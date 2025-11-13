export default async function handler(req, res) {
  // CORS-Header für Cross-Origin Requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS-Request für Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST-Requests erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Inputvalidierung
    const {
      name,
      email,
      theme,
      recipient,
      recipientName,
      mentionName,
      story,
      voice,
      style,
      instruments,
      chorus,
      special
    } = req.body;

    // Pflichtfelder prüfen
    if (!name || !email || !theme || !story || !voice || !recipient) {
      return res.status(400).json({
        error: 'Fehlende Pflichtfelder',
        missing: {
          name: !name,
          email: !email,
          theme: !theme,
          recipient: !recipient,
          story: !story,
          voice: !voice
        }
      });
    }

    // Wenn für jemand anderen, muss Name angegeben werden
    if (recipient === 'anderer' && !recipientName) {
      return res.status(400).json({
        error: 'Bitte gib den Namen oder Kosenamen der Person an, für die das Lied geschrieben wird.'
      });
    }

    // E-Mail-Validierung (einfach)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Ungültige E-Mail-Adresse' });
    }

    // OpenRouter API-Key aus Umgebungsvariablen
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY ist nicht gesetzt');
      return res.status(500).json({ error: 'Server-Konfigurationsfehler' });
    }

    // System-Prompt erstellen
    const systemPrompt = `Du bist ein empathischer Song-Assistent, der aus Kundeneingaben strukturierte Song-Briefings erstellt.

Erstelle aus folgenden Angaben ein detailliertes, strukturiertes Song-Briefing im JSON-Format.

Antworte NUR mit einem gültigen JSON-Objekt im folgenden Format (keine zusätzlichen Erklärungen, kein Markdown):

{
  "thema": "Kurze Beschreibung des Themas/Geschichte",
  "musikstil": "Musikstil und Stimmung",
  "gesangsstimme": "Beschreibung der Gesangsstimme",
  "instrumente": "Empfohlene Instrumente",
  "refrain": "Kernaussage/Refrain-Idee",
  "besonderheiten": "Besondere Wünsche und Anmerkungen",
  "gesangsstil": "Beschreibung des Gesangsstils",
  "emotion": "Emotionale Stimmung und Atmosphäre"
}

Sei präzise, kreativ und einfühlsam.`;

    // User-Prompt zusammenstellen
    let userPrompt = `Erstelle ein Song-Briefing für:\n\n`;
    userPrompt += `**Name des Auftraggebers:** ${name}\n`;
    userPrompt += `**Thema:** ${theme}\n`;
    
    // Empfänger-Informationen
    if (recipient === 'selbst') {
      userPrompt += `**Für wen:** Das Lied wird für den Auftraggeber selbst geschrieben\n`;
    } else {
      userPrompt += `**Für wen:** Das Lied wird für ${recipientName} geschrieben\n`;
      if (mentionName) {
        userPrompt += `**Wichtig:** Der Name "${recipientName}" soll im Liedtext erwähnt werden\n`;
      }
    }
    
    userPrompt += `**Geschichte/Beschreibung:** ${story}\n`;
    userPrompt += `**Gesangsstimme:** ${voice}\n`;
    
    if (style) {
      userPrompt += `**Musikstil:** ${style}\n`;
    }
    if (instruments) {
      userPrompt += `**Instrumente:** ${instruments}\n`;
    }
    if (chorus) {
      userPrompt += `**Refrain-Wunsch:** ${chorus}\n`;
    }
    if (special) {
      userPrompt += `**Besonderheiten:** ${special}\n`;
    }

    // OpenRouter API aufrufen
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.VERCEL_URL || 'https://songgpt.vercel.app',
        'X-Title': 'SongGPT - Song-Assistent'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      }),
      // Timeout nach 30 Sekunden
      signal: AbortSignal.timeout(30000)
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API Fehler:', errorText);
      return res.status(500).json({
        error: 'Fehler bei der KI-Anfrage',
        details: 'Die KI konnte nicht erreicht werden. Bitte versuche es später erneut.'
      });
    }

    const openRouterData = await openRouterResponse.json();

    // Antwort extrahieren
    const aiResponse = openRouterData.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('Keine Antwort von OpenRouter:', openRouterData);
      return res.status(500).json({
        error: 'Ungültige Antwort von der KI',
        details: 'Die KI hat keine Antwort zurückgegeben.'
      });
    }

    // JSON aus der Antwort extrahieren (falls es in Markdown-Code-Blöcken ist)
    let briefingJson;
    try {
      // Versuche, JSON direkt zu parsen
      briefingJson = JSON.parse(aiResponse);
    } catch (e) {
      // Falls es in Markdown-Code-Blöcken ist, extrahiere den JSON-Teil
      const jsonMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        briefingJson = JSON.parse(jsonMatch[1]);
      } else {
        // Fallback: Versuche, JSON-ähnliche Struktur zu finden
        const braceMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          briefingJson = JSON.parse(braceMatch[0]);
        } else {
          throw new Error('Kein gültiges JSON in der Antwort gefunden');
        }
      }
    }

    // Erfolgreiche Antwort zurückgeben
    return res.status(200).json({
      success: true,
      briefing: briefingJson,
      metadata: {
        model: openRouterData.model,
        usage: openRouterData.usage
      }
    });

  } catch (error) {
    console.error('Server-Fehler:', error);

    // Spezifische Fehlerbehandlung

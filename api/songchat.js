// Hilfsfunktion zum Sanitizen von Eingaben
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

// Hilfsfunktion zur Validierung der Eingabelänge
function validateLength(value, min, max, fieldName) {
  if (!value || value.length < min) {
    return { valid: false, error: `${fieldName} muss mindestens ${min} Zeichen lang sein.` };
  }
  if (value.length > max) {
    return { valid: false, error: `${fieldName} darf maximal ${max} Zeichen lang sein.` };
  }
  return { valid: true };
}

export default async function handler(req, res) {
  // CORS-Header für Cross-Origin Requests (könnte restriktiver sein in Produktion)
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://songgpt.vercel.app',
    'https://songgpt-eight.vercel.app',
    'http://localhost:3000'
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Fallback für Entwicklung
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 Stunden

  // OPTIONS-Request für Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST-Requests erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Inputvalidierung und Sanitization
    let {
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

    // Sanitize alle String-Eingaben
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    theme = sanitizeInput(theme);
    recipient = sanitizeInput(recipient);
    recipientName = sanitizeInput(recipientName);
    story = sanitizeInput(story);
    voice = sanitizeInput(voice);
    style = sanitizeInput(style);
    instruments = sanitizeInput(instruments);
    chorus = sanitizeInput(chorus);
    special = sanitizeInput(special);

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

    // Eingabelängen validieren
    const nameValidation = validateLength(name, 2, 100, 'Name');
    if (!nameValidation.valid) {
      return res.status(400).json({ error: nameValidation.error });
    }

    const storyValidation = validateLength(story, 10, 2000, 'Geschichte');
    if (!storyValidation.valid) {
      return res.status(400).json({ error: storyValidation.error });
    }

    if (recipientName) {
      const recipientNameValidation = validateLength(recipientName, 1, 100, 'Empfängername');
      if (!recipientNameValidation.valid) {
        return res.status(400).json({ error: recipientNameValidation.error });
      }
    }

    // Wenn für jemand anderen, muss Name angegeben werden
    if (recipient === 'anderer' && !recipientName) {
      return res.status(400).json({
        error: 'Bitte gib den Namen oder Kosenamen der Person an, für die das Lied geschrieben wird.'
      });
    }

    // E-Mail-Validierung (robuster)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email) || email.length > 255) {
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

    // User-Prompt zusammenstellen (Eingaben sind bereits sanitized)
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

    // Logging (ohne sensible Daten)
    console.log(`[SongGPT] Request von ${email.substring(0, 3)}***@*** - Thema: ${theme}`);

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
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return res.status(504).json({
        error: 'Timeout',
        details: 'Die Anfrage hat zu lange gedauert. Bitte versuche es erneut.'
      });
    }

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return res.status(500).json({
        error: 'Parsing-Fehler',
        details: 'Die KI-Antwort konnte nicht verarbeitet werden.'
      });
    }

    // Generischer Fehler
    return res.status(500).json({
      error: 'Interner Serverfehler',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.'
    });
  }
}

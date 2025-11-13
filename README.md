# 🎵 SongGPT - Empathischer Song-Assistent

Ein automatischer Song-Assistent, der aus Kundeneingaben persönliche Song-Briefings erstellt. Perfekt für individuelle Songproduktionen mit KI-Tools wie Suno.ai.

## ✨ Features

- **Intuitive Benutzeroberfläche** mit modernem Design
- **Erweiterte Eingabefelder** für präzise Song-Briefings
- **5 Hauptthemen**: Liebe ❤️, Abschied 🕊️, Glückwunsch 🎉, Erinnerung 🌈, Heilung 🌿
- **KI-gestützte Briefing-Erstellung** mit GPT-4o-mini über OpenRouter
- **Strukturierte JSON-Ausgabe** für einfache Weiterverarbeitung
- **Responsive Design** für Desktop & Mobile
- **Robustes Fehlerhandling** und Inputvalidierung

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+ (für lokale Entwicklung)
- Vercel-Account (kostenlos)
- OpenRouter API-Key ([hier registrieren](https://openrouter.ai/))

### Lokale Entwicklung

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd songgpt
   ```

2. **Vercel CLI installieren** (optional, für lokales Testen)
   ```bash
   npm install -g vercel
   ```

3. **Lokalen Server starten**
   ```bash
   vercel dev
   ```

4. **Umgebungsvariable setzen**
   
   Erstelle eine `.env.local` Datei:
   ```
   OPENROUTER_API_KEY=dein-api-key-hier
   ```

5. **Im Browser öffnen**
   ```
   http://localhost:3000
   ```

## 📦 Deployment auf Vercel

### Schritt 1: Repository verbinden

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf "New Project"
3. Verbinde dein GitHub-Repository `songgpt`
4. Vercel erkennt automatisch die Konfiguration

### Schritt 2: Umgebungsvariable setzen

1. Im Vercel-Dashboard: **Settings** → **Environment Variables**
2. Füge hinzu:
   - **Name**: `OPENROUTER_API_KEY`
   - **Value**: Dein OpenRouter API-Key
3. Klicke auf **Save**

### Schritt 3: Deployment

1. Klicke auf **Deploy**
2. Warte auf den erfolgreichen Build
3. Deine App ist live unter `https://songgpt.vercel.app`

## 🔧 Konfiguration

### Custom Domain (optional)

1. Im Vercel-Dashboard: **Settings** → **Domains**
2. Füge deine Domain hinzu (z.B. `songs.seelenklang-song.de`)
3. Folge den DNS-Anweisungen von Vercel

### Integration auf Canva-Website

**Option 1: iFrame-Einbettung**

Füge diesen Code auf deiner Canva-Seite ein:

```html
<iframe 
  src="https://songgpt.vercel.app" 
  width="100%" 
  height="900" 
  style="border:none;border-radius:12px;">
</iframe>
```

**Option 2: Button-Link**

Erstelle einen Button, der zu `https://songgpt.vercel.app` verlinkt.

## 📁 Projektstruktur

```
songgpt/
├── api/
│   └── songchat.js      # Backend API (Vercel Serverless Function)
├── index.html           # Frontend (Formular & UI)
├── vercel.json          # Vercel-Konfiguration
├── package.json         # Projekt-Metadaten
└── README.md           # Diese Datei
```

## 🎯 Verwendung

1. **Kunde öffnet das Formular**
2. **Füllt die Felder aus**:
   - Name & E-Mail (Pflichtfelder)
   - Thema auswählen (Liebe, Abschied, etc.)
   - Geschichte/Beschreibung eingeben
   - Gesangsstimme wählen
   - Optionale Felder: Stil, Instrumente, Refrain, Besonderheiten
3. **Klickt auf "Song-Briefing erstellen"**
4. **KI erstellt strukturiertes Briefing** (ca. 10-30 Sekunden)
5. **Briefing wird angezeigt** und kann für die Songproduktion verwendet werden

## 📊 API-Endpoint

### POST `/api/songchat`

**Request Body:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "theme": "Liebe",
  "story": "Eine Geschichte über...",
  "voice": "weiblich",
  "style": "Pop",
  "instruments": "Gitarre, Klavier",
  "chorus": "Optionaler Refrain-Wunsch",
  "special": "Optionale Besonderheiten"
}
```

**Response:**
```json
{
  "success": true,
  "briefing": {
    "thema": "...",
    "musikstil": "...",
    "gesangsstimme": "...",
    "instrumente": "...",
    "refrain": "...",
    "besonderheiten": "...",
    "gesangsstil": "...",
    "emotion": "..."
  },
  "metadata": {
    "model": "openai/gpt-4o-mini",
    "usage": { ... }
  }
}
```

## 🔒 Sicherheit

- Inputvalidierung auf Client- und Server-Seite
- E-Mail-Format-Validierung
- CORS-Header konfiguriert
- XSS-Schutz aktiviert
- API-Key wird sicher in Umgebungsvariablen gespeichert

## 🛠️ Technischer Stack

| Bereich | Technologie |
|---------|------------|
| Hosting | Vercel (Serverless) |
| Backend | Node.js / Edge Runtime |
| API | OpenRouter (GPT-4o-mini) |
| Frontend | Plain HTML, CSS, JavaScript |
| KI | GPT-4o-mini / OpenAI |

## 🚧 Geplante Features

- [ ] Chatmodus mit geführten Fragen
- [ ] Fortschrittsanzeige mit mehreren Schritten
- [ ] Automatische E-Mail mit Briefing an Marcel/Elke
- [ ] Datenbank-Logging (z.B. Google Sheets Integration)
- [ ] Zahlungsintegration (Stripe, PayPal)
- [ ] Song-Vorschau oder Download-Link

## 📝 Lizenz

MIT License

## 👥 Autoren

Marcel & Elke - Seelenklang Song

## 🆘 Support

Bei Fragen oder Problemen:
- GitHub Issues öffnen
- E-Mail an: [deine-email@example.com]

---

**Made with ❤️ for Seelenklang Song**



# 🎵 SongGPT - Einfache Schritt-für-Schritt Anleitung

Diese Anleitung erklärt dir ganz einfach, wie du dein SongGPT-Projekt zum Laufen bringst.

---

## 📋 Übersicht

Dein Projekt braucht einen **OpenRouter API-Key**, damit die KI funktioniert. Dann kannst du es lokal testen oder direkt online stellen.

---

## 🔑 SCHRITT 1: OpenRouter API-Key besorgen

### Was ist OpenRouter?
OpenRouter ist ein Dienst, der dir Zugang zu verschiedenen KI-Modellen (wie ChatGPT) gibt.

### So gehst du vor:

1. **Gehe auf die Website:**
   - Öffne deinen Browser
   - Gehe zu: **https://openrouter.ai**

2. **Registrieren:**
   - Klicke oben rechts auf **"Sign Up"** oder **"Registrieren"**
   - Erstelle einen Account (mit E-Mail und Passwort)
   - Bestätige deine E-Mail, falls nötig

3. **API-Key finden:**
   - Nach der Anmeldung gehe zu **"Keys"** (meist im Menü oder Dashboard)
   - Klicke auf **"Create Key"** oder **"Neuen Key erstellen"**
   - Gib dem Key einen Namen (z.B. "SongGPT")
   - **WICHTIG:** Kopiere den Key sofort! Er wird nur einmal angezeigt.
   - Der Key sieht etwa so aus: `sk-or-v1-abc123def456...`

4. **Key sicher aufbewahren:**
   - Speichere den Key in einem Textdokument oder Passwort-Manager
   - Du brauchst ihn gleich wieder!

---

## 💻 SCHRITT 2: Lokal testen (OPTIONAL - nur wenn du es vorher testen willst)

> **Hinweis:** Du kannst diesen Schritt überspringen und direkt zu Schritt 3 gehen, wenn du es gleich online stellen willst.

### Was brauchst du?
- Node.js installiert (falls nicht: https://nodejs.org herunterladen)
- Vercel CLI (wird gleich installiert)

### So testest du lokal:

1. **Vercel installieren:**
   - Öffne PowerShell oder Terminal
   - Navigiere zu deinem Projektordner:
     ```
     cd C:\Users\marce\Desktop\songgpt
     ```
   - Installiere Vercel:
     ```
     npm install -g vercel
     ```
   - Warte, bis die Installation fertig ist

2. **Umgebungsvariable erstellen:**
   - Erstelle eine neue Datei namens `.env.local` im Projektordner
   - Öffne die Datei mit einem Texteditor
   - Füge diese Zeile ein (ersetze `DEIN-KEY-HIER` mit deinem echten API-Key):
     ```
     OPENROUTER_API_KEY=sk-or-v1-dein-echter-key-hier
     ```
   - Speichere die Datei

3. **Lokal starten:**
   - Im Terminal/PowerShell (im Projektordner) tippe:
     ```
     vercel dev
     ```
   - Warte, bis du eine Meldung siehst wie: "Ready! Available at http://localhost:3000"
   - Öffne deinen Browser und gehe zu: **http://localhost:3000**
   - Teste das Formular!

4. **Beenden:**
   - Drücke `Strg + C` im Terminal, um den Server zu stoppen

---

## 🚀 SCHRITT 3: Auf Vercel online stellen

### Was ist Vercel?
Vercel ist ein kostenloser Dienst, der deine Website online stellt, damit jeder sie nutzen kann.

### So stellst du es online:

#### Option A: Mit GitHub (EMPFOHLEN - einfacher für Updates)

1. **GitHub Account erstellen (falls noch nicht vorhanden):**
   - Gehe zu: **https://github.com**
   - Erstelle einen kostenlosen Account

2. **Projekt auf GitHub hochladen:**
   - Klicke auf **"+"** oben rechts → **"New repository"**
   - Gib einen Namen ein (z.B. "songgpt")
   - Wähle **"Public"** (kostenlos)
   - Klicke **"Create repository"**
   - Folge den Anweisungen, um deine Dateien hochzuladen:
     - Oder nutze GitHub Desktop (einfacher)
     - Oder nutze Git im Terminal

3. **Vercel Account erstellen:**
   - Gehe zu: **https://vercel.com**
   - Klicke auf **"Sign Up"**
   - Wähle **"Continue with GitHub"** (am einfachsten)
   - Erlaube Vercel den Zugriff auf GitHub

4. **Projekt verbinden:**
   - In Vercel klicke auf **"Add New..."** → **"Project"**
   - Wähle dein GitHub-Repository (songgpt) aus
   - Klicke **"Import"**

5. **API-Key hinzufügen:**
   - In den **"Environment Variables"** (Umgebungsvariablen)
   - Klicke auf **"Add"** oder **"Hinzufügen"**
   - Name: `OPENROUTER_API_KEY`
   - Wert: Dein OpenRouter API-Key (den du in Schritt 1 kopiert hast)
   - Klicke **"Save"**

6. **Deployen:**
   - Klicke auf **"Deploy"**
   - Warte 1-2 Minuten
   - Fertig! Du bekommst eine URL wie: `https://songgpt-xyz.vercel.app`

#### Option B: Direkt mit Vercel CLI (OHNE GitHub)

1. **Vercel installieren (falls noch nicht):**
   ```
   npm install -g vercel
   ```

2. **Anmelden:**
   - Im Terminal/PowerShell (im Projektordner):
     ```
     vercel login
     ```
   - Folge den Anweisungen im Browser

3. **Projekt deployen:**
   ```
   vercel
   ```
   - Beantworte die Fragen:
     - "Set up and deploy? Yes"
     - "Which scope? Dein Account"
     - "Link to existing project? No"
     - "Project name? songgpt" (oder wie du willst)
     - "Directory? ./" (Enter drücken)
     - "Override settings? No"

4. **API-Key hinzufügen:**
   - Gehe zu: **https://vercel.com/dashboard**
   - Wähle dein Projekt aus
   - Gehe zu **"Settings"** → **"Environment Variables"**
   - Klicke **"Add"**
   - Name: `OPENROUTER_API_KEY`
   - Wert: Dein OpenRouter API-Key
   - Wähle alle Umgebungen (Production, Preview, Development)
   - Klicke **"Save"**

5. **Neu deployen:**
   - Gehe zu **"Deployments"**
   - Klicke auf die drei Punkte (...) beim letzten Deployment
   - Wähle **"Redeploy"**

---

## 🌐 SCHRITT 4: In Canva einbinden

### Option 1: Als Link (EINFACHSTE Methode)

1. **Button in Canva erstellen:**
   - Füge einen Button oder Text hinzu
   - Mache ihn anklickbar (Link hinzufügen)
   - Füge deine Vercel-URL ein (z.B. `https://songgpt-xyz.vercel.app`)
   - Fertig! Wenn Besucher auf den Button klicken, öffnet sich SongGPT in einem neuen Tab

### Option 2: Als iFrame (Erscheint direkt auf der Seite)

1. **In Canva:**
   - Füge ein **"Embed"** oder **"HTML"** Element hinzu
   - Füge diesen Code ein (ersetze `DEINE-URL` mit deiner Vercel-URL):
     ```html
     <iframe 
       src="https://deine-url.vercel.app" 
       width="100%" 
       height="800px" 
       frameborder="0"
       style="border-radius: 20px;">
     </iframe>
     ```
   - Passe die Höhe (`height`) an deine Bedürfnisse an

---

## ✅ Checkliste - Hast du alles?

- [ ] OpenRouter Account erstellt
- [ ] API-Key kopiert und gespeichert
- [ ] Projekt auf Vercel deployed
- [ ] API-Key in Vercel als Umgebungsvariable gesetzt
- [ ] Website funktioniert (getestet)
- [ ] In Canva eingebunden

---

## 🆘 Hilfe bei Problemen

### "OPENROUTER_API_KEY ist nicht gesetzt"
- **Lösung:** Prüfe, ob der Key in Vercel richtig gesetzt ist
- Gehe zu: Vercel Dashboard → Dein Projekt → Settings → Environment Variables
- Stelle sicher, dass der Name genau `OPENROUTER_API_KEY` ist (Großbuchstaben!)

### "Fehler bei der KI-Anfrage"
- **Lösung:** Prüfe, ob dein OpenRouter Account aktiv ist und Guthaben hat
- Gehe zu: openrouter.ai → Dashboard → Prüfe dein Guthaben

### Website lädt nicht
- **Lösung:** Warte 2-3 Minuten nach dem Deploy
- Prüfe die Vercel-Logs: Dashboard → Dein Projekt → Deployments → Logs

### Lokaler Test funktioniert nicht
- **Lösung:** Stelle sicher, dass `.env.local` im Projektordner liegt (nicht in einem Unterordner)
- Prüfe, dass der API-Key in der Datei steht (ohne Anführungszeichen am Anfang/Ende)

---

## 📞 Weitere Hilfe

- **Vercel Dokumentation:** https://vercel.com/docs
- **OpenRouter Dokumentation:** https://openrouter.ai/docs
- **GitHub Issues:** Falls du einen Fehler findest, erstelle ein Issue

---

**Viel Erfolg! 🎉**


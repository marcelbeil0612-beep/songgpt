# 🔧 GitHub Push - Manuelle Anleitung

Falls GitHub Desktop nicht funktioniert, kannst du die Dateien manuell auf GitHub hochladen.

## Option 1: Über GitHub Web-Interface (EINFACHSTE Methode)

1. **Gehe zu deinem Repository:**
   - Öffne: https://github.com/marcelbeil0612-beep/songgpt

2. **Dateien aktualisieren:**
   - Klicke auf die Datei, die du aktualisieren willst (z.B. `index.html`)
   - Klicke auf das **Stift-Symbol** (Edit/Pencil) oben rechts
   - Kopiere den gesamten Inhalt aus deiner lokalen Datei
   - Ersetze den Inhalt im Browser
   - Scrolle nach unten
   - Gib eine Commit-Message ein (z.B. "Update index.html")
   - Klicke auf **"Commit changes"**

3. **Wiederhole für alle geänderten Dateien:**
   - `index.html`
   - `api/songchat.js`
   - etc.

## Option 2: Git über Command Line (falls Git installiert ist)

1. **Git installieren (falls noch nicht):**
   - Download: https://git-scm.com/download/win
   - Installieren mit Standard-Einstellungen

2. **In PowerShell/Terminal:**
   ```powershell
   cd C:\Users\marce\Desktop\songgpt
   git add .
   git commit -m "Update files"
   git push origin main
   ```

3. **Bei Authentifizierung:**
   - GitHub wird nach Username und Password fragen
   - **WICHTIG:** Als Password musst du ein **Personal Access Token** verwenden (nicht dein GitHub-Passwort!)
   - Token erstellen: https://github.com/settings/tokens
   - Klicke "Generate new token (classic)"
   - Wähle "repo" Berechtigung
   - Kopiere den Token und verwende ihn als Password

## Option 3: GitHub Desktop neu installieren

1. **GitHub Desktop deinstallieren**
2. **Neu installieren:** https://desktop.github.com
3. **Neu anmelden**
4. **Repository öffnen:** File → Add Local Repository → `C:\Users\marce\Desktop\songgpt`

---

**Empfehlung:** Option 1 (Web-Interface) ist am einfachsten, wenn nur wenige Dateien geändert wurden.



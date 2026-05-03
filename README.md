# ZeroThreat – Penetration Testing Dashboard

Een grafische web-interface voor populaire penetration testing tools,
aangedreven door een Flask backend die de tools echt uitvoert op je systeem.

---

## Projectstructuur

```
zerothreat/
├── index.html        # Grafische interface (frontend)
├── style.css         # Styling & layout
├── script.js         # Terminal logica + backend verbinding
├── app.py            # Flask backend (voert tools uit)
├── requirements.txt  # Python pakketten
└── README.md         # Dit bestand
```

---

## Vereisten

- Python 3.8 of hoger
- pip
- Kali Linux (aanbevolen) of een systeem met de tools geïnstalleerd
- Een moderne webbrowser

---

## Installatie

### 1. Python pakketten installeren

```bash
pip install -r requirements.txt
```

### 2. Tools installeren (Kali Linux)

```bash
sudo apt update
sudo apt install nmap nikto john tshark w3af hydra sqlmap dirb gobuster hashcat
```

### 3. Backend starten

```bash
python app.py
```

De backend draait nu op: `http://127.0.0.1:5000`

### 4. Frontend openen

Open `index.html` in je browser. Dat kan via:

```bash
# Optie 1 – Direct openen
xdg-open index.html

# Optie 2 – Via een lokale server (aanbevolen)
python -m http.server 8080
# Ga dan naar: http://localhost:8080
```

---

## Gebruik

1. Start de Flask backend met `python app.py`
2. Open `index.html` in je browser
3. Klik op een tool-icoon
4. Een terminal opent zich in de browser
5. Typ `help` voor beschikbare commando's
6. Voer commando's in — de output verschijnt direct in de terminal

---

## Beschikbare Tools

| Tool            | Backend | Omschrijving                        |
|-----------------|---------|-------------------------------------|
| Nmap            | ✅ Echt  | Netwerk- en poortscanner            |
| Nikto           | ✅ Echt  | Webserver kwetsbaarheidsscanner     |
| John the Ripper | ✅ Echt  | Wachtwoord kraker                   |
| Wireshark       | ✅ Echt  | Pakketanalyse (via tshark CLI)      |
| w3af            | ✅ Echt  | Web applicatie aanval framework     |
| Hydra           | ✅ Echt  | Login brute-force tool              |
| SQLmap          | ✅ Echt  | SQL injectie scanner                |
| Dirb            | ✅ Echt  | Webmap directory bruteforcer        |
| Gobuster        | ✅ Echt  | Directory en DNS brute-forcer       |
| Hashcat         | ✅ Echt  | GPU wachtwoord kraker               |
| ZeroThreat      | 💻 Lokaal | Eigen web applicatie scanner       |
| Kali Linux      | 💻 Lokaal | OS commando simulatie              |
| Metasploit      | 💻 Lokaal | Exploit framework simulatie        |
| Burp Suite      | 💻 Lokaal | Web proxy simulatie                |
| Nessus          | 💻 Lokaal | Vulnerability scanner simulatie    |

---

## API Endpoints

De Flask backend heeft de volgende endpoints:

### GET /api/status
Controleer welke tools geïnstalleerd zijn.

```bash
curl http://127.0.0.1:5000/api/status
```

Voorbeeld response:
```json
{
  "status": "actief",
  "tools": {
    "nmap": true,
    "nikto": true,
    "john": false
  }
}
```

### POST /api/run
Voer een tool uit met argumenten.

```bash
curl -X POST http://127.0.0.1:5000/api/run \
  -H "Content-Type: application/json" \
  -d '{"tool": "nmap", "args": "-sV 192.168.1.1"}'
```

Voorbeeld response:
```json
{
  "success": true,
  "tool": "nmap",
  "command": "nmap -sV 192.168.1.1",
  "output": "Starting Nmap...\nPORT   STATE SERVICE\n22/tcp open  ssh"
}
```

### GET /api/tools
Geef een lijst van alle geconfigureerde tools.

```bash
curl http://127.0.0.1:5000/api/tools
```

---

## Terminal Commando's

In elke terminal zijn deze commando's altijd beschikbaar:

| Commando | Functie                        |
|----------|--------------------------------|
| `help`   | Toon beschikbare commando's    |
| `clear`  | Maak de terminal leeg          |
| `exit`   | Sluit de terminal              |
| `↑ / ↓`  | Navigeer door commandogeschiedenis |

---

## Problemen oplossen

**Backend niet bereikbaar**
```
[!] Geen verbinding met backend.
```
Oplossing: Zorg dat `app.py` draait in een apart terminalvenster.

**Tool niet gevonden**
```
[!] 'nmap' niet gevonden op dit systeem.
```
Oplossing: Installeer de tool met `sudo apt install nmap`

**CORS fout in browser**
Oplossing: Open de frontend via een lokale server in plaats van direct het bestand:
```bash
python -m http.server 8080
```

---

## Nieuwe Tool Toevoegen

Open `app.py` en voeg een entry toe aan `ALLOWED_TOOLS`:

```python
"mijnTool": {
    "bin": "mijn-tool",
    "allowed_flags": ["-flag1", "-flag2"],
},
```

Voeg daarna in `script.js` de tool toe aan het `tools` object:

```javascript
mijnTool: {
  name: "Mijn Tool",
  prompt: "root@mijnTool:~#",
  backendKey: "mijnTool"
},
```

---

## Licentie

Dit project is alleen bedoeld voor gebruik op eigen systemen
en in geautoriseerde testomgevingen.

---

*Gebouwd met Flask + Vanilla JS*

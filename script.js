// ===== TOOL CONFIGURATIE =====
const tools = {
  zerothreat: {
    name: "ZeroThreat",
    prompt: "root@zerothreat:~#",
    welcome: [
      { type: "info", text: "╔══════════════════════════════════════╗" },
      { type: "info", text: "║        ZEROTHREAT FRAMEWORK          ║" },
      { type: "info", text: "║     Web Application Scanner          ║" },
      { type: "info", text: "╚══════════════════════════════════════╝" },
      { type: "out",  text: "Versie: 1.0.0 | Status: Actief" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  scan <url>    - Start een webscan" },
        { type: "out",  text: "  report        - Toon laatste rapport" },
        { type: "out",  text: "  clear         - Terminal leegmaken" },
        { type: "out",  text: "  exit          - Sluit terminal" },
      ],
      scan: (args) => [
        { type: "out",  text: `[*] Target: ${args || "geen url opgegeven"}` },
        { type: "out",  text: "[*] Initialiseren scanner..." },
        { type: "out",  text: "[*] Crawlen van pagina's..." },
        { type: "out",  text: "[+] 12 pagina's gevonden" },
        { type: "out",  text: "[*] Testen op XSS, SQLi, CSRF..." },
        { type: "out",  text: "[+] Scan voltooid. Zie 'report' voor details." },
      ],
      report: [
        { type: "info", text: "=== SCAN RAPPORT ===" },
        { type: "out",  text: "Kwetsbaarheden gevonden: 3" },
        { type: "error",text: "  [HOOG]   SQL Injection – /login" },
        { type: "out",  text: "  [MIDDEN] XSS – /search" },
        { type: "out",  text: "  [LAAG]   Info lekkage – /admin" },
      ],
    }
  },

  kali: {
    name: "Kali Linux",
    prompt: "root@kali:~#",
    welcome: [
      { type: "info", text: "┌──────────────────────────────────┐" },
      { type: "info", text: "│         KALI LINUX               │" },
      { type: "info", text: "│  The Penetration Testing OS      │" },
      { type: "info", text: "└──────────────────────────────────┘" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  ifconfig      - Netwerkinterfaces" },
        { type: "out",  text: "  whoami        - Huidige gebruiker" },
        { type: "out",  text: "  uname -a      - Systeeminfo" },
        { type: "out",  text: "  ls            - Bestanden tonen" },
        { type: "out",  text: "  clear         - Terminal leegmaken" },
      ],
      ifconfig: [
        { type: "out",  text: "eth0: flags=4163<UP,BROADCAST,RUNNING>" },
        { type: "out",  text: "      inet 192.168.1.100  netmask 255.255.255.0" },
        { type: "out",  text: "lo:   flags=73<UP,LOOPBACK,RUNNING>" },
        { type: "out",  text: "      inet 127.0.0.1  netmask 255.0.0.0" },
      ],
      whoami: [
        { type: "out",  text: "root" },
      ],
      "uname -a": [
        { type: "out",  text: "Linux kali 6.1.0-kali9-amd64 #1 SMP x86_64 GNU/Linux" },
      ],
      ls: [
        { type: "out",  text: "Desktop  Documents  Downloads  Pictures  Tools" },
      ],
    }
  },

  metasploit: {
    name: "Metasploit",
    prompt: "msf6 >",
    welcome: [
      { type: "info", text: "       =[ metasploit v6.x.x ]=" },
      { type: "info", text: "+ -- --=[ 2000+ exploits ]=" },
      { type: "info", text: "+ -- --=[ 1100+ auxiliary ]=" },
      { type: "out",  text: "" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Core Commands:" },
        { type: "out",  text: "  search <term>  - Zoek modules" },
        { type: "out",  text: "  use <module>   - Module laden" },
        { type: "out",  text: "  show exploits  - Alle exploits" },
        { type: "out",  text: "  info           - Info over module" },
        { type: "out",  text: "  clear          - Terminal leegmaken" },
      ],
      "show exploits": [
        { type: "out",  text: "Naam                             Rank" },
        { type: "out",  text: "----                             ----" },
        { type: "out",  text: "exploit/multi/handler            normal" },
        { type: "out",  text: "exploit/windows/smb/ms17_010     excellent" },
        { type: "out",  text: "exploit/unix/ftp/vsftpd_backdoor  excellent" },
      ],
      search: (args) => [
        { type: "out",  text: `[*] Zoeken naar: ${args || "..."}` },
        { type: "out",  text: "[*] Overeenkomende modules gevonden: 5" },
        { type: "out",  text: "  exploit/multi/misc/..." },
        { type: "out",  text: "  auxiliary/scanner/..." },
      ],
    }
  },

  nmap: {
    name: "Nmap",
    prompt: "root@nmap:~#",
    welcome: [
      { type: "info", text: "╔═══════════════════════════════╗" },
      { type: "info", text: "║   Nmap – Network Scanner      ║" },
      { type: "info", text: "╚═══════════════════════════════╝" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  nmap <host>         - Basis scan" },
        { type: "out",  text: "  nmap -sV <host>     - Versie detectie" },
        { type: "out",  text: "  nmap -O <host>      - OS detectie" },
        { type: "out",  text: "  nmap -p- <host>     - Alle poorten" },
        { type: "out",  text: "  clear               - Terminal leegmaken" },
      ],
      nmap: (args) => [
        { type: "out",  text: `Starting Nmap scan voor: ${args || "geen host"}` },
        { type: "out",  text: "Nmap scan report:" },
        { type: "out",  text: "Host is up (0.0023s latency)." },
        { type: "out",  text: "PORT     STATE  SERVICE" },
        { type: "out",  text: "22/tcp   open   ssh" },
        { type: "out",  text: "80/tcp   open   http" },
        { type: "out",  text: "443/tcp  open   https" },
        { type: "out",  text: "3306/tcp closed mysql" },
        { type: "out",  text: "" },
        { type: "info", text: "Nmap done: 1 IP address scanned" },
      ],
    }
  },

  w3af: {
    name: "w3af",
    prompt: "w3af>>>",
    welcome: [
      { type: "info", text: "w3af – Web Application Attack and Audit Framework" },
      { type: "out",  text: "Versie 2.x | Open Source" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  target set target <url> - Doelwit instellen" },
        { type: "out",  text: "  plugins                 - Plugins tonen" },
        { type: "out",  text: "  start                   - Scan starten" },
        { type: "out",  text: "  clear                   - Terminal leegmaken" },
      ],
      plugins: [
        { type: "out",  text: "audit:    sqli, xss, csrf, rfi, lfi" },
        { type: "out",  text: "crawl:    web_spider, allowed_methods" },
        { type: "out",  text: "output:   html_file, text_file" },
      ],
      start: [
        { type: "out",  text: "[*] Scan gestart..." },
        { type: "out",  text: "[*] Crawlen..." },
        { type: "out",  text: "[+] Scan voltooid." },
      ],
    }
  },

  wireshark: {
    name: "Wireshark",
    prompt: "root@wireshark:~#",
    welcome: [
      { type: "info", text: "╔══════════════════════════════╗" },
      { type: "info", text: "║  Wireshark – Packet Analyzer ║" },
      { type: "info", text: "╚══════════════════════════════╝" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  capture <iface>   - Start capture" },
        { type: "out",  text: "  filter <expr>     - Filter instellen" },
        { type: "out",  text: "  stats             - Statistieken" },
        { type: "out",  text: "  clear             - Terminal leegmaken" },
      ],
      capture: (args) => [
        { type: "out",  text: `[*] Capturing op interface: ${args || "eth0"}` },
        { type: "out",  text: "[*] Pakket 1: 192.168.1.1 → 8.8.8.8 TCP 443" },
        { type: "out",  text: "[*] Pakket 2: 8.8.8.8 → 192.168.1.1 TCP 443" },
        { type: "out",  text: "[*] Pakket 3: 192.168.1.1 → 192.168.1.2 UDP 53" },
        { type: "info", text: "[+] 3 pakketten vastgelegd" },
      ],
      stats: [
        { type: "info", text: "=== CAPTURE STATISTIEKEN ===" },
        { type: "out",  text: "TCP pakketten:  148" },
        { type: "out",  text: "UDP pakketten:   42" },
        { type: "out",  text: "HTTP verzoeken:  17" },
        { type: "out",  text: "DNS queries:      9" },
      ],
    }
  },

  nikto: {
    name: "Nikto",
    prompt: "root@nikto:~#",
    welcome: [
      { type: "info", text: "╔══════════════════════════════╗" },
      { type: "info", text: "║  Nikto – Web Server Scanner  ║" },
      { type: "info", text: "╚══════════════════════════════╝" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  nikto -h <host>      - Scan host" },
        { type: "out",  text: "  nikto -h <host> -p 443  - HTTPS scan" },
        { type: "out",  text: "  clear                - Terminal leegmaken" },
      ],
      "nikto -h": (args) => [
        { type: "out",  text: `- Nikto v2.1.6` },
        { type: "out",  text: `- Target: ${args || "geen host"}` },
        { type: "out",  text: "- Start Time: " + new Date().toLocaleString() },
        { type: "out",  text: "+ Server: Apache/2.4.41" },
        { type: "error",text: "+ /admin/: Admin directory gevonden!" },
        { type: "error",text: "+ /phpinfo.php: PHP info pagina blootgesteld." },
        { type: "out",  text: "+ 6544 item(s) getest" },
        { type: "info", text: "Scan voltooid." },
      ],
    }
  },

  burpsuite: {
    name: "Burp Suite",
    prompt: "burp@proxy:~#",
    welcome: [
      { type: "info", text: "╔══════════════════════════════╗" },
      { type: "info", text: "║  Burp Suite – Web Proxy      ║" },
      { type: "info", text: "╚══════════════════════════════╝" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  intercept on/off   - Proxy intercept" },
        { type: "out",  text: "  spider <url>        - Crawl site" },
        { type: "out",  text: "  intruder <url>      - Aanval starten" },
        { type: "out",  text: "  repeater            - Request herhalen" },
        { type: "out",  text: "  clear               - Terminal leegmaken" },
      ],
      "intercept on": [
        { type: "out",  text: "[*] Proxy intercept: AAN" },
        { type: "out",  text: "[*] Luisteren op 127.0.0.1:8080" },
      ],
      "intercept off": [
        { type: "out",  text: "[*] Proxy intercept: UIT" },
      ],
      spider: (args) => [
        { type: "out",  text: `[*] Spider gestart voor: ${args || "geen url"}` },
        { type: "out",  text: "[*] 5 nieuwe URL's gevonden" },
        { type: "out",  text: "[+] Spider voltooid" },
      ],
    }
  },

  nessus: {
    name: "Nessus",
    prompt: "nessus@scanner:~#",
    welcome: [
      { type: "info", text: "╔══════════════════════════════╗" },
      { type: "info", text: "║  Nessus – Vulnerability Scan ║" },
      { type: "info", text: "╚══════════════════════════════╝" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  scan new <target>  - Nieuwe scan" },
        { type: "out",  text: "  scan list          - Scans tonen" },
        { type: "out",  text: "  report             - Rapport tonen" },
        { type: "out",  text: "  clear              - Terminal leegmaken" },
      ],
      "scan list": [
        { type: "out",  text: "ID  Naam          Status" },
        { type: "out",  text: "1   LAN Scan       Voltooid" },
        { type: "out",  text: "2   Web Server     Actief" },
      ],
      report: [
        { type: "info", text: "=== NESSUS RAPPORT ===" },
        { type: "error",text: "Kritiek:  2 kwetsbaarheden" },
        { type: "error",text: "Hoog:     5 kwetsbaarheden" },
        { type: "out",  text: "Midden:   8 kwetsbaarheden" },
        { type: "out",  text: "Laag:    12 kwetsbaarheden" },
      ],
      scan: (args) => [
        { type: "out",  text: `[*] Scan gestart voor: ${args || "geen target"}` },
        { type: "out",  text: "[*] Plugin checks uitvoeren..." },
        { type: "out",  text: "[+] Scan voltooid." },
      ],
    }
  },

  johntheripper: {
    name: "John the Ripper",
    prompt: "root@john:~#",
    welcome: [
      { type: "info", text: "╔══════════════════════════════╗" },
      { type: "info", text: "║  John the Ripper – Cracker   ║" },
      { type: "info", text: "╚══════════════════════════════╝" },
      { type: "out",  text: "Typ 'help' voor beschikbare commando's." },
    ],
    commands: {
      help: [
        { type: "info", text: "Beschikbare commando's:" },
        { type: "out",  text: "  john <file>         - Wachtwoord kraken" },
        { type: "out",  text: "  john --show <file>  - Gevonden wachtwoorden" },
        { type: "out",  text: "  john --list=formats - Hash formaten" },
        { type: "out",  text: "  clear               - Terminal leegmaken" },
      ],
      "john --list=formats": [
        { type: "out",  text: "md5crypt, bcrypt, sha256crypt, sha512crypt," },
        { type: "out",  text: "NT, LM, NTLM, MySQL, MSSQL, Oracle, ..." },
      ],
      john: (args) => [
        { type: "out",  text: `[*] Laden van bestand: ${args || "geen bestand"}` },
        { type: "out",  text: "[*] Hashes gedetecteerd: md5crypt" },
        { type: "out",  text: "[*] Woordenboek aanval gestart..." },
        { type: "out",  text: "[+] admin:password123 (admin)" },
        { type: "info", text: "[+] 1 wachtwoord gekraakt" },
      ],
    }
  }
};

// ===== DOM REFERENTIES =====
const overlay       = document.getElementById("modalOverlay");
const terminalTitle = document.getElementById("terminalTitle");
const terminalOutput= document.getElementById("terminalOutput");
const terminalInput = document.getElementById("terminalInput");
const terminalPrompt= document.getElementById("terminalPrompt");
const closeBtn      = document.getElementById("closeBtn");

let currentTool = null;
let commandHistory = [];
let historyIndex = -1;

// ===== KAARTEN KLIKKEN =====
document.querySelectorAll(".tool-card").forEach(card => {
  card.addEventListener("click", () => {
    const toolKey = card.dataset.tool;
    openTerminal(toolKey);
  });
});

// ===== TERMINAL OPENEN =====
function openTerminal(toolKey) {
  currentTool = tools[toolKey];
  if (!currentTool) return;

  terminalTitle.textContent = `Terminal – ${currentTool.name}`;
  terminalPrompt.textContent = currentTool.prompt;
  terminalOutput.innerHTML = "";
  commandHistory = [];
  historyIndex = -1;

  // Welkomstbericht tonen
  currentTool.welcome.forEach(line => appendLine(line.type, line.text));

  overlay.classList.add("active");
  setTimeout(() => terminalInput.focus(), 100);
}

// ===== TERMINAL SLUITEN =====
function closeTerminal() {
  overlay.classList.remove("active");
  currentTool = null;
}

closeBtn.addEventListener("click", closeTerminal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeTerminal();
});

// ===== COMMANDO VERWERKEN =====
terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const raw = terminalInput.value.trim();
    terminalInput.value = "";

    if (!raw) return;

    // Bewaar in geschiedenis
    commandHistory.unshift(raw);
    historyIndex = -1;

    // Toon ingevoerd commando
    appendLine("cmd", `${currentTool.prompt} ${raw}`);

    // Verwerk commando
    if (raw === "clear") {
      terminalOutput.innerHTML = "";
      return;
    }

    if (raw === "exit") {
      closeTerminal();
      return;
    }

    processCommand(raw);
    scrollToBottom();
  }

  // Geschiedenis navigeren
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      terminalInput.value = commandHistory[historyIndex];
    }
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      terminalInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = -1;
      terminalInput.value = "";
    }
  }
});

// ===== COMMANDO OPZOEKEN =====
function processCommand(raw) {
  if (!currentTool) return;
  const cmds = currentTool.commands;

  // Exact match
  if (cmds[raw]) {
    const result = typeof cmds[raw] === "function" ? cmds[raw]("") : cmds[raw];
    result.forEach(l => appendLine(l.type, l.text));
    return;
  }

  // Prefix match (commando met argumenten)
  for (const key of Object.keys(cmds)) {
    if (raw.startsWith(key + " ") || raw === key) {
      const args = raw.slice(key.length).trim();
      const result = typeof cmds[key] === "function" ? cmds[key](args) : cmds[key];
      result.forEach(l => appendLine(l.type, l.text));
      return;
    }
  }

  // Onbekend commando
  appendLine("error", `bash: ${raw.split(" ")[0]}: commando niet gevonden`);
}

// ===== UITVOER TOEVOEGEN =====
function appendLine(type, text) {
  const div = document.createElement("div");
  div.className = `line-${type}`;
  div.textContent = text || " ";
  terminalOutput.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// ===== ESC TOETS =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeTerminal();
});

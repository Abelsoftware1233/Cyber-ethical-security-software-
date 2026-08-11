// ===== CONFIGURATIE =====
const API_URL = "http://127.0.0.1:5025/api";

// Tool → backend tool key mapping
const tools = {
  zerothreat:    { name: "ZeroThreat",      prompt: "root@zerothreat:~#",   backendKey: null },
  kali:          { name: "Kali Linux",      prompt: "root@kali:~#",         backendKey: null },
  metasploit:    { name: "Metasploit",      prompt: "msf6 >",               backendKey: null },
  nmap:          { name: "Nmap",            prompt: "root@nmap:~#",         backendKey: "nmap" },
  w3af:          { name: "w3af",            prompt: "w3af>>>",              backendKey: "w3af" },
  wireshark:     { name: "Wireshark",       prompt: "root@wireshark:~#",    backendKey: "wireshark" },
  nikto:         { name: "Nikto",           prompt: "root@nikto:~#",        backendKey: "nikto" },
  burpsuite:     { name: "Burp Suite",      prompt: "burp@proxy:~#",        backendKey: null },
  nessus:        { name: "Nessus",          prompt: "nessus@scanner:~#",    backendKey: null },
  johntheripper: { name: "John the Ripper", prompt: "root@john:~#",         backendKey: "john" },
};

// Lokale fallback commando's (als backendKey null is)
const localCommands = {
  zerothreat: {
    help:   [{ t:"info", v:"ZeroThreat commando's:" },
             { t:"out",  v:"  scan <url>   – Webscan starten" },
             { t:"out",  v:"  report       – Laatste rapport" },
             { t:"out",  v:"  clear        – Terminal leegmaken" }],
    report: [{ t:"info", v:"Geen actieve scan gevonden." }],
  },
  kali: {
    help:       [{ t:"info", v:"Kali commando's:" },
                 { t:"out",  v:"  whoami      – Huidige gebruiker" },
                 { t:"out",  v:"  uname -a    – Systeeminformatie" },
                 { t:"out",  v:"  ls          – Bestanden tonen" }],
    whoami:     [{ t:"out",  v:"root" }],
    "uname -a": [{ t:"out",  v:"Linux kali 6.1.0-kali9-amd64 #1 SMP x86_64 GNU/Linux" }],
    ls:         [{ t:"out",  v:"Desktop  Documents  Downloads  Tools" }],
  },
  metasploit: {
    help:           [{ t:"info", v:"Metasploit commando's:" },
                     { t:"out",  v:"  show exploits  – Beschikbare exploits" },
                     { t:"out",  v:"  search <term>  – Modules zoeken" }],
    "show exploits":[{ t:"out",  v:"exploit/multi/handler            normal" },
                     { t:"out",  v:"exploit/windows/smb/ms17_010     excellent" }],
  },
  burpsuite: {
    help:            [{ t:"info", v:"Burp Suite commando's:" },
                      { t:"out",  v:"  intercept on/off  – Proxy aan/uit" },
                      { t:"out",  v:"  spider <url>      – Crawl site" }],
    "intercept on":  [{ t:"out",  v:"[*] Proxy intercept: AAN – 127.0.0.1:8080" }],
    "intercept off": [{ t:"out",  v:"[*] Proxy intercept: UIT" }],
  },
  nessus: {
    help:       [{ t:"info", v:"Nessus commando's:" },
                 { t:"out",  v:"  scan list   – Scans tonen" },
                 { t:"out",  v:"  report      – Rapport tonen" }],
    "scan list":[{ t:"out",  v:"1  LAN Scan     Voltooid" },
                 { t:"out",  v:"2  Web Server   Actief" }],
    report:     [{ t:"error",v:"Kritiek: 2  Hoog: 5  Midden: 8  Laag: 12" }],
  },
};

// ===== DOM =====
const overlay        = document.getElementById("modalOverlay");
const terminalTitle  = document.getElementById("terminalTitle");
const terminalOutput = document.getElementById("terminalOutput");
const terminalInput  = document.getElementById("terminalInput");
const terminalPrompt = document.getElementById("terminalPrompt");
const closeBtn       = document.getElementById("closeBtn");

let currentTool  = null;
let cmdHistory   = [];
let historyIndex = -1;
let isLoading    = false;

// ===== KAARTEN KLIKKEN =====
document.querySelectorAll(".tool-card").forEach(card => {
  card.addEventListener("click", () => openTerminal(card.dataset.tool));
});

// ===== TERMINAL OPENEN =====
function openTerminal(toolKey) {
  currentTool = { key: toolKey, ...tools[toolKey] };
  terminalTitle.textContent  = `Terminal – ${currentTool.name}`;
  terminalPrompt.textContent = currentTool.prompt;
  terminalOutput.innerHTML   = "";
  cmdHistory   = [];
  historyIndex = -1;

  // Welkomstbericht
  appendLine("info", "╔══════════════════════════════════════════╗");
  appendLine("info", `║  ${currentTool.name.padEnd(40)}║`);
  appendLine("info", "╚══════════════════════════════════════════╝");

  if (currentTool.backendKey) {
    appendLine("out", `[*] Backend verbonden via ${API_URL}`);
    appendLine("out", `[*] Tool: ${currentTool.backendKey}`);
    checkBackendStatus(currentTool.backendKey);
  } else {
    appendLine("out", "[*] Lokale simulatie modus");
  }

  appendLine("out", "Typ 'help' voor beschikbare commando's.");
  overlay.classList.add("active");
  setTimeout(() => terminalInput.focus(), 80);
}

// ===== BACKEND STATUS CONTROLEREN =====
async function checkBackendStatus(toolKey) {
  try {
    const res  = await fetch(`${API_URL}/status`);
    const data = await res.json();
    const installed = data.tools?.[toolKey];
    if (installed === false) {
      appendLine("error", `[!] Waarschuwing: '${toolKey}' niet gevonden op dit systeem.`);
      appendLine("error", `[!] Installeer met: sudo apt install ${toolKey}`);
    } else if (installed === true) {
      appendLine("out", `[+] ${toolKey} gevonden en klaar voor gebruik.`);
    }
  } catch {
    appendLine("error", "[!] Backend niet bereikbaar. Start app.py eerst.");
    appendLine("error", `    python app.py`);
  }
}

// ===== TERMINAL SLUITEN =====
function closeTerminal() {
  overlay.classList.remove("active");
  currentTool = null;
}
closeBtn.addEventListener("click", closeTerminal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeTerminal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeTerminal(); });

// ===== INPUT VERWERKEN =====
terminalInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    if (isLoading) return;
    const raw = terminalInput.value.trim();
    terminalInput.value = "";
    if (!raw) return;

    cmdHistory.unshift(raw);
    historyIndex = -1;

    appendLine("cmd", `${currentTool.prompt} ${raw}`);

    if (raw === "clear") { terminalOutput.innerHTML = ""; return; }
    if (raw === "exit")  { closeTerminal(); return; }

    await verwerkCommando(raw);
  }

  // Geschiedenis
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex < cmdHistory.length - 1) {
      historyIndex++;
      terminalInput.value = cmdHistory[historyIndex];
    }
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex > 0) { historyIndex--; terminalInput.value = cmdHistory[historyIndex]; }
    else { historyIndex = -1; terminalInput.value = ""; }
  }
});

// ===== COMMANDO VERWERKEN =====
async function verwerkCommando(raw) {
  const key = currentTool.key;

  // Backend aanroepen als tool beschikbaar is
  if (currentTool.backendKey) {
    await roepBackendAan(currentTool.backendKey, raw);
    return;
  }

  // Lokale fallback
  const local = localCommands[key] || {};

  // Exacte match
  if (local[raw]) {
    local[raw].forEach(l => appendLine(l.t, l.v));
    return;
  }

  // Prefix match
  for (const k of Object.keys(local)) {
    if (raw.startsWith(k + " ")) {
      local[k].forEach(l => appendLine(l.t, l.v));
      return;
    }
  }

  appendLine("error", `bash: ${raw.split(" ")[0]}: commando niet gevonden`);
}

// ===== BACKEND API AANROEP =====
async function roepBackendAan(toolKey, args) {
  isLoading = true;
  const loadingEl = toonLaden();

  try {
    const res = await fetch(`${API_URL}/run`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ tool: toolKey, args: args })
    });

    verwijderLaden(loadingEl);

    const data = await res.json();

    if (data.success) {
      // Uitvoer regel voor regel tonen
      const regels = data.output.split("\n");
      regels.forEach(r => appendLine("out", r));
    } else {
      appendLine("error", data.output || "Onbekende fout.");
    }
  } catch (err) {
    verwijderLaden(loadingEl);
    appendLine("error", "[!] Geen verbinding met backend.");
    appendLine("error", "    Zorg dat app.py draait: python app.py");
  }

  isLoading = false;
  terminalInput.focus();
}

// ===== LADEN ANIMATIE =====
function toonLaden() {
  const div = document.createElement("div");
  div.className = "line-info loading-line";
  div.textContent = "[*] Uitvoeren...";
  terminalOutput.appendChild(div);

  let dots = 0;
  div._interval = setInterval(() => {
    dots = (dots + 1) % 4;
    div.textContent = "[*] Uitvoeren" + ".".repeat(dots);
  }, 300);

  scrollToBottom();
  return div;
}

function verwijderLaden(el) {
  if (el) {
    clearInterval(el._interval);
    el.remove();
  }
}

// ===== HULPFUNCTIES =====
function appendLine(type, text) {
  const div = document.createElement("div");
  div.className = `line-${type}`;
  div.textContent = text ?? " ";
  terminalOutput.appendChild(div);
  scrollToBottom();
}

function scrollToBottom() {
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

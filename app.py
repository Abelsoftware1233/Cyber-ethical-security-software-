# ZeroThreat - Flask Backend
# Voer uit met: python app.py

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import shlex
import os
import re

# 1. Flask initialisatie met statische bestanden vanuit de hoofdmap
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Staat verbindingen toe vanuit je frontend

# 2. Hoofdroute die index.html serveert
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# ===== TOEGESTANE TOOLS & COMMANDO'S =====
ALLOWED_TOOLS = {
    "nmap": {
        "bin": "nmap",
        "allowed_flags": ["-sV", "-O", "-p", "-p-", "-sC", "-A", "--open", "-T4"],
    },
    "nikto": {
        "bin": "nikto",
        "allowed_flags": ["-h", "-p", "-ssl", "-output"],
    },
    "john": {
        "bin": "john",
        "allowed_flags": ["--show", "--list=formats", "--wordlist", "--format"],
    },
    "wireshark": {
        "bin": "tshark",  # Wireshark CLI versie
        "allowed_flags": ["-i", "-c", "-Y", "-r", "-w"],
    },
    "w3af": {
        "bin": "w3af_console",
        "allowed_flags": [],
    },
    "hydra": {
        "bin": "hydra",
        "allowed_flags": ["-l", "-L", "-p", "-P", "-t", "-s"],
    },
    "sqlmap": {
        "bin": "sqlmap",
        "allowed_flags": ["-u", "--batch", "--dbs", "--tables", "--dump", "--level", "--risk"],
    },
    "metasploit": {
        "bin": "msfconsole",
        "allowed_flags": ["-x", "-q"],
    }
}

# ===== API ENDPOINTS =====

@app.route('/api/tools', methods=['GET'])
def get_tools():
    """Geef lijst van toegestane tools terug."""
    return jsonify(ALLOWED_TOOLS)

@app.route('/api/run', methods=['POST'])
@app.route('/run', methods=['POST'])
@app.route('/api/scan', methods=['POST'])
@app.route('/scan', methods=['POST'])
def run_tool():
    """Voer een geselecteerde security tool veilig uit."""
    data = request.get_json() or {}
    tool_name = data.get('tool')
    target = data.get('target', '').strip()
    user_flags = data.get('flags', [])

    if not tool_name or tool_name not in ALLOWED_TOOLS:
        return jsonify({"error": f"Tool '{tool_name}' is niet toegestaan of niet gevonden."}), 400

    tool_config = ALLOWED_TOOLS[tool_name]
    bin_path = tool_config["bin"]
    allowed_flags = tool_config.get("allowed_flags", [])

    cmd = [bin_path]

    # Converteer string-flags naar een lijst indien nodig
    if isinstance(user_flags, str):
        user_flags = shlex.split(user_flags)

    # Valideer flags
    for flag in user_flags:
        flag_base = flag.split('=')[0]
        if flag_base in allowed_flags or any(flag.startswith(af) for af in allowed_flags):
            cmd.append(flag)

    # Target validatie (voorkom command injection)
    if target:
        if re.match(r'^[a-zA-Z0-9.-_:/]+$', target):
            cmd.append(target)
        else:
            return jsonify({"error": "Ongeldig target formaat."}), 400

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        return jsonify({
            "success": True,
            "command": " ".join(cmd),
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode
        })
    except subprocess.TimeoutExpired:
        return jsonify({"error": "Commando uitvoering is verlopen (timeout van 120s)."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5025))
    app.run(host='0.0.0.0', port=port, debug=True)

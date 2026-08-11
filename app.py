# ZeroThreat - Flask Backend

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import shlex
import os
import re

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# ===== FRONTEND ROUTE =====
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# ===== ALLOWED TOOLS & COMMANDS =====
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
        "bin": "tshark", 
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

@app.route('/api', methods=['GET'])
@app.route('/api/', methods=['GET'])
def api_health():
    """Healthcheck for the Windows CLI script"""
    return jsonify({"status": "online", "message": "Backend is reachable"})

@app.route('/api/tools', methods=['GET'])
def get_tools():
    """Return list of allowed tools."""
    return jsonify(ALLOWED_TOOLS)

@app.route('/api/run', methods=['POST'])
@app.route('/run', methods=['POST'])
@app.route('/api/scan', methods=['POST'])
@app.route('/scan', methods=['POST'])
def run_tool():
    """Execute a selected security tool safely."""
    data = request.get_json() or {}
    tool_name = data.get('tool')
    target = data.get('target', '').strip()
    user_flags = data.get('flags', [])

    if not tool_name or tool_name not in ALLOWED_TOOLS:
        return jsonify({"error": f"Tool '{tool_name}' is not allowed or not found."}), 400

    tool_config = ALLOWED_TOOLS[tool_name]
    bin_path = tool_config["bin"]
    allowed_flags = tool_config.get("allowed_flags", [])

    cmd = [bin_path]

    if isinstance(user_flags, str):
        user_flags = shlex.split(user_flags)

    for flag in user_flags:
        flag_base = flag.split('=')[0]
        if flag_base in allowed_flags or any(flag.startswith(af) for af in allowed_flags):
            cmd.append(flag)

    if target:
        if re.match(r'^[a-zA-Z0-9.-_:/]+$', target):
            cmd.append(target)
        else:
            return jsonify({"error": "Invalid target format."}), 400

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
        return jsonify({"error": "Command execution timed out (120s)."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5025))
    app.run(host='0.0.0.0', port=port, debug=True)

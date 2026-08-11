"""
ZeroThreat – Flask Backend
Voer uit met: python app.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import shlex
import os
import re

app = Flask(__name__)
CORS(app)  # Staat verbindingen toe vanuit je frontend

# ===== TOEGESTANE TOOLS & COMMANDO'S =====
# Voeg hier jouw eigen tools/paden toe
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
        "bin": "tshark",   # Wireshark CLI versie
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
        "allowed_flags": ["-u", "--dbs", "--tables", "--dump", "--batch", "--level"],
    },
    "dirb": {
        "bin": "dirb",
        "allowed_flags": ["-o", "-r", "-z"],
    },
    "gobuster": {
        "bin": "gobuster",
        "allowed_flags": ["dir", "-u", "-w", "-t", "-o", "-x"],
    },
    "hashcat": {
        "bin": "hashcat",
        "allowed_flags": ["-m", "-a", "-o", "--show", "--force"],
    },
}

# ===== HULPFUNCTIES =====

def tool_beschikbaar(tool_naam):
    """Controleer of een tool geïnstalleerd is op het systeem."""
    return subprocess.run(
        ["which", tool_naam],
        capture_output=True
    ).returncode == 0


def valideer_commando(tool_key, args_string):
    """
    Basisvalidatie: controleer of de tool bestaat in de whitelist.
    Voeg hier extra validatie toe indien gewenst.
    """
    if tool_key not in ALLOWED_TOOLS:
        return False, f"Tool '{tool_key}' is niet toegestaan."
    return True, None


def voer_uit(commando_lijst, timeout=60):
    """
    Voer een systeemcommando uit en geef de uitvoer terug.
    timeout: maximale uitvoeringstijd in seconden
    """
    try:
        result = subprocess.run(
            commando_lijst,
            capture_output=True,
            text=True,
            timeout=timeout
        )
        uitvoer = result.stdout or result.stderr or "(geen uitvoer)"
        return True, uitvoer
    except subprocess.TimeoutExpired:
        return False, "Fout: commando heeft de tijdslimiet overschreden."
    except FileNotFoundError:
        return False, f"Fout: tool niet gevonden op dit systeem."
    except Exception as e:
        return False, f"Onverwachte fout: {str(e)}"


# ===== API ROUTES =====

@app.route("/api/status", methods=["GET"])
def status():
    """Controleer welke tools beschikbaar zijn."""
    beschikbaar = {}
    for key, config in ALLOWED_TOOLS.items():
        beschikbaar[key] = tool_beschikbaar(config["bin"])
    return jsonify({
        "status": "actief",
        "tools": beschikbaar
    })


@app.route("/api/run", methods=["POST"])
def run_tool():
    """
    Voer een tool uit.
    
    Verwacht JSON body:
    {
        "tool": "nmap",
        "args": "-sV 192.168.1.1"
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "output": "Geen JSON data ontvangen."}), 400

    tool_key = data.get("tool", "").strip().lower()
    args_raw  = data.get("args", "").strip()

    # Valideer tool
    geldig, fout = valideer_commando(tool_key, args_raw)
    if not geldig:
        return jsonify({"success": False, "output": fout}), 403

    tool_config = ALLOWED_TOOLS[tool_key]
    bin_naam    = tool_config["bin"]

    # Controleer of tool geïnstalleerd is
    if not tool_beschikbaar(bin_naam):
        return jsonify({
            "success": False,
            "output": f"'{bin_naam}' is niet geïnstalleerd op dit systeem.\nInstalleer met: sudo apt install {bin_naam}"
        }), 404

    # Bouw commando op
    try:
        args_lijst = shlex.split(args_raw) if args_raw else []
    except ValueError as e:
        return jsonify({"success": False, "output": f"Ongeldige argumenten: {e}"}), 400

    commando = [bin_naam] + args_lijst

    # Uitvoeren
    succes, uitvoer = voer_uit(commando, timeout=120)

    return jsonify({
        "success": succes,
        "tool":    tool_key,
        "command": " ".join(commando),
        "output":  uitvoer
    })


@app.route("/api/tools", methods=["GET"])
def lijst_tools():
    """Geef een lijst van alle geconfigureerde tools terug."""
    return jsonify({
        "tools": list(ALLOWED_TOOLS.keys())
    })


# ===== STARTEN =====
if __name__ == "__main__":
    print("=" * 45)
    print("  ZeroThreat Backend – Actief")
    print("  URL: http://127.0.0.1:5025")
    print("=" * 45)
    app.run(debug=True, host="127.0.0.1", port=5025)

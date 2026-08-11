#!/usr/bin/env bash

# Exit immediately if any command fails
set -e

# Ensure script is executed with root/sudo privileges
if [ "$EUID" -ne 0 ]; then
  echo "[ERROR] Please run this script with sudo or as root:"
  echo "        sudo bash deploy.sh"
  exit 1
fi

# Set deployment configuration variables
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_USER="${SUDO_USER:-$USER}"
SERVICE_NAME="cyber-security-app"
PORT=5025
VENV_DIR="$APP_DIR/venv"

echo "=========================================="
echo " Starting setup on Port: $PORT"
echo " Directory: $APP_DIR"
echo " User: $APP_USER"
echo "=========================================="

# 1. Install required system packages
echo "--> [1/5] Updating packages and installing Python system tools..."
apt-get update -qq
apt-get install -y python3 python3-venv python3-pip

# 2. Create Python Virtual Environment (venv)
if [ ! -d "$VENV_DIR" ]; then
    echo "--> [2/5] Creating virtual environment at $VENV_DIR..."
    python3 -m venv "$VENV_DIR"
else
    echo "--> [2/5] Virtual environment already exists. Skipping creation."
fi

# Set ownership of app files to the user
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# 3. Upgrade pip and install requirements.txt
echo "--> [3/5] Installing Python dependencies..."
sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install --upgrade pip

if [ -f "$APP_DIR/requirements.txt" ]; then
    sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install -r "$APP_DIR/requirements.txt"
else
    echo "[WARNING] requirements.txt not found. Skipping requirements installation."
fi

# Ensure production WSGI server (gunicorn) is available in venv
sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install gunicorn

# 4. Create systemd unit service file for port 5025
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
echo "--> [4/5] Creating systemd service unit (${SERVICE_FILE})..."

cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Cyber Ethical Security App on Port $PORT
After=network.target

[Service]
User=$APP_USER
WorkingDirectory=$APP_DIR
Environment="PATH=$VENV_DIR/bin"
Environment="PORT=$PORT"
ExecStart=$VENV_DIR/bin/gunicorn --workers 3 --bind 127.0.0.1:$PORT app:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 5. Enable and start systemctl service
echo "--> [5/5] Reloading systemd, enabling and starting $SERVICE_NAME..."
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

echo "=========================================="
echo " Setup complete!"
echo " Service Status:"
systemctl status "$SERVICE_NAME" --no-pager
echo "=========================================="
echo " Your application is live at: http://127.0.0.1:$PORT"
echo " You can now point your Nginx reverse proxy to port $PORT."

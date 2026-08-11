#!/usr/bin/env bash

# Stop execution on any error
set -e

# 1. Root check
if [ "$EUID" -ne 0 ]; then
  echo "[ERROR] Please run this script with sudo or as root:"
  echo "        sudo bash deploy.sh"
  exit 1
fi

# Variables
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_USER="${SUDO_USER:-$USER}"
SERVICE_NAME="cyber-security-app"
PORT=5025
VENV_DIR="$APP_DIR/venv"

echo "=========================================="
echo " Starting deployment on Port: $PORT"
echo " Working Directory: $APP_DIR"
echo " Owner User: $APP_USER"
echo "=========================================="

# 2. Update and install required system packages
echo "--> Installing system packages (python3, python3-venv, python3-pip)..."
apt-get update -qq
apt-get install -y python3 python3-venv python3-pip

# 3. Create Python virtual environment
if [ ! -d "$VENV_DIR" ]; then
    echo "--> Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
else
    echo "--> Virtual environment already exists. Skipping creation."
fi

# Set proper ownership for the application directory
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# 4. Install dependencies inside the virtual environment
echo "--> Upgrading pip and installing dependencies..."
sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install --upgrade pip

if [ -f "$APP_DIR/requirements.txt" ]; then
    sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install -r "$APP_DIR/requirements.txt"
else
    echo "[WARNING] requirements.txt not found. Skipping dependency installation."
fi

# Ensure production server (gunicorn) is installed
sudo -u "$APP_USER" "$VENV_DIR/bin/pip" install gunicorn

# 5. Create the systemd service file
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
echo "--> Creating systemd service file at ${SERVICE_FILE}..."

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

# 6. Enable and start the service
echo "--> Reloading systemd and starting $SERVICE_NAME..."
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

echo "=========================================="
echo " Deployment Complete!"
echo " Status of $SERVICE_NAME:"
systemctl status "$SERVICE_NAME" --no-pager
echo "=========================================="
echo " Application is running locally at http://127.0.0.1:$PORT"
echo " Ready for Nginx reverse proxy setup."

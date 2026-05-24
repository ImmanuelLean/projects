#!/usr/bin/env bash
# =============================================================================
# Ubuntu 24.04 WSL2 — One-shot developer environment installer
# Mirrors the host emmanuel_coder@DESKTOP-D1PMLJK
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# =============================================================================
set -euo pipefail

log() { printf "\n\033[1;36m==> %s\033[0m\n" "$*"; }

# ---------------------------------------------------------------------------
# 0. Sanity checks
# ---------------------------------------------------------------------------
if [[ $EUID -eq 0 ]]; then
  echo "Run as your normal user (sudo will be invoked as needed)." >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 1. /etc/wsl.conf — systemd + default user
# ---------------------------------------------------------------------------
log "Configuring /etc/wsl.conf (systemd + default user)"
sudo tee /etc/wsl.conf >/dev/null <<EOF
[boot]
systemd=true

[user]
default=${USER}
EOF

# ---------------------------------------------------------------------------
# 2. Base system
# ---------------------------------------------------------------------------
log "Updating apt and installing base packages"
sudo apt update
sudo apt upgrade -y
sudo apt install -y \
  build-essential curl wget git unzip zip ca-certificates \
  software-properties-common gnupg lsb-release apt-transport-https \
  htop tree jq ripgrep fzf tmux net-tools openssh-client \
  cmake gdb make gcc g++

# ---------------------------------------------------------------------------
# 3. Databases
# ---------------------------------------------------------------------------
log "Installing SQLite"
sudo apt install -y sqlite3 libsqlite3-dev

log "Installing MariaDB"
sudo apt install -y mariadb-server mariadb-client
sudo systemctl enable --now mariadb || true

log "Installing PostgreSQL"
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql || true

log "Installing MySQL client libraries"
sudo apt install -y mysql-common libmysqlclient-dev || true

# ---------------------------------------------------------------------------
# 4. Languages
# ---------------------------------------------------------------------------
log "Installing Python"
sudo apt install -y python3 python3-pip python3-venv python3-dev

log "Installing PHP 8.3 + extensions"
sudo apt install -y php php-cli php-mysql php-sqlite3 php-curl php-xml php-mbstring

log "Installing Composer"
if ! command -v composer >/dev/null; then
  curl -sS https://getcomposer.org/installer | php
  sudo mv composer.phar /usr/local/bin/composer
fi

log "Installing OpenJDK 21"
sudo apt install -y openjdk-21-jdk

log "Installing nvm + Node LTS + latest"
if [[ ! -d "$HOME/.nvm" ]]; then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm install node
nvm alias default node
npm install -g pnpm corepack

# ---------------------------------------------------------------------------
# 5. Docker Engine
# ---------------------------------------------------------------------------
log "Installing Docker Engine"
if ! command -v docker >/dev/null; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo tee /etc/apt/keyrings/docker.asc >/dev/null
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt update
  sudo apt install -y docker-ce docker-ce-cli containerd.io \
                      docker-buildx-plugin docker-compose-plugin
  sudo usermod -aG docker "$USER"
  sudo systemctl enable --now docker || true
fi

# ---------------------------------------------------------------------------
# 6. Dev tooling
# ---------------------------------------------------------------------------
log "Installing GitHub CLI"
sudo apt install -y gh

log "Installing Apache2"
sudo apt install -y apache2
sudo systemctl enable --now apache2 || true

# ---------------------------------------------------------------------------
# 7. Done
# ---------------------------------------------------------------------------
log "Cleaning up"
sudo apt autoremove -y

cat <<'EOF'

============================================================
 ✅  Installation complete.

 Next:
   1. Run `wsl --shutdown` in Windows PowerShell, then reopen
      Ubuntu (so systemd + docker group take effect).
   2. Secure MariaDB:   sudo mysql_secure_installation
   3. Set postgres pw:  sudo -u postgres psql -c \
        "ALTER USER postgres PASSWORD 'postgres';"
   4. Authenticate gh:  gh auth login
============================================================
EOF

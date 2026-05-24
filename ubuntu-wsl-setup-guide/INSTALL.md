# Step-by-Step Installation Guide

A full reproduction of this Ubuntu WSL2 environment, in the same order it was built.

---

## Part 1 — Install WSL2 and Ubuntu 24.04 on Windows

### 1. Enable WSL (Windows PowerShell as Administrator)

```powershell
wsl --install
```

This enables the WSL feature, the Virtual Machine Platform, downloads the WSL2 kernel
and installs the default Ubuntu distribution.

### 2. (Optional) Install a specific Ubuntu version

```powershell
wsl --list --online
wsl --install -d Ubuntu-24.04
wsl --set-default-version 2
```

### 3. Update the WSL kernel and reboot

```powershell
wsl --update
wsl --shutdown
```

### 4. First Ubuntu launch

Open **Ubuntu 24.04** from the Start menu. Create your UNIX username and password
(this machine uses `emmanuel_coder`).

### 5. Enable systemd and default user

Create `/etc/wsl.conf` (sudo required):

```ini
[boot]
systemd=true

[user]
default=emmanuel_coder
```

Then back in PowerShell:

```powershell
wsl --shutdown
```

Re-open Ubuntu — systemd is now PID 1, so `systemctl` works.

---

## Part 2 — Base system update

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl wget git unzip zip ca-certificates \
                    software-properties-common gnupg lsb-release apt-transport-https
```

---

## Part 3 — Databases

### SQLite

```bash
sudo apt install -y sqlite3 libsqlite3-dev
sqlite3 --version          # 3.45.x
```

### MariaDB (MySQL-compatible)

```bash
sudo apt install -y mariadb-server mariadb-client
sudo systemctl enable --now mariadb
sudo mysql_secure_installation
mariadb --version
```

### PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
psql --version             # 16.13
```

### MySQL client libs (if you ever need the real Oracle MySQL alongside MariaDB)

```bash
sudo apt install -y mysql-common libmysqlclient-dev
```

---

## Part 4 — Programming languages & runtimes

### Node.js via nvm (recommended)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm install node          # latest (this host runs v24.14.1)
nvm use node
npm install -g pnpm corepack
```

### Python 3

```bash
sudo apt install -y python3 python3-pip python3-venv python3-dev
python3 --version          # 3.12.x
```

### PHP 8.3 + Composer

```bash
sudo apt install -y php php-cli php-mysql php-sqlite3 php-curl php-xml php-mbstring
php -v
# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Java (OpenJDK 21)

```bash
sudo apt install -y openjdk-21-jdk
java --version
```

### C / C++ toolchain

```bash
sudo apt install -y build-essential gdb cmake make gcc g++
```

---

## Part 5 — Containers

### Docker Engine (native, no Docker Desktop required)

```bash
# Add Docker's official repo
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo tee /etc/apt/keyrings/docker.asc > /dev/null
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
sudo systemctl enable --now docker
```

Log out / restart WSL: `wsl --shutdown` from PowerShell, then re‑open.

---

## Part 6 — Developer tooling

### GitHub CLI

```bash
sudo apt install -y gh
gh auth login
```

### Apache (already enabled on this host)

```bash
sudo apt install -y apache2
sudo systemctl enable --now apache2
```

### Useful CLI utilities

```bash
sudo apt install -y htop tree jq ripgrep fzf tmux net-tools openssh-client
```

---

## Part 7 — Editor / IDE integration

- Install **VS Code** on Windows, then add the **WSL** extension.
- Inside Ubuntu run `code .` — VS Code Server installs automatically into `~/.vscode-server`.

---

## Part 8 — Verify everything

Run the checks in [DEPENDENCIES.md](./DEPENDENCIES.md) section *Verification commands*.

---

## Part 9 — Maintenance

```bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
nvm install node --reinstall-packages-from=node   # upgrade Node, keep globals
```

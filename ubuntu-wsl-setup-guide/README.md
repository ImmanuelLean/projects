# Ubuntu WSL Developer Environment Setup Guide

Complete reproducible setup for a Windows + WSL2 + Ubuntu 24.04 LTS developer machine,
documenting exactly what is installed on the current environment so it can be rebuilt
on any new system.

## What this repo contains

| File | Purpose |
|------|---------|
| [INSTALL.md](./INSTALL.md) | Step‑by‑step manual installation (WSL → Ubuntu → tools) |
| [DEPENDENCIES.md](./DEPENDENCIES.md) | Snapshot of every tool currently installed on this machine |
| [setup.sh](./setup.sh) | One‑shot automated installer (run on a fresh Ubuntu WSL) |
| [GITHUB-UPLOAD.md](./GITHUB-UPLOAD.md) | 3‑step guide to push this folder to GitHub |
| [wsl.conf](./wsl.conf) | The `/etc/wsl.conf` used here (systemd + default user) |

## Quick start on a brand‑new machine

```powershell
# 1. In Windows PowerShell (Admin)
wsl --install -d Ubuntu-24.04
```

```bash
# 2. Inside the new Ubuntu shell
curl -fsSL https://raw.githubusercontent.com/<your-user>/ubuntu-wsl-setup-guide/main/setup.sh | bash
```

That's it — SQLite, MariaDB, PostgreSQL, Node.js (via nvm), Python, PHP, Java, Docker,
GitHub CLI and the rest will be installed and enabled.

## Current host snapshot

- **OS:** Ubuntu 24.04.4 LTS (Noble) on WSL2 kernel 6.6.87.2
- **Default user:** `emmanuel_coder`
- **systemd:** enabled
- **Databases:** SQLite 3.45, MariaDB 10.11, PostgreSQL 16.13
- **Languages:** Node 24.14 (nvm), Python 3.12, PHP 8.3, Java 21, GCC 13.3
- **Containers:** Docker 29.4

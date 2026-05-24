# Installed Dependencies — Snapshot of this Machine

Captured live from the running system. Use this as the canonical list when
rebuilding.

## Operating system

| Item | Value |
|------|-------|
| Distro | Ubuntu 24.04.4 LTS (Noble Numbat) |
| Kernel | 6.6.87.2-microsoft-standard-WSL2 |
| Architecture | x86_64 |
| systemd | enabled (`/etc/wsl.conf [boot] systemd=true`) |
| Default user | `emmanuel_coder` |

## Databases

| Engine | Version | Service |
|--------|---------|---------|
| SQLite | 3.45.1 | n/a (file based) |
| MariaDB (MySQL drop-in) | 10.11.14 | `mariadb.service` (enabled) |
| PostgreSQL | 16.13 | `postgresql.service` (enabled) |

DB-related packages currently installed:

```
sqlite3, libsqlite3-0, libaprutil1-dbd-sqlite3
mariadb-server, mariadb-client, mariadb-common, libmariadb3
mariadb-plugin-provider-{bzip2,lz4,lzma,lzo,snappy}
mysql-common, libmysqlclient21, libdbd-mysql-perl
postgresql, postgresql-16, postgresql-client-16,
postgresql-client-common, postgresql-common, postgresql-contrib
php8.3-mysql, php8.3-sqlite3, php-mysql, php-sqlite3
```

## Languages & runtimes

| Tool | Version |
|------|---------|
| Node.js (via nvm) | v24.14.1 |
| npm | 11.11.0 |
| pnpm | 10.33.2 |
| Python | 3.12.3 |
| pip | 24.0 |
| PHP | 8.3.6 |
| Composer | 2.7.1 |
| Java (OpenJDK) | 21.0.10 |
| GCC | 13.3.0 |
| G++ | 13.3.0 |
| GNU Make | 4.3 |

## Containers

| Tool | Version | Service |
|------|---------|---------|
| Docker Engine | 29.4.2 | `docker.service` (enabled) |
| containerd | (apt) | `containerd.service` (enabled) |

## Networking / tooling

| Tool | Version |
|------|---------|
| curl | 8.5.0 |
| wget | 1.21.4 |
| git | 2.43.0 |
| GitHub CLI (`gh`) | 2.45.0 |

## Web servers / services enabled

```
apache2.service
mariadb.service
postgresql.service
docker.service
containerd.service
cron.service
ssh / openssh (client)
snapd.service
```

## Global npm packages

```
@github/copilot@1.0.34
corepack@0.34.6
npm@11.11.0
pnpm@10.33.2
```

## Python (system) packages of note

Standard `cloud-init`, `cryptography`, `bcrypt`, `httplib2`, `Babel`, etc.
Use a `venv` for project work — do **not** `pip install` into the system Python.

## Verification commands

Paste this block into a fresh shell after running `setup.sh`:

```bash
echo "--- OS ---"; lsb_release -a
echo "--- DBs ---"
sqlite3 --version
mariadb --version
psql --version
echo "--- Languages ---"
node --version && npm --version && pnpm --version
python3 --version && pip3 --version
php --version | head -1
java --version
gcc --version | head -1
echo "--- Tools ---"
git --version
gh --version | head -1
docker --version
echo "--- Services ---"
systemctl is-active mariadb postgresql docker apache2
```

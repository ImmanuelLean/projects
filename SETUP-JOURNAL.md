# 🚀 Setup Journal — What We Did & Why It Matters

A complete, beginner-friendly record of everything we configured in this session,
**why each step matters**, and the **exact commands** so you can repeat or understand them later.

> Account used: `codewithimmanuel@gmail.com`
> Machine: Windows · Workspace: `C:\Users\HP Laptop\ANTIGRAVITY`

---

## 📑 Table of Contents
1. [Configured MCP servers in Antigravity](#1-configured-mcp-servers-in-antigravity)
2. [Added the GitHub MCP server](#2-added-the-github-mcp-server)
3. [Uploaded the workspace to GitHub](#3-uploaded-the-workspace-to-github)
4. [Installed Google Cloud CLI](#4-installed-google-cloud-cli)
5. [Logged in & created a Cloud project](#5-logged-in--created-a-cloud-project)
6. [Quick reference cheat sheet](#6-quick-reference-cheat-sheet)
7. [Glossary](#7-glossary)

---

## 1. Configured MCP servers in Antigravity

### What is MCP?
**MCP (Model Context Protocol)** is a standard that lets the **AI agent inside
Antigravity** plug into external tools, docs, browsers, and services. Think of it
as a **USB-C port for AI** — instead of you copy-pasting context or running
commands yourself, the agent can call these tools directly when you chat with it.

### Where the config lives
```
C:\Users\HP Laptop\.gemini\config\mcp_config.json
```
This is the **shared** config — used by both the Antigravity **IDE** and **CLI**.

### What we added (best picks for full-stack web dev)
| Server | What it does | Why it matters |
|--------|--------------|----------------|
| **context7** | Fetches up-to-date docs for any library/framework | Stops the AI giving outdated/hallucinated code |
| **playwright** | Controls a real browser | E2E tests, screenshots, scraping, UI debugging |
| **shadcn** | Browse & install UI components | Fast, consistent UI building |

```jsonc
{
  "mcpServers": {
    "context7":   { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] },
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
    "shadcn":     { "command": "npx", "args": ["-y", "shadcn@latest", "mcp"] }
  }
}
```

### Antigravity-specific rules (important!)
- Use **`serverUrl`** for remote servers — *not* `url` or `httpUrl`.
- **No inline comments** allowed in the JSON.
- **No top-level `timeout`** property.
- After editing: **Agent panel → "..." menu → Manage MCP Servers → Refresh** (or type `/mcp`).

### ✅ Significance
You taught the AI agent new skills it can use just by you *asking* — no manual
command typing for docs lookup, browser testing, or component installs.

---

## 2. Added the GitHub MCP server

We added a GitHub server so the agent could (optionally) manage your repos by chat:

```jsonc
"github": {
  "serverUrl": "https://api.githubcopilot.com/mcp/",
  "headers": { "Authorization": "Bearer YOUR_GITHUB_TOKEN" }
}
```

### ⚠️ Status: needs a token
This server is **inactive until you add a GitHub Personal Access Token**:
1. Go to <https://github.com/settings/tokens> → *Generate new token (classic)*.
2. Check the **`repo`** scope.
3. Replace `YOUR_GITHUB_TOKEN` in the config with it, then refresh MCP servers.

> 🔐 The token is stored in plaintext in that file — treat it like a password.

### ✅ Significance
This is a **convenience layer**. It is **NOT** how we uploaded your code (we used
plain git — see next section). It only matters if you want the agent to do GitHub
tasks for you via chat later.

---

## 3. Uploaded the workspace to GitHub

> 💡 **Key learning:** This upload used **plain git**, *not* MCP. Git was already
> installed on your machine. MCP and git are different things.

### Repo
**https://github.com/ImmanuelLean/projects**
(This repo already had other work — C/C++ practice, etc. We **added to it without
overwriting** anything.)

### What we did, step by step
| Step | Command | Why |
|------|---------|-----|
| 1. Init git | `git init` | Turns the folder into a git repository |
| 2. Connect remote | `git remote add origin <url>` | Links local folder to the GitHub repo |
| 3. Fetch existing | `git fetch origin` | Downloads the repo's existing history |
| 4. Attach to branch | `git checkout -b main origin/main` | Builds on existing work (no overwrite) |
| 5. Ignore junk | edited `.gitignore` | Keeps huge/auto-generated files out |
| 6. Stage | `git add -A` | Marks files to be saved |
| 7. Commit | `git commit -m "..."` | Saves a snapshot locally |
| 8. Push | `git push origin main` | Uploads to GitHub |

### What we deliberately EXCLUDED (via `.gitignore`)
- `node_modules/` — re-downloadable dependencies (huge, never commit).
- `server.exe` — 8.3 MB compiled Go binary (build artifacts don't belong in git).

### What got uploaded
- `go-lessons/` — all 10 lessons + packages & tests
- `go-hello-api/` — Go source (without the `.exe`)
- Web files: `index.html`, `index.css`, `index.js`, `emm.html`, `package.json`, `.prettierrc`, `.vscode/`

### ✅ Significance
Your work is now **backed up in the cloud**, **version-controlled** (every change
is tracked), and **accessible from any machine**.

### 🔁 Next time you change files
```powershell
git add -A
git commit -m "describe what changed"
git push
```

---

## 4. Installed Google Cloud CLI

### What is it?
`gcloud` is Google's command-line tool to manage Google Cloud (databases,
storage, AI services, etc.) from your terminal.

### How we installed it
```powershell
winget install --id Google.CloudSDK -e --accept-package-agreements --accept-source-agreements
```
- Installed: **Google Cloud SDK 573.0.0** (includes `gcloud`, `gsutil`, `bq`).
- Location: `C:\Users\HP Laptop\AppData\Local\Google\Cloud SDK\`

### ⚠️ The PATH gotcha (very common!)
After install, typing `gcloud` gave:
`'gcloud' is not recognized...`

**Why:** A terminal only reads the system **PATH** when it *starts*. The installer
added gcloud to the PATH, but your already-open terminal didn't know yet.

**Fixes:**
- **Best:** open a **brand-new terminal** (or fully restart Antigravity).
- **Quick (current terminal only):**
  ```powershell
  $env:Path = [Environment]::GetEnvironmentVariable("Path","User") + ";" + [Environment]::GetEnvironmentVariable("Path","Machine")
  ```

### ✅ Significance
You can now use Google Cloud services from the command line, and your Antigravity
**Google Cloud MCP servers** (BigQuery, Spanner, AlloyDB...) can authenticate
using these credentials.

---

## 5. Logged in & created a Cloud project

### Login
```powershell
gcloud init        # or: gcloud auth login
```
Opens a browser → pick account → **Allow**. Logged in as `codewithimmanuel@gmail.com`.

### The Terms of Service blocker
Creating a project failed with: *"Callers must accept Terms of Service."*

**Why:** Logging in ≠ accepting the **Cloud Terms of Service**. The ToS must be
accepted once, in the browser, at <https://console.cloud.google.com>.

> 🧠 **Learning:** Authentication (who you are) is separate from accepting the
> service agreement (your permission to use the service).

### Creating the project
After accepting the ToS in the browser:
```powershell
gcloud projects create <unique-id> --name="Immanuel Dev" --set-as-default
```
- Project IDs must be **6–30 chars**, lowercase letters/digits/hyphens, **globally unique**.
- We ended up with project **`immanuel-dev-499812`** ("Immanuel Dev") set as active.
- A duplicate created during testing was cleaned up with `gcloud projects delete`.

### ✅ Final status
```
✅ gcloud installed          573.0.0
✅ logged in                 codewithimmanuel@gmail.com
✅ Terms of Service          accepted
✅ active project            immanuel-dev-499812 ("Immanuel Dev")
```

### ➡️ What's still optional
To actually *use* cloud services (BigQuery etc.) you'll later need to:
- **Enable the relevant APIs**, e.g. `gcloud services enable bigquery.googleapis.com`
- Possibly **link a billing account** to the project.

---

## 6. Quick reference cheat sheet

### Git (daily backup)
```powershell
git status                 # what changed
git add -A                 # stage everything
git commit -m "message"    # save snapshot
git push                   # upload to GitHub
git pull                   # get latest from GitHub
```

### gcloud essentials
```powershell
gcloud --version                       # confirm install
gcloud auth list                       # who am I logged in as
gcloud config get-value project        # current project
gcloud projects list                   # all my projects
gcloud config set project <id>         # switch project
```

### Antigravity MCP
- Config file: `C:\Users\HP Laptop\.gemini\config\mcp_config.json`
- Reload: Agent panel → "..." → Manage MCP Servers → **Refresh** (or `/mcp`)

---

## 7. Glossary

| Term | Plain-English meaning |
|------|-----------------------|
| **MCP** | A way for the AI agent to use external tools/services |
| **MCP server** | One specific tool the agent can call (GitHub, browser, docs...) |
| **git** | Version-control tool that tracks file changes locally |
| **remote / origin** | The online copy of your repo (on GitHub) |
| **commit** | A saved snapshot of your code |
| **push / pull** | Upload / download changes to/from GitHub |
| **.gitignore** | List of files git should never track |
| **PATH** | List of folders the terminal searches for commands |
| **gcloud** | Google Cloud's command-line tool |
| **PAT (token)** | A password-like key that proves you own your GitHub account |
| **ToS** | Terms of Service — the agreement you accept to use a service |

---

### 🎯 The big picture
```diagram
╭──────────────────╮     ╭──────────────────╮     ╭────────────────────╮
│  Antigravity AI  │────▶│  MCP servers     │────▶│ docs · browser · UI │
│     (agent)      │     │  (agent's tools) │     │  · GitHub · Cloud   │
╰──────────────────╯     ╰──────────────────╯     ╰────────────────────╯

╭──────────────────╮     ╭──────────────────╮     ╭────────────────────╮
│  Your code       │────▶│  git (push)      │────▶│ GitHub: ImmanuelLean│
│  (this folder)   │     │                  │     │ /projects (backup)  │
╰──────────────────╯     ╰──────────────────╯     ╰────────────────────╯

╭──────────────────╮     ╭──────────────────╮     ╭────────────────────╮
│  gcloud CLI      │────▶│  your Google     │────▶│ Cloud project:      │
│  (terminal)      │     │  account login   │     │ immanuel-dev-499812 │
╰──────────────────╯     ╰──────────────────╯     ╰────────────────────╯
```

*Generated as a learning reference. Keep it, edit it, push it with `git push`.* ✨

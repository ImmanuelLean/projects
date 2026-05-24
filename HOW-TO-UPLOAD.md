# How to Upload Projects to GitHub

Personal cheatsheet for `~/projects` on this Ubuntu WSL2 machine.
The `~/projects` folder is **one single Git repo** connected to
`git@github.com:ImmanuelLean/projects.git` over SSH.

---

## Part A — Day‑to‑day: upload any new folder in 3 steps

Whenever you create a new project inside `~/projects/`, do this:

```bash
cd ~/projects
git add my-new-folder/                 # or:  git add .   (everything)
git commit -m "Add my-new-folder: short description"
git push
```

That's the whole flow. No `git init`, no `gh repo create`, no remote setup.

### Useful extras

```bash
git status              # see what's new/changed before committing
git pull                # pull updates first if you also work on another machine
git log --oneline -5    # see your last 5 commits
git diff                # see exactly what changed
```

### ⚠️  Rules to avoid breaking the setup

1. **Never run `git init` inside a sub‑folder of `~/projects/`.**
   That creates a nested repo and the parent repo will refuse to track its files.
   Just drop your folder into `~/projects/` and commit from `~/projects`.

2. If you accidentally did `git init` inside, fix it with:
   ```bash
   rm -rf ~/projects/that-folder/.git
   cd ~/projects && git add that-folder/ && git commit -m "..." && git push
   ```

3. Keep secrets (`.env`, API keys, passwords) out of commits — use a
   `.gitignore` file at the project root.

---

## Part B — One‑time: how `~/projects` was connected to GitHub via SSH

This is exactly how you would reconnect on a brand‑new machine.

### Step 1 — Identify yourself to Git

```bash
git config --global user.name  "Emmanuel Z. Lean"
git config --global user.email "codewithimmanuel@gmail.com"
```

### Step 2 — Generate an SSH key (if you don't already have one)

```bash
ls ~/.ssh/id_ed25519.pub 2>/dev/null && echo "Key exists ✅" || \
  ssh-keygen -t ed25519 -C "codewithimmanuel@gmail.com" -f ~/.ssh/id_ed25519 -N ""
```

Start the agent and load the key:

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Step 3 — Add the public key to your GitHub account

Print the key:

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the output, then:

1. Open https://github.com/settings/keys
2. Click **New SSH key**
3. Title: `WSL Ubuntu 24.04` (anything you like)
4. Paste the key → **Add SSH key**

Verify it works:

```bash
ssh -T git@github.com
# expected:  Hi ImmanuelLean! You've successfully authenticated...
```

### Step 4 — Create the GitHub repo (once)

On https://github.com/new:

- Repository name: `projects`
- Public or Private (your choice)
- **Do NOT** initialise with README / .gitignore / license (keeps it empty)

### Step 5 — Connect the local folder to the GitHub repo (once)

```bash
cd ~/projects
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:ImmanuelLean/projects.git
git push -u origin main
```

The `-u origin main` is the magic bit — it remembers the remote and branch
so that from now on you can just type `git push` (Part A, three steps).

---

## Part C — Quick troubleshooting

| Problem | Fix |
|---------|-----|
| `Permission denied (publickey)` | Re‑run `ssh-add ~/.ssh/id_ed25519`, re‑check key on github.com/settings/keys |
| `Repository not found` | The repo doesn't exist on GitHub yet — create it at https://github.com/new |
| `Updates were rejected ... non-fast-forward` | Someone (or another machine) pushed first. Run `git pull --rebase` then `git push` |
| Wrong identity in commits | `git config --global user.email "codewithimmanuel@gmail.com"` |
| Accidentally committed a secret | Remove the file, `git commit`, then **rotate the secret** — assume it's leaked |

---

## TL;DR

- **New folder → GitHub:** `cd ~/projects && git add . && git commit -m "msg" && git push`
- **New machine → GitHub:** SSH key → add to GitHub → `git clone git@github.com:ImmanuelLean/projects.git`

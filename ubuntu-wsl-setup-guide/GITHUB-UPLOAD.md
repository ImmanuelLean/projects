# Push this folder to GitHub in 3 steps

Run these inside `~/projects/ubuntu-wsl-setup-guide`.

## Step 1 — Initialise the repo

```bash
cd ~/projects/ubuntu-wsl-setup-guide
git init -b main
git add .
git commit -m "Initial commit: Ubuntu WSL2 dev environment setup guide"
```

## Step 2 — Create the GitHub repo (using GitHub CLI)

```bash
gh auth login         # only the first time
gh repo create ubuntu-wsl-setup-guide --public --source=. --remote=origin
```

> Prefer a private repo? Use `--private` instead of `--public`.
>
> No `gh`? Create the repo on github.com/new, then:
> ```bash
> git remote add origin git@github.com:<your-user>/ubuntu-wsl-setup-guide.git
> ```

## Step 3 — Push

```bash
git push -u origin main
```

Done — the guide is live at
`https://github.com/<your-user>/ubuntu-wsl-setup-guide`.

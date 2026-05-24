# 🔐 GitHub Account & Dev Machine Security Checklist

Personal security playbook for `ImmanuelLean` (codewithimmanuel@gmail.com).
Work through the **Critical** list first — it's the difference between
"someone got in" and "I lost everything".

---

## 🚨 Critical — do today

### 1. Enable Two-Factor Authentication (2FA)

- Open https://github.com/settings/security
- Click **Enable two-factor authentication**
- Choose **Authenticator app** (Google Authenticator, Authy, 1Password, Bitwarden) —
  **NOT SMS** (SIM-swap attacks are real).
- Scan the QR code with your app, enter the 6-digit code to confirm.

> GitHub now *requires* 2FA for anyone who contributes code, so this is not optional.

### 2. Save your 2FA recovery codes

When you enable 2FA, GitHub shows ~16 one-time recovery codes.

- **Download** them and save to a password manager.
- **Print** a copy and keep it in a drawer.
- **Without these**, losing your phone = losing your account permanently.
  GitHub support **will not** restore it.

### 3. Use a strong, unique password

- Use a password manager: **Bitwarden** (free), **1Password**, **Proton Pass**.
- Minimum 20 characters, random, never reused on any other site.
- Change it now if you've ever used it elsewhere.

### 4. Secure the email behind the account

Your recovery email is `codewithimmanuel@gmail.com`.
If someone steals that inbox, they steal GitHub too.

- Turn on 2FA in Gmail: https://myaccount.google.com/security
- Use an authenticator app or hardware key, not SMS.
- Add a recovery phone *and* a recovery email you control.

---

## 🛡️ Important — do this week

### 5. Audit SSH keys

- https://github.com/settings/keys
- Delete any key you don't recognise or any from machines you no longer use.

### 6. Audit active sessions & authorised apps

- Sessions: https://github.com/settings/sessions — sign out anything unfamiliar.
- OAuth apps: https://github.com/settings/applications — revoke ones you don't use.
- Personal access tokens: https://github.com/settings/tokens — delete old ones.

### 7. Protect your local SSH private key

Your key `~/.ssh/id_ed25519` lives on this WSL machine.
Anyone with file access to your home folder can push as you.

Add a passphrase (you'll only type it once per session thanks to `ssh-agent`):

```bash
ssh-keygen -p -f ~/.ssh/id_ed25519
# Old passphrase:  (press Enter if none)
# New passphrase:  ********
# Confirm:         ********
```

Verify file permissions:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

### 8. Never commit secrets

API keys, `.env` files, database passwords, tokens — **never** commit them.

- Add a `.gitignore` to every project:
  ```
  .env
  .env.*
  *.pem
  *.key
  secrets/
  config/credentials.*
  ```
- If you ever push a secret by accident:
  1. **Rotate the secret immediately** (assume it's already scraped by bots).
  2. Remove it from history (`git filter-repo` or BFG Repo-Cleaner).
  3. Force-push.
  4. Don't rely on "deleting the commit" — it's still in GitHub's reflog.

### 9. Enable secret scanning & Dependabot alerts

For each important repo → **Settings → Code security and analysis** → enable:

- Dependabot alerts
- Dependabot security updates
- Secret scanning
- Push protection (blocks commits that contain detected secrets)

---

## 🪙 Nice to have — when you have time

### 10. Add a passkey (passwordless login)

- https://github.com/settings/security → **Passkeys** → **Add a passkey**
- Uses your phone/laptop biometrics. Phishing-resistant.

### 11. Buy a hardware security key

- YubiKey 5 NFC (~$50) — works for GitHub, Google, AWS, password managers.
- Keep a backup key in a safe place.

### 12. Sign your commits

So others can verify a commit really came from you:

```bash
# generate a signing key (SSH key works)
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Then add the same key on https://github.com/settings/keys as a **Signing key**.

### 13. Review repo visibility

- Default new repos to **Private**: https://github.com/settings/repositories
- Make repos public only when you mean to share.

### 14. Monitor for breaches

- https://haveibeenpwned.com — sign up for alerts on your email.
- Change passwords immediately if you appear in a breach.

---

## 🆘 If something goes wrong

| Situation | What to do |
|-----------|------------|
| You think someone logged in | Change password → revoke all sessions → rotate SSH keys & tokens → check repos for unknown commits/collaborators |
| Lost phone with 2FA app | Use a recovery code from step 2 to log in, then re-enrol 2FA on the new phone |
| Lost phone AND recovery codes | https://github.com/account/recovery — but recovery is **not guaranteed**. Backups matter. |
| Pushed a secret | Rotate the secret now. Don't just delete the file. |
| Account suspended / hijacked | https://support.github.com — contact support immediately |

---

## TL;DR — Minimum viable security

1. ✅ 2FA on GitHub (authenticator app, not SMS)
2. ✅ Recovery codes saved offline
3. ✅ 2FA on the Gmail behind the account
4. ✅ Passphrase on `~/.ssh/id_ed25519`
5. ✅ Never commit `.env` files

---

## Status on this machine (as of setup)

- [x] 2FA enabled via Microsoft Authenticator
- [x] Recovery codes downloaded & stored safely
- [x] SSH Authentication key registered on GitHub
- [x] SSH Signing key registered on GitHub
- [x] Signed commits enabled globally (`commit.gpgsign=true`)
- [x] Global `.gitignore` blocking `.env`, keys, secrets
- [ ] Passphrase on `~/.ssh/id_ed25519` *(pending)*
- [ ] 2FA on Gmail *(pending)*

Do those five and you've eliminated 99% of the realistic ways to lose this account.


# Local Setup — Windows

This guide gets a new developer running the Decision Ledger on Windows.
Follow every step in order. If something fails, do not skip it.

> **Recommended:** Use Windows 11. Windows 10 works but some steps differ slightly.

---

## Step 1 — Install Windows Subsystem for Linux (WSL2)

WSL2 lets you run Linux commands on Windows. Most development tools
work better on Linux, and the team's scripts assume a Unix environment.

Open **PowerShell as Administrator** and run:

```powershell
wsl --install
```

Restart your computer when prompted.

After restart, open **Ubuntu** from the Start menu. It will ask you to create
a username and password — this is your Linux user (separate from Windows).

Verify:
```bash
wsl --version
# Expected: WSL version 2.x.x
```

📖 Docs: https://learn.microsoft.com/en-us/windows/wsl/install

> **Why WSL?**
> Tools like Supabase CLI and uv work natively on Linux/Mac.
> WSL gives you a proper Linux environment on Windows so the commands
> in this project work the same way as on a Mac.

---

## Step 2 — Install Windows Terminal (recommended)

A much better terminal than Command Prompt or PowerShell.

Download from: https://aka.ms/terminal

After installing, open Windows Terminal and select **Ubuntu** from the dropdown.
All remaining commands run inside Ubuntu/WSL.

---

## Step 3 — Install nvm and Node.js v20

Inside Ubuntu terminal:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**Close and reopen the terminal**, then:

```bash
nvm install 20
nvm use 20
nvm alias default 20

node --version
# Expected: v20.x.x
```

📖 Docs: https://github.com/nvm-sh/nvm#readme

---

## Step 4 — Install uv

Inside Ubuntu terminal:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Close and reopen the terminal**, then:

```bash
uv --version
# Expected: uv 0.11.x

uv python install 3.12
uv python list
```

📖 Docs: https://docs.astral.sh/uv/

---

## Step 5 — Install Docker Desktop for Windows

Download from: https://www.docker.com/products/docker-desktop/

During installation:
- ✅ Check "Use WSL 2 instead of Hyper-V"
- ✅ Check "Add shortcut to desktop"

After installing:
1. Open Docker Desktop
2. Go to Settings → Resources → WSL Integration
3. Enable integration for your Ubuntu distribution
4. Click "Apply & Restart"

Verify inside Ubuntu terminal:
```bash
docker --version
# Expected: Docker version 28.x.x
```

📖 Docs: https://docs.docker.com/desktop/windows/

---

## Step 6 — Install Supabase CLI

Inside Ubuntu terminal:

```bash
# Install via npm (most reliable on WSL)
npm install -g supabase

supabase --version
# Expected: 2.x.x
```

📖 Docs: https://supabase.com/docs/guides/cli/getting-started

---

## Step 7 — Install Git

Git is likely already installed in WSL. Check:

```bash
git --version
```

If missing:
```bash
sudo apt update && sudo apt install git -y
```

Set your identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## Step 8 — Install VS Code + WSL extension

Download VS Code: https://code.visualstudio.com/

Install the WSL extension:
1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search "WSL"
4. Install "WSL" by Microsoft

Now you can open the project in VS Code from WSL:
```bash
cd decision-ledger
code .
```

📖 Docs: https://code.visualstudio.com/docs/remote/wsl

---

## Steps 9–13

From here, follow the same steps as the Mac guide, running all commands
inside the Ubuntu (WSL) terminal:

- [Step 7 onwards in the Mac guide](./local-setup-mac.md#step-7----clone-the-repository)

Everything from cloning the repo onward is identical between Mac and Windows/WSL.

---

## Windows-specific common problems

**Docker commands not found in WSL**
→ Open Docker Desktop → Settings → Resources → WSL Integration → enable your Ubuntu distro → Apply & Restart

**`supabase start` very slow**
→ Normal on first run (downloading images). Subsequent starts are fast.
→ Make sure Docker Desktop is open before running supabase commands.

**Permission errors on files**
→ Make sure you cloned the repo inside WSL filesystem (`~/` or `/home/yourname/`)
→ Not inside `/mnt/c/` (the Windows filesystem) — this causes permission issues

**VS Code not connecting to WSL**
→ Install the WSL extension in VS Code
→ Open terminal in VS Code → select Ubuntu profile

---

## Learning resources

Same as the Mac guide:

| Topic | Resource |
|-------|---------|
| React | https://react.dev/learn |
| Next.js | https://nextjs.org/docs |
| FastAPI | https://fastapi.tiangolo.com/tutorial/ |
| Supabase | https://supabase.com/docs |
| WSL | https://learn.microsoft.com/en-us/windows/wsl/ |
| TypeScript | https://www.typescriptlang.org/docs/handbook/intro.html |

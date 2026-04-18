# Local Setup — Mac

This guide gets a new developer running the Decision Ledger on a Mac.
Follow every step in order. If something fails, do not skip it.

---

## What you are setting up

| Tool | Purpose | Docs |
|------|---------|------|
| Node.js v20 | Runs the Next.js frontend | https://nodejs.org/en/docs |
| nvm | Manages Node versions — pins the team to v20 | https://github.com/nvm-sh/nvm |
| Python 3.12 | Runs FastAPI and all backend services | https://docs.python.org/3.12 |
| uv | Python package manager — replaces pip + virtualenv | https://docs.astral.sh/uv/ |
| Supabase CLI | Runs local database + pushes migrations | https://supabase.com/docs/guides/cli |
| Docker Desktop | Required for Supabase local development | https://docs.docker.com/desktop/mac/ |
| Git | Version control | https://git-scm.com/doc |

---

## Step 1 — Install Homebrew

Homebrew is the Mac package manager. Most tools install through it.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify:
```bash
brew --version
# Expected: Homebrew 4.x.x
```

📖 Docs: https://brew.sh/

---

## Step 2 — Install nvm and Node.js v20

nvm (Node Version Manager) lets you switch between Node versions.
We pin this project to v20 LTS for consistency across all machines.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

**Restart your terminal**, then:

```bash
nvm install 20
nvm use 20
nvm alias default 20

node --version
# Expected: v20.x.x

npm --version
# Expected: 10.x.x
```

📖 Docs: https://github.com/nvm-sh/nvm#readme

> **Why v20 and not the latest?**
> Node v20 is LTS (Long Term Support) — it receives security fixes for years.
> The latest version changes frequently and can break packages unexpectedly.
> The team pins to the same version to avoid "works on my machine" problems.

---

## Step 3 — Install uv

uv manages Python versions, virtual environments, and packages.
It replaces pip, virtualenv, and pyenv in one tool.

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Restart your terminal**, then:

```bash
uv --version
# Expected: uv 0.11.x
```

Install Python 3.12 via uv:

```bash
uv python install 3.12
uv python list
# Should show cpython-3.12 as installed
```

📖 Docs: https://docs.astral.sh/uv/

> **Why uv instead of pip?**
> With pip, you'd have to manually create a virtual environment (`python -m venv venv`),
> activate it (`source venv/bin/activate`), install packages (`pip install ...`),
> and freeze them (`pip freeze > requirements.txt`). On every machine, every time.
>
> With uv, you run `uv sync` once and get an identical environment. Every time. Every machine.
> The `uv.lock` file guarantees exact versions.

---

## Step 4 — Install Docker Desktop

Supabase local development runs inside Docker containers.
You do not need to understand Docker deeply — just have it installed and running.

Download from: https://www.docker.com/products/docker-desktop/

After installing:
1. Open Docker Desktop
2. Wait for the whale icon to appear in your menu bar
3. The icon should be steady (not animated) — that means Docker is running

```bash
docker --version
# Expected: Docker version 28.x.x
```

📖 Docs: https://docs.docker.com/desktop/

> **What is Docker?**
> Docker runs applications in isolated "containers" — think of them as
> lightweight virtual machines. Supabase runs your local database, auth service,
> and storage inside containers so you get the exact same behaviour as production.

---

## Step 5 — Install Supabase CLI

```bash
brew install supabase/tap/supabase
supabase --version
# Expected: 2.x.x
```

📖 Docs: https://supabase.com/docs/guides/cli/getting-started

---

## Step 6 — Install Git (if not already installed)

```bash
git --version
# If missing:
brew install git
```

Set your identity (used in commit messages):
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

📖 Docs: https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup

---

## Step 7 — Clone the repository

```bash
git clone https://github.com/your-org/decision-ledger.git
cd decision-ledger
```

> Replace `your-org` with the actual GitHub organisation name.

---

## Step 8 — Set up environment variables

```bash
cp .env.example .env
```

Open `.env` in your editor and fill in:
- `SUPABASE_URL` — from your Supabase project dashboard
- `SUPABASE_ANON_KEY` — from your Supabase project dashboard
- `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project dashboard
- `ANTHROPIC_API_KEY` — from https://console.anthropic.com

Where to find Supabase keys:
1. Go to https://app.supabase.com
2. Open your project
3. Go to Settings → API
4. Copy the Project URL and both keys

> **IMPORTANT:** Never commit your `.env` file. It is in `.gitignore` for this reason.
> If you accidentally commit a key, rotate it immediately.

---

## Step 9 — Install all dependencies

```bash
make install
```

This runs:
- `uv sync` — installs all Python packages across the workspace
- `cd apps/web && npm install` — installs all JavaScript packages

Expected output ends with:
```
✅ All dependencies installed
```

---

## Step 10 — Start Supabase locally

```bash
supabase start
```

First time this runs, it downloads Docker images (~500MB). This takes a few minutes.
Subsequent starts are fast.

When done, you'll see something like:
```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
```

Open http://localhost:54323 in your browser — this is the Supabase Studio,
a visual interface for your local database.

---

## Step 11 — Run migrations

```bash
make migrate
```

This creates all the database tables. You should see each migration file run in order.

---

## Step 12 — Start the backend

```bash
cd services/api
uv run uvicorn ledger_api.main:app --reload --port 8000
```

Open http://localhost:8000/health — you should see:
```json
{"status": "ok", "service": "decision-ledger-api", "version": "0.1.0"}
```

Open http://localhost:8000/docs — interactive API explorer. Bookmark this.

---

## Step 13 — Start the frontend

In a new terminal tab:

```bash
cd apps/web
npm run dev
```

Open http://localhost:3000 — you should see the Decision Ledger UI.

---

## Verify everything is running

| URL | What it is | Expected |
|-----|-----------|---------|
| http://localhost:3000 | Next.js frontend | Decision Ledger UI |
| http://localhost:8000/health | FastAPI backend | `{"status":"ok"}` |
| http://localhost:8000/docs | API documentation | Interactive explorer |
| http://localhost:54323 | Supabase Studio | Database UI |

---

## Stopping everything

```bash
# Stop Supabase
supabase stop

# Stop FastAPI — Ctrl+C in the terminal running uvicorn
# Stop Next.js — Ctrl+C in the terminal running npm run dev
```

---

## Common problems

**`supabase start` fails**
→ Make sure Docker Desktop is open and running (whale icon in menu bar)

**`uv sync` fails with Python version error**
→ Run `uv python install 3.12` then try again

**`npm run dev` fails with module not found**
→ Run `cd apps/web && npm install` first

**Port already in use**
→ Something else is using port 3000 or 8000. Check with `lsof -i :3000`

---

## Learning resources

| Topic | Resource |
|-------|---------|
| React (frontend framework) | https://react.dev/learn |
| Next.js (React + routing) | https://nextjs.org/docs |
| FastAPI (Python API) | https://fastapi.tiangolo.com/tutorial/ |
| Supabase | https://supabase.com/docs |
| Python basics | https://docs.python.org/3/tutorial/ |
| TypeScript | https://www.typescriptlang.org/docs/handbook/intro.html |

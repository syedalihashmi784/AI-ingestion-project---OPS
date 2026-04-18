# ─────────────────────────────────────────────────────────
# Makefile — common commands for the whole project
#
# WHAT IS A MAKEFILE?
#   A file of shortcuts. Instead of remembering long commands,
#   you just type `make <command>`. This is standard practice
#   in professional projects so everyone uses the same commands.
#
# HOW TO USE:
#   make install     ← first time setup
#   make dev         ← start everything for local development
#   make test        ← run all tests
#   make migrate     ← run database migrations
# ─────────────────────────────────────────────────────────

.PHONY: install dev test migrate seed lint format help

# Default — show help when you just type `make`
help:
	@echo ""
	@echo "  Decision Ledger — available commands"
	@echo ""
	@echo "  make install    First time setup (install all dependencies)"
	@echo "  make dev        Start all services for local development"
	@echo "  make test       Run all tests"
	@echo "  make migrate    Run Supabase database migrations"
	@echo "  make seed       Seed database with sample data"
	@echo "  make lint       Check code style"
	@echo "  make format     Auto-fix code style"
	@echo ""

# Install all Python dependencies across workspace
# uv sync reads every pyproject.toml and installs exact versions
install:
	uv sync
	cd apps/web && npm install
	@echo "✅ All dependencies installed"

# Start everything locally
# Supabase local runs your DB locally via Docker
dev:
	@echo "Starting Supabase local..."
	supabase start
	@echo "Starting FastAPI..."
	cd services/api && uv run uvicorn ledger_api.main:app --reload --port 8000 &
	@echo "Starting Next.js..."
	cd apps/web && npm run dev

# Run all tests
test:
	uv run pytest services/ packages/ tests/ -v

# Push migrations to local Supabase
migrate:
	supabase db push

# Seed local database with sample data
seed:
	supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres

# Check code style without fixing
lint:
	uv run ruff check .

# Auto-fix code style issues
format:
	uv run ruff format .
	uv run ruff check --fix .

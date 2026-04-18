# The Decision Ledger

> Institutional memory for data integration decisions. An AI platform that captures, structures, and retrieves the reasoning behind every project — so the next team, the next project, and the next generation can find out.

## What this is

The Decision Ledger converts the institution's existing project files, policy documents, and decision logs into structured, queryable decision records. 
Every new project draws from that memory and contributes to it. The result: decisions stop being solved from scratch.

## Quick navigation

| You are | Start here |
|---------|-----------|
| New developer setting up locally | [Mac setup](docs/runbooks/local-setup-mac.md) · [Windows setup](docs/runbooks/local-setup-windows.md) |
| Looking at the system design | [Architecture](docs/architecture.md) · [Data model](docs/data-model.md) |
| Wanting to understand a design decision | [ADRs](docs/adr/) |
| Deploying | [Deploy runbook](docs/runbooks/deploy.md) |

## Project structure

```
decision-ledger/
├── apps/web/              ← Next.js frontend (React)
├── services/
│   ├── api/               ← FastAPI backend — main API
│   ├── ingest-worker/     ← batch document ingestion
│   ├── model-gateway/     ← AI provider proxy
│   └── retrieval-service/ ← hybrid search + reranking
├── packages/
│   ├── schema/            ← shared Pydantic data models
│   ├── supabase_client/   ← shared database access layer
│   └── model_gateway_client/ ← shared gateway client
├── supabase/              ← database migrations + edge functions
├── infra/                 ← Terraform + deployment scripts
├── docs/                  ← all documentation
└── tests/                 ← end-to-end tests + fixtures
```

## Tech stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 + React + TypeScript | Component-based UI, server-side rendering |
| Backend | FastAPI + Python 3.12 | Fast, typed API with automatic docs |
| Database | Supabase (PostgreSQL + pgvector) | Managed DB with vector search and auth built in |
| AI | Claude API (Anthropic) | Extraction, precedent matching, structured output |
| Package manager (Python) | uv | Fast, reproducible environments across machines |
| Package manager (JS) | npm | Standard Node.js package management |
| Infrastructure | Docker + Azure Canada Central | Containerised, Canadian data sovereignty |

## Status

- [x] Project scaffolded
- [ ] Supabase project created
- [ ] Core schema migrations written
- [ ] FastAPI health endpoint running
- [ ] Frontend connected to Supabase
- [ ] Ingest pipeline working
- [ ] Retrieval working
- [ ] Capture workflow working
- [ ] Demo ready

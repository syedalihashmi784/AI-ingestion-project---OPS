# ADR 0001 — Use Supabase for MVP database layer

**Date:** 2026-04-18
**Status:** Accepted

## What is an ADR?

An Architecture Decision Record documents *why* a technical choice was made.
When someone joins the team six months later and asks "why are we using Supabase?",
this file has the answer — including what alternatives were considered and rejected.

## Context

We need a database that:
- Stores structured decision records with vector embeddings for similarity search
- Handles authentication (reviewers logging in)
- Stores uploaded documents (PDFs, Word files)
- Can be set up quickly for a demo by a small team
- Supports Canadian-region hosting for data sovereignty

## Decision

Use **Supabase** as the managed database platform for the MVP.

## What Supabase gives us

| Need | Supabase feature |
|------|-----------------|
| Relational database | PostgreSQL |
| Vector search (AI similarity) | pgvector extension |
| Authentication | Supabase Auth (supports SSO via OIDC) |
| File storage | Supabase Storage |
| Row-level security | Built into PostgreSQL |
| Real-time updates | Supabase Realtime |
| Local development | Supabase CLI + Docker |

## Alternatives considered

**Self-hosted PostgreSQL + separate auth service**
- More control, but requires significant DevOps work
- Not appropriate for a small team building a demo
- Rejected: too much operational overhead for MVP phase

**Firebase**
- Fast to set up, but NoSQL (not relational)
- No Canadian-region hosting
- No native vector search
- Rejected: doesn't fit the data model

**PlanetScale / Neon**
- Good hosted PostgreSQL options
- No built-in auth or storage
- No pgvector support
- Rejected: would still need separate auth and storage

## Consequences

- **Good:** Dramatically reduces infrastructure work for MVP
- **Good:** pgvector gives us vector search without a separate vector database
- **Good:** Auth is handled — no custom JWT logic needed
- **Watch:** Supabase managed cloud region must be set to Canada (ca-central-1) for data sovereignty
- **Watch:** If we outgrow Supabase, migration path is to self-hosted Supabase (same codebase) or raw PostgreSQL

## References
- https://supabase.com/docs
- https://supabase.com/docs/guides/database/extensions/pgvector
- https://supabase.com/docs/guides/auth

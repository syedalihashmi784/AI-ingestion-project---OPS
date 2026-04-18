# ADR 0003 — Build a thin model gateway rather than using a vendor solution

**Date:** 2026-04-18
**Status:** Accepted

## Context

Every AI operation in the system (document extraction, embedding, reranking)
calls an external LLM provider (Anthropic Claude, Azure OpenAI, etc.).

We need to:
- Centralise API key management (keys in one place, not scattered across services)
- Cache identical requests (don't pay for the same AI call twice)
- Log all prompts and responses for audit
- Enforce data classification rules (Protected B content cannot go to non-compliant providers)
- Be able to swap providers without changing service code

## Decision

Build a **thin custom model gateway** service (~1,000–2,000 lines of Python)
rather than using a vendor gateway product (LiteLLM, Portkey, etc.).

## What it does

```
Any service → Model Gateway → Claude API
                           → Azure OpenAI
                           → Local vLLM (for classified content)
```

The gateway is a FastAPI service with:
- Provider adapters (one per AI provider)
- Classification gate (refuses to route Protected B to non-compliant providers)
- Redis cache (deduplicates identical requests)
- Prompt log (writes every request/response to Supabase audit table)
- Rate limiting

## Why not a vendor gateway (LiteLLM, Portkey)?

**LiteLLM / Portkey are good products** but:
- Add an external dependency in the path of every AI call
- Their classification enforcement is not configurable to Canadian gov requirements
- Vendor gateways are another thing to understand, update, and pay for
- A custom gateway is ~1,500 lines — small enough for any developer to read and audit

For a government project where every outbound AI call is security-sensitive,
owning the gateway is the right trade.

## Consequences

- **Good:** Full control over routing, logging, and classification enforcement
- **Good:** Swapping Claude for Azure OpenAI is a config change — one line
- **Good:** Small audit surface — a security reviewer can read the whole thing in an hour
- **Watch:** We maintain this code — it is not someone else's responsibility
- **Watch:** Must handle provider outages with retries and fallback routing

## References
- https://docs.anthropic.com/en/api/getting-started
- https://learn.microsoft.com/en-us/azure/ai-services/openai/

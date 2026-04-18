"""
retrieval.py — Precedent search endpoints.

WHAT THIS DOES:
  Takes a query (text describing a new project or decision)
  and returns the most similar past decisions from the ledger.

  This is the core value of the system — "show me what we decided before."
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class RetrievalRequest(BaseModel):
    """What the frontend sends when asking for precedents."""
    query: str              # Natural language description
    domain: str | None = None   # Optional filter by domain
    limit: int = 5          # How many results to return


class RetrievalResponse(BaseModel):
    """What we send back."""
    results: list[dict]     # List of matching decision records
    total: int


@router.post("/")
async def retrieve_precedents(request: RetrievalRequest) -> RetrievalResponse:
    """
    Find past decisions similar to the given query.

    TODO: Wire up to retrieval-service (hybrid vector + BM25 search).
    For now returns empty — will be implemented in Phase 2.
    """
    # Placeholder — real implementation calls retrieval-service
    return RetrievalResponse(results=[], total=0)

"""
capture.py — Decision capture endpoints.

WHAT THIS DOES:
  Receives a reviewer-approved decision record and saves it
  to the ledger (Supabase). This is how the compounding loop works —
  every new decision becomes a future precedent.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class CaptureRequest(BaseModel):
    """What the frontend sends when a reviewer approves a decision."""
    project_id: str
    domain: str
    decision_type: str
    what: str
    why: str
    reviewer_name: str
    reviewer_role: str = ""
    source_ids: list[str] = []
    precedent_ids: list[str] = []


@router.post("/")
async def capture_decision(request: CaptureRequest):
    """
    Save an approved decision record to the ledger.

    TODO: Wire up to Supabase via supabase_client package.
    For now returns a placeholder response.
    """
    return {
        "status": "captured",
        "message": "Decision record saved to ledger.",
        "id": "placeholder-id",
    }

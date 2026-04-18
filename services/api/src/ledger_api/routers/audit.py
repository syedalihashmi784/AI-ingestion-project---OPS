"""
audit.py — Audit log endpoints.

WHAT THIS DOES:
  Exports the complete decision trail for a project.
  Used by leadership and auditors to see exactly what happened.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/export/{project_id}")
async def export_audit_trail(project_id: str):
    """
    Export the full audit trail for a project as a structured bundle.

    TODO: Wire up to Supabase append-only audit log.
    """
    return {
        "project_id": project_id,
        "events": [],
        "exported_at": "2026-04-18T00:00:00Z",
    }

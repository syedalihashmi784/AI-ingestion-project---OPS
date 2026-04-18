"""
records.py — Decision record read endpoints.

WHAT THIS DOES:
  Endpoints for reading individual records and listing all records.
  Used by the ledger view and the record detail page.
"""

from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.get("/")
async def list_records(
    domain: str | None = None,
    limit: int = 20,
    offset: int = 0,
):
    """
    List all decision records, with optional domain filter.

    TODO: Wire up to Supabase.
    """
    return {"records": [], "total": 0}


@router.get("/{record_id}")
async def get_record(record_id: str):
    """
    Get a single decision record by ID.

    TODO: Wire up to Supabase.
    """
    raise HTTPException(status_code=404, detail="Record not found")

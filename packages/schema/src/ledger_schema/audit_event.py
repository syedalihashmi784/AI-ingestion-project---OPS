"""
audit_event.py — Audit log entry model.

Every significant action in the system emits an AuditEvent.
These are append-only — never updated, never deleted.
They form the complete defensible trail of everything that happened.

WHY THIS MATTERS:
  When a regulator asks "show us how decision X was made",
  we export the chain of AuditEvents for that decision and
  have a verifiable, timestamped record of every step.
"""

from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class AuditEvent(BaseModel):
    id: UUID = Field(default_factory=uuid4)

    event_type: str = Field(
        ...,
        description=(
            "What happened. Examples: "
            "'record.created', 'record.approved', 'record.rejected', "
            "'record.retrieved', 'ingest.started', 'ingest.completed'"
        )
    )

    # What was affected
    subject_type: str = Field(
        ...,
        description="What kind of thing this event is about: 'decision_record', 'project', etc."
    )
    subject_id: UUID = Field(..., description="The ID of the affected entity.")

    # Who did it
    actor_name: str = Field(..., description="Who triggered this event.")
    actor_role: str = Field(default="")

    # When
    occurred_at: datetime = Field(default_factory=datetime.utcnow)

    # Optional details
    metadata: dict = Field(
        default_factory=dict,
        description="Any extra context. Keep it small."
    )

    class Config:
        from_attributes = True

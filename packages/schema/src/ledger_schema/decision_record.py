"""
decision_record.py — The canonical DecisionRecord model.

This is the most important file in the codebase.
Everything the system does — ingest, capture, retrieval — exists to
populate, maintain, or query this structure.

WHAT IS A PYDANTIC MODEL?
  A class that describes the shape of data. When you create one,
  Pydantic validates that all required fields are present and have
  the right types. If something is wrong, you get a clear error.

  Example:
    record = DecisionRecord(
        project_id="abc-123",
        domain=Domain.PRIVACY,
        decision_type=DecisionType.DOMAIN_SIGNOFF,
        what="Approved data sharing with Province X",
        why="PIPEDA compliant. Privacy review passed. No consent issues.",
        reviewer_name="Jane Smith",
    )
"""

from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from .enums import Classification, DecisionType, Domain


class DecisionRecord(BaseModel):
    """
    A single captured decision with its full rationale and context.

    Fields marked with `Field(...)` are REQUIRED.
    Fields with a default value are optional.
    """

    # ── Identity
    id: UUID = Field(
        default_factory=uuid4,
        description="Unique identifier. Auto-generated if not provided."
    )
    version: int = Field(
        default=1,
        description="Increments when a record is edited after signoff."
    )

    # ── What this decision is about (REQUIRED)
    project_id: UUID = Field(
        ...,  # The ... means REQUIRED in Pydantic
        description="Which project this decision belongs to."
    )
    domain: Domain = Field(
        ...,
        description="Which review domain: privacy, compliance, risk, etc."
    )
    decision_type: DecisionType = Field(
        ...,
        description="What kind of decision: intake, signoff, approval, etc."
    )
    classification: Classification = Field(
        default=Classification.UNCLASSIFIED,
        description="Security classification of this record."
    )

    # ── The actual decision (REQUIRED)
    what: str = Field(
        ...,
        min_length=10,
        description="What was decided. Plain English, one to three sentences."
    )
    why: str = Field(
        ...,
        min_length=20,
        description="Why this decision was made. The rationale."
    )

    # ── Sources and precedents (optional but important)
    source_ids: list[UUID] = Field(
        default_factory=list,
        description="Documents that were cited to support this decision."
    )
    precedent_ids: list[UUID] = Field(
        default_factory=list,
        description="Prior decisions this one is based on. The compounding loop."
    )

    # ── Who approved this (REQUIRED)
    reviewer_name: str = Field(
        ...,
        description="Full name of the person who approved this decision."
    )
    reviewer_role: str = Field(
        default="",
        description="Their role, e.g. 'Privacy Lead'."
    )

    # ── Timestamps (auto-set)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    signed_off_at: datetime | None = Field(
        default=None,
        description="Set when the reviewer formally approves."
    )

    # ── AI metadata
    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="How confident the AI was in extracted content (0-1)."
    )

    class Config:
        # Allow creating a DecisionRecord from a database row dict
        from_attributes = True


class DecisionRecordDraft(BaseModel):
    """
    A pre-filled draft waiting for reviewer approval.
    Same fields as DecisionRecord but everything is optional —
    because the AI might not be able to fill everything in.
    """
    project_id: UUID | None = None
    domain: Domain | None = None
    decision_type: DecisionType | None = None
    what: str = ""
    why: str = ""
    reviewer_name: str = ""
    source_ids: list[UUID] = Field(default_factory=list)
    precedent_ids: list[UUID] = Field(default_factory=list)
    confidence: float = 0.0
    missing_fields: list[str] = Field(
        default_factory=list,
        description="Fields the AI could not fill in — shown to reviewer."
    )

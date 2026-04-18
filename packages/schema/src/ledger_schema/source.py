"""
source.py — Source document model.

A Source is a document that was cited as evidence for a decision.
Could be a policy PDF, a project file, a legislative reference, etc.
"""

from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from .enums import Classification


class Source(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    title: str = Field(..., description="Human-readable document title.")
    document_type: str = Field(
        ...,
        description="Type: 'policy', 'project_file', 'legislation', 'meeting_notes', etc."
    )
    uri: str = Field(
        default="",
        description="Where the document lives: SharePoint URL, file path, etc."
    )
    classification: Classification = Field(default=Classification.UNCLASSIFIED)
    department: str = Field(default="")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

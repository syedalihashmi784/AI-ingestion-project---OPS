"""
project.py — Project model.

A Project is a data integration initiative that produces
one or more DecisionRecords as it moves through review stages.
"""

from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from .enums import Classification, ProjectStage


class Project(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(..., min_length=3)
    description: str = Field(default="")
    department: str = Field(..., description="Which department owns this project.")
    stage: ProjectStage = Field(default=ProjectStage.INTAKE)
    classification: Classification = Field(default=Classification.UNCLASSIFIED)
    stakeholders: list[str] = Field(
        default_factory=list,
        description="Names or email addresses of people involved."
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

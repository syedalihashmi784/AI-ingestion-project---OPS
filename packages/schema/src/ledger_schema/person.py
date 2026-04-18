"""
person.py — Person model (reviewer, analyst, stakeholder).
"""

from uuid import UUID, uuid4

from pydantic import BaseModel, Field

from .enums import Domain


class Person(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str = Field(...)
    email: str = Field(...)
    role: str = Field(default="", description="Job title or role.")
    department: str = Field(default="")
    domain_leads: list[Domain] = Field(
        default_factory=list,
        description="Which domains this person is an authority for."
    )
    is_active: bool = Field(default=True)

    class Config:
        from_attributes = True

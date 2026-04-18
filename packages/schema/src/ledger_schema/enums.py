"""
enums.py — Closed value sets used across the whole system.

WHY ENUMS?
  Instead of storing the string "privacy" in the database and hoping
  nobody types "Privacy" or "privacyy", enums enforce a fixed list
  of allowed values at the Python level. If you pass a bad value,
  you get an error immediately — not a silent bug in production.

DOCS: https://docs.python.org/3/library/enum.html
"""

from enum import Enum


class Domain(str, Enum):
    """Which review domain this decision belongs to."""
    ETHICS = "ethics"
    PRIVACY = "privacy"
    COMPLIANCE = "compliance"
    RISK = "risk"
    TECH_SECURITY = "tech_security"


class DecisionType(str, Enum):
    """The kind of decision being recorded."""
    INTAKE = "intake"               # Initial project assessment
    SCOPE_CHANGE = "scope_change"   # Project scope was modified
    DOMAIN_SIGNOFF = "domain_signoff"  # A domain lead approved
    APPROVAL = "approval"           # Final project approval
    REJECTION = "rejection"         # Project rejected


class Classification(str, Enum):
    """
    Canadian government security classification levels.
    DOCS: https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32614
    """
    UNCLASSIFIED = "unclassified"
    PROTECTED_A = "protected_a"
    PROTECTED_B = "protected_b"
    PROTECTED_C = "protected_c"


class ProjectStage(str, Enum):
    """Where a project is in its lifecycle."""
    INTAKE = "intake"
    DESIGN = "design"
    REVIEW = "review"
    APPROVED = "approved"
    LIVE = "live"
    CLOSED = "closed"

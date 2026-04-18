"""
main.py — FastAPI application entry point.

WHAT HAPPENS HERE:
  1. The FastAPI app is created
  2. Middleware is added (CORS, auth)
  3. Routers (groups of endpoints) are registered
  4. The app is ready to receive requests

HOW FASTAPI ROUTING WORKS:
  Each router is a group of related endpoints.
  For example, retrieval.py handles all /retrieve/* endpoints.

  When a request comes in:
    GET /health → health.py handles it
    POST /retrieve → retrieval.py handles it
    POST /capture → capture.py handles it

AUTOMATIC DOCS:
  Once running, visit http://localhost:8000/docs
  FastAPI generates interactive documentation automatically.
  You can test every endpoint right from the browser.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import audit, capture, health, records, retrieval

# Create the FastAPI application
app = FastAPI(
    title="Decision Ledger API",
    description="Institutional memory for data integration decisions.",
    version="0.1.0",
    # In production, disable the interactive docs
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# ── CORS Middleware
# CORS (Cross-Origin Resource Sharing) controls which domains
# can call this API. In dev, we allow localhost:3000 (Next.js).
# DOCS: https://fastapi.tiangolo.com/tutorial/cors/
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register routers
# Each router handles a group of related endpoints
app.include_router(health.router)
app.include_router(retrieval.router, prefix="/retrieve", tags=["Retrieval"])
app.include_router(capture.router, prefix="/capture", tags=["Capture"])
app.include_router(records.router, prefix="/records", tags=["Records"])
app.include_router(audit.router, prefix="/audit", tags=["Audit"])

"""
health.py — Health check endpoint.

WHY A HEALTH ENDPOINT?
  Every service needs a /health endpoint. It's used by:
  - Docker to check the container is running
  - Load balancers to know if the service is ready
  - You, to quickly confirm the API started correctly

  When you start the API, the first thing you do is visit:
  http://localhost:8000/health
  If you see {"status": "ok"}, the server is running.

HOW FASTAPI ENDPOINTS WORK:
  @router.get("/health") means:
    "When someone sends a GET request to /health, run this function."

  The function returns a dict, which FastAPI automatically
  converts to a JSON response.
"""

from fastapi import APIRouter

# A router is a group of related endpoints
# Think of it like a mini-app that gets attached to the main app
router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Returns 200 OK if the service is running.
    This is always the first endpoint you test.
    """
    return {
        "status": "ok",
        "service": "decision-ledger-api",
        "version": "0.1.0",
    }

# ─────────────────────────────────────────────────────────
# Dockerfile — FastAPI service
#
# WHAT IS A DOCKERFILE?
#   Instructions for building a Docker container image.
#   Think of it as a recipe: start with Python, copy the code in,
#   install dependencies, then say how to start the app.
#
# This uses a multi-stage build:
#   Stage 1 (builder): installs dependencies
#   Stage 2 (runtime): copies only what's needed to run
#   This keeps the final image small and secure.
#
# DOCS: https://docs.docker.com/reference/dockerfile/
# ─────────────────────────────────────────────────────────

# Stage 1: Build stage
FROM python:3.12-slim AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy dependency files first (Docker caches this layer)
# If only code changes, dependencies aren't reinstalled
COPY pyproject.toml .
COPY packages/ packages/
COPY services/api/ services/api/

# Install dependencies
RUN uv sync --frozen

# Stage 2: Runtime stage
FROM python:3.12-slim AS runtime

WORKDIR /app

# Copy the installed packages from builder
COPY --from=builder /app/.venv /app/.venv

# Copy the application code
COPY services/api/src/ src/
COPY packages/ packages/

# Set environment variables
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app/src:/app/packages/schema/src:/app/packages/supabase_client/src"

# Expose the API port
EXPOSE 8000

# Start the FastAPI server
CMD ["uvicorn", "ledger_api.main:app", "--host", "0.0.0.0", "--port", "8000"]

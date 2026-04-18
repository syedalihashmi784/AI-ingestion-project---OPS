"""
config.py — Application settings loaded from environment variables.

WHAT IS THIS?
  Instead of hardcoding values like API keys and URLs in code,
  we read them from environment variables. This means:
  - Dev uses different values than production
  - Secrets never end up in the codebase
  - Each developer uses their own .env file

HOW IT WORKS:
  pydantic-settings reads from your .env file automatically.
  If a required variable is missing, you get a clear error on startup.

DOCS: https://docs.pydantic.dev/latest/concepts/pydantic_settings/
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Pydantic-settings reads .env automatically
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Supabase
    supabase_url: str
    supabase_service_role_key: str
    # Service role key is used server-side — bypasses RLS for admin operations

    # ── Model Gateway
    model_gateway_url: str = "http://localhost:8001"

    # ── App
    api_env: str = "development"
    api_port: int = 8000
    debug: bool = True


# Create a single settings instance imported by the rest of the app
settings = Settings()

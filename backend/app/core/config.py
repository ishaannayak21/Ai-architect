from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "AI Software Architect"
    API_V1_PREFIX: str = "/api/v1"
    VERSION: str = "1.0.0"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    BCRYPT_ROUNDS: int = 12

    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    GEMINI_TIMEOUT_SECONDS: int = 120
    GEMINI_GENERATION_TEMPERATURE: float = 0.4
    GEMINI_MAX_RETRIES: int = 3

    DATABASE_URL: str = "sqlite:///./ai_architect.db"

    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ]


@lru_cache
def get_settings() -> Settings:
    return Settings()

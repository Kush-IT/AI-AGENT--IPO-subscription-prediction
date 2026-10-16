"""
Application Configuration Module
Reads environment variables with fallback defaults.
"""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and environment configuration."""
    
    PROJECT_NAME: str = "IPO Agentic AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS Configuration
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
    
    # External API Keys (Defaults empty for development)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ipo_agentic_ai"
    NEWS_API_KEY: str = ""
    MARKET_DATA_API_KEY: str = ""

    # Live IPO Intelligence Cache Configuration
    IPO_DATA_TTL_MINUTES: int = 60
    SUBSCRIPTION_DATA_TTL_MINUTES: int = 60
    GMP_DATA_TTL_MINUTES: int = 30
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )
    
    @property
    def cors_origin_list(self) -> List[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

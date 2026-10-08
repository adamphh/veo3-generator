import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Shopee Veo 3 Video Generator"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # AI API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GOOGLE_CLOUD_PROJECT: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    GOOGLE_CLOUD_LOCATION: str = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    
    # Optional Third-party TTS
    FPT_AI_API_KEY: str = os.getenv("FPT_AI_API_KEY", "")
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    
    # Storage Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    STORAGE_DIR: str = os.path.join(BASE_DIR, "storage")
    UPLOADS_DIR: str = os.path.join(STORAGE_DIR, "uploads")
    AUDIO_DIR: str = os.path.join(STORAGE_DIR, "audio")
    CLIPS_DIR: str = os.path.join(STORAGE_DIR, "clips")
    OUTPUT_DIR: str = os.path.join(STORAGE_DIR, "output")
    ASSETS_DIR: str = os.path.join(BASE_DIR, "assets")
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

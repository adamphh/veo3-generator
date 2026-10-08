import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.routes import router as api_router

# Thiết lập Logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

app = FastAPI(
    title=settings.APP_NAME,
    description="Công cụ tạo 10 Video Shopee Affiliate bằng Google Veo 3 & Gemini 2.0 Flash",
    version="1.0.0"
)

# CORS Middleware cho Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files Mount cho Media (Ảnh, Audio, Video Render)
for directory_path in [settings.STORAGE_DIR, settings.OUTPUT_DIR, settings.UPLOADS_DIR, settings.AUDIO_DIR, settings.CLIPS_DIR]:
    os.makedirs(directory_path, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.STORAGE_DIR), name="static")

# Đăng ký API Routes
app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "docs": "/docs",
        "storage": settings.STORAGE_DIR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

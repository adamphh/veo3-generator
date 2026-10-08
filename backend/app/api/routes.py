import os
import zipfile
import shutil
import logging
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.core.config import settings
from app.providers.shopee_provider import ShopeeProvider, ProductData
from app.services.gemini_service import gemini_service, BatchScriptResponse, VideoScript
from app.services.tts_service import tts_service
from app.services.subtitle_service import subtitle_service
from app.services.veo_service import veo_service
from app.services.ffmpeg_service import ffmpeg_service

logger = logging.getLogger(__name__)
router = APIRouter()

shopee_provider = ShopeeProvider()

class ScrapeRequest(BaseModel):
    url: str
    niche: str = "gia_dung"

class RenderBatchRequest(BaseModel):
    product_title: str
    image_url: Optional[str] = None
    scripts: List[VideoScript]
    social_proof_text: Optional[str] = "⭐ 4.9/5 - Đã bán 2.5k"

# Trạng thái tiến độ render toàn cục (In-memory store)
render_progress_store = {}

@router.post("/scrape-product")
async def scrape_product(req: ScrapeRequest):
    """Cào dữ liệu chi tiết sản phẩm Shopee từ Link."""
    try:
        product_data = await shopee_provider.extract_product_data(req.url)
        return {"status": "success", "data": product_data}
    except Exception as e:
        logger.error(f"Scraping endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-scripts")
async def generate_scripts(product: ProductData, niche: str = "gia_dung"):
    """Tạo 10 kịch bản marketing tự nhiên + Veo prompts + SEO tags với Gemini 2.0 Flash."""
    try:
        batch_response = await gemini_service.generate_10_scripts(product, niche)
        return {"status": "success", "data": batch_response}
    except Exception as e:
        logger.error(f"Script generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

async def run_render_pipeline(task_id: str, req: RenderBatchRequest):
    """Tiến trình nền render tuần tự từng video trong 10 video."""
    render_progress_store[task_id] = {
        "status": "processing",
        "progress_percent": 5,
        "current_video": 1,
        "total_videos": len(req.scripts),
        "completed_videos": []
    }

    # Tải ảnh sản phẩm về local làm first-frame nếu có URL
    local_image_path = os.path.join(settings.UPLOADS_DIR, "product_thumb.jpg")
    if req.image_url and req.image_url.startswith("http"):
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.get(req.image_url)
                if resp.status_code == 200:
                    with open(local_image_path, "wb") as f:
                        f.write(resp.content)
        except Exception:
            local_image_path = None
    elif not os.path.exists(local_image_path):
        local_image_path = None

    completed_list = []
    total = len(req.scripts)

    for idx, script in enumerate(req.scripts, 1):
        try:
            render_progress_store[task_id]["current_video"] = idx
            render_progress_store[task_id]["progress_percent"] = int((idx - 0.7) / total * 100)

            # 1. Sinh Voiceover TTS & Subtitles
            tts_res = await tts_service.generate_speech(
                text=script.voiceover_script,
                output_filename=f"voice_{task_id}_{idx}",
                voice_gender=script.voice_gender,
                voice_accent=script.voice_accent
            )
            audio_path = tts_res["audio_path"]
            duration = tts_res["duration"]

            # 2. Sinh file Subtitle Karaoke .ass
            ass_path = os.path.join(settings.STORAGE_DIR, f"sub_{task_id}_{idx}.ass")
            subtitle_service.generate_karaoke_ass(tts_res.get("subtitles", ""), ass_path)

            # 3. Sinh các phân cảnh Video Clips (Veo 3 / Hybrid)
            clip_paths = []
            for scene_idx, vp in enumerate(script.veo_prompts, 1):
                clip = await veo_service.generate_video_clip(
                    prompt=vp.cinematography_prompt,
                    image_path=local_image_path,
                    duration_seconds=int(duration / len(script.veo_prompts)) or 4,
                    output_filename=f"clip_{task_id}_{idx}_{scene_idx}"
                )
                clip_paths.append(clip)

            # 4. Ghép nối Video + Overlays + Audio hoàn chỉnh bằng FFmpeg
            final_video_name = f"video_{task_id}_{idx}"
            final_path = await ffmpeg_service.render_full_video(
                clip_paths=clip_paths,
                audio_path=audio_path,
                ass_subtitle_path=ass_path,
                hook_text=script.hook_text_overlay,
                social_proof_text=req.social_proof_text or "⭐ 4.9/5 - Đã bán 2.5k",
                output_filename=final_video_name,
                include_arrow=True
            )

            completed_list.append({
                "video_id": script.video_id,
                "angle_title": script.angle_title,
                "video_url": f"/static/output/{final_video_name}.mp4",
                "video_path": final_path,
                "seo_title": script.seo_title,
                "seo_description": script.seo_description,
                "seo_tags": script.seo_tags
            })

            render_progress_store[task_id]["completed_videos"] = completed_list
            render_progress_store[task_id]["progress_percent"] = int(idx / total * 100)

        except Exception as e:
            logger.error(f"Error rendering video {idx}: {e}")

    render_progress_store[task_id]["status"] = "completed"
    render_progress_store[task_id]["progress_percent"] = 100

class RenderSingleRequest(BaseModel):
    product_title: str
    image_url: Optional[str] = None
    script: VideoScript
    social_proof_text: Optional[str] = "⭐ 4.9/5 - Đã bán 2.5k"

@router.post("/render-single-video")
async def render_single_video(req: RenderSingleRequest):
    """Render ngay lập tức 1 video đơn lẻ theo kịch bản được chọn."""
    import uuid
    task_id = str(uuid.uuid4())[:8]
    script = req.script
    
    # Tải ảnh thumbnail nếu có
    local_image_path = os.path.join(settings.UPLOADS_DIR, f"thumb_{task_id}.jpg")
    if req.image_url and req.image_url.startswith("http"):
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                resp = await client.get(req.image_url, timeout=10.0)
                if resp.status_code == 200:
                    with open(local_image_path, "wb") as f:
                        f.write(resp.content)
        except Exception:
            local_image_path = None
    elif not os.path.exists(local_image_path):
        local_image_path = None

    try:
        # 1. Sinh Voiceover TTS & Subtitles
        tts_res = await tts_service.generate_speech(
            text=script.voiceover_script,
            output_filename=f"voice_{task_id}_{script.video_id}",
            voice_gender=script.voice_gender,
            voice_accent=script.voice_accent
        )
        audio_path = tts_res["audio_path"]
        duration = tts_res["duration"]

        # 2. Sinh file Subtitle Karaoke .ass
        ass_path = os.path.join(settings.STORAGE_DIR, f"sub_{task_id}_{script.video_id}.ass")
        subtitle_service.generate_karaoke_ass(tts_res.get("subtitles", ""), ass_path)

        # 3. Sinh các phân cảnh Video Clips (Veo 3 / Hybrid)
        clip_paths = []
        for scene_idx, vp in enumerate(script.veo_prompts, 1):
            clip = await veo_service.generate_video_clip(
                prompt=vp.cinematography_prompt,
                image_path=local_image_path,
                duration_seconds=int(duration / len(script.veo_prompts)) or 4,
                output_filename=f"clip_{task_id}_{script.video_id}_{scene_idx}"
            )
            clip_paths.append(clip)

        # 4. Ghép nối Video + Overlays + Audio hoàn chỉnh bằng FFmpeg
        final_video_name = f"video_{task_id}_{script.video_id}"
        final_path = await ffmpeg_service.render_full_video(
            clip_paths=clip_paths,
            audio_path=audio_path,
            ass_subtitle_path=ass_path,
            hook_text=script.hook_text_overlay,
            social_proof_text=req.social_proof_text or "⭐ 4.9/5 - Đã bán 2.5k",
            output_filename=final_video_name,
            include_arrow=True
        )

        return {
            "status": "success",
            "video_id": script.video_id,
            "angle_title": script.angle_title,
            "video_url": f"/static/output/{final_video_name}.mp4",
            "video_path": final_path,
            "seo_title": script.seo_title,
            "seo_description": script.seo_description,
            "seo_tags": script.seo_tags
        }
    except Exception as e:
        logger.error(f"Single video render error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/render-batch-videos")
async def render_batch_videos(req: RenderBatchRequest, background_tasks: BackgroundTasks):
    """Kích hoạt tiến trình ngầm render hàng loạt 10 video."""
    import uuid
    task_id = str(uuid.uuid4())[:8]
    background_tasks.add_task(run_render_pipeline, task_id, req)
    return {"status": "started", "task_id": task_id, "total_videos": len(req.scripts)}

@router.get("/render-status/{task_id}")
async def get_render_status(task_id: str):
    """Lấy trạng thái tiến độ render realtime."""
    status = render_progress_store.get(task_id)
    if not status:
        raise HTTPException(status_code=404, detail="Task ID not found")
    return status

@router.get("/download-zip/{task_id}")
async def download_zip(task_id: str):
    """Tải trọn gói file ZIP chứa tất cả video hoàn chỉnh kèm file SEO_metadata.txt."""
    task_data = render_progress_store.get(task_id)
    if not task_data or not task_data.get("completed_videos"):
        raise HTTPException(status_code=400, detail="No completed videos found for this task")

    zip_filename = f"shopee_affiliate_videos_{task_id}.zip"
    zip_filepath = os.path.join(settings.OUTPUT_DIR, zip_filename)

    with zipfile.ZipFile(zip_filepath, 'w') as zipf:
        seo_text_content = "# DANH SÁCH SEO METADATA CHO 10 VIDEO AFFILIATE\n\n"
        
        for item in task_data["completed_videos"]:
            vpath = item.get("video_path")
            if vpath and os.path.exists(vpath):
                zipf.write(vpath, arcname=os.path.basename(vpath))
            
            seo_text_content += f"===============================\n"
            seo_text_content += f"VIDEO #{item['video_id']}: {item['angle_title']}\n"
            seo_text_content += f"Tiêu đề: {item['seo_title']}\n"
            seo_text_content += f"Mô tả: {item['seo_description']}\n"
            seo_text_content += f"Tags: {', '.join(item['seo_tags'])}\n\n"

        zipf.writestr("SEO_METADATA.txt", seo_text_content)

    return FileResponse(zip_filepath, media_type="application/zip", filename=zip_filename)

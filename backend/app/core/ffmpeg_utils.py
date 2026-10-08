import os
import shutil
import logging

logger = logging.getLogger(__name__)

def get_ffmpeg_cmd() -> str:
    """
    Returns the valid ffmpeg binary command:
    1. System ffmpeg if installed in PATH
    2. static-ffmpeg / imageio_ffmpeg if available in Python environment
    """
    system_ffmpeg = shutil.which("ffmpeg")
    if system_ffmpeg:
        return "ffmpeg"
    
    try:
        import imageio_ffmpeg
        ffmpeg_bin = imageio_ffmpeg.get_ffmpeg_exe()
        if os.path.exists(ffmpeg_bin):
            return f'"{ffmpeg_bin}"'
    except Exception:
        pass

    try:
        import static_ffmpeg
        static_ffmpeg.add_paths()
        if shutil.which("ffmpeg"):
            return "ffmpeg"
    except Exception:
        pass

    return "ffmpeg"

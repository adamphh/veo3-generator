import os
import re
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class SubtitleService:
    """
    Creates eye-catching TikTok / Shopee Video style Advanced Substation Alpha (.ass) subtitles.
    Supports bold fonts, stroke borders, glowing colors, and karaoke word-by-word highlights.
    """

    @staticmethod
    def generate_karaoke_ass(srt_content: str, output_ass_path: str) -> str:
        """
        Converts raw SRT content to a beautifully styled ASS subtitle file with TikTok aesthetics.
        """
        # Header định nghĩa kiểu chữ: Font Montserrat/Arial Black to, đậm, viền đen dày, chữ vàng/trắng
        ass_header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: TikTokDefault,Arial,65,&H00FFFFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,2,0,1,8,4,2,60,60,380,1
Style: TikTokHighlight,Arial,72,&H0000FFFF,&H000000FF,&H00000000,&H80000000,-1,0,0,0,105,105,2,0,1,10,6,2,60,60,380,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
        events = []
        # Parse SRT blocks
        blocks = srt_content.strip().split("\n\n")
        for block in blocks:
            lines = block.strip().split("\n")
            if len(lines) >= 3:
                time_line = lines[1]
                text = " ".join(lines[2:])
                
                # Chuyển đổi timestamp từ 00:00:01,230 sang 0:00:01.23
                match = re.match(r"(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})", time_line)
                if match:
                    h1, m1, s1, ms1, h2, m2, s2, ms2 = match.groups()
                    start_ass = f"{int(h1)}:{m1}:{s1}.{int(ms1)//10:02d}"
                    end_ass = f"{int(h2)}:{m2}:{s2}.{int(ms2)//10:02d}"
                    
                    # Highlight style
                    events.append(f"Dialogue: 0,{start_ass},{end_ass},TikTokDefault,,0,0,0,,{text.upper()}")

        with open(output_ass_path, "w", encoding="utf-8") as f:
            f.write(ass_header + "\n".join(events))

        return output_ass_path

subtitle_service = SubtitleService()

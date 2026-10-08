import json
import logging
from typing import List, Dict, Any
from pydantic import BaseModel
from google import genai
from google.genai import types
from app.core.config import settings
from app.providers.base_provider import ProductData

logger = logging.getLogger(__name__)

class ScenePrompt(BaseModel):
    scene_number: int
    duration_seconds: int
    camera_movement: str
    cinematography_prompt: str
    suggested_mode: str  # "image-to-video" or "text-to-video"

class VideoScript(BaseModel):
    video_id: int
    angle_title: str
    angle_type: str
    hook_text_overlay: str
    voiceover_script: str
    voice_gender: str  # "female" or "male"
    voice_accent: str  # "north" or "south"
    veo_prompts: List[ScenePrompt]
    seo_title: str
    seo_description: str
    seo_tags: List[str]

class BatchScriptResponse(BaseModel):
    product_title: str
    niche: str
    scripts: List[VideoScript]

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if self.api_key:
            self.client = genai.Client(api_key=self.api_key)
        else:
            self.client = None

    async def generate_10_scripts(self, product: ProductData, niche: str = "gia_dung") -> BatchScriptResponse:
        """
        Generates 10 distinct, highly viral affiliate video scripts tailored to Vietnamese audience psychology.
        Includes Hook Overlays, Natural Voiceovers, Veo 3 Prompts, and SEO tags.
        """
        logger.info(f"Generating 10 scripts with Gemini 2.0 Flash for product: {product.title}, Niche: {niche}")
        
        niche_instructions = {
            "my_pham": "Tone tâm sự mỏng, ASMR nhẹ nhàng, nhấn mạnh thành phần/độ an toàn cho da, chia sẻ chân thành, cảnh báo hàng kém chất lượng.",
            "thoi_trang": "Tone năng động, bắt trend, gợi ý phối đồ (OOTD), nhấn mạnh form dáng tôn dáng, chất vải thoáng mát.",
            "gia_dung": "Tone thực tế, tập trung giải quyết nỗi phiền toái (Problem-Solution), mẹo vặt cuộc sống tiện lợi, đập hộp test độ bền.",
            "cong_nghe": "Tone chuyên gia kỹ tính, so sánh hiệu năng thực tế, bóc tách tính năng thông minh đáng tiền."
        }.get(niche, "Tone gần gũi, chia sẻ trải nghiệm chân thực, mang lại giá trị hữu ích cho người xem.")

        prompt = f"""
Bạn là Chuyên gia Sáng tạo Nội dung Video Ngắn và Bậc thầy Tối ưu Chuyển đổi Shopee Affiliate tại Việt Nam.

DỮ LIỆU SẢN PHẨM:
- Tên: {product.title}
- Giá bán: {product.price_sale} (Giá gốc: {product.price_original or 'N/A'})
- Đã bán: {product.sold_count or 'Hàng nghìn lượt bán'}
- Đánh giá: {product.rating_star} sao
- Mô tả: {product.description[:500]}
- Ngành hàng: {niche} (Định hướng: {niche_instructions})

NHIỆM VỤ:
Tạo đúng 10 kịch bản video ngắn (thời lượng 12-15 giây) tương ứng với 10 góc độ (Angles) nội dung tự nhiên:
1. Góc 1: Tình huống oái oăm đời thường (POV)
2. Góc 2: Unboxing & Cảm nhận chân thực
3. Góc 3: Mẹo hay cuộc sống mà ít ai biết (Lifehack)
4. Góc 4: Trước và Sau khi dùng (Before & After)
5. Góc 5: Thử thách kiểm chứng độ bền/tính năng
6. Góc 6: Dành riêng cho đối tượng mục tiêu cụ thể
7. Góc 7: So sánh trải nghiệm đáng tiền
8. Góc 8: Kể chuyện ngắn hài hước/đồng cảm
9. Góc 9: Tâm lý đảo ngược ("Đừng mua nếu...")
10. Góc 10: Đánh giá sau 1 tháng sử dụng thực tế

YÊU CẦU CHO MỖI KỊCH BẢN:
- hook_text_overlay: Chữ to giật tít hiện trên video 3s đầu (ngắn gọn dưới 8 từ, font TikTok cực hút).
- voiceover_script: Lời thoại tiếng Việt tự nhiên, không hard-sell, ngắt nghỉ hợp lý cho thời lượng 12-15 giây (khoảng 35-45 từ).
- veo_prompts: 3 phân cảnh chuẩn điện ảnh (Scene 1: Hook 0-4s Image-to-Video, Scene 2: Body 4-10s Lifestyle, Scene 3: CTA 10-15s Macro). Prompt tiếng Anh chi tiết: [Shot Type] + [Subject] + [Action] + [Lighting & Camera Movement] + [Cinematic Quality 4K].
- seo_title, seo_description, seo_tags: Tối ưu chuẩn SEO cho TikTok Shop, Shopee Video, Facebook Reels và YouTube Shorts.

TRẢ VỀ ĐÚNG ĐỊNH DẠNG JSON SCHEMA THEO CẤU TRÚC SAU:
{{
  "product_title": "{product.title}",
  "niche": "{niche}",
  "scripts": [
    {{
      "video_id": 1,
      "angle_title": "Tên góc độ",
      "angle_type": "pov / unboxing / lifehack / before_after / challenge / niche_target / comparison / storytelling / reverse_psychology / review_after_use",
      "hook_text_overlay": "VÍ DỤ: ĐỪNG MUA NẾU CHƯA BIẾT ĐIỀU NÀY!",
      "voiceover_script": "Lời thoại tiếng Việt tự nhiên...",
      "voice_gender": "female",
      "voice_accent": "north",
      "veo_prompts": [
        {{
          "scene_number": 1,
          "duration_seconds": 4,
          "camera_movement": "Smooth slow zoom in",
          "cinematography_prompt": "Cinematic macro close-up of {product.title}, soft studio morning light, 4k commercial look",
          "suggested_mode": "image-to-video"
        }},
        {{
          "scene_number": 2,
          "duration_seconds": 6,
          "camera_movement": "Medium panning shot",
          "cinematography_prompt": "Modern cozy Vietnamese living room, person happily demonstrating {product.title}, warm ambient lighting, highly detailed",
          "suggested_mode": "text-to-video"
        }},
        {{
          "scene_number": 3,
          "duration_seconds": 4,
          "camera_movement": "Low-angle dynamic hero shot",
          "cinematography_prompt": "Hero product display shot on clean pastel background, glowing vibrant soft light, commercial advertisement",
          "suggested_mode": "image-to-video"
        }}
      ],
      "seo_title": "Tiêu đề giật tít chuẩn SEO",
      "seo_description": "Mô tả ngắn gọn kèm hashtag #shopeeaffiliate #review",
      "seo_tags": ["shopee", "affiliate", "review"]
    }}
  ]
}}
"""
        if not self.client:
            logger.warning("No GEMINI_API_KEY found. Generating intelligent fallback 10 scripts.")
            return self._generate_mock_scripts(product, niche)

        try:
            response = self.client.models.generate_content(
                model='gemini-2.0-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7
                )
            )
            data = json.loads(response.text)
            return BatchScriptResponse(**data)
        except Exception as e:
            logger.error(f"Gemini Generation Error: {e}. Using fallback scripts.")
            return self._generate_mock_scripts(product, niche)

    def _generate_mock_scripts(self, product: ProductData, niche: str) -> BatchScriptResponse:
        """Fallback mock generator with 10 production-ready marketing angles."""
        angles = [
            ("Góc 1: Tình huống oái oăm đời thường", "pov", "TỪ NGÀY BIẾT MÓN NÀY NHÀ GỌN HẲN!", "Trước đây mình mất cả tiếng đồng hồ để dọn dẹp, từ ngày có em này thì mọi thứ tiện hơn hẳn. Nhỏ gọn mà dùng cực thích luôn, ai chưa có nhớ thử ngay nha!"),
            ("Góc 2: Đập hộp & Cảm nhận đầu tiên", "unboxing", "ĐẬP HỘP MÓN ĐỒ ĐANG HOT SHOPEE", "Vừa săn được em này đợt sale vừa rồi, mở hộp ra thấy độ hoàn thiện xịn sò bất ngờ. Chất liệu cầm chắc tay, đóng gói cẩn thận 10 điểm không có nhưng!"),
            ("Góc 3: Mẹo hay ít người biết", "lifehack", "MẸO HAY CUỘC SỐNG BẠN NÊN BIẾT!", "Bí quyết giúp công việc nhẹ nhàng gấp đôi là đây chứ đâu. Vừa tiết kiệm thời gian vừa đỡ tốn công sức, tiện lợi vô cùng."),
            ("Góc 4: Trước và Sau khi dùng", "before_after", "KHÁC BIỆT TRƯỚC VÀ SAU KHI DÙNG", "Nhìn sự khác biệt trước và sau khi sử dụng là thấy đáng đồng tiền bát gạo liền. Hiệu quả thấy rõ ngay lần đầu tiên trải nghiệm luôn!"),
            ("Góc 5: Thử thách kiểm chứng thực tế", "challenge", "TEST THỬ ĐỘ XỊN CỦA MÓN NÀY!", "Hôm nay mình test thử xem có thực sự thần thánh như lời đồn không nha. Kết quả bất ngờ thật sự, hoạt động cực kỳ mượt mà."),
            ("Góc 6: Dành riêng cho người bận rộn", "niche_target", "MÓN ĐỒ CHÂN ÁI CHO NGƯỜI BẬN RỘN", "Dân văn phòng hay học sinh sinh viên bận rộn nhất định phải có một chiếc. Nhanh, gọn, tiện lợi và giá thì siêu hạt dẻ."),
            ("Góc 7: So sánh trải nghiệm đáng tiền", "comparison", "NÂNG CẤP ĐÁNG TIỀN NHẤT NĂM NAY", "Bỏ qua mấy món truyền thống cồng kềnh đi, em này nâng cấp lên một tầm cao mới. Đẹp mắt, bền bỉ và cực kỳ đa năng."),
            ("Góc 8: Tâm sự chia sẻ chân thành", "storytelling", "MÓN ĐỒ MUA VỀ AI CŨNG KHEN", "Lúc đầu mua cũng hơi phân vân, mà rước về dùng xong cả nhà ai cũng khen tiện. Đúng là món đầu tư xứng đáng nhất tháng này."),
            ("Góc 9: Tâm lý đảo ngược", "reverse_psychology", "ĐỪNG MUA NẾU BẠN SỢ BỊ NGHIỆN!", "Cảnh báo là đừng tò mò mua thử nha, vì dùng quen rồi là không bỏ được đâu. Quá nhiều tiện ích trong một thiết kế nhỏ gọn."),
            ("Góc 10: Đánh giá sau 1 tháng sử dụng", "review_after_use", "REVIEW SAU 1 THÁNG TRẢI NGHIỆM", "Dùng suốt 1 tháng nay ngày nào cũng xài mà vẫn như mới. Điểm 10 cho chất lượng và độ tiện dụng, link mình để góc trái nha.")
        ]
        
        scripts = []
        for idx, (title, atype, hook, voice) in enumerate(angles, 1):
            scripts.append(VideoScript(
                video_id=idx,
                angle_title=title,
                angle_type=atype,
                hook_text_overlay=hook,
                voiceover_script=voice,
                voice_gender="female" if idx % 2 == 1 else "male",
                voice_accent="north" if idx % 3 != 0 else "south",
                veo_prompts=[
                    ScenePrompt(
                        scene_number=1,
                        duration_seconds=4,
                        camera_movement="Smooth slow zoom in",
                        cinematography_prompt=f"Cinematic close-up product shot of {product.title}, commercial 4k aesthetic, soft lighting",
                        suggested_mode="image-to-video"
                    ),
                    ScenePrompt(
                        scene_number=2,
                        duration_seconds=6,
                        camera_movement="Medium tracking shot",
                        cinematography_prompt=f"A modern Vietnamese cozy setting, person using {product.title} with ease, natural lighting",
                        suggested_mode="text-to-video"
                    ),
                    ScenePrompt(
                        scene_number=3,
                        duration_seconds=4,
                        camera_movement="Dynamic low angle rotation",
                        cinematography_prompt=f"Hero advertisement shot of {product.title} on minimalist studio podium, clean pastel background",
                        suggested_mode="image-to-video"
                    )
                ],
                seo_title=f"{hook} - Đánh giá {product.title}",
                seo_description=f"Review chi tiết {product.title}. Món đồ gia dụng/tiện ích hot trend Shopee. #shopeeaffiliate #review #{niche}",
                seo_tags=["shopee", "affiliate", "review", niche, "trending"]
            ))

        return BatchScriptResponse(
            product_title=product.title,
            niche=niche,
            scripts=scripts
        )

gemini_service = GeminiService()

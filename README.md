# Shopee Veo 3 Video Generator (AI Affiliate 9:16)

Hệ thống Fullstack Web App tự động hóa sản xuất **10 Video Ngắn Shopee Affiliate (TikTok/Shopee Video/Reels/Shorts)** từ 1 Link sản phẩm bằng **Google Veo 3**, **Gemini 2.0 Flash**, **TTS Tiếng Việt** và **FFmpeg Rendering Engine**.

---

## 🚀 Các Tính Năng Nổi Bật
1. **Thu thập dữ liệu tự động**: Cào ảnh gốc HD, Tên, Giá bán, Mức giảm %, Đã bán, Đánh giá ⭐ từ Link Shopee qua Playwright-Stealth hoặc Upload thủ công.
2. **AI Kịch bản & Tối ưu chuyển đổi (Gemini 2.0 Flash)**:
   - Tự động sinh **10 kịch bản marketing tự nhiên** theo 10 góc độ Viral (POV, Unboxing, Mẹo hay, Before/After, Đừng mua nếu...).
   - Tự động phân loại Tone & Mood theo 4 ngành hàng chủ lực (Mỹ phẩm, Thời trang, Gia dụng, Công nghệ).
   - Tạo dòng chữ **Hook Text Overlay** to nổi bật trong 3 giây đầu phong cách TikTok.
   - Sinh bộ **SEO Metadata** (Tiêu đề giật tít, Mô tả kèm hashtag, Tags) tối ưu tìm kiếm.
   - Sinh chuỗi **Prompt điện ảnh chuyên sâu** gửi tới Google Veo 3.
3. **Google Veo 3 & Hybrid Rendering Engine**:
   - Sử dụng ảnh thật làm First Frame (Image-to-Video) để đảm bảo hình dáng sản phẩm chuẩn xác và tiết kiệm chi phí API.
4. **TTS Tiếng Việt & Phụ Đề Động**:
   - Tích hợp **Edge-TTS miễn phí** (giọng HoaiMy, NamMinh cực mượt) + Hỗ trợ FPT.AI / ElevenLabs.
   - Tự động tạo phụ đề **Karaoke đổi màu từng chữ (.ass)** nổi bật.
5. **Marketing Overlays & Tải Trọn Gói**:
   - Tự động chèn **Mũi tên chỉ giỏ hàng góc trái** kèm SFX âm thanh.
   - Tải 1-Click trọn gói **file ZIP chứa 10 video 9:16 Full HD kèm file SEO_METADATA.txt**.
   - Thiết kế sẵn sàng mở rộng sang thị trường **Amazon US/Global**.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Khởi chạy Backend (FastAPI)
```bash
cd /mnt/miniproject/shopee-veo3-generator/backend

# Tạo môi trường ảo và cài đặt thư viện
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Cài đặt trình duyệt Playwright
playwright install chromium

# Cấu hình biến môi trường (Tùy chọn)
export GEMINI_API_KEY="your-gemini-api-key"
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"

# Chạy server FastAPI
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation sẽ có tại: `http://localhost:8000/docs`

### 2. Khởi chạy Frontend (Next.js)
```bash
cd /mnt/miniproject/shopee-veo3-generator/frontend

# Cài đặt packages
npm install

# Chạy Next.js Development Server
npm run dev
```
Giao diện ứng dụng sẽ sẵn sàng tại: `http://localhost:3000`

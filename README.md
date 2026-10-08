# 📚 HƯỚNG DẪN VẬN HÀNH & KIẾN TRÚC DỰ ÁN: SHOPEE VEO 3 VIDEO GENERATOR

> **Tên dự án**: Shopee Veo 3 Video Generator (AI Affiliate 9:16)  
> **Vị trí thư mục**: `/mnt/miniproject/shopee-veo3-generator/`  
> **Mục tiêu cốt lõi**: Tự động hóa sản xuất **10 video ngắn affiliate** (chuẩn dọc 9:16 cho TikTok, Shopee Video, Facebook Reels, YouTube Shorts) từ 1 link Shopee hoặc bộ ảnh sản phẩm bằng **Google Veo 3**, **Gemini 2.0 Flash**, **TTS tiếng Việt** và **FFmpeg Engine**.

---

## 1. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

```
                              [ NGƯỜI DÙNG / CREATOR ]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │         NEXT.JS 14 FRONTEND           │
                     │  - Dashboard Stepper 4 bước          │
                     │  - Input: Link Shopee / Upload        │
                     │  - Batch Script Editor (10 Angles)    │
                     │  - Video Player 9:16 & ZIP Downloader │
                     └───────────────────┬───────────────────┘
                                         │ REST API / WebSockets
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          FASTAPI BACKEND              │
                     │  - Task Queue & Background Worker     │
                     │  - Storage & Media Server (/static)   │
                     └───────────────────┬───────────────────┘
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         ▼                               ▼                               ▼
┌──────────────────┐           ┌──────────────────┐            ┌──────────────────┐
│  DATA PROVIDER   │           │    AI ENGINE     │            │  MEDIA PIPELINE  │
│ - Playwright     │           │ - Gemini 2.0     │            │ - Edge-TTS (VN)  │
│   Stealth        │           │   (10 Scripts,   │            │ - Google Veo 3   │
│ - Direct API     │           │    Hook Overlays,│            │   (Image-to-Video│
│ (Ảnh HD, Đã bán, │           │    SEO Metadata) │            │   & Ken Burns)   │
│  Rating, Giá)    │           │ - Veo 3 Prompts  │            │ - FFmpeg Engine  │
└──────────────────┘           └──────────────────┘            └──────────────────┘
```

---

## 2. CHIẾN LƯỢC NỘI DUNG 10 ANGLES & MARKETING PSYCHOLOGY

Để video tiếp thị liên kết **không bị nền tảng bóp tương tác** và **tối ưu tỷ lệ click vào giỏ hàng**, hệ thống triển khai 10 góc độ sáng tạo tự nhiên:

| # | Góc Độ Kịch Bản (Angle) | Bản Chất & Đòn Bẩy Tâm Lý | Mục Tiêu Giữ Chân & Chuyển Đổi |
| :--- | :--- | :--- | :--- |
| **1** | **POV Tình Huống Đời Thường** | Đánh trúng nỗi đau thực tế (Problem - Solution). | Người xem thấy chính mình trong video. |
| **2** | **Đập Hộp & Cảm Nhận Đầu Tiên** | Cảm giác chân thực, sờ tận tay chất liệu hoàn thiện. | Xóa bỏ nghi ngờ về chất lượng hàng online. |
| **3** | **Mẹo Hay Cuộc Sống (Lifehack)** | Chia sẻ giá trị hữu ích trước, lồng sản phẩm sau. | Tăng lượt Save / Share video lên TikTok. |
| **4** | **Trước & Sau (Before & After)** | Trực quan hóa sự khác biệt vượt trội. | Kích thích nhu cầu mua sắm ngay lập tức. |
| **5** | **Thử Thách / Test Độ Bền** | Kiểm chứng cam kết (chống nước, kháng lực...). | Xây dựng lòng tin tuyệt đối (High Trust). |
| **6** | **Dành Riêng Đối Tượng Ngách** | Nhắm trực diện: Dân văn phòng, Sinh viên, Mẹ bỉm. | Khách hàng mục tiêu tự nhận diện nhu cầu. |
| **7** | **So Sánh Trải Nghiệm** | Tại sao nên đổi từ phương pháp cũ sang món này. | Biến sản phẩm thành khoản đầu tư hời. |
| **8** | **Tâm Sự / Kể Chuyện Ngắn** | Đồng cảm, câu chuyện đời thường gần gũi. | Giữ chân người xem qua 3 giây đầu. |
| **9** | **Tâm Lý Đảo Ngược** | *"Đừng mua nếu bạn sợ nghiện..."* gây tò mò. | Kích hoạt bản năng tò mò của người lướt feed. |
| **10**| **Review Sau 1 Tháng Sử Dụng** | Đánh giá công tâm ưu và nhược điểm thực tế. | Chốt đơn khách hàng kỹ tính khó tính nhất. |

---

## 3. CÁC TÍNH NĂNG TỐI ƯU CHUYỂN ĐỔI (CONVERSION BOOSTERS)

1. **Hook Text Overlay (0-3s)**: Tự động chèn dòng chữ to, viền đen chữ vàng phong cách TikTok để người xem dừng lướt.
2. **Social Proof Banner**: Tự động chèn badge uy tín: `⭐ 4.9/5 - Đã bán 25.4k`.
3. **Mũi Tên Chỉ Giỏ Hàng Nhấp Nháy (10-15s)**: Sticker chỉ thẳng xuống góc dưới bên trái (vị trí giỏ hàng Shopee Video / TikTok Shop).
4. **Phụ Đề Karaoke Động (.ass)**: Hiển thị chữ nổi bật và đổi màu sáng theo từng từ giọng đọc phát ra.
5. **Hybrid Rendering**: Sử dụng ảnh thật làm First Frame với Veo 3 để giữ nguyên ngoại quan sản phẩm và tiết kiệm 60% chi phí API.

---

## 4. CẤU TRÚC THƯ MỤC DỰ ÁN

```
/mnt/miniproject/shopee-veo3-generator/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py              # Endpoints API: Cào, Sinh kịch bản, Render, Xuất ZIP
│   │   ├── core/
│   │   │   └── config.py              # Quản lý API Keys & Đường dẫn Storage
│   │   ├── providers/
│   │   │   ├── base_provider.py       # Interface chuẩn cho các sàn TMĐT
│   │   │   ├── shopee_provider.py     # Cào Shopee VN (Direct API + Playwright Stealth)
│   │   │   └── amazon_provider.py     # Module chuẩn bị cho Amazon US/Global
│   │   ├── services/
│   │   │   ├── gemini_service.py      # Gemini 2.0 Flash (10 Kịch bản + SEO Tags + Prompts)
│   │   │   ├── tts_service.py         # Edge-TTS tiếng Việt (HoaiMy, NamMinh) + Timestamps
│   │   │   ├── subtitle_service.py    # Sinh file Karaoke Subtitle .ass
│   │   │   ├── veo_service.py         # Google Veo 3 Video API + Fallback Ken Burns
│   │   │   └── ffmpeg_service.py      # Ghép clips, Subtitle, Mũi tên giỏ hàng, BGM
│   │   └── main.py                    # Khởi tạo FastAPI App
│   ├── requirements.txt               # Dependencies Python
│   └── storage/                       # Thư mục lưu uploads, audio, clips, video output
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Dashboard Stepper chính
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── Stepper.tsx            # Thanh điều hướng 4 bước
│   │   │   ├── InputSection.tsx       # Form dán Link Shopee / Chọn ngành hàng / Upload
│   │   │   ├── BatchScriptEditor.tsx  # Trình quản lý duyệt 10 kịch bản & SEO
│   │   │   └── VideoBatchGrid.tsx     # Lưới 10 video 9:16 + Tải trọn gói ZIP
│   │   └── lib/api.ts                 # Axios API Client kết nối Backend
│   ├── package.json
│   └── tailwind.config.js
├── docs/
│   └── ARCHITECTURE_AND_MANUAL.md     # Tài liệu này
└── README.md
```

---

## 5. HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH (STEP-BY-STEP)

### Bước 1: Khởi động Backend (FastAPI Server)
Mở Terminal 1:
```bash
cd /mnt/miniproject/shopee-veo3-generator/backend

# 1. Tạo môi trường ảo Python
python3 -m venv venv
source venv/bin/activate

# 2. Cài đặt các thư viện cần thiết
pip install -r requirements.txt

# 3. Cài đặt trình duyệt Playwright để cào Shopee
playwright install chromium

# 4. (Tùy chọn) Cài đặt API Keys vào biến môi trường
export GEMINI_API_KEY="AIzaSy..."
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"

# 5. Khởi chạy Backend Server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Swagger UI kiểm tra: `http://localhost:8000/docs`

### Bước 2: Khởi động Frontend (Next.js App)
Mở Terminal 2:
```bash
cd /mnt/miniproject/shopee-veo3-generator/frontend

# 1. Cài đặt các packages Node.js
npm install

# 2. Chạy Server giao diện
npm run dev
```
- Truy cập ứng dụng tại: `http://localhost:3000`

---

## 6. HƯỚNG DẪN SỬ DỤNG TRÊN GIAO DIỆN (USER FLOW)

1. **Bước 1: Nhập Sản Phẩm**
   - Dán đường link sản phẩm Shopee (ví dụ: bình giữ nhiệt, tai nghe, nồi chiên...) hoặc chọn Tab *Upload Ảnh & Nhập tay*.
   - Chọn **Ngành hàng** tương ứng (Mỹ phẩm, Thời trang, Gia dụng, Công nghệ) để AI áp dụng đúng Tone kịch bản và Nhạc nền.
   - Bấm nút **"Tiếp Tục: Sinh 10 Kịch Bản"**.
2. **Bước 2: Duyệt & Tinh Chỉnh 10 Kịch Bản**
   - Xem qua 10 thẻ kịch bản theo 10 góc độ Viral.
   - Bạn có thể sửa nhanh dòng chữ **Hook Text 3s đầu**, sửa lời thoại, hoặc đổi giọng đọc (Nam/Nữ, Bắc/Nam).
   - Xem trước các câu Prompt điện ảnh mà AI đã tạo cho Google Veo 3.
   - Bấm nút **"Bắt Đầu Render 10 Video (Veo 3)"**.
3. **Bước 3: Xem Video & Tải Về**
   - Theo dõi thanh tiến độ render thời gian thực.
   - Xem trực tiếp từng video trên trình phát dọc chuẩn 9:16.
   - Bấm **"Copy SEO Tags"** để sao chép sẵn Tiêu đề + Mô tả + Hashtags đăng bài.
   - Bấm **"Tải Trọn Gói 10 Video + File SEO.txt (ZIP)"** để lưu về máy và lên lịch đăng tải lên TikTok Shop / Shopee Video.

---

## 7. KẾ HOẠCH MỞ RỘNG TƯƠNG LAI (AMAZON US / GLOBAL)
Khi muốn triển khai cho thị trường nước ngoài:
- Kích hoạt file `backend/app/providers/amazon_provider.py`.
- Sử dụng preset giọng đọc US (`en-US-JennyNeural`, `en-US-ChristopherNeural` hoặc ElevenLabs).
- Gemini sẽ tự động viết kịch bản tiếng Anh chuẩn phong cách *"Amazon Finds / TikTok Made Me Buy It"* và gán badge *Amazon Prime / Best Seller*.

# 🚀 HƯỚNG DẪN KHỞI CHẠY CÔNG CỤ (QUICKSTART & RUN GUIDE)

> **Dự án**: Shopee Veo 3 Video Generator (Fullstack AI Video Affiliate 9:16)  
> **Thư mục dự án**: `/mnt/miniproject/shopee-veo3-generator/`

---

## 📋 1. YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)

Trước khi chạy, máy của bạn cần có sẵn:
1. **Python**: Phiên bản `>= 3.10`
2. **Node.js**: Phiên bản `>= 18.x` hoặc `20.x` (kèm `npm`)
3. **FFmpeg**: Đã được cài trên hệ điều hành (để ghép video và phụ đề)
   ```bash
   # Kiểm tra FFmpeg trên Linux/Ubuntu:
   ffmpeg -version
   # Nếu chưa có: sudo apt update && sudo apt install -y ffmpeg
   ```

---

## 🛠️ 2. HƯỚNG DẪN CÀI ĐẶT LẦN ĐẦU (FIRST-TIME SETUP)

### Bước 2.1: Cài đặt Backend (FastAPI Python)
Mở Terminal và chạy các lệnh sau:
```bash
cd /mnt/miniproject/shopee-veo3-generator/backend

# 1. Tạo môi trường ảo Python (Virtual Environment)
python3 -m venv venv

# 2. Kích hoạt môi trường ảo
source venv/bin/activate

# 3. Cài đặt các thư viện Python
pip install --upgrade pip
pip install -r requirements.txt

# 4. Cài đặt trình duyệt Playwright (để cào dữ liệu Shopee)
playwright install chromium
```

### Bước 2.2: Cài đặt Frontend (Next.js Node.js)
Mở Terminal mới (hoặc chuyển sang thư mục frontend):
```bash
cd /mnt/miniproject/shopee-veo3-generator/frontend

# Cài đặt các packages Node.js
npm install
```

---

## 🔑 3. CẤU HÌNH BIẾN MÔI TRƯỜNG (API KEYS)

Trong thư mục `/mnt/miniproject/shopee-veo3-generator/backend/`, tạo file `.env` (hoặc export trực tiếp trong terminal):

```bash
# Tạo file .env cho Backend
cat << 'EOF' > /mnt/miniproject/shopee-veo3-generator/backend/.env
# Google Gemini API Key (để viết 10 kịch bản & SEO tags)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# Google Cloud Project (Dành cho Google Veo 3 API trên Vertex AI)
GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
GOOGLE_CLOUD_LOCATION="us-central1"

# Tùy chọn Third-party TTS (Nếu muốn dùng ngoài Edge-TTS miễn phí)
FPT_AI_API_KEY=""
ELEVENLABS_API_KEY=""
EOF
```

> 💡 **Lưu ý**: Nếu bạn chưa có `GEMINI_API_KEY`, hệ thống vẫn có sẵn bộ sinh kịch bản thông minh dự phòng (Smart Fallback Generator) để bạn trải nghiệm và test toàn bộ luồng tạo video ngay lập tức!

---

## ⚡ 4. KHỞI CHẠY HỆ THỐNG (RUNNING THE APP)

Để sử dụng ứng dụng đầy đủ, bạn cần chạy song song 2 dịch vụ:

### 🟢 Cửa sổ Terminal 1: Chạy Backend FastAPI
```bash
cd /mnt/miniproject/shopee-veo3-generator/backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- **Backend API**: `http://localhost:8000`
- **Tài liệu API Swagger**: `http://localhost:8000/docs`

---

### 🟢 Cửa sổ Terminal 2: Chạy Frontend Next.js
```bash
cd /mnt/miniproject/shopee-veo3-generator/frontend
npm run dev
```
- **Giao diện Web App**: `http://localhost:3000`

---

## 🖱️ 5. CÁC BƯỚC SỬ DỤNG TRÊN GIAO DIỆN WEB (USER FLOW)

1. Mở trình duyệt và truy cập: **`http://localhost:3000`**
2. **Bước 1 (Nhập Sản Phẩm)**:
   - Dán một link sản phẩm Shopee bất kỳ hoặc chọn Tab *Upload Ảnh & Nhập Tay*.
   - Chọn **Ngành hàng** (Gia dụng / Mỹ phẩm / Thời trang / Công nghệ).
   - Nhấn **"Tiếp Tục: Sinh 10 Kịch Bản"**.
3. **Bước 2 (Duyệt Kịch Bản & Tinh Chỉnh)**:
   - Hệ thống hiển thị 10 kịch bản theo 10 góc độ Viral khác nhau.
   - Bạn có thể chỉnh sửa dòng **Hook Text 3s đầu**, sửa lời thoại hoặc đổi giọng đọc Nam/Nữ.
   - Nhấn **"Bắt Đầu Render 10 Video (Veo 3)"**.
4. **Bước 3 (Xem Video & Tải Về)**:
   - Theo dõi tiến độ render từng video theo thời gian thực (0% → 100%).
   - Xem thử video 9:16 trên web player.
   - Bấm **"Copy SEO Tags"** để sao chép tiêu đề, mô tả và hashtag chuẩn SEO.
   - Bấm nút xanh **"Tải Trọn Gói 10 Video + File SEO.txt (ZIP)"** để tải về máy!

---

## 🛑 6. CÁCH DỪNG HỆ THỐNG (STOPPING THE APP)
- Tại mỗi cửa sổ terminal đang chạy, nhấn tổ hợp phím **`Ctrl + C`** để tắt server.

---

## ❓ 7. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

- **Lỗi: `No such filter: drawtext`**: Do bản FFmpeg trên máy chưa được bật libfreetype. Chạy `sudo apt install ffmpeg` để cài bản đầy đủ.
- **Lỗi: `Playwright Executable Doesn't Exist`**: Chạy lệnh `playwright install chromium` bên trong môi trường ảo backend.
- **Port 8000 hoặc 3000 bị chiếm dụng**: Kiểm tra và tắt tiến trình cũ bằng: `lsof -i :8000` hoặc `kill -9 <PID>`.

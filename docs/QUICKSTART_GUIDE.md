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

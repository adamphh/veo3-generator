#!/bin/bash

# Script tiện ích khởi chạy toàn bộ hệ thống Shopee Veo 3 Generator (1-Click Start)

echo "========================================================"
echo "🚀 KHỞI ĐỘNG SHOPEE VEO 3 VIDEO GENERATOR (FULLSTACK)"
echo "========================================================"

BASE_DIR="/mnt/miniproject/shopee-veo3-generator"

# 1. Kiểm tra môi trường ảo Backend
if [ ! -d "$BASE_DIR/backend/venv" ]; then
    echo "📦 Đang tạo môi trường ảo Python và cài đặt packages..."
    python3 -m venv "$BASE_DIR/backend/venv"
    source "$BASE_DIR/backend/venv/bin/activate"
    pip install -r "$BASE_DIR/backend/requirements.txt"
    playwright install chromium
fi

# 2. Khởi chạy Backend FastAPI ở background
echo "🟢 Đang khởi động Backend FastAPI (Port 8000)..."
source "$BASE_DIR/backend/venv/bin/activate"
cd "$BASE_DIR/backend"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 3. Khởi chạy Frontend Next.js
echo "🟢 Đang khởi động Frontend Next.js (Port 3000)..."
cd "$BASE_DIR/frontend"
if [ ! -d "$BASE_DIR/frontend/node_modules" ]; then
    echo "📦 Đang cài đặt node_modules..."
    npm install
fi
npm run dev &
FRONTEND_PID=$!

echo "========================================================"
echo "🎉 HỆ THỐNG ĐÃ SẴN SÀNG!"
echo "🌐 Giao diện Web: http://localhost:3000"
echo "📚 Backend Docs:  http://localhost:8000/docs"
echo "👉 Nhấn Ctrl + C để dừng toàn bộ hệ thống."
echo "========================================================"

# Bắt sự kiện Ctrl + C để tắt cả 2 tiến trình
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

wait

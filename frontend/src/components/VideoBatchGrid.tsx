import React from 'react';
import { Download, CheckCircle, ExternalLink, Play, Sparkles, Copy, FileText } from 'lucide-react';
import { getDownloadZipUrl } from '@/lib/api';

interface VideoBatchGridProps {
  taskId: string;
  progressPercent: number;
  currentVideo: number;
  totalVideos: number;
  status: string;
  completedVideos: any[];
  onReset: () => void;
}

export const VideoBatchGrid: React.FC<VideoBatchGridProps> = ({
  taskId,
  progressPercent,
  currentVideo,
  totalVideos,
  status,
  completedVideos,
  onReset
}) => {
  const isFinished = status === 'completed' || progressPercent === 100;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào bộ nhớ tạm!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Tiến độ Header */}
      <div className="text-center space-y-4">
        {isFinished ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
            <CheckCircle className="w-4 h-4" />
            Đã hoàn thành xuất sắc 10 Video Affiliate 9:16!
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-shopee-orange font-bold text-sm animate-pulse">
            <Sparkles className="w-4 h-4" />
            Đang render Video #{currentVideo} / {totalVideos || 10}...
          </div>
        )}

        <h2 className="text-2xl font-extrabold text-gray-900">
          {isFinished ? 'Bộ Sưu Tập 10 Video Affiliate Sẵn Sàng Đăng Tải' : 'Hệ Thống Đang Biên Tập & Render Video 9:16'}
        </h2>

        {/* Thanh Progress Bar */}
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
            <span>Tiến độ tổng:</span>
            <span className="text-shopee-orange font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-gradient-to-r from-shopee-orange to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Nút Tải Toàn Bộ ZIP */}
        {isFinished && (
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={getDownloadZipUrl(taskId)}
              download
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-xl hover:shadow-emerald-200 transition-all flex items-center gap-3 text-base"
            >
              <Download className="w-5 h-5" />
              Tải Trọn Gói 10 Video + File SEO.txt (ZIP)
            </a>
            <button
              onClick={onReset}
              className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
            >
              Tạo Sản Phẩm Mới
            </button>
          </div>
        )}
      </div>

      {/* Lưới hiển thị 10 Video */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {completedVideos.map((v, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
          >
            {/* Player giả lập 9:16 */}
            <div className="relative aspect-[9/16] bg-black flex items-center justify-center overflow-hidden group">
              <video
                src={`http://localhost:8000${v.video_url}`}
                controls
                className="w-full h-full object-cover"
                poster="https://placehold.co/1080x1920/1e1e2f/ffffff?text=Video+9:16"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white">
                #{v.video_id}
              </div>
            </div>

            {/* Thông tin & Nút Copy SEO */}
            <div className="p-3 space-y-2 text-xs">
              <h4 className="font-bold text-gray-800 line-clamp-1">{v.angle_title}</h4>
              <p className="text-[11px] text-gray-500 line-clamp-2">{v.seo_title}</p>
              
              <button
                onClick={() =>
                  copyToClipboard(
                    `Tiêu đề: ${v.seo_title}\n\nMô tả: ${v.seo_description}\n\nTags: ${v.seo_tags.join(' ')}`
                  )
                }
                className="w-full py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all text-[11px]"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy SEO Tags
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

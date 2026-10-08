'use client';

import React, { useState, useEffect } from 'react';
import { Stepper } from '@/components/Stepper';
import { InputSection } from '@/components/InputSection';
import { BatchScriptEditor } from '@/components/BatchScriptEditor';
import { VideoBatchGrid } from '@/components/VideoBatchGrid';
import {
  ProductData,
  VideoScript,
  scrapeProduct,
  generateScripts,
  renderBatchVideos,
  renderSingleVideo,
  getRenderStatus
} from '@/lib/api';
import { Sparkles, ShoppingBag, ShieldCheck, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renderingSingleId, setRenderingSingleId] = useState<number | null>(null);
  
  // Toast Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };
  
  // Dữ liệu luồng
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [scripts, setScripts] = useState<VideoScript[]>([]);
  const [taskId, setTaskId] = useState<string>('');
  
  // Tiến độ render
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<number>(1);
  const [renderStatus, setRenderStatus] = useState<string>('idle');
  const [completedVideos, setCompletedVideos] = useState<any[]>([]);

  // Bước 1 -> Bước 2: Nhận sản phẩm và gọi Gemini sinh 10 kịch bản
  const handleProductReady = async (product: ProductData, niche: string) => {
    setIsLoading(true);
    setProductData(product);
    showToast(`Đang phân tích sản phẩm và tạo 10 kịch bản Marketing...`, 'info');

    try {
      const res = await generateScripts(product, niche);
      if (res.data && res.data.scripts) {
        setScripts(res.data.scripts);
        setCurrentStep(2);
        showToast(`Đã tạo thành công 10 kịch bản & SEO metadata!`, 'success');
      }
    } catch (err: any) {
      console.error('Error generating scripts:', err);
      showToast(`Không thể tạo kịch bản: ${err.message || 'Lỗi server'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Render 1 Video Đơn Lẻ Ngay Lập Tức
  const handleRenderSingle = async (script: VideoScript) => {
    setRenderingSingleId(script.video_id);
    showToast(`Đang render Video #${script.video_id}: ${script.angle_title}...`, 'info');

    try {
      const res = await renderSingleVideo({
        product_title: productData?.title || 'Shopee Product',
        image_url: productData?.image_urls[0],
        script: script,
        social_proof_text: `⭐ ${productData?.rating_star || '4.9'} - Đã bán ${productData?.sold_count || '1.5k'}`
      });

      if (res && res.status === 'success') {
        showToast(`🎉 Render thành công Video #${script.video_id}!`, 'success');
        setCompletedVideos(prev => {
          const exists = prev.some(v => v.video_id === res.video_id);
          if (exists) {
            return prev.map(v => v.video_id === res.video_id ? res : v);
          }
          return [...prev, res];
        });
        setCurrentStep(3);
        setRenderStatus('completed');
        setProgressPercent(100);
      }
    } catch (err: any) {
      console.error('Error rendering single video:', err);
      showToast(`Lỗi khi render video #${script.video_id}: ${err.message || 'Lỗi xử lý'}`, 'error');
    } finally {
      setRenderingSingleId(null);
    }
  };

  // Bước 2 -> Bước 3: Người dùng duyệt 10 kịch bản và bấm bắt đầu Render Hàng Loạt
  const handleStartRender = async (updatedScripts: VideoScript[]) => {
    setIsLoading(true);
    showToast(`Đang khởi chạy tiến trình render hàng loạt 10 Video...`, 'info');

    try {
      const res = await renderBatchVideos({
        product_title: productData?.title || 'Shopee Product',
        image_url: productData?.image_urls[0],
        scripts: updatedScripts,
        social_proof_text: `⭐ ${productData?.rating_star || '4.9'} - Đã bán ${productData?.sold_count || '1.5k'}`
      });

      if (res.task_id) {
        setTaskId(res.task_id);
        setCurrentStep(3);
        setRenderStatus('processing');
        showToast(`Tiến trình render đang chạy ngầm trên server.`, 'info');
      }
    } catch (err: any) {
      console.error('Error starting render:', err);
      showToast(`Lỗi khi kích hoạt render: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Polling cập nhật tiến độ render
  useEffect(() => {
    let interval: any;
    if (taskId && currentStep === 3 && renderStatus !== 'completed') {
      interval = setInterval(async () => {
        try {
          const status = await getRenderStatus(taskId);
          setProgressPercent(status.progress_percent || 0);
          setCurrentVideo(status.current_video || 1);
          setCompletedVideos(status.completed_videos || []);
          
          if (status.status === 'completed') {
            setRenderStatus('completed');
            setCurrentStep(4);
            showToast(`🎉 Hoàn thành xuất sắc toàn bộ 10 video!`, 'success');
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [taskId, currentStep, renderStatus]);

  const handleReset = () => {
    setCurrentStep(1);
    setProductData(null);
    setScripts([]);
    setTaskId('');
    setProgressPercent(0);
    setCompletedVideos([]);
    setRenderStatus('idle');
    setRenderingSingleId(null);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative">
      {/* Toast Notification Floating Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : toast.type === 'error'
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-200" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-200" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-orange-400" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-shopee-orange text-white flex items-center justify-center font-black shadow-md shadow-orange-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 tracking-tight">
                Shopee<span className="text-shopee-orange">Veo3</span> Generator
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                AI Affiliate 9:16
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-gray-600">
            <span className="hidden md:flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="w-4 h-4" /> Gemini 2.0 Flash + Google Veo 3
            </span>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Stepper Navigation */}
        <Stepper currentStep={currentStep} />

        {/* Step 1: Input Product */}
        {currentStep === 1 && (
          <InputSection onProductReady={handleProductReady} isLoading={isLoading} />
        )}

        {/* Step 2: Batch Script Editor */}
        {currentStep === 2 && (
          <BatchScriptEditor
            scripts={scripts}
            onStartRender={handleStartRender}
            onRenderSingle={handleRenderSingle}
            isLoading={isLoading}
            renderingSingleId={renderingSingleId}
          />
        )}

        {/* Step 3 & 4: Video Batch Grid & Export */}
        {(currentStep === 3 || currentStep === 4) && (
          <VideoBatchGrid
            taskId={taskId}
            progressPercent={progressPercent}
            currentVideo={currentVideo}
            totalVideos={scripts.length || 10}
            status={renderStatus}
            completedVideos={completedVideos}
            onReset={handleReset}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>© 2026 Shopee Veo 3 Video Generator. Sáng tạo nội dung Affiliate chuyển đổi cao cho TikTok Shop, Shopee Video, Reels & Shorts.</p>
      </footer>
    </main>
  );
}

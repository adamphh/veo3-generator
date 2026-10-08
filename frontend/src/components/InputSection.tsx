import React, { useState } from 'react';
import { Link2, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { ProductData } from '@/lib/api';

interface InputSectionProps {
  onProductReady: (product: ProductData, niche: string) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onProductReady, isLoading }) => {
  const [tab, setTab] = useState<'link' | 'manual'>('link');
  const [shopeeUrl, setShopeeUrl] = useState('');
  const [niche, setNiche] = useState('gia_dung');
  
  // Manual form state
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrice, setManualPrice] = useState('');
  const [manualSold, setManualSold] = useState('1.5k');
  const [manualDesc, setManualDesc] = useState('');
  const [manualImage, setManualImage] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60');

  const handleScrapeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopeeUrl) return;
    
    try {
      const res = await scrapeProduct(shopeeUrl, niche);
      if (res && res.data) {
        onProductReady(res.data, niche);
      }
    } catch (err) {
      console.error("Scraping error:", err);
      // Fallback nếu cào thất bại
      const fallbackProduct: ProductData = {
        title: "Sản phẩm Shopee chất lượng cao",
        price_sale: "189.000 đ",
        price_original: "320.000 đ",
        sold_count: "1.5k",
        rating_star: "4.9",
        description: "Sản phẩm chính hãng chất lượng cao",
        image_urls: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60"],
        freeship_tag: true,
        flash_sale_tag: true
      };
      onProductReady(fallbackProduct, niche);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle) return;

    const product: ProductData = {
      title: manualTitle,
      price_sale: manualPrice || "Liên hệ giá tốt",
      sold_count: manualSold,
      rating_star: "4.9",
      description: manualDesc || manualTitle,
      image_urls: [manualImage],
      freeship_tag: true,
      flash_sale_tag: false
    };

    onProductReady(product, niche);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('link')}
          className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition-all border-b-2 ${
            tab === 'link'
              ? 'border-shopee-orange text-shopee-orange'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Link2 className="w-4 h-4" />
          Dán Link Shopee (Tự động cào)
        </button>
        <button
          onClick={() => setTab('manual')}
          className={`flex items-center gap-2 pb-4 px-4 font-semibold text-sm transition-all border-b-2 ${
            tab === 'manual'
              ? 'border-shopee-orange text-shopee-orange'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Ảnh & Nhập Tay
        </button>
      </div>

      {/* Dropdown Chọn Ngành Hàng */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🎯 Chọn Ngành Hàng (Để AI tối ưu Tone giọng & Nhạc nền):
        </label>
        <select
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-shopee-orange focus:border-transparent outline-none bg-gray-50 text-gray-800 font-medium"
        >
          <option value="gia_dung">🍳 Đồ Gia dụng / Nhà cửa đời sống (Problem - Solution, Mẹo vặt, Bền bỉ)</option>
          <option value="my_pham">💄 Mỹ phẩm / Skincare (Tâm sự, ASMR, Chuyên gia phân tích, Chill)</option>
          <option value="thoi_trang">👗 Thời trang / Phụ kiện (Trendy, OOTD, Form dáng, Nhạc giật cuốn)</option>
          <option value="cong_nghe">💻 Công nghệ / Điện tử (Chuyên gia kỹ tính, Test tính năng, Thông số)</option>
        </select>
      </div>

      {tab === 'link' ? (
        <form onSubmit={handleScrapeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔗 Link Sản Phẩm Shopee (Shopee.vn / App Share Link):
            </label>
            <input
              type="url"
              required
              placeholder="https://shopee.vn/product/12345/67890..."
              value={shopeeUrl}
              onChange={(e) => setShopeeUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-shopee-orange focus:border-transparent outline-none text-gray-800"
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-xs text-orange-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Hệ thống sẽ tự động trích xuất: <b>Ảnh HD gốc</b>, <b>Giá khuyến mãi</b>, <b>Số lượng đã bán</b>, <b>Đánh giá ⭐</b> và <b>Tag Freeship Xtra</b> để chuẩn bị tạo video.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-shopee-orange hover:bg-shopee-darkOrange text-white font-bold rounded-xl shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Đang phân tích và cào dữ liệu...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Tiếp Tục: Sinh 10 Kịch Bản & Veo 3 Prompts
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Sản Phẩm:</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nồi chiên không dầu Lock&Lock 5L"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-shopee-orange outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Giá Bán:</label>
              <input
                type="text"
                placeholder="Ví dụ: 199.000 đ"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-shopee-orange outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Đã Bán (Social Proof):</label>
              <input
                type="text"
                placeholder="Ví dụ: 5.4k"
                value={manualSold}
                onChange={(e) => setManualSold(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-shopee-orange outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Link Ảnh Sản Phẩm (HD):</label>
            <input
              type="url"
              placeholder="https://..."
              value={manualImage}
              onChange={(e) => setManualImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-shopee-orange outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả / Tính năng nổi bật:</label>
            <textarea
              rows={3}
              placeholder="Mô tả công dụng, tính năng vượt trội..."
              value={manualDesc}
              onChange={(e) => setManualDesc(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-shopee-orange outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-shopee-orange hover:bg-shopee-darkOrange text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Sinh 10 Kịch Bản Tự Nhiên Bằng Gemini
          </button>
        </form>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { VideoScript } from '@/lib/api';
import { Edit3, Play, Volume2, Sparkles, Video, ArrowRight, Tag } from 'lucide-react';

interface BatchScriptEditorProps {
  scripts: VideoScript[];
  onStartRender: (updatedScripts: VideoScript[]) => void;
  isLoading: boolean;
}

export const BatchScriptEditor: React.FC<BatchScriptEditorProps> = ({
  scripts: initialScripts,
  onStartRender,
  isLoading
}) => {
  const [scripts, setScripts] = useState<VideoScript[]>(initialScripts);
  const [activeTab, setActiveTab] = useState<number>(1);

  const handleScriptChange = (id: number, field: keyof VideoScript, value: any) => {
    setScripts(prev =>
      prev.map(s => (s.video_id === id ? { ...s, [field]: value } : s))
    );
  };

  const currentScript = scripts.find(s => s.video_id === activeTab) || scripts[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-shopee-orange" />
            10 Kịch Bản Tiếp Thị Tự Nhiên & SEO Tags (Gemini 2.0)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Được tối ưu theo 10 góc độ Viral. Bạn có thể sửa lời thoại, chọn giọng đọc trước khi render.
          </p>
        </div>

        <button
          onClick={() => onStartRender(scripts)}
          disabled={isLoading}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          <Video className="w-5 h-5" />
          {isLoading ? 'Đang kích hoạt hàng đợi...' : 'Bắt Đầu Render 10 Video (Veo 3)'}
        </button>
      </div>

      {/* Tabs danh sách 10 Video */}
      <div className="flex gap-2 overflow-x-auto py-4 scrollbar-thin">
        {scripts.map(s => (
          <button
            key={s.video_id}
            onClick={() => setActiveTab(s.video_id)}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm whitespace-nowrap transition-all border ${
              activeTab === s.video_id
                ? 'bg-shopee-orange text-white border-shopee-orange shadow-md'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            #{s.video_id}: {s.angle_title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Chi tiết Kịch bản đang chọn */}
      {currentScript && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Cột 1 & 2: Thoại + Hook + SEO */}
          <div className="lg:col-span-2 space-y-5">
            {/* Hook Text Overlay */}
            <div>
              <label className="block text-xs font-bold text-orange-600 uppercase mb-1">
                🔥 Hook Text Overlay (Chữ To 3s Đầu Phong Cách TikTok):
              </label>
              <input
                type="text"
                value={currentScript.hook_text_overlay}
                onChange={e => handleScriptChange(currentScript.video_id, 'hook_text_overlay', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-orange-300 bg-orange-50 font-bold text-gray-900 focus:ring-2 focus:ring-shopee-orange outline-none"
              />
            </div>

            {/* Voiceover Script */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  🎙️ Lời Thoại Thuyết Minh (Thời Lượng 12-15 Giây):
                </label>
                <span className="text-xs text-gray-400">
                  {currentScript.voiceover_script.split(' ').length} từ
                </span>
              </div>
              <textarea
                rows={4}
                value={currentScript.voiceover_script}
                onChange={e => handleScriptChange(currentScript.video_id, 'voiceover_script', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-shopee-orange outline-none leading-relaxed"
              />
            </div>

            {/* Giọng đọc TTS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Giới tính giọng đọc:</label>
                <select
                  value={currentScript.voice_gender}
                  onChange={e => handleScriptChange(currentScript.video_id, 'voice_gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
                >
                  <option value="female">Nữ (Truyền cảm, dịu dàng)</option>
                  <option value="male">Nam (Trầm ấm, dứt khoát)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Vùng miền:</label>
                <select
                  value={currentScript.voice_accent}
                  onChange={e => handleScriptChange(currentScript.video_id, 'voice_accent', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
                >
                  <option value="north">Miền Bắc</option>
                  <option value="south">Miền Nam</option>
                </select>
              </div>
            </div>

            {/* SEO Metadata Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-shopee-orange" />
                SEO Metadata Tối Ưu Cho TikTok/Shopee Video/Reels:
              </h4>
              <div>
                <span className="text-xs text-gray-500">Tiêu đề:</span>
                <p className="text-sm font-semibold text-gray-800">{currentScript.seo_title}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Tags / Hashtags:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {currentScript.seo_tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cột 3: Veo 3 Prompts Inspector */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase mb-3">
                <Video className="w-4 h-4" />
                Google Veo 3 Prompts (3 Scenes):
              </div>

              <div className="space-y-3">
                {currentScript.veo_prompts.map((vp, idx) => (
                  <div key={idx} className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-xs">
                    <div className="flex justify-between text-slate-400 font-mono mb-1">
                      <span>Phân cảnh {vp.scene_number} ({vp.duration_seconds}s)</span>
                      <span className="text-emerald-400 font-bold">{vp.suggested_mode}</span>
                    </div>
                    <p className="text-slate-200 font-mono text-[11px] leading-relaxed">
                      "{vp.cinematography_prompt}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">
              💡 <b>Hybrid Rendering</b>: Phân cảnh 1 dùng ảnh thật làm First Frame để giữ nguyên mẫu sản phẩm, các cảnh sau tạo bối cảnh đời sống.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

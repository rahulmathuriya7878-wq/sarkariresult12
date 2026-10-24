import React, { useState } from 'react';
import { 
  X, Sparkles, SlidersHorizontal 
} from 'lucide-react';
import { VacancyItem, LanguageMode } from '../types';

interface AddVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageMode;
  onAddVacancy: (newJob: VacancyItem) => void;
  onUpdateVacancy?: (updatedJob: VacancyItem) => void;
  onDeleteVacancy?: (id: string) => void;
  editItem?: VacancyItem | null;
}

export const AddVacancyModal: React.FC<AddVacancyModalProps> = ({
  isOpen, onClose, editItem
}) => {
  const isAdmin = true;
  const isEdit = !!editItem;

  // Active Admin Tabs: Direct Update and AI Blog Writer
  const [activeTab, setActiveTab] = useState<'ai_writer' | 'direct_update'>('direct_update');

  // AI Writer Handler
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ title?: string; shortInfo?: string } | null>(null);

  const handleGenerateAiBlog = async () => {
    if (!aiTopicPrompt.trim()) return;
    setAiGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiTopicPrompt.trim() }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiResult(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiGenerating(false);
    }
  };

  if (!isOpen) return null;
  if (!isAdmin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">
            {isEdit ? 'संपूर्ण पोस्ट संपादक (Full Admin Post Editor)' : 'नई भर्ती / योजना का संपूर्ण फॉर्म'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setActiveTab('direct_update')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'direct_update' ? 'border-amber-600 text-amber-700 bg-white' : 'border-transparent text-slate-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>⚡ डायरेक्ट सेक्शन व पोस्ट अपडेट</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai_writer')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'ai_writer' ? 'border-amber-600 text-amber-700 bg-white' : 'border-transparent text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>✨ AI ब्लॉग राइटर</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'ai_writer' ? (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs leading-relaxed font-semibold">
                ✨ AI ब्लॉग राइटर: किसी भी भर्ती, प्रवेश पत्र या परिणाम का नाम दर्ज करें और AI स्वतः विस्तृत पोस्ट तैयार कर देगा।
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiTopicPrompt}
                  onChange={(e) => setAiTopicPrompt(e.target.value)}
                  placeholder="उदा. SSC CGL 2026 Notification or Railway ALP Admit Card..."
                  className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiBlog}
                  disabled={aiGenerating}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {aiGenerating ? 'AI पोस्ट बन रही है...' : 'AI जनरेट करें'}
                </button>
              </div>

              {aiResult && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-slate-900">{aiResult.title || 'जनरेट की गई पोस्ट'}</div>
                  <p className="text-slate-600">{aiResult.shortInfo}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 text-xs font-medium">
                ⚡ डायरेक्ट सेक्शन व पोस्ट अपडेट एडिटर में आपका स्वागत है। आप सीधे किसी भी सेक्शन, दिनांक, शुल्क, पद या लिंक को अपडेट कर सकते हैं।
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

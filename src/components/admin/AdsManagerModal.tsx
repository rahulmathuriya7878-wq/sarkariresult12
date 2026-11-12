import React, { useState } from 'react';
import { 
  X, 
  Save, 
  RotateCcw, 
  Check, 
  DollarSign, 
  Globe, 
  Layout, 
  ExternalLink,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';
import { 
  getAdsConfig, 
  saveAdsConfig, 
  AdsConfig, 
  DEFAULT_ADS_CONFIG 
} from '../../utils/adsConfig';

interface AdsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const AdsManagerModal: React.FC<AdsManagerModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [config, setConfig] = useState<AdsConfig>(getAdsConfig);
  const [activeTab, setActiveTab] = useState<'adspace' | 'adsense' | 'custom' | 'placements' | 'html'>('adspace');
  const [selectedPlacement, setSelectedPlacement] = useState<keyof AdsConfig['customBanners']>('homeTop');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    saveAdsConfig(config);
    setSavedSuccess(true);
    if (onShowToast) onShowToast('✅ Ad Settings & Placements Saved Successfully!');
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all Ad settings to default sponsored banners?')) {
      setConfig(DEFAULT_ADS_CONFIG);
      saveAdsConfig(DEFAULT_ADS_CONFIG);
      if (onShowToast) onShowToast('Ad settings reset to defaults.');
    }
  };

  const currentBanner = config.customBanners[selectedPlacement];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-md shadow-2xl border-2 border-slate-700 flex flex-col overflow-hidden text-slate-800">
        
        {/* Header Bar */}
        <div className="bg-[#ab1616] text-white px-4 py-3 flex items-center justify-between border-b border-red-950 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-400 text-slate-900 font-black flex items-center justify-center text-sm shadow-xs">
              📢
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide font-serif text-white flex items-center gap-2">
                <span>Google AdSense & Sponsored Ads Manager</span>
                <span className="bg-amber-300 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Ad Placements
                </span>
              </h2>
              <p className="text-[11px] text-amber-100 font-medium">
                Monetize your portal with Google AdSense, affiliate banners & sponsored promotions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Ad Toggle Switch */}
        <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
            <div>
              <span className="text-sm font-extrabold text-slate-900">
                Master Ads Switch: {config.enabled ? '🟢 Ads Active on Site' : '🔴 Ads Disabled'}
              </span>
              <p className="text-[11px] text-slate-500">
                Turn on/off all advertisements across the website with a single click
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-600 hover:text-red-700 font-bold px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-200 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-1.5 rounded shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved!' : 'Save & Publish Ads'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 pt-2 bg-slate-50 border-b border-slate-200 text-xs font-bold overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('adspace')}
            className={`px-3.5 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-colors ${
              activeTab === 'adspace'
                ? 'border-[#ab1616] text-[#ab1616] bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>1. Standard Ad Space (728×90 & 320×50)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('adsense')}
            className={`px-3.5 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-colors ${
              activeTab === 'adsense'
                ? 'border-[#ab1616] text-[#ab1616] bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>2. Google AdSense</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-colors ${
              activeTab === 'custom'
                ? 'border-[#ab1616] text-[#ab1616] bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>3. Sponsored Banners</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('placements')}
            className={`px-3.5 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-colors ${
              activeTab === 'placements'
                ? 'border-[#ab1616] text-[#ab1616] bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5 text-blue-600" />
            <span>4. Placements Control</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('html')}
            className={`px-3.5 py-2 border-b-2 cursor-pointer flex items-center gap-1.5 transition-colors ${
              activeTab === 'html'
                ? 'border-[#ab1616] text-[#ab1616] bg-white font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-slate-700" />
            <span>5. Custom HTML Code</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {/* TAB 1: STANDARD AD SPACE (728x90 & 320x50) */}
          {activeTab === 'adspace' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg flex items-start gap-2.5">
                <span className="text-xl">📢</span>
                <div className="text-xs text-amber-950 space-y-1">
                  <p className="font-bold">Standard Ad Space Banners (728×90 Desktop & 320×50 Mobile):</p>
                  <p>
                    All advertising zones across the website are calibrated to standard IAB/Google display ad dimensions. You can choose whether to display official <strong>"Ad Space Available"</strong> placeholder slots with advertiser booking buttons, or show <strong>Sponsored Promotional Banners</strong>.
                  </p>
                </div>
              </div>

              {/* Display Mode Selection Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                  Select Active Ad Presentation Mode:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setConfig({ ...config, adDisplayType: 'ad_space' })}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      config.adDisplayType === 'ad_space'
                        ? 'border-red-600 bg-red-50/60 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-900">
                        1. Ad Space (728×90 & 320×50)
                      </span>
                      {config.adDisplayType === 'ad_space' && (
                        <Check className="w-4 h-4 text-red-600 font-black" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Shows standard size badges (728×90 / 320×50), "विज्ञापन स्थान उपलब्ध", and direct booking CTA.
                    </p>
                    <span className="inline-block mt-2 text-[9px] bg-red-700 text-white font-bold px-1.5 py-0.5 rounded">
                      Active Default
                    </span>
                  </div>

                  <div
                    onClick={() => setConfig({ ...config, adDisplayType: 'sponsored' })}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      config.adDisplayType === 'sponsored'
                        ? 'border-red-600 bg-red-50/60 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-900">
                        2. Sponsored Banners
                      </span>
                      {config.adDisplayType === 'sponsored' && (
                        <Check className="w-4 h-4 text-red-600 font-black" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Shows custom mock tests, books, photo resizer, and WhatsApp/Telegram alerts.
                    </p>
                  </div>

                  <div
                    onClick={() => setConfig({ ...config, adDisplayType: 'adsense' })}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      config.adDisplayType === 'adsense'
                        ? 'border-red-600 bg-red-50/60 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-xs text-slate-900">
                        3. Google AdSense Live
                      </span>
                      {config.adDisplayType === 'adsense' && (
                        <Check className="w-4 h-4 text-red-600 font-black" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      Renders live Google AdSense tags with your configured Publisher & Slot IDs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advertiser Booking & Contact URL */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Advertiser Booking / Inquiry Link (WhatsApp / Contact URL):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.adContactUrl || ''}
                    onChange={(e) => setConfig({ ...config, adContactUrl: e.target.value.trim() })}
                    placeholder="https://whatsapp.com/channel/..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-red-600 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, adContactUrl: 'https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j' })}
                    className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded cursor-pointer shrink-0"
                  >
                    Reset WhatsApp
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  When visitors or prospective sponsors click "Book This Ad Space", they will be directed to this link.
                </p>
              </div>

              {/* Live Preview of Standard Ad Space Banners */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <span>👁️ Live Standard Ad Space Preview:</span>
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-mono font-bold px-2 py-0.5 rounded">
                    Responsive Auto-Switch
                  </span>
                </div>

                {/* Desktop 728x90 Preview */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    🖥️ Desktop Leaderboard View (728 × 90 px):
                  </span>
                  <div className="w-full rounded-2xl border border-slate-200/90 bg-[#f8fafc] p-4 flex flex-col items-center justify-start min-h-[140px]">
                    <div className="w-full text-center text-xs font-semibold text-[#64748b] tracking-wider uppercase select-none mb-3">
                      विज्ञापन (ADVERTISEMENT)
                    </div>
                    <div className="w-full flex-1 flex items-center justify-between gap-4 px-2">
                      <span className="text-xs font-bold text-slate-600">
                        728 × 90 Standard Responsive Leaderboard Slot
                      </span>
                      <button
                        type="button"
                        className="px-3.5 py-1.5 bg-[#ab1616] text-white text-xs font-bold rounded shadow-2xs"
                      >
                        Book This Ad Space
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile 320x50 Preview */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    📱 Mobile View (320 × 50 px):
                  </span>
                  <div className="max-w-[340px] rounded-2xl border border-slate-200/90 bg-[#f8fafc] p-3 flex flex-col items-center justify-start min-h-[100px]">
                    <div className="w-full text-center text-[11px] font-semibold text-[#64748b] tracking-wider uppercase select-none mb-2">
                      विज्ञापन (ADVERTISEMENT)
                    </div>
                    <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 px-1">
                      <span>320 × 50 Slot</span>
                      <span className="text-red-700">Book Ad →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE ADSENSE */}
          {activeTab === 'adsense' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-lg flex items-start gap-2.5">
                <span className="text-xl">💰</span>
                <div className="text-xs text-amber-950 space-y-1">
                  <p className="font-bold">Google AdSense Integration Guide:</p>
                  <p>
                    Enter your Google AdSense Publisher ID below (e.g. <code>ca-pub-1234567890123456</code>). The system will automatically inject the required official AdSense script into the website's head and render responsive ad units in all designated placements.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    Google AdSense Publisher ID (Client ID):
                  </label>
                  <input
                    type="text"
                    value={config.adSensePublisherId}
                    onChange={(e) => setConfig({ ...config, adSensePublisherId: e.target.value.trim() })}
                    placeholder="e.g. ca-pub-1234567890123456"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Available in your Google AdSense Console &gt; Account &gt; Settings &gt; Publisher ID.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Top Leaderboard Ad Slot ID:
                  </label>
                  <input
                    type="text"
                    value={config.adSenseSlots.leaderboard}
                    onChange={(e) => setConfig({
                      ...config,
                      adSenseSlots: { ...config.adSenseSlots, leaderboard: e.target.value.trim() }
                    })}
                    placeholder="e.g. 1234567890"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Slot ID for 728x90 Header Leaderboard.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mid-Content / In-Feed Ad Slot ID:
                  </label>
                  <input
                    type="text"
                    value={config.adSenseSlots.inContent}
                    onChange={(e) => setConfig({
                      ...config,
                      adSenseSlots: { ...config.adSenseSlots, inContent: e.target.value.trim() }
                    })}
                    placeholder="e.g. 2345678901"
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Slot ID for in-between table and post sections.
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs text-slate-600">
                <strong>Status:</strong> {config.adSensePublisherId ? (
                  <span className="text-emerald-700 font-bold ml-1">
                    ✓ Google AdSense is linked to {config.adSensePublisherId}
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium ml-1">
                    No AdSense ID set. Website will show high-converting Sponsored Banners as authentic fallback.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CUSTOM SPONSORED BANNERS */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
                <span className="text-slate-500 shrink-0">Placement:</span>
                {[
                  { key: 'homeTop', label: '1. Home Top Leaderboard' },
                  { key: 'homeMid', label: '2. Home Mid Grid' },
                  { key: 'postTop', label: '3. Post Top (Under Title)' },
                  { key: 'postMid', label: '4. Post Mid (Above Links)' },
                  { key: 'postBottom', label: '5. Post Bottom' }
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedPlacement(item.key as any)}
                    className={`px-3 py-1.5 rounded-full border cursor-pointer shrink-0 transition-colors ${
                      selectedPlacement === item.key
                        ? 'bg-red-700 text-white border-red-800 font-extrabold shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Banner Editing Form */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Banner Headline / Title:
                    </label>
                    <input
                      type="text"
                      value={currentBanner.title}
                      onChange={(e) => {
                        const updated = { ...currentBanner, title: e.target.value };
                        setConfig({
                          ...config,
                          customBanners: { ...config.customBanners, [selectedPlacement]: updated }
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-bold focus:outline-none focus:border-red-600 bg-white"
                      placeholder="e.g. 🎯 Free All India Mock Test Series 2026"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Banner Subtitle / Description:
                    </label>
                    <textarea
                      rows={2}
                      value={currentBanner.subtitle}
                      onChange={(e) => {
                        const updated = { ...currentBanner, subtitle: e.target.value };
                        setConfig({
                          ...config,
                          customBanners: { ...config.customBanners, [selectedPlacement]: updated }
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-red-600 bg-white"
                      placeholder="Description of the offer, alert, or service..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Badge Text (e.g. SPONSORED, OFFICIAL, NEW):
                    </label>
                    <input
                      type="text"
                      value={currentBanner.badge || ''}
                      onChange={(e) => {
                        const updated = { ...currentBanner, badge: e.target.value };
                        setConfig({
                          ...config,
                          customBanners: { ...config.customBanners, [selectedPlacement]: updated }
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-red-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Button Label:
                    </label>
                    <input
                      type="text"
                      value={currentBanner.buttonText}
                      onChange={(e) => {
                        const updated = { ...currentBanner, buttonText: e.target.value };
                        setConfig({
                          ...config,
                          customBanners: { ...config.customBanners, [selectedPlacement]: updated }
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-red-600 bg-white"
                      placeholder="e.g. Start Free Test Online"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Click URL:
                    </label>
                    <input
                      type="text"
                      value={currentBanner.linkUrl}
                      onChange={(e) => {
                        const updated = { ...currentBanner, linkUrl: e.target.value };
                        setConfig({
                          ...config,
                          customBanners: { ...config.customBanners, [selectedPlacement]: updated }
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-red-600 bg-white"
                      placeholder="https://t.me/newsarkariresultt"
                    />
                  </div>
                </div>

                {/* Live Preview of Selected Banner */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    👁️ Live Banner Preview:
                  </span>
                  <div className="group relative bg-gradient-to-r from-amber-50 via-white to-red-50 border border-amber-300/80 rounded p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {currentBanner.badge && (
                          <span className="bg-red-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            {currentBanner.badge}
                          </span>
                        )}
                        <h4 className="font-black text-sm text-slate-900 leading-tight">
                          {currentBanner.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600">
                        {currentBanner.subtitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 text-white font-extrabold text-xs rounded shadow-xs shrink-0"
                    >
                      <span>{currentBanner.buttonText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLACEMENTS CONTROL */}
          {activeTab === 'placements' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Choose exactly where advertisements should appear across your Sarkari Result website:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'homeLeaderboard', label: '1. Home Top Leaderboard (Under Header / Live Ribbon)' },
                  { key: 'homeMidGrid', label: '2. Home Mid Grid (Between Results and Admit Cards)' },
                  { key: 'postTop', label: '3. Individual Post Top (Directly under Post Details Table)' },
                  { key: 'postMidLinks', label: '4. Individual Post Mid (Above Official Important Links)' },
                  { key: 'postBottom', label: '5. Individual Post Bottom (Above FAQs & Footer)' }
                ].map((item) => {
                  const pKey = item.key as keyof AdsConfig['placements'];
                  const isChecked = config.placements[pKey];
                  return (
                    <label 
                      key={item.key}
                      className={`p-3.5 border rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-red-50/50 border-red-300' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setConfig({
                          ...config,
                          placements: { ...config.placements, [pKey]: e.target.checked }
                        })}
                        className="w-4 h-4 text-red-600 rounded cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOM HTML / 3RD-PARTY AD CODE */}
          {activeTab === 'html' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Paste 3rd-Party Ad Network JavaScript or HTML Embed Code:
              </label>
              <textarea
                rows={6}
                value={config.customHtmlCode || ''}
                onChange={(e) => setConfig({ ...config, customHtmlCode: e.target.value })}
                placeholder="<script async src='...'></script><ins ...></ins>"
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-xs focus:ring-2 focus:ring-red-600 focus:outline-none bg-slate-900 text-emerald-400"
              />
              <p className="text-[11px] text-slate-500">
                Supports Media.net, Ezoic, PropellerAds, or raw AdSense tags. If empty, the website renders the custom sponsored creatives.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-4 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Apply Ad Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
};

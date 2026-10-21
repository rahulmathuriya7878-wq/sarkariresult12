import React from 'react';

interface AdsenseBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export const AdsenseBanner: React.FC<AdsenseBannerProps> = ({
  slotId = '1234567890',
  format = 'auto',
  className = ''
}) => {
  return (
    <div className={`my-4 p-2 bg-slate-50 border border-slate-200 rounded text-center overflow-hidden ${className}`}>
      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
        Advertisement / विज्ञापन
      </div>
      <div className="min-h-[90px] flex items-center justify-center bg-white border border-dashed border-slate-300 rounded text-xs text-slate-500 p-4">
        <div className="space-y-1">
          <p className="font-semibold text-slate-600">Google AdSense Ad Slot ({format})</p>
          <p className="text-[11px] text-slate-400">Publisher ID: ca-pub-XXXXXXXXXXXXXXXX (Slot: {slotId})</p>
        </div>
      </div>
    </div>
  );
};

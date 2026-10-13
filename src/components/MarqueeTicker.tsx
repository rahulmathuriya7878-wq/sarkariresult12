import React from 'react';
import { trendingAlerts } from '../data/mockJobs';

interface MarqueeTickerProps {
  onSelectAlert: (slug: string) => void;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ onSelectAlert }) => {
  return (
    <div className="w-full bg-[#f8f9fa] border-b border-slate-300 py-1.5 px-2 overflow-hidden text-xs">
      <div className="flex items-center">
        {/* Sarkari Result iconic moving ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap flex items-center gap-2 text-slate-900 font-bold">
          {trendingAlerts.concat(trendingAlerts).map((alert, idx) => (
            <React.Fragment key={`${alert.id}-${idx}`}>
              <button
                onClick={() => onSelectAlert(alert.slug)}
                className="hover:text-[#ab1616] text-[#0000cc] transition-colors cursor-pointer text-xs font-bold inline-block hover:underline"
              >
                {alert.title}
              </button>
              <span className="text-red-700 font-black px-1">||</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

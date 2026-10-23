import React, { useState } from 'react';

interface MarqueeTickerProps {
  onSelectAlert: (slug: string) => void;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({ onSelectAlert }) => {
  const [pausedLine1, setPausedLine1] = useState(false);
  const [pausedLine2, setPausedLine2] = useState(false);
  const [pausedLine3, setPausedLine3] = useState(false);

  const line1Items = [
    { title: 'Army TGC 145 Online Form 2026', slug: 'army-tgc-145-online-form-2026' },
    { title: 'UP Assistant Teacher Primary Super TET Online Form 2026', slug: 'upessc-up-primary-teacher-super-tet-2026' },
    { title: 'UP PGT Teacher Online Form 2026', slug: 'upessc-up-pgt-teacher-online-form-2026' },
  ];

  const line2Items = [
    { title: 'Railway NTPC 10+2 Level Online Form 2026', slug: 'rrb-ntpc-12th-level-recruitment-2026' },
    { title: 'MPESB Sub Engineer Online Form 2026', slug: 'mpesb-sub-engineer-online-form-2026' },
    { title: 'Sarkari Result Outsourcing Jobs', slug: 'up-outsourcing-offline-jobs-2026' },
  ];

  const line3Items = [
    { title: 'Railway Paramedical Post Online Form 2026', slug: 'rrb-paramedical-cen-05-2026' },
    { title: 'UP Anganwadi Helper Online Form 2026', slug: 'up-anganwadi-worker-bharti-2026' },
    { title: 'RRB NTPC Graduate Level Online Form', slug: 'rrb-ntpc-graduate-level-online-form-2026' },
  ];

  return (
    <div className="w-full bg-[#fefefe] border-b border-slate-300 py-1.5 px-2 text-center space-y-1 font-headlight">
      {/* Line 1 Marquee */}
      <div 
        className="overflow-hidden whitespace-nowrap cursor-pointer text-[12pt] font-bold py-0.5"
        onMouseEnter={() => setPausedLine1(true)}
        onMouseLeave={() => setPausedLine1(false)}
      >
        <div className={`inline-block animate-marquee ${pausedLine1 ? '[animation-play-state:paused]' : ''}`}>
          {line1Items.map((item, idx) => (
            <React.Fragment key={idx}>
              <button
                onClick={() => onSelectAlert(item.slug)}
                className="hover:text-[#ab1616] text-[#0000cc] font-bold hover:underline px-2 cursor-pointer text-[12pt]"
              >
                {item.title}
              </button>
              {idx < line1Items.length - 1 && <span className="text-red-700 font-black px-1.5">||</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Line 2 Marquee */}
      <div 
        className="overflow-hidden whitespace-nowrap cursor-pointer text-[12pt] font-bold py-0.5"
        onMouseEnter={() => setPausedLine2(true)}
        onMouseLeave={() => setPausedLine2(false)}
      >
        <div className={`inline-block animate-marquee ${pausedLine2 ? '[animation-play-state:paused]' : ''}`}>
          {line2Items.map((item, idx) => (
            <React.Fragment key={idx}>
              <button
                onClick={() => onSelectAlert(item.slug)}
                className="hover:text-[#ab1616] text-[#0000cc] font-bold hover:underline px-2 cursor-pointer text-[12pt]"
              >
                {item.title}
              </button>
              {idx < line2Items.length - 1 && <span className="text-red-700 font-black px-1.5">||</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Line 3 Marquee */}
      <div 
        className="overflow-hidden whitespace-nowrap cursor-pointer text-[12pt] font-bold py-0.5"
        onMouseEnter={() => setPausedLine3(true)}
        onMouseLeave={() => setPausedLine3(false)}
      >
        <div className={`inline-block animate-marquee ${pausedLine3 ? '[animation-play-state:paused]' : ''}`}>
          {line3Items.map((item, idx) => (
            <React.Fragment key={idx}>
              <button
                onClick={() => onSelectAlert(item.slug)}
                className="hover:text-[#ab1616] text-[#0000cc] font-bold hover:underline px-2 cursor-pointer text-[12pt]"
              >
                {item.title}
              </button>
              {idx < line3Items.length - 1 && <span className="text-red-700 font-black px-1.5">||</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

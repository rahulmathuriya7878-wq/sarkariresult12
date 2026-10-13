import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Download, Upload, RefreshCw, X, Check, ShieldAlert } from 'lucide-react';

interface PhotoResizerToolProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoResizerTool: React.FC<PhotoResizerToolProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<'ssc_photo' | 'ssc_sig' | 'upsc_photo' | 'custom'>('ssc_photo');
  const [candidateName, setCandidateName] = useState<string>('RAHUL KUMAR');
  const [photoDate, setPhotoDate] = useState<string>('11-10-2026');
  const [includeDateStamp, setIncludeDateStamp] = useState<boolean>(true);
  const [quality, setQuality] = useState<number>(0.85);
  const [targetKb, setTargetKb] = useState<number>(35);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [outputBlobUrl, setOutputBlobUrl] = useState<string | null>(null);
  const [outputFileSizeKb, setOutputFileSizeKb] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 350, height: 450 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Default placeholder image generator (avatar silhouette)
  useEffect(() => {
    if (!imageSrc) {
      // Create a default passport-sized silhouette preview
      const canvas = document.createElement('canvas');
      canvas.width = 350;
      canvas.height = 450;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 350, 450);

        // Gradient body
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(175, 180, 75, 0, Math.PI * 2);
        ctx.fill();

        // Torso
        ctx.beginPath();
        ctx.ellipse(175, 390, 130, 140, 0, 0, Math.PI * 2);
        ctx.fill();

        setImageSrc(canvas.toDataURL('image/jpeg', 0.9));
      }
    }
  }, []);

  // Update preset settings
  useEffect(() => {
    if (selectedPreset === 'ssc_photo') {
      setDimensions({ width: 350, height: 450 });
      setTargetKb(35);
      setIncludeDateStamp(false);
    } else if (selectedPreset === 'ssc_sig') {
      setDimensions({ width: 400, height: 200 });
      setTargetKb(15);
      setIncludeDateStamp(false);
    } else if (selectedPreset === 'upsc_photo') {
      setDimensions({ width: 350, height: 450 });
      setTargetKb(40);
      setIncludeDateStamp(true);
    }
  }, [selectedPreset]);

  // Redraw canvas and calculate size
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw source image fit/crop
      const hAvailable = includeDateStamp ? dimensions.height - 65 : dimensions.height;
      
      // Calculate aspect ratio crop
      const imgRatio = img.width / img.height;
      const targetRatio = dimensions.width / hAvailable;
      
      let sw = img.width;
      let sh = img.height;
      let sx = 0;
      let sy = 0;

      if (imgRatio > targetRatio) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dimensions.width, hAvailable);

      // Stamping Name and Date at bottom (Govt format)
      if (includeDateStamp && candidateName) {
        const stripHeight = 65;
        const stripY = dimensions.height - stripHeight;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, stripY, dimensions.width, stripHeight);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, stripY, dimensions.width, stripHeight);

        // Text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(candidateName.toUpperCase(), dimensions.width / 2, stripY + 22);

        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`D.O.P: ${photoDate}`, dimensions.width / 2, stripY + 45);
      }

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          if (outputBlobUrl) {
            URL.revokeObjectURL(outputBlobUrl);
          }
          const url = URL.createObjectURL(blob);
          setOutputBlobUrl(url);
          setOutputFileSizeKb(Math.round((blob.size / 1024) * 10) / 10);
        }
      }, 'image/jpeg', quality);
    };
  }, [imageSrc, dimensions, includeDateStamp, candidateName, photoDate, quality]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadProcessedImage = () => {
    if (!outputBlobUrl) return;
    const a = document.createElement('a');
    a.href = outputBlobUrl;
    const prefix = selectedPreset === 'ssc_sig' ? 'sarkari_signature' : 'sarkari_passport_photo';
    a.download = `${prefix}_${dimensions.width}x${dimensions.height}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold tracking-tight">Sarkari Photo & Signature Resizer (फोटो व हस्ताक्षर रिसाइज़र)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Exam Format Preset
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'ssc_photo', label: 'SSC Photo', detail: '20-50 KB · 3.5×4.5 cm' },
                { id: 'upsc_photo', label: 'UPSC / Police Photo', detail: 'With Name & Date Strip' },
                { id: 'ssc_sig', label: 'Signature', detail: '10-20 KB · White BG' },
                { id: 'custom', label: 'Custom Resize', detail: 'User Specified' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    selectedPreset === preset.id
                      ? 'border-red-700 bg-red-50 ring-1 ring-red-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900">{preset.label}</div>
                  <div className="text-[11px] text-slate-500">{preset.detail}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Workspace Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Controls */}
            <div className="space-y-4">
              {/* File Upload Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md border border-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  Choose Photo / Signature File from Computer
                </button>
                <p className="text-[11px] text-slate-500 mt-1">Supports JPG, JPEG, PNG formats.</p>
              </div>

              {/* Name and Date Stamping options */}
              {selectedPreset !== 'ssc_sig' && (
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800">
                      Print Name & Date on Photo (नाम व तारीख पट्टी)
                    </label>
                    <input
                      type="checkbox"
                      checked={includeDateStamp}
                      onChange={(e) => setIncludeDateStamp(e.target.checked)}
                      className="w-4 h-4 text-red-700 rounded-sm focus:ring-red-600"
                    />
                  </div>

                  {includeDateStamp && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Candidate Name</label>
                        <input
                          type="text"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="e.g. RAHUL KUMAR"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-sm uppercase focus:ring-1 focus:ring-red-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date of Photo (DOP)</label>
                        <input
                          type="text"
                          value={photoDate}
                          onChange={(e) => setPhotoDate(e.target.value)}
                          placeholder="DD-MM-YYYY"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-sm focus:ring-1 focus:ring-red-700"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quality & File Size Adjuster */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">File Compression Quality</span>
                  <span className="font-mono text-slate-600">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-red-700"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Lower KB (Smaller)</span>
                  <span>Higher Quality (Sharper)</span>
                </div>
              </div>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Live Output Preview
              </span>
              
              {/* Canvas hidden or visible */}
              <div className="relative border-2 border-slate-300 shadow-xs bg-white max-h-[300px] overflow-hidden rounded-xs flex items-center justify-center">
                <canvas ref={canvasRef} className="max-h-[280px] w-auto object-contain" />
              </div>

              {/* Output File Specs */}
              {outputFileSizeKb !== null && (
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 rounded-full text-xs font-bold text-slate-800 shadow-2xs">
                    <span>Target Size:</span>
                    <span className="text-emerald-700 font-mono text-sm">{outputFileSizeKb} KB</span>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    {dimensions.width}px × {dimensions.height}px (JPG)
                  </p>
                </div>
              )}

              {/* Download Action */}
              <button
                type="button"
                onClick={downloadProcessedImage}
                disabled={!outputBlobUrl}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Formatted JPG ({outputFileSizeKb} KB)
              </button>
            </div>
          </div>

          {/* Guidelines Banner */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Official Exam Guidelines Notice:</p>
              <p>For SSC, UP Police and Railway exams, ensure that eyes are clearly visible, ears are not covered, caps or dark spectacles are not worn, and the background is light/white.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
          <span className="text-[11px] text-slate-500 font-medium">
            100% Client-Side Processing · No photos uploaded to external servers
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

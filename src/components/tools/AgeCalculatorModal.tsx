import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle2, XCircle, Calculator, X, Sparkles } from 'lucide-react';

interface AgeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExam?: (slug: string) => void;
}

export const AgeCalculatorModal: React.FC<AgeCalculatorModalProps> = ({ isOpen, onClose }) => {
  // Default values
  const [dob, setDob] = useState<string>('2002-05-15');
  const [asOnDate, setAsOnDate] = useState<string>('2026-08-01');
  const [selectedCategory, setSelectedCategory] = useState<'GEN' | 'OBC' | 'SC_ST' | 'PWD'>('GEN');

  const ageData = useMemo(() => {
    if (!dob || !asOnDate) return null;

    const birth = new Date(dob);
    const target = new Date(asOnDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || target < birth) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next birthday calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      daysToNextBday,
      exactDecimalAge: (years + months / 12 + days / 365).toFixed(2)
    };
  }, [dob, asOnDate]);

  // Exam eligibility presets with relaxation rules
  const examRules = [
    {
      name: 'UPSC Civil Services (IAS / IPS)',
      min: 21,
      max: 32,
      maxRelaxed: { GEN: 32, OBC: 35, SC_ST: 37, PWD: 42 }
    },
    {
      name: 'SSC CGL (Combined Graduate Level)',
      min: 18,
      max: 32,
      maxRelaxed: { GEN: 32, OBC: 35, SC_ST: 37, PWD: 42 }
    },
    {
      name: 'Railway RRB NTPC (Graduate/UG)',
      min: 18,
      max: 36,
      maxRelaxed: { GEN: 36, OBC: 39, SC_ST: 41, PWD: 46 }
    },
    {
      name: 'UP Police Constable',
      min: 18,
      max: 25,
      maxRelaxed: { GEN: 25, OBC: 28, SC_ST: 30, PWD: 25 }
    },
    {
      name: 'SSC GD Constable (CAPFs)',
      min: 18,
      max: 23,
      maxRelaxed: { GEN: 23, OBC: 26, SC_ST: 28, PWD: 23 }
    },
    {
      name: 'Banking IBPS PO / Clerk',
      min: 20,
      max: 30,
      maxRelaxed: { GEN: 30, OBC: 33, SC_ST: 35, PWD: 40 }
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold tracking-tight">Sarkari Age Calculator (सरकारी उम्र कैलकुलेटर)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date of Birth (जन्म तिथि)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-700 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Age as on Date (इस तारीख तक उम्र)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={asOnDate}
                  onChange={(e) => setAsOnDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-700 font-mono"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Reservation Category (आयु सीमा में छूट हेतु श्रेणी)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'GEN', label: 'General / EWS (No Extra)' },
                  { id: 'OBC', label: 'OBC (+3 Yrs)' },
                  { id: 'SC_ST', label: 'SC / ST (+5 Yrs)' },
                  { id: 'PWD', label: 'PwD / PH (+10 Yrs)' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`py-1.5 px-2 text-xs font-medium rounded-md border text-center transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-red-700 text-white border-red-700 font-semibold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Age Result Display */}
          {ageData ? (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <span className="text-xs uppercase font-bold tracking-wider text-red-800 block mb-1">
                  Your Exact Calculated Age
                </span>
                <div className="text-2xl md:text-3xl font-extrabold text-red-900 tracking-tight">
                  <span className="text-red-700">{ageData.years}</span> Years,{' '}
                  <span className="text-red-700">{ageData.months}</span> Months,{' '}
                  <span className="text-red-700">{ageData.days}</span> Days
                </div>
                <p className="text-xs text-slate-600 mt-1 font-mono">
                  {ageData.totalMonths} months · {ageData.totalWeeks} weeks · {ageData.totalDays.toLocaleString()} days
                </p>
              </div>

              {/* Exam Eligibility Matrix */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Exam Eligibility Status for {selectedCategory} Category
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100 text-xs">
                  {examRules.map((exam) => {
                    const maxAllowed = exam.maxRelaxed[selectedCategory];
                    const isMinOk = ageData.years >= exam.min;
                    const isMaxOk = (ageData.years < maxAllowed) || (ageData.years === maxAllowed && ageData.months === 0 && ageData.days === 0);
                    const isEligible = isMinOk && isMaxOk;

                    return (
                      <div key={exam.name} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50">
                        <div>
                          <div className="font-semibold text-slate-900">{exam.name}</div>
                          <div className="text-slate-500 text-[11px]">
                            Age Limit: {exam.min} to {maxAllowed} Years ({selectedCategory})
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isEligible ? (
                            <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                              Eligible (योग्य)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-medium">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              {ageData.years < exam.min ? 'Under Age' : 'Over Age'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs text-center">
              Please enter a valid Date of Birth earlier than the Cut-off date.
            </div>
          )}

          {/* Tips */}
          <div className="bg-slate-50 border-t border-slate-200 p-3 rounded-md text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">📌 Important Note for Govt Exams:</p>
            <p>1. Always check the exact cutoff date specified in the official notification advertisement (e.g. 01/01/2026 or 01/08/2026).</p>
            <p>2. Age proof accepted is usually Matriculation (10th standard) certificate marksheet.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { SarkariPost, Qualification } from '../../types/job';
import { Sparkles, X, Check, ArrowRight, Filter, Briefcase } from 'lucide-react';

interface EligibilityMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
}

export const EligibilityMatcherModal: React.FC<EligibilityMatcherModalProps> = ({
  isOpen,
  onClose,
  posts,
  onSelectPost
}) => {
  const [selectedQual, setSelectedQual] = useState<Qualification | 'All'>('Graduate');
  const [candidateAge, setCandidateAge] = useState<number>(23);
  const [selectedCat, setSelectedCat] = useState<'GEN' | 'OBC' | 'SC' | 'ST'>('GEN');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const matchingPosts = useMemo(() => {
    return posts.filter((p) => {
      // Must be latest_jobs
      if (p.category !== 'latest_jobs') return false;

      // Check qualification
      if (selectedQual !== 'All' && !p.qualifications.includes(selectedQual)) {
        return false;
      }

      // Check department
      if (selectedDept !== 'All' && p.department !== selectedDept) {
        return false;
      }

      // Check age if age limit defined
      if (p.ageLimit) {
        let maxAllowed = p.ageLimit.maxAge || 40;
        // Age relaxation
        if (selectedCat === 'OBC') maxAllowed += 3;
        if (selectedCat === 'SC' || selectedCat === 'ST') maxAllowed += 5;

        const minAllowed = p.ageLimit.minAge || 18;
        if (candidateAge < minAllowed || candidateAge > maxAllowed) {
          return false;
        }
      }

      return true;
    });
  }, [posts, selectedQual, candidateAge, selectedCat, selectedDept]);

  if (!isOpen) return null;

  const qualificationsList: (Qualification | 'All')[] = [
    'All',
    '10th Pass',
    '12th Pass',
    'Graduate',
    'Post Graduate',
    'Diploma / ITI',
    'B.Tech / BE',
    'B.Ed / CTET'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold tracking-tight">
              Sarkari Job Finder / योग्यता अनुसार सरकारी नौकरी
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Filter Controls Bar */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Your Highest Qualification (आपकी शैक्षणिक योग्यता)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {qualificationsList.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setSelectedQual(q)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      selectedQual === q
                        ? 'bg-red-800 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  2. Your Age: <span className="text-red-700 font-mono">{candidateAge} Yrs</span>
                </label>
                <input
                  type="range"
                  min="16"
                  max="45"
                  value={candidateAge}
                  onChange={(e) => setCandidateAge(parseInt(e.target.value))}
                  className="w-full accent-red-700"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  3. Category (वर्ग)
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['GEN', 'OBC', 'SC', 'ST'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCat(cat)}
                      className={`py-1 text-xs font-semibold rounded text-center border cursor-pointer ${
                        selectedCat === cat
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  4. Preferred Sector
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full text-xs py-1.5 px-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-red-700"
                >
                  <option value="All">All Sectors</option>
                  <option value="UPSC">UPSC</option>
                  <option value="SSC">SSC</option>
                  <option value="Railway">Railway</option>
                  <option value="Police">Police</option>
                  <option value="Defence">Defence / Armed Forces</option>
                  <option value="Banking">Banking</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result Count Banner */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
            <span>Found <strong>{matchingPosts.length}</strong> Matching Active Vacancies for your profile:</span>
            <span className="text-emerald-700 font-mono">Age: {candidateAge} · {selectedCat} · {selectedQual}</span>
          </div>

          {/* Matching Vacancies List */}
          <div className="space-y-2">
            {matchingPosts.length > 0 ? (
              matchingPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    onSelectPost(post);
                    onClose();
                  }}
                  className="p-3.5 bg-white border border-slate-200 hover:border-red-600 rounded-lg shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded">
                        {post.department}
                      </span>
                      {post.totalVacancies && (
                        <span className="text-[11px] font-semibold text-slate-600">
                          {post.totalVacancies} Vacancies
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-700 transition-colors">
                      {post.title}
                    </h3>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>Last Date: <strong className="text-slate-700">{post.lastDate || 'Check Notification'}</strong></span>
                      <span>·</span>
                      <span>Eligible: {post.qualifications.join(', ')}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
                    <span>View Post</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
                <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="font-semibold text-slate-700 text-sm">No vacancies found for this combination</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try switching qualification to "All" or adjusting the age slider.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Close Finder
          </button>
        </div>
      </div>
    </div>
  );
};

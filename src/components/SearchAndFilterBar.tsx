import React from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Department, Qualification, PostCategory } from '../types/job';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDept: Department | 'All';
  onDeptChange: (dept: Department | 'All') => void;
  selectedQual: Qualification | 'All';
  onQualChange: (qual: Qualification | 'All') => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDept,
  onDeptChange,
  selectedQual,
  onQualChange,
  selectedState,
  onStateChange,
  onResetFilters,
  totalFilteredCount
}) => {
  const departments: (Department | 'All')[] = [
    'All',
    'SSC',
    'UPSC',
    'Railway',
    'Police',
    'Defence',
    'Banking',
    'Teaching',
    'State PSC'
  ];

  const qualifications: (Qualification | 'All')[] = [
    'All',
    '10th Pass',
    '12th Pass',
    'Graduate',
    'Diploma / ITI',
    'B.Ed / CTET'
  ];

  const states = [
    'All States',
    'Uttar Pradesh',
    'Bihar',
    'Rajasthan',
    'Madhya Pradesh',
    'Delhi'
  ];

  const hasActiveFilters = searchQuery !== '' || selectedDept !== 'All' || selectedQual !== 'All' || selectedState !== 'All States';

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-3 sm:p-4 shadow-2xs space-y-3 mb-6">
      {/* Search Input Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Exam, Post, Department, Admit Card, Result (e.g. SSC CGL, UPSC, Railway, 60244, Constable)..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-700 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* State Dropdown */}
        <div className="sm:w-44 shrink-0">
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full py-2 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-red-700 font-medium text-slate-700"
          >
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Quick Sector Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        <span className="text-slate-500 font-semibold shrink-0 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Sector:
        </span>
        {departments.map((dept) => (
          <button
            key={dept}
            type="button"
            onClick={() => onDeptChange(dept)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              selectedDept === dept
                ? 'bg-red-800 text-white font-bold shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Qualification Filter Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-500 font-semibold shrink-0 mr-1">
          Qualification:
        </span>
        {qualifications.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onQualChange(q)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              selectedQual === q
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Search, X, IndianRupee, MapPin } from 'lucide-react';
import { Department, Qualification, SalaryBand } from '../types/job';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDept?: Department | 'All';
  onDeptChange?: (dept: Department | 'All') => void;
  selectedQual?: Qualification | 'All';
  onQualChange?: (qual: Qualification | 'All') => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedSalary: SalaryBand;
  onSalaryChange: (salary: SalaryBand) => void;
  onResetFilters: () => void;
  totalFilteredCount?: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedState,
  onStateChange,
  selectedSalary,
  onSalaryChange,
  onResetFilters,
  totalFilteredCount
}) => {
  const states = [
    'All States',
    'Rajasthan',
    'Uttar Pradesh',
    'Bihar',
    'Madhya Pradesh',
    'Delhi'
  ];

  const salaryBands: { label: string; value: SalaryBand }[] = [
    { label: 'All Salaries (सभी वेतनमान)', value: 'All' },
    { label: 'Below ₹25,000 / mo (< ₹25K)', value: 'Below 25K' },
    { label: '₹25,000 - ₹50,000 / mo (25K - 50K)', value: '25K - 50K' },
    { label: '₹50,000 - ₹1,00,000 / mo (50K - 1L)', value: '50K - 1 Lakh' },
    { label: 'Above ₹1,00,000 / mo (> ₹1 Lakh)', value: 'Above 1 Lakh' },
  ];

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedState !== 'All States' || 
    selectedSalary !== 'All';

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-3 sm:p-4 shadow-2xs space-y-3 mb-6">
      {/* Search Input & Dropdowns Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Exam, Post, Department, RUHS, Rajasthan, CET, Police..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-red-700 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* State Filter Dropdown */}
        <div className="sm:w-44 shrink-0 relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full py-2 pl-8 pr-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-red-700 font-medium text-slate-700 cursor-pointer"
            title="Filter by State"
          >
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Salary Range Filter Dropdown */}
        <div className="sm:w-56 shrink-0 relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedSalary}
            onChange={(e) => onSalaryChange(e.target.value as SalaryBand)}
            className="w-full py-2 pl-8 pr-2.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:ring-1 focus:ring-red-700 font-medium text-slate-700 cursor-pointer"
            title="Filter by Salary Range"
          >
            {salaryBands.map((band) => (
              <option key={band.value} value={band.value}>
                {band.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 border border-red-200 rounded-md transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer"
            title="Clear all filters"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700">Active Filters:</span>
            {searchQuery && (
              <span className="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                Keyword: "{searchQuery}"
                <button onClick={() => onSearchChange('')} className="hover:text-red-950 cursor-pointer">×</button>
              </span>
            )}
            {selectedState !== 'All States' && (
              <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                State: {selectedState}
                <button onClick={() => onStateChange('All States')} className="hover:text-blue-950 cursor-pointer">×</button>
              </span>
            )}
            {selectedSalary !== 'All' && (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1">
                Salary: {selectedSalary}
                <button onClick={() => onSalaryChange('All')} className="hover:text-emerald-950 cursor-pointer">×</button>
              </span>
            )}
          </div>
          {typeof totalFilteredCount === 'number' && (
            <span className="font-bold text-slate-700">
              Matching Jobs: <span className="text-[#ab1616] font-black">{totalFilteredCount}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

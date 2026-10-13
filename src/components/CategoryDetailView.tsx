import React from 'react';
import { SarkariPost, PostCategory } from '../types/job';
import { ArrowLeft, Calendar, Building, GraduationCap, ChevronRight } from 'lucide-react';

interface CategoryDetailViewProps {
  category: PostCategory;
  posts: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onBackToHome: () => void;
  isHindi: boolean;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category,
  posts,
  onSelectPost,
  onBackToHome,
  isHindi
}) => {
  const getCategoryTitle = (cat: PostCategory) => {
    switch (cat) {
      case 'result':
        return isHindi ? 'सरकारी रिजल्ट (Results)' : 'Govt Exam Results (सरकारी रिजल्ट)';
      case 'admit_card':
        return isHindi ? 'प्रवेश पत्र (Admit Card)' : 'Admit Cards & Hall Tickets (प्रवेश पत्र)';
      case 'latest_jobs':
        return isHindi ? 'सरकारी नौकरी (Latest Jobs)' : 'Latest Government Jobs 2026 (सरकारी नौकरी)';
      case 'answer_key':
        return isHindi ? 'उत्तर कुंजी (Answer Key)' : 'Official Exam Answer Keys (उत्तर कुंजी)';
      case 'syllabus':
        return isHindi ? 'परीक्षा पाठ्यक्रम (Syllabus)' : 'Exam Syllabus & Exam Patterns';
      case 'admission':
        return isHindi ? 'प्रवेश सूचना (Admissions)' : 'College & University Admissions 2026';
      case 'certificate_verification':
        return isHindi ? 'प्रमाण पत्र सत्यापन' : 'Certificate Verification & Online Services';
      default:
        return 'All Notifications';
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Header bar */}
      <div className="bg-[#ab1616] text-white p-3.5 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-yellow-300 hover:text-white font-bold mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Main Portal (मुख्य पृष्ठ)</span>
          </button>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-wide uppercase">
            {getCategoryTitle(category)}
          </h2>
        </div>
        <div className="text-xs text-red-100 font-mono bg-black/20 px-3 py-1.5 rounded self-start sm:self-auto">
          Total {posts.length} Active Listings
        </div>
      </div>

      {/* Grid listing */}
      <div className="bg-white border-2 border-[#ab1616] rounded-xs overflow-hidden shadow-xs divide-y divide-slate-100">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="p-3 sm:p-4 hover:bg-red-50/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-[#ab1616] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                  {post.department}
                </span>
                <span className="text-slate-500">Post Date: {post.postDate}</span>
                {post.state && (
                  <span className="text-slate-400">· {post.state}</span>
                )}
              </div>

              <h3 className="font-bold text-sm sm:text-base text-[#0000cc] group-hover:text-[#ab1616] group-hover:underline transition-colors">
                {post.title}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                {post.totalVacancies && (
                  <span className="font-semibold text-emerald-700">
                    {post.totalVacancies} Posts
                  </span>
                )}
                {post.lastDate && (
                  <span className="font-semibold text-red-600">
                    Last Date: {post.lastDate}
                  </span>
                )}
                {post.qualifications.length > 0 && (
                  <span className="text-slate-500">
                    Eligibility: {post.qualifications.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            No entries found in this category matching current filters.
          </div>
        )}
      </div>
    </div>
  );
};

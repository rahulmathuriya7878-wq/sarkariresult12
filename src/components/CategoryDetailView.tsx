import React from 'react';
import { SarkariPost, PostCategory } from '../types/job';
import { ArrowLeft, ChevronRight } from 'lucide-react';

interface CategoryDetailViewProps {
  category: PostCategory;
  posts: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onBackToHome: () => void;
  isHindi: boolean;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  category: _category,
  posts,
  onSelectPost,
  onBackToHome: _onBackToHome,
  isHindi: _isHindi
}) => {
  return (
    <div className="space-y-3 mb-8">
      {/* Grid listing */}
      <div className="bg-white border-2 border-slate-800 rounded-xs overflow-hidden shadow-xs divide-y divide-slate-100">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="p-3 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                  {post.department}
                </span>
                <span className="text-slate-500">Post Date: {post.postDate}</span>
                {post.state && (
                  <span className="text-slate-400">· {post.state}</span>
                )}
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-[#0000cc] group-hover:underline transition-colors">
                {post.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                <span className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                  <span>वेतन (Salary):</span>
                  <span>{post.salary || (post.department === 'UPSC' ? '₹ 56,100 - ₹ 2,50,000/-' : post.department === 'Medical' ? '₹ 56,100 - ₹ 1,77,500/-' : post.department === 'Police' ? '₹ 21,700 - ₹ 69,100/-' : post.title.toLowerCase().includes('anganwadi') ? '₹ 8,000 - ₹ 12,000/-' : '₹ 25,500 - ₹ 81,100/-')}</span>
                </span>
                {post.totalVacancies && (
                  <span className="font-semibold text-emerald-700">
                    {post.totalVacancies} Posts
                  </span>
                )}
                {post.lastDate && (
                  <span className="font-semibold text-red-700">
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

            <div className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:translate-x-1 transition-transform">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            No entries found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { SarkariPost } from '../types/job';
import { Bookmark, X, ArrowRight, Trash2, Calendar, Building } from 'lucide-react';

interface BookmarkedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedPosts: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onRemoveBookmark: (postId: string) => void;
  onClearAll: () => void;
}

export const BookmarkedJobsModal: React.FC<BookmarkedJobsModalProps> = ({
  isOpen,
  onClose,
  bookmarkedPosts,
  onSelectPost,
  onRemoveBookmark,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#8b0000] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-bold tracking-tight">
              Saved Govt Jobs & Alerts (सहेजे गए पद) ({bookmarkedPosts.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/80 hover:text-white hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {bookmarkedPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>Click any item to view full details and apply links</span>
                <button
                  onClick={onClearAll}
                  className="text-red-700 hover:text-red-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

              <div className="space-y-2.5">
                {bookmarkedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                  >
                    <div 
                      className="cursor-pointer flex-1"
                      onClick={() => {
                        onSelectPost(post);
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-1">
                        <span className="font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded">
                          {post.department}
                        </span>
                        <span>{post.category.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 hover:text-red-800 transition-colors">
                        {post.shortTitle}
                      </h4>
                      {post.lastDate && (
                        <p className="text-[11px] text-red-700 font-semibold mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last Date: {post.lastDate}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPost(post);
                          onClose();
                        }}
                        className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveBookmark(post.id)}
                        className="p-1.5 text-slate-400 hover:text-red-700 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">No saved jobs yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the bookmark icon on any job or exam notification to save it here for quick access later.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

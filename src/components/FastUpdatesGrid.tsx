import React from 'react';
import { SarkariPost } from '../types/job';
import { ChevronRight } from 'lucide-react';
import { isPostVisited } from '../utils/visitedPosts';


interface FastUpdatesGridProps {
  results: SarkariPost[];
  admitCards: SarkariPost[];
  latestJobs: SarkariPost[];
  answerKeys?: SarkariPost[];
  syllabi?: SarkariPost[];
  important?: SarkariPost[];
  admissions?: SarkariPost[];
  certificates?: SarkariPost[];
  onSelectPost: (post: SarkariPost) => void;
  onViewCategory: (category: 'result' | 'admit_card' | 'latest_jobs' | 'answer_key' | 'syllabus' | 'important' | 'admission' | 'certificate_verification') => void;
  isHindi: boolean;
  onOpenAppInfo?: () => void;
  visitedPostIds?: Set<string>;
  isGlobalWordEditActive?: boolean;
  onUpdatePost?: (updatedPost: SarkariPost) => void;
  onAddNewPost?: (category: string) => void;
  onDeletePost?: (postId: string) => void;
}

export const FastUpdatesGrid: React.FC<FastUpdatesGridProps> = ({
  results,
  admitCards,
  latestJobs,
  answerKeys = [],
  syllabi = [],
  important = [],
  admissions = [],
  certificates = [],
  onSelectPost,
  onViewCategory,
  isHindi,
  onOpenAppInfo: _onOpenAppInfo,
  visitedPostIds = new Set(),
  isGlobalWordEditActive = false,
  onUpdatePost,
  onAddNewPost,
  onDeletePost
}) => {
  const renderColumn = (
    title: string,
    hindiSub: string,
    posts: SarkariPost[],
    category: 'result' | 'admit_card' | 'latest_jobs' | 'answer_key' | 'syllabus' | 'important' | 'admission' | 'certificate_verification',
    viewMoreText: string
  ) => {
    return (
      <div className="border border-[#ab1616] bg-white rounded-xs flex flex-col shadow-xs overflow-hidden">
        <div className="bg-[#ab1616] border-b border-red-900 text-white py-2.5 sm:py-3.5 px-3.5 sm:px-5 text-center select-none">
          <h2 className="font-black text-lg sm:text-xl md:text-2xl tracking-wide uppercase leading-tight font-serif text-white">
            {title}
          </h2>
          <span className="block text-[11px] sm:text-xs font-handwriting text-amber-200 font-bold tracking-normal normal-case mt-0.5">
            {hindiSub}
          </span>
        </div>

        <ul className="divide-y divide-slate-100 flex-1 p-2 sm:p-3 bg-white space-y-0.5">
          {posts.map((post) => (
            <PostListItem 
              key={post.id} 
              post={post} 
              onSelectPost={onSelectPost} 
              visitedPostIds={visitedPostIds} 
            />
          ))}

          {posts.length === 0 && (
            <li className="p-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
              No updates available in this section.
            </li>
          )}
        </ul>

        <div className="p-2.5 sm:p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={() => onViewCategory(category)}
            className="text-xs sm:text-sm font-extrabold text-[#ab1616] hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
          >
            <span>{viewMoreText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {isGlobalWordEditActive && onAddNewPost && (
            <button
              type="button"
              onClick={() => onAddNewPost(category)}
              className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded shadow-2xs cursor-pointer flex items-center gap-1"
              title={category === 'important' ? "महत्वपूर्ण लिंक सेक्शन में नया अपडेट जोड़ें" : "इस सेक्शन में नया पोस्ट जोड़ें"}
            >
              <span>+</span>
              <span>{category === 'important' ? 'नया महत्वपूर्ण लिंक जोड़ें' : 'नया पोस्ट जोड़ें'}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const PostListItem = React.memo(({ 
    post, 
    onSelectPost, 
    visitedPostIds 
  }: { 
    post: SarkariPost; 
    onSelectPost: (post: SarkariPost) => void;
    visitedPostIds: Set<string>;
  }) => {
    const visited = isPostVisited(visitedPostIds, post);
    return (
      <li
        onClick={() => {
          if (!isGlobalWordEditActive) {
            onSelectPost(post);
          }
        }}
        className="py-2.5 sm:py-3 px-2 sm:px-3 hover:bg-red-50/60 transition-colors cursor-pointer group flex items-start justify-between gap-2 sm:gap-2.5"
      >
        <div className="flex items-start gap-2 sm:gap-2.5 flex-1 min-w-0">
          <span className="text-slate-800 font-black text-base sm:text-lg leading-none shrink-0 mt-0.5">•</span>
          <div className="flex-1 min-w-0">
            {isGlobalWordEditActive ? (
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updated = e.currentTarget.innerText.trim();
                  if (updated && updated !== (post.shortTitle || post.title) && onUpdatePost) {
                    onUpdatePost({
                      ...post,
                      shortTitle: updated,
                      title: updated
                    });
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="font-extrabold text-[11pt] text-[#0000cc] underline leading-snug break-words block font-serif outline-none hover:bg-amber-100/90 focus:bg-amber-50 focus:ring-2 focus:ring-amber-500 rounded px-1 -mx-1 border-b border-dashed border-amber-500 cursor-text"
                title="क्लिक करके पोस्ट का नाम बदलें (Click to edit post title)"
              >
                {post.shortTitle || post.title}
              </span>
            ) : (
              <span className={`font-extrabold text-[11pt] ${visited ? 'text-[#551a8b]' : 'text-[#0000cc]'} group-hover:text-[#ab1616] underline leading-snug break-words block font-serif`}>
                {post.shortTitle}
              </span>
            )}

            {post.lastDate && (
              <div className="text-xs text-red-600 font-bold mt-1">
                <span>Last Date: </span>
                {isGlobalWordEditActive ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updated = e.currentTarget.innerText.trim();
                      if (updated && updated !== post.lastDate && onUpdatePost) {
                        onUpdatePost({
                          ...post,
                          lastDate: updated
                        });
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="outline-none hover:bg-amber-100 rounded px-1 border-b border-dashed border-amber-500 cursor-text"
                    title="क्लिक करके अंतिम तिथि बदलें (Click to edit last date)"
                  >
                    {post.lastDate}
                  </span>
                ) : (
                  <span>{post.lastDate}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {isGlobalWordEditActive && onDeletePost && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`क्या आप वाकई "${post.shortTitle || post.title}" को डिलीट करना चाहते हैं?`)) {
                onDeletePost(post.id);
              }
            }}
            className="text-red-500 hover:text-red-700 text-xs px-1 cursor-pointer font-bold shrink-0 mt-0.5"
            title="यह पोस्ट हटाएं"
          >
            ✕
          </button>
        )}
      </li>
    );
  });

  return (
    <div className="my-2 sm:my-3 space-y-2 sm:space-y-3">
      {/* Pair 1: Result | Latest Jobs */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        {renderColumn(
          isHindi ? 'परिणाम (Result)' : 'Result',
          '✍️ सम्पादक द्वारा सत्यापित परीक्षा परिणाम',
          results,
          'result',
          'View More Result'
        )}

        {renderColumn(
          isHindi ? 'सरकारी नौकरी (Latest Jobs)' : 'Latest Jobs',
          '✍️ सम्पादक द्वारा जाँची नई भर्ती सूची',
          latestJobs,
          'latest_jobs',
          'View More Latest Jobs'
        )}
      </div>

      {/* Pair 2: Admit Card | Answer Key */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        {renderColumn(
          isHindi ? 'प्रवेश पत्र (Admit Card)' : 'Admit Card',
          '✍️ हॉल टिकट एवं परीक्षा तिथि विवरण',
          admitCards,
          'admit_card',
          'View More Admit Card'
        )}

        {renderColumn(
          isHindi ? 'उत्तर कुंजी (Answer Key)' : 'Answer Key',
          '✍️ आधिकारिक उत्तर कुंजी व आपत्ति दर्ज',
          answerKeys,
          'answer_key',
          'View More Answer Key'
        )}
      </div>

      {/* Pair 3: Syllabus | Admission */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        {renderColumn(
          isHindi ? 'पाठ्यक्रम (Syllabus)' : 'Syllabus',
          '✍️ विषयवार परीक्षा पैटर्न एवं विस्तृत सिलेबस',
          syllabi,
          'syllabus',
          'View More Syllabus'
        )}

        {renderColumn(
          isHindi ? 'प्रवेश (Admission)' : 'Admission',
          '✍️ यूनिवर्सिटी एवं कॉलेज प्रवेश फॉर्म',
          admissions,
          'admission',
          'View More Admission'
        )}
      </div>

      {/* Pair 4 (Web ke sabse niche): Certificate Verification | Important */}
      <div className="grid grid-cols-2 gap-1 sm:gap-2">
        {renderColumn(
          isHindi ? 'प्रमाण पत्र सत्यापन (Certificate Verification)' : 'Certificate Verification',
          '✍️ आधार, पैन, वोटर, जाति व आय सत्यापन',
          certificates,
          'certificate_verification',
          'View More Verification'
        )}

        {renderColumn(
          isHindi ? 'महत्वपूर्ण लिंक (Important)' : 'Important',
          '✍️ आवश्यक सरकारी पोर्टल, छात्रवृत्ति व महत्वपूर्ण सेवाएं',
          important,
          'important',
          'View More Important'
        )}
      </div>
    </div>
  );
};

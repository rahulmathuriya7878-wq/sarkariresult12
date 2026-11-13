import React from 'react';
import { SarkariPost } from '../types/job';
import { isPostVisited } from '../utils/visitedPosts';
import { AdBanner } from './common/AdBanner';

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
  onOpenAppInfo,
  visitedPostIds = new Set(),
  isGlobalWordEditActive = false,
  onUpdatePost,
  onAddNewPost,
  onDeletePost
}) => {
  const renderColumn = (
    title: string,
    idAttr: string,
    posts: SarkariPost[],
    category: 'result' | 'admit_card' | 'latest_jobs' | 'answer_key' | 'syllabus' | 'important' | 'admission' | 'certificate_verification',
    orderClass: string = ''
  ) => {
    const badgeLabel =
      category === 'result' ? '(Out)' : category === 'admit_card' ? '(New)' : category === 'latest_jobs' ? '(Apply)' : '(New)';

    return (
      <div className={`sr-box ${orderClass}`} id={idAttr}>
        <div className="sr-box-header">{title}</div>

        <ul className="sr-box-list">
          {posts.map((post, idx) => {
            const visited = isPostVisited(visitedPostIds, post);
            const showRedBadge = idx === 0 || post.isNew || post.isHot;
            return (
              <li key={post.id} className="relative">
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
                    className="text-[#0000ff] underline outline-none hover:bg-amber-100 rounded px-1 border-b border-dashed border-amber-500 cursor-text"
                  >
                    {post.shortTitle || post.title}
                  </span>
                ) : (
                  <a
                    href={`#post/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectPost(post);
                    }}
                    className="open-post-link"
                    style={{ color: visited ? '#551a8b' : '#0000ff' }}
                  >
                    {post.shortTitle || post.title}
                  </a>
                )}{' '}
                {post.lastDate ? (
                  <span className="badge-red">
                    (Last Date:{' '}
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
                        className="outline-none hover:bg-amber-100 rounded px-0.5 border-b border-dashed border-amber-500 cursor-text"
                      >
                        {post.lastDate}
                      </span>
                    ) : (
                      post.lastDate
                    )}
                    )
                  </span>
                ) : (
                  showRedBadge && <span className="badge-red">{badgeLabel}</span>
                )}

                {isGlobalWordEditActive && onDeletePost && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`क्या आप वाकई "${post.shortTitle || post.title}" को डिलीट करना चाहते हैं?`)) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="ml-1.5 text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer"
                    title="यह पोस्ट हटाएं"
                  >
                    ✕
                  </button>
                )}
              </li>
            );
          })}

          {posts.length === 0 && (
            <li className="text-slate-500">No updates available in this section.</li>
          )}
        </ul>

        <div className="sr-box-footer flex items-center justify-between gap-2">
          {isGlobalWordEditActive && onAddNewPost ? (
            <button
              type="button"
              onClick={() => onAddNewPost(category)}
              className="text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded cursor-pointer"
            >
              + नया पोस्ट जोड़ें
            </button>
          ) : (
            <span />
          )}
          <a
            href={`#${idAttr}`}
            onClick={(e) => {
              e.preventDefault();
              onViewCategory(category);
            }}
            className="sr-link-blue"
          >
            View More
          </a>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 
        Responsive Category Grid:
        - Mobile (2 columns): Row 1 = Result | Latest Job, Row 2 = Admit Card | Answer Key, Row 3 = Syllabus | Admission
        - Laptop/Desktop (3 columns): Row 1 = Result | Admit Card | Latest Job, Row 2 = Answer Key | Syllabus | Admission
      */}
      <section className="columns-3">
        {renderColumn(
          isHindi ? 'परिणाम (Result)' : 'Result',
          'result',
          results,
          'result',
          'order-1 md:order-1'
        )}

        {renderColumn(
          isHindi ? 'प्रवेश पत्र (Admit Card)' : 'Admit Card',
          'admit-card',
          admitCards,
          'admit_card',
          'order-3 md:order-2'
        )}

        {renderColumn(
          isHindi ? 'सरकारी नौकरी (Latest Job)' : 'Latest Job',
          'latest-job',
          latestJobs,
          'latest_jobs',
          'order-2 md:order-3'
        )}

        {renderColumn(
          isHindi ? 'उत्तर कुंजी (Answer Key)' : 'Answer Key',
          'answer-key',
          answerKeys,
          'answer_key',
          'order-4 md:order-4'
        )}

        {renderColumn(
          isHindi ? 'पाठ्यक्रम (Syllabus)' : 'Syllabus',
          'syllabus',
          syllabi,
          'syllabus',
          'order-5 md:order-5'
        )}

        {renderColumn(
          isHindi ? 'प्रवेश (Admission)' : 'Admission',
          'admission',
          admissions,
          'admission',
          'order-6 md:order-6'
        )}
      </section>

      <AdBanner placement="homeMid" onOpenTool={onOpenAppInfo} />

      {/* Bottom 2-Column Grid: Certificate Verification | Important */}
      {(certificates.length > 0 || important.length > 0) && (
        <section className="grid grid-cols-2 gap-[6px] md:gap-[10px] mb-4">
          {renderColumn(
            isHindi ? 'प्रमाण पत्र सत्यापन (Certificate Verification)' : 'Certificate Verification',
            'certificate-verification',
            certificates,
            'certificate_verification'
          )}

          {renderColumn(
            isHindi ? 'महत्वपूर्ण लिंक (Important)' : 'Important',
            'important',
            important,
            'important'
          )}
        </section>
      )}
    </div>
  );
};


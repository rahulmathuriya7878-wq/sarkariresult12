import React from 'react';
import { SarkariPost } from '../types/job';
import { ChevronRight } from 'lucide-react';
import { isPostVisited } from '../utils/visitedPosts';
import { AdSection } from './AdSection';

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
  visitedPostIds = new Set()
}) => {

  const renderColumn = (
    title: string,
    hindiSub: string,
    posts: SarkariPost[],
    category: 'result' | 'admit_card' | 'latest_jobs' | 'answer_key' | 'syllabus' | 'important' | 'admission' | 'certificate_verification',
    viewMoreText: string
  ) => (
    <div className="border-2 border-[#ab1616] bg-white rounded-xs flex flex-col shadow-xs overflow-hidden h-full">
      <div className="bg-[#ab1616] text-white py-2.5 sm:py-3.5 px-3.5 sm:px-5 text-center select-none">
        <h2 className="font-black text-lg sm:text-xl md:text-2xl tracking-wide uppercase leading-tight font-serif text-white">
          {title}
        </h2>
        <span className="block text-[11px] sm:text-xs font-handwriting text-yellow-200 font-bold tracking-normal normal-case mt-0.5">
          {hindiSub}
        </span>
      </div>

      <ul className="divide-y divide-slate-100 flex-1 p-2 sm:p-3 bg-white space-y-0.5">
        {posts.slice(0, 100).map((post) => {
          const visited = isPostVisited(visitedPostIds, post);
          return (
            <li
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="py-2.5 sm:py-3 px-2 sm:px-3 hover:bg-red-50/60 transition-colors cursor-pointer group flex items-start gap-2 sm:gap-2.5"
            >
              <span className="text-slate-800 font-black text-base sm:text-lg leading-none shrink-0 mt-0.5">•</span>
              <div className="flex-1 min-w-0">
                <span className={`font-extrabold text-[13.5px] sm:text-[15px] md:text-[17px] ${visited ? 'text-[#551a8b]' : 'text-[#0000cc]'} group-hover:text-[#ab1616] underline leading-snug break-words block font-serif`}>
                  {post.shortTitle}
                </span>
                {post.lastDate && (
                  <span className="text-xs text-red-600 block font-bold mt-1">
                    Last Date: {post.lastDate}
                  </span>
                )}
              </div>
            </li>
          );
        })}

        {posts.length === 0 && (
          <li className="p-5 text-center text-xs sm:text-sm text-slate-500 font-medium">
            No updates available in this section.
          </li>
        )}
      </ul>

      <div className="p-2.5 sm:p-3 text-center bg-slate-50 border-t border-slate-200 mt-auto">
        <button
          onClick={() => onViewCategory(category)}
          className="text-xs sm:text-sm font-extrabold text-[#ab1616] hover:underline inline-flex items-center gap-1 cursor-pointer py-1"
        >
          <span>{viewMoreText}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="my-5 sm:my-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* 1. Result */}
      {renderColumn(
        isHindi ? 'परिणाम (Result)' : 'Result',
        '✍️ सम्पादक द्वारा सत्यापित परीक्षा परिणाम',
        results,
        'result',
        'View More Result'
      )}

      {/* 2. Latest Jobs */}
      {renderColumn(
        isHindi ? 'सरकारी नौकरी (Latest Jobs)' : 'Latest Jobs',
        '✍️ सम्पादक द्वारा जाँची नई भर्ती सूची',
        latestJobs,
        'latest_jobs',
        'View More Latest Jobs'
      )}

      {/* 3. Admit Card */}
      {renderColumn(
        isHindi ? 'प्रवेश पत्र (Admit Card)' : 'Admit Card',
        '✍️ हॉल टिकट एवं परीक्षा तिथि विवरण',
        admitCards,
        'admit_card',
        'View More Admit Card'
      )}

      {/* Ad Section 1 */}
      <div className="col-span-full">
        <AdSection slotId="8892103412" format="horizontal" label="Sponsored Ad / प्रायोजित विज्ञापन" />
      </div>

      {/* 4. Answer Key */}
      {renderColumn(
        isHindi ? 'उत्तर कुंजी (Answer Key)' : 'Answer Key',
        '✍️ आधिकारिक उत्तर कुंजी व आपत्ति दर्ज',
        answerKeys,
        'answer_key',
        'View More Answer Key'
      )}

      {/* 5. Syllabus */}
      {renderColumn(
        isHindi ? 'पाठ्यक्रम (Syllabus)' : 'Syllabus',
        '✍️ विषयवार परीक्षा पैटर्न एवं विस्तृत सिलेबस',
        syllabi,
        'syllabus',
        'View More Syllabus'
      )}

      {/* Ad Section 2 */}
      <div className="col-span-full">
        <AdSection slotId="9923841029" format="horizontal" label="Advertisement / विज्ञापन" />
      </div>

      {/* 6. Admission */}
      {renderColumn(
        isHindi ? 'प्रवेश (Admission)' : 'Admission',
        '✍️ यूनिवर्सिटी एवं कॉलेज प्रवेश फॉर्म',
        admissions,
        'admission',
        'View More Admission'
      )}

      {/* 7. Certificate Verification */}
      {renderColumn(
        isHindi ? 'प्रमाण पत्र सत्यापन (Certificate Verification)' : 'Certificate Verification',
        '✍️ आधार, पैन, वोटर, जाति व आय सत्यापन',
        certificates,
        'certificate_verification',
        'View More Verification'
      )}

      {/* 8. Important */}
      {renderColumn(
        isHindi ? 'महत्वपूर्ण लिंक (Important)' : 'Important',
        '✍️ आवश्यक सरकारी पोर्टल, छात्रवृत्ति व महत्वपूर्ण सेवाएं',
        important,
        'important',
        'View More Important'
      )}

      {/* Final Ad Section */}
      <div className="col-span-full">
        <AdSection slotId="7738291040" format="horizontal" />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { VacancyItem, LanguageMode } from '../types';
import { VacancyDetailPage } from './VacancyDetailPage';
import { AddVacancyModal } from './AddVacancyModal';
import { Edit3, SlidersHorizontal, ShieldCheck, ArrowUp, ArrowDown } from 'lucide-react';

export interface PostEditorManagerProps {
  vacancy: VacancyItem;
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageMode;
  isAdmin: boolean;
  onUpdateVacancy: (updatedItem: VacancyItem) => void;
  onDeleteVacancy?: (id: string) => void;
  allVacancies?: VacancyItem[];
  onSelectOtherVacancy?: (item: VacancyItem) => void;
}

export const DEFAULT_SECTION_KEYS = [
  'overview',
  'latest_update',
  'dates',
  'post_breakdown',
  'salary_table',
  'exam_pattern',
  'qualification',
  'age_limit',
  'application_fee',
  'selection_process',
  'documents',
  'how_to_apply',
  'important_links',
  'faqs'
];

export const PostEditorManager: React.FC<PostEditorManagerProps> = ({
  vacancy,
  isOpen,
  onClose,
  lang,
  isAdmin,
  onUpdateVacancy,
  onDeleteVacancy,
  allVacancies = [],
  onSelectOtherVacancy
}) => {
  const [editorMode, setEditorMode] = useState<'live_word' | 'section_form'>('section_form');
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_SECTION_KEYS);

  // 2. सेक्शन को ऊपर खिसकाने का फंक्शन (Move Up)
  const moveSectionUp = (index: number) => {
    if (index <= 0) return;
    setSectionOrder(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  // 3. सेक्शन को नीचे खिसकाने का फंक्शन (Move Down)
  const moveSectionDown = (index: number) => {
    if (index >= sectionOrder.length - 1) return;
    setSectionOrder(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white w-screen h-screen overflow-hidden">
      {/* Top Header Controls Bar */}
      <div className="h-12 bg-slate-950 px-4 flex items-center justify-between border-b border-slate-800 shrink-0 gap-2 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded text-xs font-bold uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>संपूर्ण पोस्ट संपादक</span>
          </div>
          <h2 className="text-sm font-extrabold text-white truncate max-w-sm">
            {vacancy.shortTitle || vacancy.title}
          </h2>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditorMode('live_word')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              editorMode === 'live_word'
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>✏️ वर्ड इन-प्लेस लाइव एडिट मोड</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorMode('section_form')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              editorMode === 'section_form'
                ? 'bg-sky-600 text-white ring-2 ring-sky-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>⚡ डायरेक्ट सेक्शन व फॉर्म अपडेट</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="ml-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            बंद करें
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto bg-white text-slate-900">
        {editorMode === 'live_word' ? (
          <div className="p-2 sm:p-4 max-w-6xl mx-auto">
            <VacancyDetailPage
              vacancy={vacancy}
              onBack={onClose}
              lang={lang}
              isSaved={false}
              onToggleSave={() => {}}
              allVacancies={allVacancies}
              onSelectOtherVacancy={onSelectOtherVacancy || (() => {})}
              onUpdateVacancy={onUpdateVacancy}
              onDeleteVacancy={onDeleteVacancy}
              isAdmin={isAdmin}
            />
          </div>
        ) : (
          <AddVacancyModal
            isOpen={isOpen}
            onClose={onClose}
            onAddVacancy={() => {}}
            onUpdateVacancy={onUpdateVacancy}
            onDeleteVacancy={onDeleteVacancy}
            editItem={vacancy}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
};

export default PostEditorManager;

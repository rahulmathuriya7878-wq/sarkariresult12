import React from 'react';
import { FullPagePostView } from './FullPagePostView';
import { SarkariPost } from '../types/job';
import { LanguageMode } from '../types';

export interface VacancyDetailPageProps {
  vacancy: SarkariPost;
  onBack: () => void;
  lang?: LanguageMode;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  allVacancies?: SarkariPost[];
  onSelectOtherVacancy?: (item: SarkariPost) => void;
  onUpdateVacancy?: (updatedItem: SarkariPost) => void;
  onDeleteVacancy?: (id: string) => void;
  isAdmin?: boolean;
}

export const VacancyDetailPage: React.FC<VacancyDetailPageProps> = ({
  vacancy,
  onBack,
  allVacancies = [],
  onSelectOtherVacancy,
  onUpdateVacancy,
  onDeleteVacancy,
}) => {
  return (
    <FullPagePostView
      post={vacancy}
      onBack={onBack}
      allPosts={allVacancies}
      onSelectPost={onSelectOtherVacancy}
      onUpdatePost={onUpdateVacancy}
      onDeletePost={onDeleteVacancy}
      isGlobalWordEditActive={true}
    />
  );
};

export default VacancyDetailPage;

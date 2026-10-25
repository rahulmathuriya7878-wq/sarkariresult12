import React from 'react';
import { AdminEditingPanelModal } from './admin/AdminEditingPanelModal';
import { SarkariPost } from '../types/job';
import { LanguageMode } from '../types';

export interface AddVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVacancy?: (item: SarkariPost) => void;
  onUpdateVacancy?: (item: SarkariPost) => void;
  onDeleteVacancy?: (id: string) => void;
  editItem?: SarkariPost | null;
  lang?: LanguageMode;
}

export const AddVacancyModal: React.FC<AddVacancyModalProps> = ({
  isOpen,
  onClose,
  onAddVacancy,
  onUpdateVacancy,
  onDeleteVacancy,
  editItem,
}) => {
  return (
    <AdminEditingPanelModal
      isOpen={isOpen}
      onClose={onClose}
      posts={editItem ? [editItem] : []}
      onAddPost={onAddVacancy || (() => {})}
      onUpdatePost={onUpdateVacancy || (() => {})}
      onDeletePost={onDeleteVacancy || (() => {})}
      onResetToDefault={() => {}}
      initialPostToEdit={editItem}
      isGlobalWordEditActive={false}
    />
  );
};

export default AddVacancyModal;

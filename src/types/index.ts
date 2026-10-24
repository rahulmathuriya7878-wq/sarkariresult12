export * from './job';
import { SarkariPost } from './job';

export type VacancyItem = SarkariPost;
export type LanguageMode = 'hi' | 'en';

export interface CustomPostSection {
  id: string;
  title: string;
  content: string;
}

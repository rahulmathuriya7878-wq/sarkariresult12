export type PostCategory = 
  | 'result' 
  | 'admit_card' 
  | 'latest_jobs' 
  | 'answer_key' 
  | 'syllabus' 
  | 'admission' 
  | 'certificate_verification' 
  | 'important';

export type Department = 
  | 'UPSC' 
  | 'SSC' 
  | 'Railway' 
  | 'Banking' 
  | 'Defence' 
  | 'State PSC' 
  | 'Teaching' 
  | 'Police' 
  | 'Engineering' 
  | 'Medical' 
  | 'Other';

export type Qualification = 
  | '10th Pass' 
  | '12th Pass' 
  | 'Graduate' 
  | 'Post Graduate' 
  | 'Diploma / ITI' 
  | 'B.Tech / BE' 
  | 'B.Ed / CTET' 
  | 'Medical / Nursing';

export interface VacancyBreakdown {
  postName: string;
  totalPosts: string | number;
  eligibility: string;
  categoryBreakdown?: {
    gen?: number;
    obc?: number;
    ews?: number;
    sc?: number;
    st?: number;
  };
}

export interface ImportantDateItem {
  label: string;
  value: string;
  isHighlight?: boolean;
}

export interface ApplicationFeeItem {
  category: string;
  amount: string;
}

export interface DirectLinkItem {
  label: string;
  actionText: string;
  type: 'apply' | 'admit_card' | 'result' | 'answer_key' | 'notification' | 'official' | 'syllabus';
  url?: string;
  isPrimary?: boolean;
}

export interface SarkariPost {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  hindiTitle?: string;
  category: PostCategory;
  department: Department;
  qualifications: Qualification[];
  state: string;
  postDate: string;
  shortInfo: string;
  isHot?: boolean;
  isNew?: boolean;
  lastDate?: string;
  examDate?: string;
  admitCardDate?: string;
  resultDate?: string;
  totalVacancies?: string | number;
  applicationFee: ApplicationFeeItem[];
  feePaymentMode?: string;
  ageLimit: {
    asOnDate: string;
    minAge?: number;
    maxAge?: number;
    notes?: string;
  };
  importantDates: ImportantDateItem[];
  vacancyBreakdown: VacancyBreakdown[];
  howToApplySteps: string[];
  directLinks: DirectLinkItem[];
  notificationNumber?: string;
}

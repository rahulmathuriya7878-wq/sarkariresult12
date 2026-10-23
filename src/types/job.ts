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

export type SalaryBand = 
  | 'All' 
  | 'Below 25K' 
  | '25K - 50K' 
  | '50K - 1 Lakh' 
  | 'Above 1 Lakh';

export interface VacancyBreakdown {
  postName: string;
  totalPosts: string | number;
  eligibility: string;
  modeOfSelection?: string;
  nonTspPosts?: string | number;
  tspPosts?: string | number;
  categoryBreakdown?: {
    gen?: number | string;
    obc?: number | string;
    ews?: number | string;
    sc?: number | string;
    st?: number | string;
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
  type: 'apply' | 'admit_card' | 'result' | 'answer_key' | 'notification' | 'official' | 'syllabus' | 'other' | 'exam_city';
  url?: string;
  isPrimary?: boolean;
}

export interface ExamSubjectItem {
  subjectName: string;
  totalQuestions?: number | string;
  totalMarks?: number | string;
  duration?: string;
  remarks?: string;
}

export interface PaperPattern {
  examName?: string;
  examMode?: string;
  totalQuestions?: number | string;
  totalMarks?: number | string;
  totalDuration?: string;
  negativeMarking?: string;
  mediumOfExam?: string;
  subjects?: ExamSubjectItem[];
  notes?: string[];
}

export interface PostFAQItem {
  question: string;
  answer: string;
}

export interface SalaryBreakdownItem {
  postName: string;
  payLevel: string;
  basicPay: string;
  inHandSalary?: string;
  grossSalary?: string;
  gradePay?: string;
  allowances?: string;
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
  status?: 'upcoming' | 'active' | 'closed';
  isUpcoming?: boolean;
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
  paperPattern?: PaperPattern;
  howToApplySteps: string[];
  selectionProcess?: string[];
  salary?: string;
  salaryBand?: SalaryBand;
  salaryBreakdown?: SalaryBreakdownItem[];
  directLinks: DirectLinkItem[];
  notificationNumber?: string;
  customFaqs?: PostFAQItem[];
}

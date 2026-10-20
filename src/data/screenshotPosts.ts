import { SarkariPost } from '../types/job';

export const screenshotResultPosts: SarkariPost[] = [
  {
    id: 'res-upsc-cds-2-2026',
    slug: 'upsc-cds-ii-result-2026',
    title: 'UPSC Combined Defence Services CDS II Examination 2026 Written Exam Result with Roll Wise & Name Wise List',
    shortTitle: 'UPSC CDS II Result 2026',
    hindiTitle: 'यूपीएससी सीडीएस II लिखित परीक्षा परिणाम 2026',
    category: 'result',
    department: 'UPSC',
    qualifications: ['Graduate', 'B.Tech / BE'],
    state: 'All India',
    postDate: '19 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '19 October 2026',
    shortInfo: 'Union Public Service Commission (UPSC) has officially announced the Written Result of Combined Defence Services Examination (CDS II) 2026. Candidates who appeared for IMA, INA, AFA, and OTA courses can check their Roll Numbers in the qualified merit PDF list.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026', notes: 'Age criteria according to Indian Military Academy, Naval Academy, Air Force Academy and OTA norms.' },
    importantDates: [
      { label: 'Written Exam Date', value: '01/09/2026' },
      { label: 'Result Declared Date', value: '19/10/2026', isHighlight: true },
      { label: 'SSB Interview Schedule', value: 'November - December 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'Indian Military Academy (IMA)', totalPosts: '100 Posts', eligibility: 'Degree from recognized University' },
      { postName: 'Indian Naval Academy (INA)', totalPosts: '32 Posts', eligibility: 'Degree in Engineering' },
      { postName: 'Air Force Academy (AFA)', totalPosts: '32 Posts', eligibility: 'Degree with Physics & Math at 10+2 or BE/B.Tech' },
      { postName: 'Officers Training Academy (OTA)', totalPosts: '276 Posts', eligibility: 'Degree from recognized University' }
    ],
    howToApplySteps: [
      'Download UPSC CDS II Written Result PDF list below.',
      'Press Ctrl+F on desktop or search in PDF viewer on mobile.',
      'Enter your Roll Number to check qualification status for SSB Interview.',
      'Qualified candidates must register on Join Indian Army / Navy / Air Force official website.'
    ],
    directLinks: [
      { label: 'Download CDS II Written Result (Roll Wise)', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'Download CDS II Result (Name Wise List)', actionText: 'Name Wise PDF', type: 'result' },
      { label: 'UPSC Official Portal', actionText: 'upsc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'res-sbi-clerk-backlog-2026',
    slug: 'sbi-clerk-backlog-pre-result-2026',
    title: 'SBI Junior Associates (Customer Support & Sales) Clerk Backlog Prelims Examination Result 2026 & Scorecard',
    shortTitle: 'SBI Junior Associates Clerk Backlog Pre Result 2026',
    hindiTitle: 'एसबीआई क्लर्क बैकलॉग प्री परीक्षा परिणाम 2026',
    category: 'result',
    department: 'Banking',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '18 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '18 October 2026',
    shortInfo: 'State Bank of India (SBI) has declared the Preliminary Examination Result for Junior Associates (Clerk) Backlog recruitment. Candidates can check their scorecard and mains exam eligibility by logging in with Registration No and Password / Date of Birth.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/04/2026', minAge: 20, maxAge: 28 },
    importantDates: [
      { label: 'Prelims Result Declared', value: '18/10/2026', isHighlight: true },
      { label: 'Mains Admit Card Download', value: 'Active Now' },
      { label: 'Mains Examination Date', value: 'November 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'Junior Associate (Clerk) Backlog', totalPosts: 'Special Drive', eligibility: 'Graduation in any discipline from a recognized University.' }
    ],
    howToApplySteps: [
      'Click on Check SBI Clerk Prelims Result link.',
      'Enter your Registration Number / Roll Number and Date of Birth.',
      'Enter text verification captcha code and click Submit.',
      'Download your Prelims Marks and Mains Call Letter if shortlisted.'
    ],
    directLinks: [
      { label: 'Check SBI Clerk Backlog Pre Result & Marks', actionText: 'Click Here', type: 'result', isPrimary: true },
      { label: 'Download Mains Exam Call Letter', actionText: 'Admit Card', type: 'admit_card' },
      { label: 'SBI Official Careers Portal', actionText: 'sbi.co.in/careers', type: 'official' }
    ]
  },
  {
    id: 'res-uppsc-lt-grade-2025',
    slug: 'uppsc-lt-grade-assistant-teacher-final-result-2026',
    title: 'UPPSC LT Grade Assistant Teacher 2025 Final Result, Merit List & Cut Off Marks | Updated',
    shortTitle: 'UPPSC LT Grade Assistant Teacher 2025 Final Result | Updated',
    hindiTitle: 'यूपीपीएससी एलटी ग्रेड सहायक अध्यापक अंतिम परिणाम | अपडेटेड',
    category: 'result',
    department: 'Teaching',
    qualifications: ['Graduate', 'B.Ed / CTET'],
    state: 'Uttar Pradesh',
    postDate: '17 October 2026',
    isHot: true,
    isNew: false,
    resultDate: '17 October 2026',
    shortInfo: 'Uttar Pradesh Public Service Commission (UPPSC) has released the updated Final Merit List and subject-wise recommendation list for LT Grade Assistant Teacher recruitment across Uttar Pradesh Government Inter Colleges.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2025', minAge: 21, maxAge: 40 },
    importantDates: [
      { label: 'Updated Final Result Declared', value: '17/10/2026', isHighlight: true },
      { label: 'Document Verification Dates', value: '25/10/2026 to 05/11/2026' }
    ],
    vacancyBreakdown: [
      { postName: 'LT Grade Assistant Teacher (Male/Female Branch)', totalPosts: '10,768 Posts', eligibility: 'Bachelor Degree in Related Subject with B.Ed degree.' }
    ],
    howToApplySteps: [
      'Open the official UPPSC LT Grade updated result PDF.',
      'Find your Roll Number in the merit rank list.',
      'Check the date and venue assigned for Document Verification.'
    ],
    directLinks: [
      { label: 'Download UPPSC LT Grade Updated Final Result', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'Download Subject-Wise Cutoff Marks', actionText: 'Check Cutoff', type: 'result' },
      { label: 'UPPSC Official Portal', actionText: 'uppsc.up.nic.in', type: 'official' }
    ]
  },
  {
    id: 'res-ibps-so-spl-16-2026',
    slug: 'ibps-so-spl-16th-pre-result-2026',
    title: 'IBPS Specialist Officer SO SPL 16th Prelims Exam Result 2026 & Category Wise Scorecard',
    shortTitle: 'IBPS Specialist Officer SO SPL 16th Pre Result 2026',
    hindiTitle: 'आईबीपीएस एसओ 16th प्री परिणाम 2026',
    category: 'result',
    department: 'Banking',
    qualifications: ['B.Tech / BE', 'Post Graduate'],
    state: 'All India',
    postDate: '16 October 2026',
    isHot: false,
    isNew: true,
    resultDate: '16 October 2026',
    shortInfo: 'Institute of Banking Personnel Selection (IBPS) has activated the online result portal for Specialist Officers (SO) CRP SPL-XVI Prelims Exam for IT Officer, Agricultural Field Officer, Rajbhasha Adhikari, Law Officer, HR/Personnel Officer, and Marketing Officer.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/08/2026', minAge: 20, maxAge: 30 },
    importantDates: [
      { label: 'Prelims Result Declared', value: '16/10/2026', isHighlight: true },
      { label: 'Mains Examination Date', value: 'November 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'IBPS Specialist Officer (IT, AFO, Law, HR, Marketing)', totalPosts: 'Multiple Banks', eligibility: 'Relevant Professional Degree (B.Tech / MBA / LLB).' }
    ],
    howToApplySteps: [
      'Visit IBPS official result portal via link below.',
      'Enter Registration No / Roll No and Date of Birth / Password.',
      'View status of selection for Mains examination.'
    ],
    directLinks: [
      { label: 'Check IBPS SO Prelims Result 2026', actionText: 'Click Here', type: 'result', isPrimary: true },
      { label: 'Check Prelims Scores & Marks', actionText: 'View Marks', type: 'result' },
      { label: 'Official Website', actionText: 'ibps.in', type: 'official' }
    ]
  },
  {
    id: 'res-sbi-po-mains-2026',
    slug: 'sbi-po-mains-result-2026',
    title: 'SBI Probationary Officers PO Mains Examination Result 2026, Interview Shortlist & Score Card',
    shortTitle: 'SBI Probationary Officers PO Mains Result 2026',
    hindiTitle: 'एसबीआई पीओ मेन्स रिजल्ट व इंटरव्यू लिस्ट 2026',
    category: 'result',
    department: 'Banking',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '15 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '15 October 2026',
    shortInfo: 'State Bank of India has published the Mains examination result of Probationary Officers (PO). Candidates who cleared Mains are now called for Psychometric Test, Group Discussion, and Personal Interview.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/04/2026', minAge: 21, maxAge: 30 },
    importantDates: [
      { label: 'Mains Result Declared', value: '15/10/2026', isHighlight: true },
      { label: 'Phase III (GD / Interview)', value: 'November 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'Probationary Officer (PO)', totalPosts: '2,000 Posts', eligibility: 'Graduation in any discipline from a recognized University.' }
    ],
    howToApplySteps: [
      'Download SBI PO Mains Merit PDF list.',
      'Search roll number in the list of candidates shortlisted for Phase III Interview.'
    ],
    directLinks: [
      { label: 'Download SBI PO Mains Qualified Roll List (PDF)', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'Download Interview Call Letter', actionText: 'Admit Card', type: 'admit_card' },
      { label: 'Official SBI Careers Portal', actionText: 'sbi.co.in/careers', type: 'official' }
    ]
  },
  {
    id: 'res-up-police-final-2026',
    slug: 'up-police-constable-final-result-2026',
    title: 'UP Police Constable Civil Police Recruitment 2026 (60,244 Posts) Final Selection Result & Cut Off Marks',
    shortTitle: 'UP Police Constable Final Result 2026',
    hindiTitle: 'यूपी पुलिस कांस्टेबल अंतिम चयन परिणाम 2026 (60,244 पद)',
    category: 'result',
    department: 'Police',
    qualifications: ['12th Pass'],
    state: 'Uttar Pradesh',
    postDate: '14 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '14 October 2026',
    shortInfo: 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) has declared the Final Result for 60,244 Civil Police Constables following written exam, DV/PST, and Physical Efficiency Test (PET).',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [
      { label: 'Final Result Declared', value: '14/10/2026', isHighlight: true },
      { label: 'Medical Exam & Joining', value: 'November 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'UP Police Constable (Civil Police)', totalPosts: '60,244 Posts', eligibility: '12th Intermediate Passed from recognized board.' }
    ],
    howToApplySteps: [
      'Open the official UP Police Constable final result PDF link.',
      'Search your Roll Number or Registration Number.',
      'Check category cutoff marks and instructions for Medical Examination.'
    ],
    directLinks: [
      { label: 'Download UP Police Constable Final Result (PDF)', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'Download Category Cutoff Marks Notice', actionText: 'Cutoff PDF', type: 'result' },
      { label: 'UPPRPB Official Website', actionText: 'uppbpb.gov.in', type: 'official' }
    ]
  },
  {
    id: 'res-ssb-hc-min-2020',
    slug: 'ssb-head-constable-ministerial-result-marks-2026',
    title: 'Sashastra Seema Bal SSB Head Constable Ministerial 2020 Final Result, Skill Test Marks & Scorecard 2026',
    shortTitle: 'SSB Head Constable Ministerial 2020 Result / Marks 2026',
    hindiTitle: 'एसएसबी हेड कांस्टेबल मिनिस्ट्रियल 2020 रिजल्ट व प्राप्तांक',
    category: 'result',
    department: 'Defence',
    qualifications: ['12th Pass'],
    state: 'All India',
    postDate: '13 October 2026',
    isHot: false,
    isNew: false,
    resultDate: '13 October 2026',
    shortInfo: 'Sashastra Seema Bal (SSB) has published the final selected candidate list along with typing skill test marks details for Head Constable Ministerial 2020 recruitment cycle.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2020' },
    importantDates: [
      { label: 'Final Marks / Result Declared', value: '13/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Head Constable (Ministerial)', totalPosts: '115 Posts', eligibility: '10+2 Intermediate with 35 wpm English or 30 wpm Hindi typing.' }
    ],
    howToApplySteps: [
      'Open SSB result portal and download the merit sheet PDF.',
      'Check marks obtained in Written Test and Typing Skill Test.'
    ],
    directLinks: [
      { label: 'Download SSB Head Constable Ministerial Result (PDF)', actionText: 'Download', type: 'result', isPrimary: true },
      { label: 'SSB Official Recruitment Portal', actionText: 'ssbrectt.gov.in', type: 'official' }
    ]
  },
  {
    id: 'res-upsc-nda-2-2026',
    slug: 'upsc-nda-ii-written-exam-result-2026',
    title: 'UPSC National Defence Academy & Naval Academy NDA II Written Exam Result 2026 | Name Wise List',
    shortTitle: 'UPSC NDA II Written Exam Result 2026 | Name Wise List',
    hindiTitle: 'यूपीएससी एनडीए II लिखित परीक्षा परिणाम (नामवार सूची)',
    category: 'result',
    department: 'UPSC',
    qualifications: ['12th Pass'],
    state: 'All India',
    postDate: '12 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '12 October 2026',
    shortInfo: 'Union Public Service Commission (UPSC) has announced the Written Examination Result for NDA & NA (II) 2026. The commission has released both Roll Number wise and Name wise qualified lists for SSB Interview.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2026' },
    importantDates: [
      { label: 'Written Exam Date', value: '01/09/2026' },
      { label: 'Written Result Declared', value: '12/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'National Defence Academy (Army, Navy, Air Force) & NA', totalPosts: '404 Posts', eligibility: '10+2 Passed / Appearing.' }
    ],
    howToApplySteps: [
      'Download UPSC NDA II Name Wise Result PDF.',
      'Find candidate name and roll number in the alphabetical / roll index.',
      'Register on Indian Army recruitment website for SSB Interview centre selection.'
    ],
    directLinks: [
      { label: 'Download NDA II Result (Name Wise List)', actionText: 'Name List PDF', type: 'result', isPrimary: true },
      { label: 'Download NDA II Result (Roll Wise List)', actionText: 'Roll List PDF', type: 'result' },
      { label: 'UPSC Official Website', actionText: 'upsc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'res-upsc-capf-2024',
    slug: 'upsc-cpf-capf-ac-marks-details-2026',
    title: 'UPSC Central Armed Police Forces (CAPF AC) Assistant Commandants Marks Details & Final Scorecard 2026',
    shortTitle: 'UPSC CPF CAPF AC 2024 Marks Details 2026',
    hindiTitle: 'यूपीएससी सीएपीएफ एसी प्राप्तांक विवरण 2026',
    category: 'result',
    department: 'UPSC',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '11 October 2026',
    isHot: false,
    isNew: false,
    resultDate: '11 October 2026',
    shortInfo: 'Union Public Service Commission (UPSC) has released candidate-wise marks details of recommended and non-recommended candidates for Central Armed Police Forces (Assistant Commandants) Examination.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/08/2024', minAge: 20, maxAge: 25 },
    importantDates: [
      { label: 'Marks Details Uploaded', value: '11/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Assistant Commandant (BSF, CRPF, CISF, ITBP, SSB)', totalPosts: '506 Posts', eligibility: 'Bachelor Degree in any stream.' }
    ],
    howToApplySteps: [
      'Login on UPSC marks portal using Registration ID or Roll Number.',
      'Check Paper I, Paper II, and Personality Test marks.'
    ],
    directLinks: [
      { label: 'Check UPSC CAPF AC Marks Details', actionText: 'Click Here', type: 'result', isPrimary: true },
      { label: 'UPSC Official Portal', actionText: 'upsc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'res-rpsc-tgt-gr2-2026',
    slug: 'rpsc-tgt-senior-teacher-gr-ii-result-2026',
    title: 'RPSC Rajasthan Senior Teacher Grade II (Secondary Education) TGT Subject Wise Final Result & Cutoff 2026',
    shortTitle: 'RPSC TGT Senior Teacher Gr II Result 2026',
    hindiTitle: 'आरपीएससी वरिष्ठ अध्यापक ग्रेड-II अंतिम परिणाम व कटऑफ',
    category: 'result',
    department: 'Teaching',
    qualifications: ['Graduate', 'B.Ed / CTET'],
    state: 'Rajasthan',
    postDate: '10 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '10 October 2026',
    shortInfo: 'Rajasthan Public Service Commission (RPSC) has declared the Final Recommendation Result and Category-wise Cut-off marks for Senior Teacher (Grade II) Comp. Exam for Hindi, Social Science, Maths, and Sanskrit subjects.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2026', minAge: 18, maxAge: 40 },
    importantDates: [
      { label: 'Final Result Declared', value: '10/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Senior Teacher Grade II (TGT Various Subjects)', totalPosts: '9,760 Posts', eligibility: 'Graduate with relevant optional subject and B.Ed / D.El.Ed.' }
    ],
    howToApplySteps: [
      'Open the official RPSC result PDF for your subject.',
      'Check merit number and roll number in the main list or reserve list.'
    ],
    directLinks: [
      { label: 'Download RPSC Senior Teacher Final Result PDF', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'Download Category Cutoff Notice', actionText: 'Check Cutoff', type: 'result' },
      { label: 'RPSC Official Website', actionText: 'rpsc.rajasthan.gov.in', type: 'official' }
    ]
  },
  {
    id: 'res-dsssb-prt-2026',
    slug: 'dsssb-assistant-teacher-primary-result-2026',
    title: 'DSSSB Assistant Teacher Primary (PRT) Post Code 01/24 Final Result, Marks & e-Dossier Rejection List',
    shortTitle: 'DSSSB Assistant Teacher Primary Result 2026',
    hindiTitle: 'डीएसएसएसबी सहायक अध्यापक प्राथमिक (पीआरटी) परिणाम 2026',
    category: 'result',
    department: 'Teaching',
    qualifications: ['12th Pass', 'B.Ed / CTET'],
    state: 'Delhi',
    postDate: '09 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '09 October 2026',
    shortInfo: 'Delhi Subordinate Services Selection Board (DSSSB) has declared the final result for Assistant Teacher (Primary) under Directorate of Education and Municipal Corporation of Delhi.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2026', maxAge: 30 },
    importantDates: [
      { label: 'Final Result Declared', value: '09/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Assistant Teacher (Primary) PRT', totalPosts: '1,455 Posts', eligibility: '10+2 with 50% Marks + 2-Year Diploma in Elementary Education + CTET Qualified.' }
    ],
    howToApplySteps: [
      'Download DSSSB PRT Final Result Notice.',
      'Check shortlisted roll numbers and cutoff marks for UR, EWS, OBC, SC, ST, PwD.'
    ],
    directLinks: [
      { label: 'Download DSSSB PRT Final Result (PDF)', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'Check Candidate Marks on OARS Portal', actionText: 'Click Here', type: 'result' },
      { label: 'DSSSB Official Website', actionText: 'dsssb.delhi.gov.in', type: 'official' }
    ]
  },
  {
    id: 'res-up-board-2027',
    slug: 'up-board-high-school-inter-time-table-2027',
    title: 'UPMSP Uttar Pradesh Board High School (Class 10th) & Intermediate (Class 12th) Exam Date Sheet / Time Table 2027',
    shortTitle: 'UP Board Time Table 2027',
    hindiTitle: 'यूपी बोर्ड 10वीं व 12वीं परीक्षा समय सारणी (टाइम टेबल) 2027',
    category: 'result',
    department: 'State PSC',
    qualifications: ['10th Pass', '12th Pass'],
    state: 'Uttar Pradesh',
    postDate: '08 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '08 October 2026',
    shortInfo: 'Uttar Pradesh Madhyamik Shiksha Parishad (UPMSP), Prayagraj has released the official Exam Date Sheet & Time Table for Class 10th (High School) and Class 12th (Intermediate) Annual Board Examinations 2027.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [
      { label: 'Date Sheet Released Date', value: '08/10/2026', isHighlight: true },
      { label: 'High School Exams Begin', value: 'February 2027' },
      { label: 'Intermediate Exams Begin', value: 'February 2027' }
    ],
    vacancyBreakdown: [
      { postName: 'UPMSP Class 10th & 12th Board Examination 2027', totalPosts: 'Over 55 Lakh Registered Students', eligibility: 'Enrolled students in UP Board recognized schools.' }
    ],
    howToApplySteps: [
      'Click on Download UP Board Time Table 2027 PDF link.',
      'Check day-wise, subject-wise morning and evening shift exam schedule.',
      'Take printout and plan your study revision timetable accordingly.'
    ],
    directLinks: [
      { label: 'Download UP Board 10th / 12th Time Table 2027 PDF', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'UPMSP Official Website', actionText: 'upmsp.edu.in', type: 'official' }
    ]
  },
  {
    id: 'res-upsssc-moharir-2026',
    slug: 'upsssc-moharir-eligibility-result-2026',
    title: 'UPSSSC Moharir (Clerk / Writer) Advt 08-Exam/2022 Shortlisting & Eligibility Result for Mains Exam 2026',
    shortTitle: 'UPSSSC Moharir 2022 Eligibility Result 2026 for 92 Post',
    hindiTitle: 'यूपीएसएसएससी मोहर्रिर 2022 पात्रता परिणाम (92 पद)',
    category: 'result',
    department: 'State PSC',
    qualifications: ['12th Pass'],
    state: 'Uttar Pradesh',
    postDate: '07 October 2026',
    isHot: false,
    isNew: true,
    resultDate: '07 October 2026',
    shortInfo: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) has released the list of shortlisted candidates for Moharir (Chief Post Writer) 92 posts based on UPSSSC PET normalized scores.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2022', minAge: 18, maxAge: 40 },
    importantDates: [
      { label: 'Shortlisting Result Declared', value: '07/10/2026', isHighlight: true },
      { label: 'Mains Examination Date', value: 'November 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'Moharir (Chief Post Writer / Clerk)', totalPosts: '92 Posts', eligibility: 'Intermediate (10+2) with valid UPSSSC PET scorecard.' }
    ],
    howToApplySteps: [
      'Login on UPSSSC portal using Registration Number & Date of Birth.',
      'Check qualification status for Mains examination and pay Mains examination fee.'
    ],
    directLinks: [
      { label: 'Check UPSSSC Moharir Eligibility Result & Cutoff', actionText: 'Click Here', type: 'result', isPrimary: true },
      { label: 'UPSSSC Official Portal', actionText: 'upsssc.gov.in', type: 'official' }
    ]
  }
];

export const screenshotLatestJobPosts: SarkariPost[] = [
  {
    id: 'job-sci-court-master-2026',
    slug: 'sci-court-master-oct26',
    title: 'Supreme Court of India SCI Court Master (Shorthand) Recruitment 2026 Exam for 20 Post',
    shortTitle: 'Supreme Court of India Court Master Online Form 2026',
    hindiTitle: 'सुप्रीम कोर्ट ऑफ इंडिया कोर्ट मास्टर (आशुलिपिक) भर्ती 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'Other',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '19 October 2026',
    notificationNumber: 'SCI/Estt.II/CM-2026/04',
    totalVacancies: '20 Posts',
    salary: 'Pay Level 11 (₹ 67,700 - ₹ 2,08,700) + Central Allowances',
    salaryBand: '50K - 1 Lakh',
    isHot: true,
    isNew: true,
    lastDate: '15/11/2026',
    admitCardDate: 'Before Exam',
    examDate: 'As per Schedule',
    shortInfo: 'Supreme Court of India SCI has released Court Master (Shorthand) Notification. Those candidates who are interested in this SCI Court Master Recruitment 2026 Exam can Apply Online from 25 October 2026 to 15 November 2026. Read the notification for SCI Court Master 2026 Exam, eligibility, Subject Details information, Document Required, age limit, How to Apply and all other information.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '1500/-' },
      { category: 'SC / ST / PH', amount: '750/-' }
    ],
    feePaymentMode: 'Pay the Examination Fee Through Cast / Net Banking / Debit Card / Credit Card / UPI Mode Only.',
    ageLimit: {
      asOnDate: '01/10/2026',
      minAge: 30,
      maxAge: 45,
      notes: 'Age Relaxation Extra as per Supreme Court of India Court Master (Shorthand) Recruitment Rules 2026.'
    },
    importantDates: [
      { label: 'Application Begin', value: '25/10/2026' },
      { label: 'Last Date for Apply Online', value: '15/11/2026', isHighlight: true },
      { label: 'Pay Exam Fee Last Date', value: '15/11/2026' },
      { label: 'Exam Date', value: 'As per Schedule' },
      { label: 'Admit Card Available', value: 'Before Exam' }
    ],
    vacancyBreakdown: [
      {
        postName: 'Court Master (Shorthand)',
        totalPosts: '20',
        eligibility: `• Bachelor Degree in Any Stream in Any Recognized University in India.
• English Shorthand Speed : 120 WPM.
• Typing Speed on Computer : 40 WPM.
• Knowledge of Computer Operation with 5 Year Experience.
• For More Eligibility Details Read the Notification.`,
        modeOfSelection: 'Objective Type Written Test -> Shorthand (English) Test -> Typing Speed Test on Computer -> Personal Interview'
      }
    ],
    howToApplySteps: [
      'Supreme Court of India SCI Released Court Master (Shorthand) Recruitment 2026. Candidate Can Apply Between 25/10/2026 to 15/11/2026.',
      'Candidate Read the Notification Before Apply the Recruitment Application Form in Supreme Court Latest Recruitment 2026.',
      'Kindly Check and Collect the All Document - Eligibility, ID Proof, Address Details, Basic Details.',
      'Kindly Ready Scan Document Related to Recruitment Form - Photo, Sign, ID Proof, Etc.',
      'Before Submit the Application Form Must Check the Preview and All Column Carefully.',
      'If Candidate Required to Paying the Application Fee Must Submit. If You have Not the Required Application Fees Your Form is Not Completed.',
      'Take A Print Out of Final Submitted Form.'
    ],
    directLinks: [
      { label: 'Apply Online (Link Activate 25/10/2026)', actionText: 'Click Here', type: 'apply', url: 'https://main.sci.gov.in/recruitment', isPrimary: true },
      { label: 'Download Notification', actionText: 'Click Here', type: 'notification', url: 'https://main.sci.gov.in/recruitment' },
      { label: 'Supreme Court Official Website', actionText: 'Click Here', type: 'official', url: 'https://main.sci.gov.in/' }
    ]
  },
  {
    id: 'job-upessc-pgt-correction-2026',
    slug: 'upessc-up-pgt-teacher-correction-edit-form-2026',
    title: 'UPESSC Uttar Pradesh Post Graduate Teacher (PGT) Online Form Correction & Edit Window 2026',
    shortTitle: 'UPESSC UP PGT Teacher Online Correction / Edit Form 2026',
    hindiTitle: 'यूपीईएसएससी यूपी पीजीटी शिक्षक संशोधन / एडिट फॉर्म 2026',
    category: 'latest_jobs',
    department: 'Teaching',
    qualifications: ['Post Graduate', 'B.Ed / CTET'],
    state: 'Uttar Pradesh',
    postDate: '18 October 2026',
    notificationNumber: 'UPESSC/PGT-02/2026',
    totalVacancies: '4,163 Posts',
    salary: 'Pay Level 8 (₹ 47,600 - ₹ 1,51,100/-)',
    salaryBand: '25K - 50K',
    isHot: true,
    isNew: true,
    lastDate: '26/10/2026 (Correction Window Closes)',
    shortInfo: 'Uttar Pradesh Education Service Selection Commission (UPESSC), Prayagraj has opened the online correction / edit window for candidates who have applied for UP PGT (Post Graduate Teacher) recruitment. Candidates can edit their personal details, photograph, subject choices, and qualifications.',
    applicationFee: [
      { category: 'Correction / Modification Fee', amount: '₹ 200/- per correction' }
    ],
    feePaymentMode: 'Online through Net Banking or Debit Card.',
    ageLimit: { asOnDate: '01/07/2026', minAge: 21, notes: 'No upper age limit for PGT teachers in UP.' },
    importantDates: [
      { label: 'Correction Window Opens', value: '18/10/2026' },
      { label: 'Last Date for Correction / Edit', value: '26/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      {
        postName: 'Post Graduate Teacher (PGT - Various Subjects)',
        totalPosts: '4,163 Posts',
        eligibility: 'Master Degree in concerned subject with B.Ed degree.'
      }
    ],
    howToApplySteps: [
      'Click on UP PGT Correction Portal link below.',
      'Enter Registration Number and Password / OTP received on registered mobile.',
      'Make necessary edits in editable fields and verify preview.',
      'Submit correction and download updated application confirmation slip.'
    ],
    directLinks: [
      { label: 'Edit / Correct UP PGT Application Form', actionText: 'Edit Form', type: 'apply', isPrimary: true },
      { label: 'Download Official Correction Notice', actionText: 'Notice (PDF)', type: 'notification' },
      { label: 'UPESSC Official Portal', actionText: 'upessc.up.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-icsil-deo-2026',
    slug: 'icsil-data-entry-operator-deo-online-form-2026',
    title: 'ICSIL Delhi Data Entry Operator (DEO) & Computer Operator Recruitment 2026 Online Form',
    shortTitle: 'ICSIL Data Entry Operator DEO Post Online Form 2026',
    hindiTitle: 'आईसीएसआईएल दिल्ली डाटा एंट्री ऑपरेटर (डीईओ) भर्ती 2026',
    category: 'latest_jobs',
    department: 'Other',
    qualifications: ['12th Pass', 'Graduate'],
    state: 'Delhi',
    postDate: '17 October 2026',
    notificationNumber: 'ICSIL/DEO-Contract/2026',
    totalVacancies: '320 Posts',
    salary: '₹ 23,082/- to ₹ 25,500/- per month (as per Delhi Govt minimum wages)',
    salaryBand: 'Below 25K',
    isHot: false,
    isNew: true,
    lastDate: '30/10/2026',
    shortInfo: 'Intelligent Communication Systems India Limited (ICSIL), a joint venture of TCIL (Govt of India) and DSIIDC (Govt of NCT of Delhi), invites applications for engagement of Data Entry Operators (DEO) purely on contractual basis in Delhi Govt departments.',
    applicationFee: [
      { category: 'One Time Registration Fee', amount: '₹ 1000/- (Payable at time of joining)' }
    ],
    ageLimit: { asOnDate: '01/10/2026', minAge: 18, maxAge: 35 },
    importantDates: [
      { label: 'Online Application Begin', value: '17/10/2026' },
      { label: 'Last Date for Online Apply', value: '30/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      {
        postName: 'Data Entry Operator (DEO)',
        totalPosts: '320 Posts',
        eligibility: 'Graduate from recognized University or 10+2 with at least 30 wpm typing speed on computer.'
      }
    ],
    howToApplySteps: [
      'Visit ICSIL official career page.',
      'Fill in applicant details, educational qualifications, and typing speeds.',
      'Shortlisted candidates will be invited for typing skill test at ICSIL Delhi office.'
    ],
    directLinks: [
      { label: 'Apply Online for ICSIL DEO Vacancy', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download ICSIL DEO Detailed Notice', actionText: 'Download (PDF)', type: 'notification' },
      { label: 'ICSIL Official Portal', actionText: 'icsil.in', type: 'official' }
    ]
  },
  {
    id: 'job-cwc-asst-mgr-2026',
    slug: 'cwc-assistant-manager-junior-executive-form-2026',
    title: 'Central Warehousing Corporation CWC Assistant Manager & Junior Executive Recruitment 2026 Online Form',
    shortTitle: 'CWC Assistant Manager and Junior Executive Online Form 2026',
    hindiTitle: 'सीडब्ल्यूसी सहायक प्रबंधक एवं कनिष्ठ कार्यकारी भर्ती 2026',
    category: 'latest_jobs',
    department: 'Other',
    qualifications: ['Graduate', 'Post Graduate'],
    state: 'All India',
    postDate: '16 October 2026',
    notificationNumber: 'CWC/1-Rectt./2026/02',
    totalVacancies: '153 Posts',
    salary: 'Assistant Manager: ₹ 40,000 - ₹ 1,40,000 | Jr Executive: ₹ 29,000 - ₹ 93,000',
    salaryBand: '25K - 50K',
    isHot: false,
    isNew: true,
    lastDate: '04/11/2026',
    shortInfo: 'Central Warehousing Corporation (CWC), a Premier Schedule ‘A’ Mini-Ratna Public Sector Enterprise under Ministry of Consumer Affairs, Food & Public Distribution, invites online applications for Assistant Manager (General/Technical) and Junior Executive positions.',
    applicationFee: [
      { category: 'Male Candidates (General / EWS / OBC)', amount: '₹ 1250/-' },
      { category: 'SC / ST / PwBD / Ex-Servicemen / Female', amount: '₹ 400/-' }
    ],
    ageLimit: { asOnDate: '01/10/2026', minAge: 18, maxAge: 30 },
    importantDates: [
      { label: 'Online Registration Begin', value: '16/10/2026' },
      { label: 'Last Date to Apply Online', value: '04/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Assistant Manager (General / Technical)', totalPosts: '81 Posts', eligibility: 'Degree with Agriculture / Zoology / Chemistry or Post Graduate Degree.' },
      { postName: 'Junior Executive', totalPosts: '72 Posts', eligibility: 'Graduation in any discipline from a recognized University.' }
    ],
    howToApplySteps: [
      'Register on IBPS CWC application portal.',
      'Fill required details, upload photo & signature, and pay application fee.'
    ],
    directLinks: [
      { label: 'Apply Online for CWC Recruitment', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download Detailed Information Bulletin', actionText: 'Download (PDF)', type: 'notification' },
      { label: 'CWC Official Website', actionText: 'cewacor.nic.in', type: 'official' }
    ]
  },
  {
    id: 'job-upsssc-inter-level-2026',
    slug: 'upsssc-10-plus-2-inter-level-various-post-2026',
    title: 'UPSSSC 10+2 Intermediate Level Various Posts (Junior Assistant, Clerk, Typist) Recruitment 2026 Online Form',
    shortTitle: 'UPSSSC 10+2 Inter Level Various Post Online Form 2026',
    hindiTitle: 'यूपीएसएसएससी 10+2 इंटर लेवल विभिन्न पद भर्ती 2026',
    category: 'latest_jobs',
    department: 'State PSC',
    qualifications: ['12th Pass'],
    state: 'Uttar Pradesh',
    postDate: '15 October 2026',
    notificationNumber: 'UPSSSC/09-Exam/2026',
    totalVacancies: '5,512 Posts',
    salary: 'Pay Level 3 & Level 4 (₹ 21,700 - ₹ 69,100/-)',
    salaryBand: 'Below 25K',
    isHot: true,
    isNew: true,
    lastDate: '10/11/2026',
    shortInfo: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC), Lucknow has announced recruitment for 5,512 positions of Junior Assistant, Junior Clerk, and Assistant Grade-III in various Government departments of Uttar Pradesh for candidates with valid UPSSSC PET scorecard.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 25/-' },
      { category: 'SC / ST / PwD', amount: '₹ 25/-' }
    ],
    ageLimit: { asOnDate: '01/07/2026', minAge: 18, maxAge: 40 },
    importantDates: [
      { label: 'Online Application Begin', value: '15/10/2026' },
      { label: 'Last Date for Apply Online', value: '10/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Junior Assistant / Clerk / Typist', totalPosts: '5,512 Posts', eligibility: '10+2 Intermediate Exam with UPSSSC PET scorecard, Hindi Typing 25 wpm, English Typing 30 wpm & CCC Certificate.' }
    ],
    howToApplySteps: [
      'Authentication with UPSSSC PET Registration Number & OTP/Personal details.',
      'Fill required academic details and upload documents.',
      'Pay processing fee of Rs. 25/- online and take printout.'
    ],
    directLinks: [
      { label: 'Apply Online for UPSSSC Inter Level Posts', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download Detailed Advertisement', actionText: 'Download (PDF)', type: 'notification' },
      { label: 'UPSSSC Official Portal', actionText: 'upsssc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-mpesb-police-driver-2026',
    slug: 'mpesb-mp-police-constable-driver-form-2026',
    title: 'MPESB Madhya Pradesh Police Constable (Driver & Tradesman) Recruitment 2026 Online Form',
    shortTitle: 'MPESB MP Police Constable Driver Online Form 2026',
    hindiTitle: 'एमपी पुलिस कांस्टेबल ड्राइवर भर्ती 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'Police',
    qualifications: ['10th Pass'],
    state: 'Madhya Pradesh',
    postDate: '14 October 2026',
    notificationNumber: 'MPESB/Police-Driver/2026',
    totalVacancies: '1,820 Posts',
    salary: '₹ 19,500 - ₹ 62,000/- per month',
    salaryBand: 'Below 25K',
    isHot: true,
    isNew: true,
    lastDate: '08/11/2026',
    shortInfo: 'Madhya Pradesh Employees Selection Board (MPESB), Bhopal invites online applications for recruitment to the post of Police Constable (Driver) in MP State Police. Candidates with valid Heavy / Light Motor Vehicle (HMV/LMV) driving licence are eligible.',
    applicationFee: [
      { category: 'Unreserved Candidates', amount: '₹ 500/- + Portal fee' },
      { category: 'SC / ST / OBC / EWS (MP Domicile)', amount: '₹ 250/- + Portal fee' }
    ],
    ageLimit: { asOnDate: '01/01/2026', minAge: 18, maxAge: 33 },
    importantDates: [
      { label: 'Online Registration Begin', value: '14/10/2026' },
      { label: 'Last Date for Online Apply', value: '08/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Constable (Driver)', totalPosts: '1,820 Posts', eligibility: 'Class 10th High School Pass with valid Heavy Motor Vehicle (HMV) driving license.' }
    ],
    howToApplySteps: [
      'Login via MP Online Portal with Profile Registration ID.',
      'Select MP Police Constable Driver 2026 Form.',
      'Pay fee through MP Online Kiosk or Net Banking/UPI.'
    ],
    directLinks: [
      { label: 'Apply Online (MP Police Driver)', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download Official Notification Rulebook', actionText: 'Rulebook (PDF)', type: 'notification' },
      { label: 'MPESB Official Website', actionText: 'esb.mp.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-upessc-primary-extended-2026',
    slug: 'upessc-up-primary-teacher-super-tet-2026',
    title: 'UPESSC UP Primary Teacher (Super TET) 2026 Recruitment Online Form | Extended',
    shortTitle: 'UPESSC UP Primary Teacher (Super TET) Online Form 2026 | Extended',
    hindiTitle: 'यूपी प्राइमरी टीचर (सुपर टीईटी) भर्ती 2026 | अंतिम तिथि विस्तारित',
    category: 'latest_jobs',
    department: 'Teaching',
    qualifications: ['Graduate', 'B.Ed / CTET'],
    state: 'Uttar Pradesh',
    postDate: '13 October 2026',
    notificationNumber: 'UPESSC/PRT-SuperTET/2026/01',
    totalVacancies: '17,000+ Posts',
    salary: 'Pay Level 6 (₹ 35,400 - ₹ 1,12,400/-) + DA & HRA',
    salaryBand: '25K - 50K',
    isHot: true,
    isNew: true,
    lastDate: '15/11/2026 (Date Extended)',
    shortInfo: 'Uttar Pradesh Education Service Selection Commission (UPESSC) has extended the last date to submit online applications for UP Primary Assistant Teacher (Super TET) recruitment. Eligible candidates can apply till 15 November 2026.',
    applicationFee: [
      { category: 'General / OBC', amount: '₹ 700/-' },
      { category: 'SC / ST', amount: '₹ 500/-' },
      { category: 'Divyang / PwD', amount: '₹ 200/-' }
    ],
    ageLimit: { asOnDate: '01/07/2026', minAge: 21, maxAge: 40 },
    importantDates: [
      { label: 'Online Application Begin', value: '01/10/2026' },
      { label: 'Last Date Extended Till', value: '15/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Assistant Teacher (Primary School - Classes 1 to 5)', totalPosts: '17,000+ Posts', eligibility: 'Graduation + 2-Year D.El.Ed / B.T.C. with UPTET or CTET Paper-I qualified.' }
    ],
    howToApplySteps: [
      'Visit UPESSC portal and register using Aadhaar card verification.',
      'Enter TET roll number to fetch verified score.',
      'Complete application and pay fee online.'
    ],
    directLinks: [
      { label: 'Apply Online (UP Super TET 2026)', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download Date Extension Notice', actionText: 'Notice (PDF)', type: 'notification' },
      { label: 'UPESSC Official Website', actionText: 'upessc.up.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-army-tes-57-2026',
    slug: 'army-10-plus-2-tes-57th-entry-2026',
    title: 'Join Indian Army 10+2 Technical Entry Scheme (TES-57 Course Commencing July 2027) Online Form',
    shortTitle: 'Army 10+2 TES 57th Online Form 2026',
    hindiTitle: 'ज्वाइन इंडियन आर्मी 10+2 टेक्निकल एंट्री स्कीम (टीईएस-57)',
    category: 'latest_jobs',
    department: 'Defence',
    qualifications: ['12th Pass'],
    state: 'All India',
    postDate: '12 October 2026',
    notificationNumber: 'TES-57/Army/2026',
    totalVacancies: '90 Posts',
    salary: 'Stipend ₹ 56,100/- p.m. during training, Lt Rank on Commissioning',
    salaryBand: '50K - 1 Lakh',
    isHot: true,
    isNew: true,
    lastDate: '12/11/2026',
    shortInfo: 'Applications are invited from unmarried male candidates who have passed 10+2 examination with Physics, Chemistry and Mathematics (PCM) and appeared in JEE (Mains) 2026 examination for grant of Permanent Commission in the Army.',
    applicationFee: [
      { category: 'All Candidates', amount: '₹ 0/- (Free - No Application Fee)' }
    ],
    ageLimit: { asOnDate: '01/07/2027', notes: 'Candidate must not be below 16½ years and above 19½ years on the first day of the month in which the course begins.' },
    importantDates: [
      { label: 'Online Application Begin', value: '12/10/2026' },
      { label: 'Last Date for Online Apply', value: '12/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Technical Entry Scheme (TES-57)', totalPosts: '90 Posts', eligibility: '10+2 passed with at least 60% aggregate marks in PCM and JEE Mains 2026 appearance.' }
    ],
    howToApplySteps: [
      'Register on Join Indian Army website (joinindianarmy.nic.in).',
      'Click on Officers Selection -> Apply Online.',
      'Enter JEE Mains Application Number and 10+2 marks.'
    ],
    directLinks: [
      { label: 'Apply Online for Army TES-57 Course', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download TES-57 Detailed Notification', actionText: 'Notification PDF', type: 'notification' },
      { label: 'Join Indian Army Portal', actionText: 'joinindianarmy.nic.in', type: 'official' }
    ]
  },
  {
    id: 'job-bpsc-tre-4-2026',
    slug: 'bpsc-school-teacher-tre-4-online-form-2026',
    title: 'BPSC Bihar School Teacher Recruitment Exam TRE 4.0 (Primary, Middle, Secondary & Higher Secondary) Online Form',
    shortTitle: 'BPSC School Teacher TRE 4.0 Online Form 2026',
    hindiTitle: 'बीपीएससी बिहार शिक्षक भर्ती परीक्षा TRE 4.0 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'Teaching',
    qualifications: ['Graduate', 'B.Ed / CTET'],
    state: 'Bihar',
    postDate: '11 October 2026',
    notificationNumber: 'BPSC/TRE-4.0/2026',
    totalVacancies: '87,000+ Posts',
    salary: '₹ 25,000 - ₹ 35,000 Basic + DA + HRA (Net approx ₹ 40,000 - ₹ 55,000)',
    salaryBand: '25K - 50K',
    isHot: true,
    isNew: true,
    lastDate: '20/11/2026',
    shortInfo: 'Bihar Public Service Commission (BPSC), Patna has invited online applications for the grand Phase-4 (TRE 4.0) School Teacher Recruitment for Primary (Class 1-5), Middle (Class 6-8), Secondary (Class 9-10), and Higher Secondary (Class 11-12) schools across Bihar.',
    applicationFee: [
      { category: 'General / OBC / Other State Candidates', amount: '₹ 750/-' },
      { category: 'SC / ST / Female / PwD of Bihar', amount: '₹ 200/-' }
    ],
    ageLimit: { asOnDate: '01/08/2026', minAge: 18, maxAge: 37 },
    importantDates: [
      { label: 'Online Application Begin', value: '11/10/2026' },
      { label: 'Last Date for Online Apply', value: '20/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Primary Teacher (Class 1-5)', totalPosts: '28,000 Posts', eligibility: '12th + D.El.Ed with CTET / BTET Paper 1.' },
      { postName: 'Middle Teacher (Class 6-8)', totalPosts: '19,500 Posts', eligibility: 'Graduation + D.El.Ed / B.Ed with CTET / BTET Paper 2.' },
      { postName: 'Secondary Teacher (Class 9-10)', totalPosts: '22,000 Posts', eligibility: 'Graduation + B.Ed with STET Paper 1.' },
      { postName: 'Higher Secondary (Class 11-12)', totalPosts: '17,500 Posts', eligibility: 'Post Graduation + B.Ed with STET Paper 2.' }
    ],
    howToApplySteps: [
      'Register on BPSC Online portal (onlinebpsc.bihar.gov.in).',
      'Upload live webcam photograph and Hindi/English signatures.',
      'Pay application fee and take final print of confirmation page.'
    ],
    directLinks: [
      { label: 'Apply Online for BPSC TRE 4.0', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download TRE 4.0 Full Notification', actionText: 'Notification (PDF)', type: 'notification' },
      { label: 'BPSC Official Website', actionText: 'bpsc.bih.nic.in', type: 'official' }
    ]
  },
  {
    id: 'job-rrb-paramedical-2026',
    slug: 'railway-rrb-paramedical-recruitment-2026',
    title: 'Railway Recruitment Board (RRB) Paramedical Categories (Nursing Superintendent, Pharmacist, Lab Tech) Online Form',
    shortTitle: 'Railway RRB Paramedical Online Form 2026',
    hindiTitle: 'रेलवे आरआरबी पैरामेडिकल भर्ती 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'Railway',
    qualifications: ['Medical / Nursing', 'Diploma / ITI'],
    state: 'All India',
    postDate: '10 October 2026',
    notificationNumber: 'CEN 04/2026 (Paramedical)',
    totalVacancies: '1,376 Posts',
    salary: 'Pay Level 4, 5, 6 & 7 (₹ 25,500 - ₹ 1,42,400/-)',
    salaryBand: '25K - 50K',
    isHot: true,
    isNew: true,
    lastDate: '05/11/2026',
    shortInfo: 'Government of India, Ministry of Railways (Railway Recruitment Boards) invites online applications for various Paramedical posts including Nursing Superintendent, Pharmacist, Health Inspector, and Lab Assistant.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 500/- (₹ 400 refunded after CBT)' },
      { category: 'SC / ST / Ex-SM / PwBD / Female', amount: '₹ 250/- (Full ₹ 250 refunded after CBT)' }
    ],
    ageLimit: { asOnDate: '01/01/2027', minAge: 20, maxAge: 40 },
    importantDates: [
      { label: 'Online Application Begin', value: '10/10/2026' },
      { label: 'Last Date for Online Apply', value: '05/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Nursing Superintendent', totalPosts: '713 Posts', eligibility: 'B.Sc Nursing / GNM Registered Nurse & Midwife.' },
      { postName: 'Pharmacist Entry Grade', totalPosts: '246 Posts', eligibility: '10+2 with Diploma / Degree in Pharmacy (D.Pharm / B.Pharm).' },
      { postName: 'Lab Assistant Grade II', totalPosts: '94 Posts', eligibility: '12th in Science with DMLT.' }
    ],
    howToApplySteps: [
      'Open RRB centralized portal and create your One-Time Profile.',
      'Fill required educational credentials and council registration numbers.',
      'Pay fee online and submit choice of Railway Zone.'
    ],
    directLinks: [
      { label: 'Apply Online for RRB Paramedical Categories', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download RRB Paramedical Detailed Notice', actionText: 'CEN 04/2026 PDF', type: 'notification' },
      { label: 'Railway Recruitment Boards Portal', actionText: 'rrbapply.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-bar-aibe-2026',
    slug: 'all-india-bar-aibe-xix-2026-online-form',
    title: 'Bar Council of India All India Bar Examination (AIBE XIX / 19) 2026 Online Registration & Application Form',
    shortTitle: 'All India BAR AIBE 2026 Apply Online',
    hindiTitle: 'ऑल इंडिया बार परीक्षा (AIBE XIX) 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'Other',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '09 October 2026',
    notificationNumber: 'BCI/AIBE-XIX/2026',
    totalVacancies: 'Certificate of Practice (COP)',
    salary: 'Advocate Certificate of Practice (Legal Practice License across Courts of India)',
    salaryBand: '50K - 1 Lakh',
    isHot: true,
    isNew: true,
    lastDate: '15/11/2026',
    shortInfo: 'Bar Council of India (BCI) has opened online registration for All India Bar Examination (AIBE-XIX). Law graduates enrolled as advocates with any State Bar Council must clear this exam to obtain Certificate of Practice (COP) to practice in any court in India.',
    applicationFee: [
      { category: 'General / OBC Candidates', amount: '₹ 3560/-' },
      { category: 'SC / ST Candidates', amount: '₹ 2560/-' }
    ],
    ageLimit: { asOnDate: '01/01/2026', notes: 'No upper age limit for appearing in AIBE examination.' },
    importantDates: [
      { label: 'Online Registration Begin', value: '09/10/2026' },
      { label: 'Last Date for Online Apply', value: '15/11/2026', isHighlight: true },
      { label: 'Admit Card Download', value: 'December 2026' },
      { label: 'AIBE XIX Exam Date', value: '22 December 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'Advocate Certificate of Practice (COP)', totalPosts: 'Qualifying Examination', eligibility: '3-Year or 5-Year LL.B Degree from BCI recognized law college and enrolled in State Bar Council.' }
    ],
    howToApplySteps: [
      'Visit official AIBE registration portal: allindiabarexamination.com.',
      'Enter State Bar Council Enrollment Number.',
      'Upload Law Degree / Provisional Certificate, Enrollment Certificate, Photo & Sign.',
      'Pay registration fee online and take printout of application.'
    ],
    directLinks: [
      { label: 'Apply Online for AIBE XIX 2026', actionText: 'Apply Online', type: 'apply', url: 'https://allindiabarexamination.com', isPrimary: true },
      { label: 'Download AIBE Syllabus & Exam Pattern', actionText: 'Syllabus (PDF)', type: 'syllabus' },
      { label: 'Bar Council of India Official Website', actionText: 'barcouncilofindia.org', type: 'official' }
    ]
  },
  {
    id: 'job-up-police-pet-admit-2026',
    slug: 'up-police-constable-pet-admit-card-2026',
    title: 'UP Police Constable 60,244 Posts Physical Efficiency Test (PET) & Physical Standard Test (PST) Admit Card 2026',
    shortTitle: 'UP Police Constable PET Admit Card',
    hindiTitle: 'यूपी पुलिस कांस्टेबल 60,244 पद शारीरिक दक्षता परीक्षा (PET) प्रवेश पत्र',
    category: 'admit_card',
    department: 'Police',
    qualifications: ['12th Pass'],
    state: 'Uttar Pradesh',
    postDate: '08 October 2026',
    notificationNumber: 'UPPRPB/PET/2026',
    totalVacancies: '60,244 Posts',
    isHot: true,
    isNew: true,
    examDate: 'Running Active Across UP Centres',
    shortInfo: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB), Lucknow has released the Physical Efficiency Test (PET) / Running Admit Card for candidates who qualified the Written Examination for 60,244 Constable Civil Police posts.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [
      { label: 'PET Admit Card Released', value: '08/10/2026', isHighlight: true },
      { label: 'Physical Test Dates', value: 'October - November 2026' }
    ],
    vacancyBreakdown: [
      { postName: 'Constable (Civil Police)', totalPosts: '60,244 Posts', eligibility: 'Male: 4.8 Km in 25 Minutes | Female: 2.4 Km in 14 Minutes.' }
    ],
    howToApplySteps: [
      'Click on Download UP Police PET Admit Card link.',
      'Enter your Registration Number and Date of Birth.',
      'Download and print hall ticket along with identity declaration.'
    ],
    directLinks: [
      { label: 'Download UP Police PET Admit Card', actionText: 'Download', type: 'admit_card', isPrimary: true },
      { label: 'UPPRPB Official Portal', actionText: 'uppbpb.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-railway-ntpc-grad-2026',
    slug: 'railway-rrb-ntpc-graduate-level-2026',
    title: 'Railway RRB NTPC Graduate Level CEN 05/2026 (Station Master, Goods Train Manager, Senior Clerk) Online Form',
    shortTitle: 'Railway NTPC Graduate Level Apply Online',
    hindiTitle: 'रेलवे आरआरबी एनटीपीसी स्नातक स्तर भर्ती 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'Railway',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '07 October 2026',
    notificationNumber: 'CEN 05/2026 (Graduate)',
    totalVacancies: '8,113 Posts',
    salary: 'Pay Level 5 & Level 6 (₹ 29,200 - ₹ 92,300 + DA & HRA)',
    salaryBand: '25K - 50K',
    isHot: true,
    isNew: true,
    lastDate: '13/11/2026',
    shortInfo: 'Railway Recruitment Boards (RRBs) invite online applications for 8,113 Graduate Level posts under Non-Technical Popular Categories (NTPC) including Goods Train Manager, Chief Commercial cum Ticket Supervisor, Senior Clerk cum Typist, and Station Master.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 500/- (₹ 400 refunded after CBT-1)' },
      { category: 'SC / ST / PwBD / Female / Minorities', amount: '₹ 250/- (Full ₹ 250 refunded after CBT-1)' }
    ],
    ageLimit: { asOnDate: '01/01/2025', minAge: 18, maxAge: 36 },
    importantDates: [
      { label: 'Online Application Begin', value: '14/09/2026' },
      { label: 'Last Date for Apply Online', value: '13/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      { postName: 'Goods Train Manager (GTM)', totalPosts: '3,144 Posts', eligibility: 'Bachelor Degree in any stream from recognized University.' },
      { postName: 'Station Master', totalPosts: '994 Posts', eligibility: 'Degree in any discipline from recognized University.' },
      { postName: 'Senior Clerk Cum Typist', totalPosts: '2,429 Posts', eligibility: 'Bachelor Degree with English/Hindi Typing proficiency.' }
    ],
    howToApplySteps: [
      'Visit rrbapply.gov.in and login to your existing account or register anew.',
      'Select CEN 05/2026 (Graduate Level) and submit preferred RRB zones.',
      'Pay application fee online and print application confirmation.'
    ],
    directLinks: [
      { label: 'Apply Online for RRB NTPC Graduate Level', actionText: 'Apply Online', type: 'apply', isPrimary: true },
      { label: 'Download Official Notification CEN 05/2026', actionText: 'Download (PDF)', type: 'notification' },
      { label: 'RRB Official Apply Portal', actionText: 'rrbapply.gov.in', type: 'official' }
    ]
  }
];

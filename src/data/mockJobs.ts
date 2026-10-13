import { SarkariPost } from '../types/job';

export const mockSarkariPosts: SarkariPost[] = [
  // --- LATEST JOBS ---
  {
    id: 'job-1',
    slug: 'upsc-civil-services-ias-ifs-2026',
    title: 'UPSC Civil Services (IAS / IFS) Examination 2026 Online Application Form',
    shortTitle: 'UPSC Civil Services 2026 Apply Online',
    hindiTitle: 'यूपीएससी सिविल सेवा आईएएस / आईएफएस 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'UPSC',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '10 October 2026',
    notificationNumber: '05/2026-CSP',
    totalVacancies: 1056,
    isHot: true,
    isNew: true,
    lastDate: '05 November 2026',
    examDate: '24 May 2026 (Prelims)',
    shortInfo: 'Union Public Service Commission (UPSC) has released the notification for Civil Services Prelims (IAS / IFS) Examination 2026. Any candidate with a Bachelor Degree in any stream can apply online between 10 Oct to 05 Nov 2026.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 100/-' },
      { category: 'SC / ST / PH', amount: '₹ 0/- (Exempted)' },
      { category: 'All Category Female', amount: '₹ 0/- (Exempted)' }
    ],
    feePaymentMode: 'Pay exam fee via Net Banking, Debit Card, Credit Card, UPI or SBI Challan',
    ageLimit: {
      asOnDate: '01/08/2026',
      minAge: 21,
      maxAge: 32,
      notes: 'Age relaxation applicable: OBC 3 Years, SC/ST 5 Years, PwBD 10 Years as per UPSC Civil Services Rules 2026.'
    },
    importantDates: [
      { label: 'Application Begin', value: '10/10/2026' },
      { label: 'Last Date for Apply Online', value: '05/11/2026 up to 06:00 PM', isHighlight: true },
      { label: 'Pay Exam Fee Last Date', value: '05/11/2026' },
      { label: 'Correction Window Date', value: '06/11/2026 to 12/11/2026' },
      { label: 'Pre Exam Date', value: '24/05/2026', isHighlight: true },
      { label: 'Admit Card Available', value: 'May 2026' }
    ],
    vacancyBreakdown: [
      {
        postName: 'Indian Administrative Service (IAS / IPS / IFS & Allied Services)',
        totalPosts: '906',
        eligibility: 'Bachelor Degree in Any Stream from Any Recognized University in India.',
        categoryBreakdown: { gen: 390, obc: 245, ews: 90, sc: 135, st: 46 }
      },
      {
        postName: 'Indian Forest Service (IFS)',
        totalPosts: '150',
        eligibility: 'Bachelor Degree with at least one subject Animal Husbandry, Botany, Chemistry, Geology, Mathematics, Physics, Statistics and Zoology or Agriculture/Engineering.',
        categoryBreakdown: { gen: 65, obc: 40, ews: 15, sc: 20, st: 10 }
      }
    ],
    howToApplySteps: [
      'Union Public Service Commission UPSC Civil Services IAS / IFS Recruitment 2026. Candidate can apply between 10/10/2026 to 05/11/2026.',
      'One Time Registration (OTR) is mandatory before applying for UPSC Civil Services 2026.',
      'Candidate Read the Notification carefully before applying the recruitment application form.',
      'Kindly check and collect all documents - Eligibility, ID Proof, Address Details, Basic Details.',
      'Kindly ready scan document related to recruitment form - Photo, Sign, ID Proof, etc.',
      'Before submit the application form must check the preview and all column carefully.',
      'Take a print out of final submitted form for future reference.'
    ],
    directLinks: [
      { label: 'Apply Online (OTR / Registration)', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Detailed Notification (English)', actionText: 'Click Here (PDF)', type: 'notification' },
      { label: 'Download Detailed Notification (Hindi)', actionText: 'Click Here (PDF)', type: 'notification' },
      { label: 'Syllabus & Exam Pattern PDF', actionText: 'Download', type: 'syllabus' },
      { label: 'UPSC Official Website', actionText: 'upsc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-2',
    slug: 'ssc-cgl-2026-online-form',
    title: 'SSC CGL 2026 Combined Graduate Level Examination Online Form (14,500 Posts)',
    shortTitle: 'SSC CGL 2026 Online Form',
    hindiTitle: 'एसएससी सीजीएल 2026 ऑनलाइन आवेदन फॉर्म',
    category: 'latest_jobs',
    department: 'SSC',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '08 October 2026',
    notificationNumber: 'F.No.HQ-PPI03/11/2026',
    totalVacancies: 14500,
    isHot: true,
    isNew: true,
    lastDate: '30 October 2026',
    examDate: 'December 2026 (Tier-I)',
    shortInfo: 'Staff Selection Commission (SSC) invites online applications for Combined Graduate Level CGL Examination 2026 for various Group B and Group C posts in central government departments. Total 14,500 vacancies.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 100/-' },
      { category: 'SC / ST / PwD / ESM', amount: '₹ 0/-' },
      { category: 'All Category Female', amount: '₹ 0/-' }
    ],
    feePaymentMode: 'Online through BHIM UPI, Net Banking, Visa, Mastercard, Maestro, RuPay Credit or Debit cards',
    ageLimit: {
      asOnDate: '01/08/2026',
      minAge: 18,
      maxAge: 32,
      notes: 'Post-wise age limit varies (18-27, 18-30, 20-30, 18-32 Years). Relaxation applicable as per Central Govt rules.'
    },
    importantDates: [
      { label: 'Online Application Begin', value: '08/10/2026' },
      { label: 'Last Date for Registration', value: '30/10/2026 up to 11:00 PM', isHighlight: true },
      { label: 'Online Fee Payment Last Date', value: '31/10/2026' },
      { label: 'Window for Application Form Correction', value: '03/11/2026 to 04/11/2026' },
      { label: 'Tier-I Computer Based Exam (CBE)', value: 'December 2026', isHighlight: true },
      { label: 'Tier-II Exam Date', value: 'Notified Soon' }
    ],
    vacancyBreakdown: [
      {
        postName: 'Assistant Section Officer (ASO), Inspector (Central Excise, IT, Preventive), Sub-Inspector CBI',
        totalPosts: '9,200',
        eligibility: 'Bachelor Degree in Any Stream from Any Recognized University in India.'
      },
      {
        postName: 'Junior Statistical Officer (JSO)',
        totalPosts: '650',
        eligibility: 'Bachelor Degree with at least 60% Marks in Mathematics at 12th standard OR Bachelor Degree with Statistics as one of the subjects.'
      },
      {
        postName: 'Auditor, Accountant, Tax Assistant, Upper Division Clerk (UDC)',
        totalPosts: '4,650',
        eligibility: 'Bachelor Degree in Any Stream from Any Recognized University.'
      }
    ],
    howToApplySteps: [
      'Staff Selection Commission has launched new website ssc.gov.in. All candidates must complete One Time Registration (OTR).',
      'Live photo capture will be conducted via SSC mobile app / webcam during form submission. No pre-uploaded passport photo required.',
      'Check all academic details and category certificate validity.',
      'Submit exam center preference and pay required application fee.'
    ],
    directLinks: [
      { label: 'Apply Online', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Official Notification', actionText: 'Click Here', type: 'notification' },
      { label: 'SSC New Portal OTR Registration', actionText: 'Register Now', type: 'apply' },
      { label: 'Tier-I Exam Syllabus & Pattern', actionText: 'Download', type: 'syllabus' },
      { label: 'Official Website', actionText: 'ssc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-3',
    slug: 'railway-rrb-ntpc-recruitment-2026',
    title: 'Railway RRB NTPC Graduate & Undergraduate Level Recruitment 2026 (11,558 Posts)',
    shortTitle: 'Railway RRB NTPC 2026 Apply',
    hindiTitle: 'रेलवे आरआरबी एनटीपीसी भर्ती 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'Railway',
    qualifications: ['12th Pass', 'Graduate'],
    state: 'All India',
    postDate: '05 October 2026',
    notificationNumber: 'CEN 05/2026 & CEN 06/2026',
    totalVacancies: 11558,
    isHot: true,
    isNew: true,
    lastDate: '15 November 2026',
    examDate: 'Jan / Feb 2027 (CBT-1)',
    shortInfo: 'Railway Recruitment Boards (RRBs) have announced 11,558 vacancies for Graduate and Undergraduate Non-Technical Popular Categories (NTPC) including Station Master, Goods Train Manager, Senior Clerk, Junior Clerk, and Commercial Apprentice.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 500/- (₹ 400 refunded after CBT-1)' },
      { category: 'SC / ST / PwBD / Female / Minorities', amount: '₹ 250/- (₹ 250 full refunded after CBT-1)' }
    ],
    feePaymentMode: 'Online Net Banking / Debit Card / UPI',
    ageLimit: {
      asOnDate: '01/01/2027',
      minAge: 18,
      maxAge: 36,
      notes: 'Age Relaxation: 3 years extra relaxation given for COVID gap. OBC +3 yrs, SC/ST +5 yrs.'
    },
    importantDates: [
      { label: 'Application Started', value: '14/09/2026' },
      { label: 'Last Date for Apply Online (Graduate)', value: '13/10/2026' },
      { label: 'Last Date for Apply Online (Undergraduate)', value: '15/11/2026', isHighlight: true },
      { label: 'Fee Payment Last Date', value: '16/11/2026' },
      { label: 'CBT 1 Exam Date', value: 'Jan - Feb 2027', isHighlight: true }
    ],
    vacancyBreakdown: [
      {
        postName: 'Graduate Posts: Chief Commercial Cum Ticket Supervisor, Station Master, Goods Train Manager, Jr Accounts Assistant',
        totalPosts: '8,113',
        eligibility: 'Bachelor Degree in Any Stream from Any Recognized University in India.'
      },
      {
        postName: 'Undergraduate Posts: Commercial Cum Ticket Clerk, Accounts Clerk, Junior Clerk Cum Typist, Trains Clerk',
        totalPosts: '3,445',
        eligibility: 'Class 12th (10+2) Examination Passed with 50% aggregate marks (50% not required for SC/ST/PwBD).'
      }
    ],
    howToApplySteps: [
      'Candidates can apply through any one RRB zone only.',
      'Keep valid mobile number, active email, Aadhaar card number, and academic certificates ready.',
      'Upload recent photograph with plain white background and signature in blue/black ink.',
      'Carefully enter bank account details for refund of examination fee.'
    ],
    directLinks: [
      { label: 'Apply Online (RRB Apply Portal)', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Graduate Notification (CEN 05/2026)', actionText: 'Click Here', type: 'notification' },
      { label: 'Download Undergraduate Notification (CEN 06/2026)', actionText: 'Click Here', type: 'notification' },
      { label: 'Official RRB Recruitment Portal', actionText: 'rrbapply.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-4',
    slug: 'up-police-constable-recruitment-60244',
    title: 'UP Police Constable Civil Police Recruitment 2026 (60,244 Posts)',
    shortTitle: 'UP Police Constable 60,244 Posts',
    hindiTitle: 'यूपी पुलिस कांस्टेबल भर्ती 2026',
    category: 'latest_jobs',
    department: 'Police',
    qualifications: ['12th Pass'],
    state: 'Uttar Pradesh',
    postDate: '02 October 2026',
    notificationNumber: 'PRPB-1(150)/2026',
    totalVacancies: 60244,
    isHot: true,
    isNew: false,
    lastDate: '25 October 2026',
    examDate: '15-18 November 2026',
    shortInfo: 'Uttar Pradesh Police Recruitment & Promotion Board (UPPRPB) invites online applications for Civil Police Constable. Huge recruitment drive of 60,244 vacancies for Male and Female candidates.',
    applicationFee: [
      { category: 'General / OBC', amount: '₹ 400/-' },
      { category: 'SC / ST', amount: '₹ 400/-' }
    ],
    feePaymentMode: 'Pay fee through E-Challan or Online Debit Card / Credit Card / UPI',
    ageLimit: {
      asOnDate: '01/07/2026',
      minAge: 18,
      maxAge: 25,
      notes: 'Male Max Age 25 Yrs, Female Max Age 28 Yrs. 3 Years general age concession added.'
    },
    importantDates: [
      { label: 'Application Begin', value: '27/12/2025' },
      { label: 'Last Date for Apply Online', value: '25/10/2026', isHighlight: true },
      { label: 'Admit Card Available', value: '05/11/2026', isHighlight: true },
      { label: 'Exam Date', value: '15-18 November 2026' }
    ],
    vacancyBreakdown: [
      {
        postName: 'UP Police Constable (Civil Police)',
        totalPosts: '60,244',
        eligibility: '10+2 (Intermediate) Exam Passed from Any Recognized Board in India.',
        categoryBreakdown: { gen: 24102, ews: 6024, obc: 16264, sc: 12650, st: 1204 }
      }
    ],
    howToApplySteps: [
      'Apply online on UPPRPB official portal uppbpb.gov.in.',
      'Candidate height requirement: Male Gen/OBC/SC 168 CM, ST 160 CM. Female Gen/OBC/SC 152 CM, ST 147 CM.',
      'Running requirement: Male 4.8 KM in 25 Minutes, Female 2.4 KM in 14 Minutes.'
    ],
    directLinks: [
      { label: 'Apply Online Form', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Detailed Notification', actionText: 'Click Here (PDF)', type: 'notification' },
      { label: 'Physical Standard & Syllabus', actionText: 'Download', type: 'syllabus' },
      { label: 'UPPRPB Official Website', actionText: 'uppbpb.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-5',
    slug: 'ssc-gd-constable-2026-online-form',
    title: 'SSC GD Constable in BSF, CISF, CRPF, SSB, ITBP, AR, SSF Recruitment 2026 (39,481 Posts)',
    shortTitle: 'SSC GD Constable 39,481 Posts',
    hindiTitle: 'एसएससी जीडी कांस्टेबल भर्ती 2026 ऑनलाइन फॉर्म',
    category: 'latest_jobs',
    department: 'SSC',
    qualifications: ['10th Pass'],
    state: 'All India',
    postDate: '01 October 2026',
    notificationNumber: 'HQ-C-II01/14/2026-C2',
    totalVacancies: 39481,
    isHot: true,
    isNew: true,
    lastDate: '14 October 2026',
    examDate: 'January - February 2027',
    shortInfo: 'Staff Selection Commission SSC has issued notice for recruitment of Constable (General Duty) in Central Armed Police Forces (CAPFs), SSF, Rifleman (GD) in Assam Rifles. 10th pass candidates can apply.',
    applicationFee: [
      { category: 'General / OBC / EWS', amount: '₹ 100/-' },
      { category: 'SC / ST / ESM / Female', amount: '₹ 0/-' }
    ],
    feePaymentMode: 'Online Payment Mode',
    ageLimit: {
      asOnDate: '01/01/2027',
      minAge: 18,
      maxAge: 23,
      notes: 'Age relaxation: SC/ST 5 Years, OBC 3 Years.'
    },
    importantDates: [
      { label: 'Application Begin', value: '05/09/2026' },
      { label: 'Last Date for Apply Online', value: '14/10/2026 up to 11:00 PM', isHighlight: true },
      { label: 'Last Date Fee Payment', value: '15/10/2026' },
      { label: 'CBT Exam Date', value: 'Jan - Feb 2027', isHighlight: true }
    ],
    vacancyBreakdown: [
      {
        postName: 'Constable GD (BSF, CISF, CRPF, SSB, ITBP, AR, SSF)',
        totalPosts: '39,481',
        eligibility: 'Passed Class 10 (High School) Exam from Any Recognized Board in India. Height: Male 170 CM, Female 157 CM.'
      }
    ],
    howToApplySteps: [
      'Fill application form via SSC portal ssc.gov.in using OTR credentials.',
      'Check force preferences (BSF, CISF, CRPF, SSB, ITBP, Assam Rifles, SSF) carefully before final submission.'
    ],
    directLinks: [
      { label: 'Apply Online Form', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Notification PDF', actionText: 'Click Here', type: 'notification' },
      { label: 'Official Website', actionText: 'ssc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'job-6',
    slug: 'indian-army-agniveer-rally-2026',
    title: 'Indian Army Agniveer Rally Recruitment Online Form 2026 (All AROs)',
    shortTitle: 'Army Agniveer Rally 2026',
    hindiTitle: 'भारतीय सेना अग्निवीर भर्ती 2026',
    category: 'latest_jobs',
    department: 'Defence',
    qualifications: ['10th Pass', '12th Pass'],
    state: 'All India',
    postDate: '28 September 2026',
    totalVacancies: 'Various Rallies Across India',
    isHot: true,
    isNew: false,
    lastDate: '22 October 2026',
    shortInfo: 'Join Indian Army has invited online applications for Agniveer General Duty, Technical, Clerk/Store Keeper, and Tradesmen for all Army Recruiting Offices (AROs) across India.',
    applicationFee: [
      { category: 'All Candidates', amount: '₹ 250/- + GST' }
    ],
    ageLimit: {
      asOnDate: '01/10/2026',
      minAge: 17.5,
      maxAge: 21,
      notes: 'Candidate must be born between 01 Oct 2005 to 01 April 2009.'
    },
    importantDates: [
      { label: 'Application Begin', value: '20/09/2026' },
      { label: 'Last Date for Apply', value: '22/10/2026', isHighlight: true },
      { label: 'Common Entrance Exam (CEE)', value: 'December 2026', isHighlight: true }
    ],
    vacancyBreakdown: [
      {
        postName: 'Agniveer General Duty (All Arms)',
        totalPosts: 'Open Rally',
        eligibility: 'Class 10th / Matric with 45% marks in aggregate and 33% in each subject.'
      },
      {
        postName: 'Agniveer Technical (All Arms)',
        totalPosts: 'Open Rally',
        eligibility: '10+2 / Intermediate exam pass in Science with Physics, Chemistry, Maths and English with min 50% marks.'
      },
      {
        postName: 'Agniveer Clerk / Store Keeper Technical',
        totalPosts: 'Open Rally',
        eligibility: '10+2 / Intermediate exam pass in any stream with 60% marks aggregate and min 50% in English and Maths/Accounts.'
      }
    ],
    howToApplySteps: [
      'Visit joinindianarmy.nic.in and register under Agnipath scheme.',
      'Check your eligibility, physical standards, and ARO rally schedule.'
    ],
    directLinks: [
      { label: 'Apply Online (Join Indian Army)', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Rally Notification', actionText: 'Click Here', type: 'notification' },
      { label: 'Official Website', actionText: 'joinindianarmy.nic.in', type: 'official' }
    ]
  },

  // --- ADMIT CARDS ---
  {
    id: 'admit-1',
    slug: 'ssc-cgl-tier-ii-admit-card-2026',
    title: 'SSC CGL Tier-II Exam Admit Card & Application Status 2026 (All Regions)',
    shortTitle: 'SSC CGL Tier-II Admit Card',
    hindiTitle: 'एसएससी सीजीएल टियर-2 प्रवेश पत्र 2026',
    category: 'admit_card',
    department: 'SSC',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '11 October 2026',
    isHot: true,
    isNew: true,
    examDate: '25-27 October 2026',
    shortInfo: 'Staff Selection Commission (SSC) has released the Computer Based Exam (Tier-II) Admit Card and City Intimation for Combined Graduate Level Examination 2026 across CR, NR, ER, WR, SR, KKR, MPR, NER regions.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/08/2026' },
    importantDates: [
      { label: 'Tier-II Exam Date', value: '25-27 October 2026', isHighlight: true },
      { label: 'Application Status Available', value: '08/10/2026' },
      { label: 'Admit Card Available', value: '11/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Click on your respective region link (CR, NR, ER, WR, MPR, etc.).',
      'Enter Registration Number and Date of Birth OR Candidate Name and Father Name.',
      'Verify Captcha and click Check Status / Download Admit Card.',
      'Take a clear colored or black & white printout and carry 2 original photo ID cards.'
    ],
    directLinks: [
      { label: 'Download Admit Card (CR Region)', actionText: 'Download', type: 'admit_card', isPrimary: true },
      { label: 'Download Admit Card (NR Region)', actionText: 'Download', type: 'admit_card' },
      { label: 'Download Admit Card (Other Regions)', actionText: 'Click Here', type: 'admit_card' },
      { label: 'Check Application Status / Exam City', actionText: 'Click Here', type: 'admit_card' },
      { label: 'Official SSC Portal', actionText: 'ssc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'admit-2',
    slug: 'railway-rrb-alp-admit-card-2026',
    title: 'Railway RRB ALP (Assistant Loco Pilot) CBT-1 Exam City & Admit Card 2026',
    shortTitle: 'RRB ALP CBT-1 Admit Card',
    hindiTitle: 'रेलवे आरआरबी एएलपी सीबीटी-1 एडमिट कार्ड 2026',
    category: 'admit_card',
    department: 'Railway',
    qualifications: ['10th Pass', 'Diploma / ITI'],
    state: 'All India',
    postDate: '09 October 2026',
    isHot: true,
    isNew: true,
    examDate: '18-24 October 2026',
    shortInfo: 'Railway Recruitment Boards have activated the Exam City Intimation Slip and E-Call Letter download link for Assistant Loco Pilot (ALP) CEN 01/2026 CBT Stage 1 Exam.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [
      { label: 'Exam City Slip Available', value: '05/10/2026' },
      { label: 'Admit Card Download Date', value: '4 Days Before Exam Date', isHighlight: true },
      { label: 'CBT 1 Exam Date', value: '18-24 October 2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Log in with your Registration ID and User Password.',
      'View assigned exam date, shift timings and city.',
      'Download e-Call letter and Travel Authority pass for SC/ST candidates.'
    ],
    directLinks: [
      { label: 'Download CBT-1 Admit Card', actionText: 'Click Here', type: 'admit_card', isPrimary: true },
      { label: 'Check Exam City & Date Intimation', actionText: 'Click Here', type: 'admit_card' },
      { label: 'Mock Test Link for CBT-1', actionText: 'Practice Test', type: 'admit_card' },
      { label: 'Official Website', actionText: 'rrbapply.gov.in', type: 'official' }
    ]
  },
  {
    id: 'admit-3',
    slug: 'ctet-exam-admit-card-2026',
    title: 'CTET Central Teacher Eligibility Test 2026 Pre-Admit Card & Exam City',
    shortTitle: 'CTET 2026 Admit Card',
    hindiTitle: 'सीटेट 2026 एडमिट कार्ड व परीक्षा शहर',
    category: 'admit_card',
    department: 'Teaching',
    qualifications: ['B.Ed / CTET', 'Graduate'],
    state: 'All India',
    postDate: '06 October 2026',
    isHot: false,
    isNew: true,
    examDate: '01 November 2026',
    shortInfo: 'Central Board of Secondary Education (CBSE) has issued the CTET examination pre-admit card showing allocated city and shift details for Paper 1 and Paper 2.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2026' },
    importantDates: [
      { label: 'Pre Admit Card (City)', value: '06/10/2026' },
      { label: 'Final Admit Card Date', value: '29/10/2026', isHighlight: true },
      { label: 'Exam Date', value: '01/11/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Open CTET candidate portal.',
      'Input Application Number and Date of Birth.',
      'Download and print Self Declaration undertaking.'
    ],
    directLinks: [
      { label: 'Download Pre Admit Card / Exam City', actionText: 'Click Here', type: 'admit_card', isPrimary: true },
      { label: 'Download Final Admit Card', actionText: 'Link Available Soon', type: 'admit_card' },
      { label: 'Official Website', actionText: 'ctet.nic.in', type: 'official' }
    ]
  },
  {
    id: 'admit-4',
    slug: 'upsc-cds-ii-admit-card-2026',
    title: 'UPSC Combined Defence Services CDS-II Examination 2026 E-Admit Card',
    shortTitle: 'UPSC CDS-II Admit Card',
    hindiTitle: 'यूपीएससी सीडीएस-2 ई-प्रवेश पत्र 2026',
    category: 'admit_card',
    department: 'UPSC',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '04 October 2026',
    isHot: false,
    isNew: false,
    examDate: '19 October 2026',
    shortInfo: 'Union Public Service Commission (UPSC) has released e-Admit Card for Combined Defence Services Examination (II) 2026.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [
      { label: 'Admit Card Available', value: '04/10/2026', isHighlight: true },
      { label: 'CDS-II Exam Date', value: '19/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Enter Registration ID or Roll Number with Date of Birth to fetch your hall ticket.'
    ],
    directLinks: [
      { label: 'Download CDS-II E-Admit Card', actionText: 'Click Here', type: 'admit_card', isPrimary: true },
      { label: 'Official UPSC Portal', actionText: 'upsc.gov.in', type: 'official' }
    ]
  },

  // --- RESULTS ---
  {
    id: 'result-1',
    slug: 'ssc-chsl-tier-i-result-cutoff-2026',
    title: 'SSC CHSL 10+2 Tier-I Result, Merit List & Category-wise Cut Off Marks 2026',
    shortTitle: 'SSC CHSL Tier-I Result & Cutoff',
    hindiTitle: 'एसएससी सीएचएसएल टियर-1 परिणाम व कटऑफ 2026',
    category: 'result',
    department: 'SSC',
    qualifications: ['12th Pass'],
    state: 'All India',
    postDate: '11 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '11 October 2026',
    shortInfo: 'Staff Selection Commission (SSC) has declared the result of Combined Higher Secondary (10+2) Level Examination (Tier-I) 2026. Candidates can check qualifying list for LDC, JSA and DEO along with category cutoff marks.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/08/2026' },
    importantDates: [
      { label: 'Tier-I Exam Held', value: 'July 2026' },
      { label: 'Result Declared Date', value: '11/10/2026', isHighlight: true },
      { label: 'Marks / Scorecard Available', value: '16/10/2026' }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Open the Result PDF list 1 / List 2.',
      'Use Ctrl + F to search your Roll Number or Name.',
      'Check category cutoff marks in the official write-up notice.'
    ],
    directLinks: [
      { label: 'Download Result List 1 (LDC / JSA)', actionText: 'Download (PDF)', type: 'result', isPrimary: true },
      { label: 'Download Result List 2 (DEO Posts)', actionText: 'Download (PDF)', type: 'result' },
      { label: 'Download Official Cut Off Notice', actionText: 'Check Cutoff', type: 'result' },
      { label: 'Check Candidate Marks / Scorecard', actionText: 'Click Here', type: 'result' }
    ]
  },
  {
    id: 'result-2',
    slug: 'upsc-nda-final-result-2026',
    title: 'UPSC National Defence Academy & Naval Academy (NDA / NA) Final Result with Marks 2026',
    shortTitle: 'UPSC NDA Final Result',
    hindiTitle: 'यूपीएससी एनडीए फाइनल रिजल्ट 2026',
    category: 'result',
    department: 'UPSC',
    qualifications: ['12th Pass'],
    state: 'All India',
    postDate: '10 October 2026',
    isHot: true,
    isNew: true,
    resultDate: '10 October 2026',
    shortInfo: 'Union Public Service Commission (UPSC) has announced the Final Result of National Defence Academy and Naval Academy Examination 2026 based on Written Exam and SSB Interviews.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2026' },
    importantDates: [
      { label: 'Final Result Declared', value: '10/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Download merit list PDF containing roll numbers and names of selected candidates.'
    ],
    directLinks: [
      { label: 'Download NDA Final Merit List (PDF)', actionText: 'Click Here', type: 'result', isPrimary: true },
      { label: 'Download Cutoff & Recommendation List', actionText: 'Download', type: 'result' },
      { label: 'UPSC Official Portal', actionText: 'upsc.gov.in', type: 'official' }
    ]
  },
  {
    id: 'result-3',
    slug: 'ibps-po-mains-score-card-2026',
    title: 'IBPS PO / MT XIV Mains Exam Score Card & Interview Call Letter 2026',
    shortTitle: 'IBPS PO Mains Score Card',
    hindiTitle: 'आईबीपीएस पीओ मेन्स स्कोर कार्ड 2026',
    category: 'result',
    department: 'Banking',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '08 October 2026',
    isHot: false,
    isNew: true,
    resultDate: '08 October 2026',
    shortInfo: 'Institute of Banking Personnel Selection (IBPS) has activated the score card link for Probationary Officers (PO/MT) Mains examination and interview call letter download.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/08/2026' },
    importantDates: [
      { label: 'Mains Score Card Available', value: '08/10/2026 to 22/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Login with Registration No / Roll No and Password / DOB to check sectional & overall marks.'
    ],
    directLinks: [
      { label: 'Check IBPS PO Mains Score Card', actionText: 'Click Here', type: 'result', isPrimary: true },
      { label: 'Download Interview Call Letter', actionText: 'Click Here', type: 'admit_card' },
      { label: 'Official Website', actionText: 'ibps.in', type: 'official' }
    ]
  },
  {
    id: 'result-4',
    slug: 'upsssc-pet-revised-scorecard-2026',
    title: 'UPSSSC PET Preliminary Eligibility Test 2026 Revised Score Card & Percentile',
    shortTitle: 'UPSSSC PET Score Card 2026',
    hindiTitle: 'यूपीएसएसएससी पीईटी संशोधित स्कोर कार्ड',
    category: 'result',
    department: 'State PSC',
    qualifications: ['10th Pass', '12th Pass', 'Graduate'],
    state: 'Uttar Pradesh',
    postDate: '05 October 2026',
    isHot: false,
    isNew: false,
    resultDate: '05 October 2026',
    shortInfo: 'Uttar Pradesh Subordinate Services Selection Commission (UPSSSC) has released the revised Score Card and Normalised Percentile score for PET 2026.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [
      { label: 'Scorecard Active Date', value: '05/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Enter Registration No, DOB, Gender, and Verification Code to view UP PET scorecard.'
    ],
    directLinks: [
      { label: 'Download UPSSSC PET Score Card', actionText: 'Click Here', type: 'result', isPrimary: true },
      { label: 'Official UPSSSC Portal', actionText: 'upsssc.gov.in', type: 'official' }
    ]
  },

  // --- ANSWER KEYS ---
  {
    id: 'ak-1',
    slug: 'ssc-gd-constable-answer-key-2026',
    title: 'SSC GD Constable Exam 2026 Tentative Answer Key & Candidate Response Sheet',
    shortTitle: 'SSC GD Answer Key 2026',
    hindiTitle: 'एसएससी जीडी उत्तर कुंजी 2026',
    category: 'answer_key',
    department: 'SSC',
    qualifications: ['10th Pass'],
    state: 'All India',
    postDate: '11 October 2026',
    isHot: true,
    isNew: true,
    shortInfo: 'Staff Selection Commission has uploaded the Tentative Answer Keys along with Candidates’ Response Sheets of Constable (GD) in CAPFs, SSF and Rifleman (GD) Exam.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2026' },
    importantDates: [
      { label: 'Answer Key Released', value: '11/10/2026', isHighlight: true },
      { label: 'Objection Window Last Date', value: '16/10/2026 up to 05:00 PM', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Click on direct answer key link below.',
      'Enter Examination Roll Number and Password (as mentioned on admission certificate).',
      'Submit ₹ 100/- per challenge per question if you wish to raise objection.'
    ],
    directLinks: [
      { label: 'Download Response Sheet & Answer Key', actionText: 'Click Here', type: 'answer_key', isPrimary: true },
      { label: 'Raise Objection Online', actionText: 'Click Here', type: 'answer_key' },
      { label: 'Download Official Notice', actionText: 'Notice (PDF)', type: 'notification' }
    ]
  },
  {
    id: 'ak-2',
    slug: 'bpsc-70th-prelims-provisional-answer-key',
    title: 'BPSC 70th Combined (CCE) Preliminary Exam Provisional Answer Key 2026',
    shortTitle: 'BPSC 70th CCE Answer Key',
    hindiTitle: 'बीपीएससी 70वीं प्रारंभिक परीक्षा उत्तर कुंजी',
    category: 'answer_key',
    department: 'State PSC',
    qualifications: ['Graduate'],
    state: 'Bihar',
    postDate: '07 October 2026',
    isHot: false,
    isNew: true,
    shortInfo: 'Bihar Public Service Commission (BPSC) has published Series A, B, C, D Provisional Answer Keys for General Studies Paper.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/08/2026' },
    importantDates: [
      { label: 'Answer Key Released', value: '07/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: ['Check official question booklet series matching with provisional answers.'],
    directLinks: [
      { label: 'Download General Studies Answer Key PDF', actionText: 'Download', type: 'answer_key', isPrimary: true },
      { label: 'Submit Online Objections via Dashboard', actionText: 'Click Here', type: 'answer_key' }
    ]
  },
  {
    id: 'ak-3',
    slug: 'nta-ugc-net-official-answer-key-2026',
    title: 'NTA UGC NET Exam Official Final Answer Key & Question Paper 2026',
    shortTitle: 'UGC NET Final Answer Key',
    hindiTitle: 'यूजीसी नेट फाइनल उत्तर कुंजी 2026',
    category: 'answer_key',
    department: 'Teaching',
    qualifications: ['Post Graduate'],
    state: 'All India',
    postDate: '04 October 2026',
    isHot: false,
    isNew: false,
    shortInfo: 'National Testing Agency (NTA) has uploaded the final answer key for 83 subjects of UGC NET.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2026' },
    importantDates: [{ label: 'Final Key Released', value: '04/10/2026', isHighlight: true }],
    vacancyBreakdown: [],
    howToApplySteps: ['Download subject-wise final key master sheet.'],
    directLinks: [
      { label: 'Download All Subjects Final Answer Key (PDF)', actionText: 'Click Here', type: 'answer_key', isPrimary: true }
    ]
  },

  // --- SYLLABUS ---
  {
    id: 'syl-1',
    slug: 'upsc-civil-services-detailed-syllabus-2026',
    title: 'UPSC Civil Services (IAS / IPS / IFS) Prelims & Mains Complete Detailed Syllabus & Exam Pattern 2026',
    shortTitle: 'UPSC IAS Syllabus 2026 PDF',
    hindiTitle: 'यूपीएससी आईएएस 2026 संपूर्ण पाठ्यक्रम व पैटर्न',
    category: 'syllabus',
    department: 'UPSC',
    qualifications: ['Graduate'],
    state: 'All India',
    postDate: '09 October 2026',
    isHot: true,
    isNew: false,
    shortInfo: 'Detailed topic-wise syllabus for UPSC Prelims GS Paper 1, CSAT Paper 2, and Mains 9 Papers (Essay, GS 1-4, Optional Subject 1 & 2, Indian Languages & English).',
    applicationFee: [],
    ageLimit: { asOnDate: '01/08/2026' },
    importantDates: [{ label: 'Syllabus Updated', value: 'October 2026' }],
    vacancyBreakdown: [],
    howToApplySteps: ['Download full bilingual PDF syllabus for preparation.'],
    directLinks: [
      { label: 'Download UPSC Civil Services Syllabus (English)', actionText: 'Download (PDF)', type: 'syllabus', isPrimary: true },
      { label: 'Download UPSC IAS Syllabus in Hindi (हिंदी)', actionText: 'Download (PDF)', type: 'syllabus' },
      { label: 'Download Previous 10 Years Question Papers', actionText: 'Click Here', type: 'syllabus' }
    ]
  },
  {
    id: 'syl-2',
    slug: 'railway-rrb-ntpc-exam-pattern-syllabus',
    title: 'Railway RRB NTPC Graduate & Undergraduate Stage 1 & 2 Complete Exam Pattern & Syllabus in Hindi / English',
    shortTitle: 'RRB NTPC Syllabus 2026',
    hindiTitle: 'आरआरबी एनटीपीसी सिलेबस व परीक्षा पैटर्न',
    category: 'syllabus',
    department: 'Railway',
    qualifications: ['12th Pass', 'Graduate'],
    state: 'All India',
    postDate: '06 October 2026',
    isHot: false,
    isNew: false,
    shortInfo: 'RRB NTPC CBT-1 exam consists of General Awareness (40 marks), Mathematics (30 marks), and General Intelligence & Reasoning (30 marks) with 1/3 negative marking.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/01/2027' },
    importantDates: [{ label: 'Updated on', value: '06/10/2026' }],
    vacancyBreakdown: [],
    howToApplySteps: ['Review topic weightage and marks distribution before exam preparation.'],
    directLinks: [
      { label: 'Download CBT 1 & CBT 2 Detailed Syllabus', actionText: 'Download (PDF)', type: 'syllabus', isPrimary: true }
    ]
  },
  {
    id: 'syl-3',
    slug: 'up-police-constable-syllabus-physical-standards',
    title: 'UP Police Constable 2026 Detailed Written Syllabus, Negative Marking & Physical PST/PET Details',
    shortTitle: 'UP Police Constable Syllabus',
    hindiTitle: 'यूपी पुलिस कांस्टेबल विस्तृत सिलेबस व शारीरिक मानक',
    category: 'syllabus',
    department: 'Police',
    qualifications: ['12th Pass'],
    state: 'Uttar Pradesh',
    postDate: '03 October 2026',
    isHot: false,
    isNew: false,
    shortInfo: 'Total 150 questions (300 marks) covering General Knowledge, General Hindi, Numerical & Mental Ability, Mental Aptitude & Reasoning. Negative marking 0.5 marks per wrong answer.',
    applicationFee: [],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [{ label: 'Updated on', value: '03/10/2026' }],
    vacancyBreakdown: [],
    howToApplySteps: ['Follow Hindi and GS topic list to score 220+ marks.'],
    directLinks: [
      { label: 'Download UP Police Constable Syllabus PDF', actionText: 'Download', type: 'syllabus', isPrimary: true }
    ]
  },

  // --- ADMISSIONS ---
  {
    id: 'adm-1',
    slug: 'nta-neet-ug-2026-online-registration',
    title: 'NTA NEET UG 2026 National Eligibility Cum Entrance Test Online Application Form',
    shortTitle: 'NTA NEET UG 2026 Apply Form',
    hindiTitle: 'नीट यूजी 2026 ऑनलाइन प्रवेश फॉर्म',
    category: 'admission',
    department: 'Medical',
    qualifications: ['12th Pass'],
    state: 'All India',
    postDate: '10 October 2026',
    isHot: true,
    isNew: true,
    lastDate: '20 November 2026',
    examDate: '03 May 2026',
    shortInfo: 'National Testing Agency (NTA) will conduct the National Eligibility Cum Entrance Test (UG) 2026 for admission to undergraduate medical courses (MBBS, BDS, BAMS, BHMS, BUMS) in all medical institutions.',
    applicationFee: [
      { category: 'General', amount: '₹ 1700/-' },
      { category: 'General-EWS / OBC-NCL', amount: '₹ 1600/-' },
      { category: 'SC / ST / PwBD / Third Gender', amount: '₹ 1000/-' }
    ],
    ageLimit: {
      asOnDate: '31/12/2026',
      minAge: 17,
      notes: 'Must complete 17 years of age at the time of admission or on or before 31st December of the year of admission. No upper age limit.'
    },
    importantDates: [
      { label: 'Online Submission of Application', value: '10/10/2026 to 20/11/2026', isHighlight: true },
      { label: 'Last Date of Successful Transaction', value: '21/11/2026' },
      { label: 'Date of NEET (UG) Examination', value: '03 May 2026 (Sunday)', isHighlight: true }
    ],
    vacancyBreakdown: [
      {
        postName: 'NEET UG 2026 (MBBS / BDS / AYUSH Courses)',
        totalPosts: 'Over 1,08,000 Medical Seats',
        eligibility: 'Passed or appearing in 10+2 with Physics, Chemistry, Biology/Biotechnology and English.'
      }
    ],
    howToApplySteps: [
      'Apply online on exams.nta.ac.in/NEET.',
      'Upload passport size photograph with 80% face visible, postcard size photo, left & right thumb impressions and signature.',
      'Ensure Aadhaar Authentication is completed.'
    ],
    directLinks: [
      { label: 'Apply Online Registration', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Information Bulletin (English)', actionText: 'Click Here', type: 'notification' },
      { label: 'Official NTA NEET Website', actionText: 'exams.nta.ac.in/NEET', type: 'official' }
    ]
  },
  {
    id: 'adm-2',
    slug: 'nta-jee-main-2026-session-1-form',
    title: 'NTA JEE Main 2026 Session 1 Engineering Entrance Exam Online Application Form',
    shortTitle: 'JEE Main 2026 Session 1 Apply',
    hindiTitle: 'जेईई मेन 2026 सत्र-1 ऑनलाइन आवेदन',
    category: 'admission',
    department: 'Engineering',
    qualifications: ['12th Pass'],
    state: 'All India',
    postDate: '08 October 2026',
    isHot: true,
    isNew: true,
    lastDate: '10 November 2026',
    examDate: '22-31 January 2026',
    shortInfo: 'National Testing Agency invites applications for Joint Entrance Examination JEE Main 2026 Session 1 for admission to NITs, IIITs, CFTIs and eligibility for JEE Advanced.',
    applicationFee: [
      { category: 'Male (General / OBC / EWS)', amount: '₹ 1000/-' },
      { category: 'Female (All Categories)', amount: '₹ 800/-' },
      { category: 'SC / ST / PwD', amount: '₹ 500/-' }
    ],
    ageLimit: {
      asOnDate: '01/01/2026',
      notes: 'No age limit for candidates appearing in JEE (Main). Candidates passed 12th in 2024, 2025 or appearing in 2026 can apply.'
    },
    importantDates: [
      { label: 'Application Form Begin', value: '08/10/2026' },
      { label: 'Last Date for Registration', value: '10/11/2026 up to 09:00 PM', isHighlight: true },
      { label: 'Session 1 Exam Date', value: '22 - 31 January 2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Register with APAAR ID / ABC ID or Aadhaar Card on jeemain.nta.ac.in.',
      'Fill personal details, academic scores, and select exam paper (Paper 1 B.E/B.Tech or Paper 2A/2B B.Arch/B.Planning).'
    ],
    directLinks: [
      { label: 'Apply Online for JEE Main 2026', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Information Bulletin', actionText: 'Download (PDF)', type: 'notification' },
      { label: 'Official JEE Main Portal', actionText: 'jeemain.nta.ac.in', type: 'official' }
    ]
  },
  {
    id: 'adm-3',
    slug: 'up-bed-combined-entrance-exam-2026',
    title: 'UP B.Ed Joint Entrance Examination (JEE) 2026 Online Form for 2-Year B.Ed Course',
    shortTitle: 'UP B.Ed Entrance 2026 Apply',
    hindiTitle: 'यूपी बीएड संयुक्त प्रवेश परीक्षा 2026',
    category: 'admission',
    department: 'Teaching',
    qualifications: ['Graduate', 'Post Graduate'],
    state: 'Uttar Pradesh',
    postDate: '05 October 2026',
    isHot: false,
    isNew: false,
    lastDate: '30 October 2026',
    shortInfo: 'Bundelkhand University / State Universities UP B.Ed Combined Entrance Examination 2026 for admission to 2 Year Bachelor of Education across colleges in Uttar Pradesh.',
    applicationFee: [
      { category: 'General / OBC / Other State', amount: '₹ 1400/-' },
      { category: 'SC / ST of UP', amount: '₹ 700/-' }
    ],
    ageLimit: { asOnDate: '01/07/2026', minAge: 15 },
    importantDates: [
      { label: 'Application Begin', value: '10/09/2026' },
      { label: 'Last Date for Apply', value: '30/10/2026', isHighlight: true }
    ],
    vacancyBreakdown: [],
    howToApplySteps: ['Candidate with minimum 50% marks in Graduation / Post Graduation can apply.'],
    directLinks: [
      { label: 'Apply Online Form', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Official Notification Brochure', actionText: 'Download', type: 'notification' }
    ]
  },

  // --- CERTIFICATE VERIFICATION & IMPORTANT ---
  {
    id: 'cert-1',
    slug: 'pan-card-apply-online-instant-e-pan',
    title: 'Apply New PAN Card Online / Instant e-PAN / Correction in Existing PAN Card',
    shortTitle: 'PAN Card Online Apply & Correction',
    hindiTitle: 'पैन कार्ड ऑनलाइन आवेदन व सुधार',
    category: 'certificate_verification',
    department: 'Other',
    qualifications: ['10th Pass', '12th Pass', 'Graduate'],
    state: 'All India',
    postDate: '10 October 2026',
    isHot: true,
    isNew: false,
    shortInfo: 'UTIITSL / NSDL (Protean) e-Governance PAN card application services. Apply new PAN Card (Form 49A), change or correction in PAN details, link PAN with Aadhaar card.',
    applicationFee: [
      { category: 'Indian Citizen (Physical Card dispatched to Indian Address)', amount: '₹ 107/-' },
      { category: 'Instant e-PAN (e-Filing Income Tax Portal)', amount: '₹ 0/- Free' }
    ],
    ageLimit: { asOnDate: '01/01/2026' },
    importantDates: [{ label: 'Service Status', value: 'Available 24x7', isHighlight: true }],
    vacancyBreakdown: [],
    howToApplySteps: [
      'For Instant free e-PAN, visit Income Tax e-Filing portal with Aadhaar registered mobile number.',
      'For Physical PAN Card, submit Form 49A on NSDL Protean or UTIITSL portal with Aadhaar eKYC.'
    ],
    directLinks: [
      { label: 'Apply Instant Free e-PAN (Income Tax e-Filing)', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Apply New PAN Card (NSDL Protean)', actionText: 'Click Here', type: 'apply' },
      { label: 'PAN Card Correction / Update Online', actionText: 'Click Here', type: 'apply' },
      { label: 'Link PAN with Aadhaar Card', actionText: 'Check Status', type: 'official' }
    ]
  },
  {
    id: 'cert-2',
    slug: 'uidai-aadhaar-card-download-update-online',
    title: 'UIDAI Aadhaar Card Online Services: Download e-Aadhaar, PVC Card Order & Address Update',
    shortTitle: 'Aadhaar Card Download & Update',
    hindiTitle: 'आधार कार्ड डाउनलोड व पता अपडेट',
    category: 'certificate_verification',
    department: 'Other',
    qualifications: ['10th Pass', '12th Pass', 'Graduate'],
    state: 'All India',
    postDate: '09 October 2026',
    isHot: true,
    isNew: false,
    shortInfo: 'Unique Identification Authority of India (UIDAI) portal services. Download password-protected electronic Aadhaar PDF, verify Aadhaar number and registered mobile, update address and order PVC Smart Card for ₹ 50.',
    applicationFee: [
      { category: 'Download e-Aadhaar', amount: '₹ 0/- Free' },
      { category: 'Order Aadhaar PVC Card (Speed Post delivery)', amount: '₹ 50/-' }
    ],
    ageLimit: { asOnDate: '01/01/2026' },
    importantDates: [{ label: 'Service Status', value: 'Active 24x7', isHighlight: true }],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Visit myaadhaar.uidai.gov.in and log in using Aadhaar Number & OTP.',
      'Password to open downloaded e-Aadhaar is FIRST 4 LETTERS OF YOUR NAME IN CAPITAL + YEAR OF BIRTH (e.g. RAHU1998).'
    ],
    directLinks: [
      { label: 'Download e-Aadhaar Card Online', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Order Aadhaar PVC Card (₹ 50)', actionText: 'Click Here', type: 'apply' },
      { label: 'Check Aadhaar Update Status', actionText: 'Check Status', type: 'official' },
      { label: 'Official UIDAI Portal', actionText: 'myaadhaar.uidai.gov.in', type: 'official' }
    ]
  },
  {
    id: 'cert-3',
    slug: 'up-scholarship-online-form-2026',
    title: 'UP Scholarship 2026 Online Form for Pre-Matric (9th-10th) & Post-Matric (11th, 12th, Dashmottar Other Courses)',
    shortTitle: 'UP Scholarship Online Form 2026',
    hindiTitle: 'यूपी छात्रवृत्ति ऑनलाइन फॉर्म 2026',
    category: 'important',
    department: 'Teaching',
    qualifications: ['10th Pass', '12th Pass', 'Graduate', 'Diploma / ITI'],
    state: 'Uttar Pradesh',
    postDate: '08 October 2026',
    isHot: true,
    isNew: true,
    lastDate: '15 November 2026',
    shortInfo: 'Social Welfare Department, Government of Uttar Pradesh invites online applications for Pre-Matric and Post-Matric Scholarship and Fee Reimbursement Scheme 2026-27.',
    applicationFee: [{ category: 'All Students', amount: '₹ 0/- No Application Fee' }],
    ageLimit: { asOnDate: '01/07/2026' },
    importantDates: [
      { label: 'Application Started', value: 'July 2026' },
      { label: 'Last Date for Apply Online', value: '15/11/2026', isHighlight: true },
      { label: 'Submit Hard Copy in College', value: 'Within 3 days of submission' }
    ],
    vacancyBreakdown: [],
    howToApplySteps: [
      'Complete DigiLocker verification and eKYC with Aadhaar card.',
      'Fill academic fee details, submit income certificate and caste certificate numbers.'
    ],
    directLinks: [
      { label: 'Apply Online (Fresh Registration)', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Apply Online (Renewal Login)', actionText: 'Click Here', type: 'apply' },
      { label: 'Check Scholarship Application Status', actionText: 'Click Here', type: 'official' },
      { label: 'UP Scholarship Official Portal', actionText: 'scholarship.up.gov.in', type: 'official' }
    ]
  },
  {
    id: 'cert-4',
    slug: 'voter-id-card-apply-online-form-6',
    title: 'Election Commission of India: Apply New Voter ID Card (Form 6) & Download Digital e-EPIC',
    shortTitle: 'Voter ID Apply & Download e-EPIC',
    hindiTitle: 'वोटर कार्ड ऑनलाइन आवेदन व डाउनलोड',
    category: 'important',
    department: 'Other',
    qualifications: ['10th Pass', '12th Pass', 'Graduate'],
    state: 'All India',
    postDate: '05 October 2026',
    isHot: false,
    isNew: false,
    shortInfo: 'Election Commission of India (ECI) Voters’ Services Portal. Any citizen having age 18 years can enroll as new voter using Form 6, correct name or shift assembly constituency via Form 8.',
    applicationFee: [{ category: 'All Citizens', amount: '₹ 0/- Free Service' }],
    ageLimit: { asOnDate: '01/01/2026', minAge: 18 },
    importantDates: [{ label: 'National Voters Portal', value: 'Open All Year', isHighlight: true }],
    vacancyBreakdown: [],
    howToApplySteps: ['Register on voters.eci.gov.in with mobile number and submit Form 6.'],
    directLinks: [
      { label: 'Apply New Voter Card (Form 6)', actionText: 'Click Here', type: 'apply', isPrimary: true },
      { label: 'Download Digital e-EPIC Card', actionText: 'Click Here', type: 'apply' },
      { label: 'Check Voter Application Status', actionText: 'Check Status', type: 'official' }
    ]
  }
];

export const trendingAlerts = [
  { id: 't1', title: 'UPSC Civil Services 2026 Prelims Online Form', slug: 'upsc-civil-services-ias-ifs-2026', category: 'latest_jobs', badge: 'Apply Now' },
  { id: 't2', title: 'SSC CGL 2026 Tier-II Admit Card Released', slug: 'ssc-cgl-tier-ii-admit-card-2026', category: 'admit_card', badge: 'Admit Card' },
  { id: 't3', title: 'Railway RRB NTPC 11,558 Vacancies Form Active', slug: 'railway-rrb-ntpc-recruitment-2026', category: 'latest_jobs', badge: '11,558 Posts' },
  { id: 't4', title: 'SSC CHSL Tier-I Result & Cutoff Marks Declared', slug: 'ssc-chsl-tier-i-result-cutoff-2026', category: 'result', badge: 'Result' },
  { id: 't5', title: 'UP Police Constable 60,244 Posts Exam Updates', slug: 'up-police-constable-recruitment-60244', category: 'latest_jobs', badge: 'Hot' },
  { id: 't6', title: 'SSC GD Constable Answer Key Released With Response Sheet', slug: 'ssc-gd-constable-answer-key-2026', category: 'answer_key', badge: 'Answer Key' },
  { id: 't7', title: 'NTA NEET UG 2026 Online Registration Open', slug: 'nta-neet-ug-2026-online-registration', category: 'admission', badge: 'Admission' },
  { id: 't8', title: 'Instant e-PAN Card & Aadhaar Link Portal', slug: 'pan-card-apply-online-instant-e-pan', category: 'certificate_verification', badge: 'Services' }
];

export const highlightBoxes = [
  { id: 'h1', title: 'UPSC IAS / IFS 2026', sub: 'Apply Online (1056 Posts)', slug: 'upsc-civil-services-ias-ifs-2026', color: 'from-amber-600 to-amber-700' },
  { id: 'h2', title: 'SSC CGL 2026', sub: 'Apply Online (14,500 Posts)', slug: 'ssc-cgl-2026-online-form', color: 'from-blue-600 to-blue-700' },
  { id: 'h3', title: 'RRB NTPC 2026', sub: '11,558 Posts Form Active', slug: 'railway-rrb-ntpc-recruitment-2026', color: 'from-emerald-600 to-emerald-700' },
  { id: 'h4', title: 'UP Police Constable', sub: '60,244 Posts Notice', slug: 'up-police-constable-recruitment-60244', color: 'from-red-600 to-red-700' },
  { id: 'h5', title: 'SSC CGL Tier II Admit Card', sub: 'All Regions Available', slug: 'ssc-cgl-tier-ii-admit-card-2026', color: 'from-purple-600 to-purple-700' },
  { id: 'h6', title: 'SSC CHSL Tier 1 Result', sub: 'Cutoff Marks & List Out', slug: 'ssc-chsl-tier-i-result-cutoff-2026', color: 'from-rose-600 to-rose-700' },
  { id: 'h7', title: 'SSC GD Answer Key', sub: 'Challenge Objection Portal', slug: 'ssc-gd-constable-answer-key-2026', color: 'from-teal-600 to-teal-700' },
  { id: 'h8', title: 'NEET UG 2026 Form', sub: 'MBBS/BDS Registration Open', slug: 'nta-neet-ug-2026-online-registration', color: 'from-indigo-600 to-indigo-700' }
];

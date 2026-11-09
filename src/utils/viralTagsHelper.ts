import { SarkariPost } from '../types/job';

/**
 * Normalizes a word into a clean camelCase or PascalCase hashtag
 */
function toHashtag(str: string): string {
  const clean = str
    .replace(/[^\w\s]/gi, '')
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
  return clean ? `#${clean}` : '';
}

/**
 * Generates or retrieves context-rich viral tags for any SarkariPost
 */
export function getPostViralTags(post: SarkariPost): string[] {
  // If post already has manually assigned viral tags, return cleaned array
  if (post.viralTags && post.viralTags.length > 0) {
    return Array.from(new Set(post.viralTags.map(t => t.startsWith('#') ? t : `#${t}`)));
  }

  const tags = new Set<string>();

  // 1. Primary Sarkari Branding & Universal Viral Tags
  tags.add('#SarkariResult');
  tags.add('#SarkariResult2026');
  tags.add('#SarkariNaukri');
  tags.add('#RojgarResult');
  tags.add('#FreeJobAlert');

  // 2. Category-Specific Viral Tags
  switch (post.category) {
    case 'latest_jobs':
      tags.add('#LatestGovtJobs');
      tags.add('#OnlineForm2026');
      tags.add('#GovtJobNotification');
      tags.add('#NewRecruitment2026');
      tags.add('#ApplyOnline');
      break;
    case 'result':
      tags.add('#SarkariResultOut');
      tags.add('#ExamResult2026');
      tags.add('#MeritList');
      tags.add('#CutOffMarks');
      tags.add('#SelectionList');
      break;
    case 'admit_card':
      tags.add('#AdmitCard2026');
      tags.add('#HallTicketDownload');
      tags.add('#ExamCitySlip');
      tags.add('#ExamDateAlert');
      break;
    case 'answer_key':
      tags.add('#AnswerKey2026');
      tags.add('#OfficialAnswerKey');
      tags.add('#QuestionPaperSolution');
      tags.add('#ObjectionLink');
      break;
    case 'syllabus':
      tags.add('#ExamSyllabus2026');
      tags.add('#ExamPattern');
      tags.add('#SelectionProcess');
      tags.add('#PreviousYearPapers');
      break;
    case 'admission':
      tags.add('#AdmissionForm2026');
      tags.add('#EntranceExam');
      tags.add('#CounselingProcess');
      break;
    case 'certificate_verification':
      tags.add('#DocumentVerification');
      tags.add('#CertificateVerification');
      tags.add('#DVNotice');
      break;
    case 'important':
      tags.add('#ImportantNotice');
      tags.add('#OfficialNotification');
      tags.add('#GovtUpdates');
      break;
  }

  // 3. Department Specific Tags
  if (post.department) {
    const deptTag = toHashtag(`${post.department} Jobs`);
    if (deptTag) tags.add(deptTag);

    switch (post.department) {
      case 'Police':
        tags.add('#PoliceBharti');
        tags.add('#ConstableRecruitment');
        tags.add('#PoliceSI');
        break;
      case 'Teaching':
        tags.add('#TeachingJobs');
        tags.add('#TeacherBharti');
        tags.add('#TGT_PGT');
        break;
      case 'Railway':
        tags.add('#RailwayRecruitment');
        tags.add('#RRBNTPC');
        tags.add('#RailwayJobs2026');
        break;
      case 'SSC':
        tags.add('#SSC');
        tags.add('#SSCCGL');
        tags.add('#SSCGD');
        tags.add('#SSCCHSL');
        break;
      case 'UPSC':
        tags.add('#UPSC');
        tags.add('#CivilServices');
        tags.add('#IAS_IPS');
        break;
      case 'Defence':
        tags.add('#DefenceJobs');
        tags.add('#IndianArmy');
        tags.add('#AirForce');
        tags.add('#NavyJobs');
        break;
      case 'Banking':
        tags.add('#BankJobs');
        tags.add('#IBPSPO');
        tags.add('#SBIRecruitment');
        break;
      case 'State PSC':
        tags.add('#StatePSC');
        tags.add('#CivilServicesExam');
        break;
      case 'Engineering':
        tags.add('#EngineeringJobs');
        tags.add('#JE_AE_Recruitment');
        break;
      case 'Medical':
        tags.add('#MedicalJobs');
        tags.add('#StaffNurseRecruitment');
        break;
    }
  }

  // 4. State / Region Specific Tags
  if (post.state) {
    const cleanState = post.state.toLowerCase();
    if (cleanState.includes('uttar pradesh') || cleanState.includes('up')) {
      tags.add('#UPGovtJobs');
      tags.add('#UPBharti');
    } else if (cleanState.includes('bihar')) {
      tags.add('#BiharGovtJobs');
      tags.add('#BPSCExams');
    } else if (cleanState.includes('rajasthan')) {
      tags.add('#RajasthanRecruitment');
      tags.add('#RPSCJobs');
    } else if (cleanState.includes('delhi')) {
      tags.add('#DelhiGovtJobs');
      tags.add('#DSSSB');
    } else if (cleanState.includes('all india')) {
      tags.add('#CentralGovtJobs');
      tags.add('#AllIndiaJobs');
    }
  }

  // 5. Keyword Extraction from Title
  const title = post.title || '';
  const titleLower = title.toLowerCase();

  const titlePatterns = [
    { regex: /ctet/i, tag: '#CTET2026' },
    { regex: /bpsc/i, tag: '#BPSC' },
    { regex: /tre\s*4/i, tag: '#BPSCTRE4' },
    { regex: /upsssc/i, tag: '#UPSSSC' },
    { regex: /uppsc/i, tag: '#UPPSC' },
    { regex: /rrb|railway/i, tag: '#RailwayRRB' },
    { regex: /ntpc/i, tag: '#RRBNTPC' },
    { regex: /constable/i, tag: '#ConstableBharti' },
    { regex: /air force|iaf/i, tag: '#IndianAirForce' },
    { regex: /isro/i, tag: '#ISROJobs' },
    { regex: /supreme court/i, tag: '#SupremeCourt' },
    { regex: /ongc/i, tag: '#ONGCJobs' },
    { regex: /jee/i, tag: '#JEEMain2026' },
    { regex: /patwari/i, tag: '#PatwariBharti' },
    { regex: /stenographer/i, tag: '#Stenographer' },
    { regex: /assistant/i, tag: '#AssistantRecruitment' },
    { regex: /teacher/i, tag: '#TeacherVacancy' },
  ];

  titlePatterns.forEach(item => {
    if (item.regex.test(titleLower)) {
      tags.add(item.tag);
    }
  });

  // Short Title extraction
  if (post.shortTitle) {
    const firstTwoWords = post.shortTitle.split(/\s+/).slice(0, 3).join(' ');
    const shortTag = toHashtag(firstTwoWords);
    if (shortTag && shortTag.length > 3 && shortTag.length < 24) {
      tags.add(shortTag);
    }
  }

  // Qualification tags
  if (post.qualifications && post.qualifications.length > 0) {
    if (post.qualifications.includes('10th Pass')) tags.add('#10thPassGovtJobs');
    if (post.qualifications.includes('12th Pass')) tags.add('#12thPassGovtJobs');
    if (post.qualifications.includes('Graduate')) tags.add('#GraduateJobs');
  }

  return Array.from(tags).slice(0, 16);
}

/**
 * Returns formatted string of hashtags: e.g. "#SarkariResult #UPPolice #OnlineForm"
 */
export function formatViralTagsString(tags: string[]): string {
  return tags.join(' ');
}

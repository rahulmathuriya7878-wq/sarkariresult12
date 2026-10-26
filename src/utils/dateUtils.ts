import { SarkariPost, ImportantDateItem } from '../types/job';

/**
 * Ensures Important Dates section always handles Exam Date and Admit Card Available Date:
 * - If exam date data exists in post.examDate or importantDates, display it; otherwise "As Per Schedule".
 * - If admit card available date data exists in post.admitCardDate or importantDates, display it; otherwise "Before Exam".
 */
export const getProcessedImportantDates = (post: SarkariPost): ImportantDateItem[] => {
  const dates: ImportantDateItem[] = post.importantDates ? [...post.importantDates] : [];
  const hasLabel = (regex: RegExp) => dates.some(d => regex.test(d.label));

  if (!hasLabel(/application begin|begin date|notification released/i)) {
    dates.unshift({ label: 'Application Begin', value: post.postDate ? post.postDate.split('|')[0].trim() : 'As Per Notification' });
  }

  if (!hasLabel(/last date.*registration|last date.*apply/i)) {
    dates.push({ label: 'Last Date for Registration', value: post.lastDate || 'As Per Schedule', isHighlight: true });
  }

  if (!hasLabel(/pay.*fee.*last date|fee payment/i)) {
    dates.push({ label: 'Pay Exam Fee Last Date', value: post.lastDate || 'As Per Schedule' });
  }

  if (!hasLabel(/correction/i)) {
    dates.push({ label: 'Last Date Correction', value: 'As Per Schedule' });
  }

  if (!hasLabel(/exam date|cbt|test date/i)) {
    dates.push({ label: 'UPESSC TGT 2026 Exam Date', value: post.examDate || 'As Per Schedule', isHighlight: true });
  }

  if (!hasLabel(/exam city/i)) {
    dates.push({ label: 'Exam City Available', value: 'Before Exam' });
  }

  if (!hasLabel(/admit card/i)) {
    dates.push({ label: 'Admit Card Available', value: post.admitCardDate || 'Before Exam' });
  }

  if (!hasLabel(/answer key/i)) {
    dates.push({ label: 'Answer Key Available', value: 'As Per Schedule' });
  }

  if (!hasLabel(/result declared|result date/i)) {
    dates.push({ label: 'Result Declared', value: post.resultDate || 'As Per Schedule' });
  }

  return dates;
};

/**
 * Extracts Application Start and Last Dates for How to Apply Online date in Hindi for every post.
 */
export const getApplyDates = (post: SarkariPost) => {
  let startDate = '';
  let lastDate = post.lastDate || '';

  if (post.importantDates && post.importantDates.length > 0) {
    const startItem = post.importantDates.find(d => 
      /begin|start|commence|apply date/i.test(d.label)
    );
    if (startItem && startItem.value) {
      startDate = startItem.value;
    }

    const lastItem = post.importantDates.find(d => 
      /last date|closing date|end date/i.test(d.label)
    );
    if (lastItem && lastItem.value) {
      lastDate = lastItem.value;
    }
  }

  if (!startDate) {
    startDate = post.postDate ? post.postDate.split('|')[0].trim() : '20/10/2026';
  }
  if (!lastDate) {
    lastDate = '10/11/2026';
  }

  return { startDate, lastDate };
};

export interface HowToApplyStep {
  title: string;
  desc: string;
}

/**
 * Generates standard How to Apply Online steps in Hindi with application dates included for every post.
 */
export const getHowToApplyHindiSteps = (post: SarkariPost): HowToApplyStep[] => {
  const { startDate, lastDate } = getApplyDates(post);
  const titleName = post.shortTitle || post.title || 'Senior Personal Assistant';

  return [
    {
      title: 'ऑनलाइन आवेदन करने की तिथि (How to Apply Online Date)',
      desc: `उम्मीदवार ${startDate} से ${lastDate} तक ऑनलाइन आवेदन कर सकते हैं। (Candidate can apply online from ${startDate} to ${lastDate}).`
    },
    {
      title: 'अधिसूचना ध्यानपूर्वक पढ़ें (Read Official Notification)',
      desc: `अभ्यर्थी ${titleName} फॉर्म भरने से पहले आधिकारिक अधिसूचना (Official Notification) को ध्यानपूर्वक पढ़ें।`
    },
    {
      title: 'दस्तावेज़ की जाँच एवं संग्रह (Check & Collect Documents)',
      desc: `कृपया सभी दस्तावेज़ जैसे पात्रता (Eligibility), आईडी प्रमाण (ID Proof), पता विवरण (Address Details) और मूल विवरण जांचें व एकत्र करें।`
    },
    {
      title: 'स्कैन दस्तावेज़ तैयार रखें (Ready Scanned Documents)',
      desc: `भर्ती फॉर्म से संबंधित सभी स्कैन दस्तावेज़ - फोटो, हस्ताक्षर, आईडी प्रूफ आदि तैयार रखें।`
    },
    {
      title: 'पूर्वावलोकन एवं विवरण जांच (Preview Form Before Submit)',
      desc: `आवेदन पत्र जमा (Submit) करने से पहले पूर्वावलोकन (Preview) और सभी कॉलम को ध्यानपूर्वक जांच लें।`
    },
    {
      title: 'आवेदन शुल्क का भुगतान (Pay Application Fee)',
      desc: post.applicationFee && post.applicationFee.length > 0
        ? `यदि उम्मीदवार के लिए आवेदन शुल्क लागू है तो भुगतान अनिवार्य है। बिना शुल्क के फॉर्म पूरा नहीं माना जाएगा।`
        : `आवेदन पत्र सबमिट करें।`
    },
    {
      title: 'अंतिम सबमिट का प्रिंटआउट (Print Submitted Form)',
      desc: `अंतिम रूप से सबमिट किए गए आवेदन पत्र का एक प्रिंटआउट (Print Out) निकालकर सुरक्षित रख लें।`
    }
  ];
};

/**
 * Checks if a post's application last date has expired.
 * Compares post.lastDate (or lastDate in importantDates) with today's reference date.
 */
export const isPostExpired = (post: SarkariPost, referenceDate: Date = new Date()): boolean => {
  if (post.isArchived) return true;
  if (post.status === 'closed') return true;

  // Non-recruitment or continuous categories like results/admit_cards/answer_keys are not application forms
  if (post.category === 'result' || post.category === 'admit_card' || post.category === 'answer_key') {
    return false;
  }

  const { lastDate } = getApplyDates(post);
  if (!lastDate || lastDate.toLowerCase().includes('soon') || lastDate.toLowerCase().includes('schedule')) {
    return false;
  }

  const cleanDateStr = lastDate.replace(/extended|till.*|by.*|\(.*\)/gi, '').trim();

  // 1. Try parsing DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyyMatch = cleanDateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1], 10);
    const month = parseInt(ddmmyyyyMatch[2], 10) - 1;
    const year = parseInt(ddmmyyyyMatch[3], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const expiryDate = new Date(year, month, day, 23, 59, 59);
      return referenceDate.getTime() > expiryDate.getTime();
    }
  }

  // 2. Try parsing YYYY-MM-DD
  const yyyymmddMatch = cleanDateStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (yyyymmddMatch) {
    const year = parseInt(yyyymmddMatch[1], 10);
    const month = parseInt(yyyymmddMatch[2], 10) - 1;
    const day = parseInt(yyyymmddMatch[3], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const expiryDate = new Date(year, month, day, 23, 59, 59);
      return referenceDate.getTime() > expiryDate.getTime();
    }
  }

  // 3. Try parsing text date like "23 Nov 2026"
  const parsed = Date.parse(cleanDateStr);
  if (!isNaN(parsed)) {
    const expiryDate = new Date(parsed);
    expiryDate.setHours(23, 59, 59);
    return referenceDate.getTime() > expiryDate.getTime();
  }

  return false;
};

/**
 * Parses diverse date strings into ISO 8601 format (YYYY-MM-DD) for schema.org datePosted and validThrough.
 */
export const toIso8601Date = (dateStr?: string): string => {
  const fallback = new Date().toISOString();
  if (!dateStr) return fallback;

  const clean = dateStr.split('|')[0].replace(/extended|till.*|by.*|\(.*\)/gi, '').trim();

  // 1. Try DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyyMatch = clean.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (ddmmyyyyMatch) {
    const day = ddmmyyyyMatch[1].padStart(2, '0');
    const month = ddmmyyyyMatch[2].padStart(2, '0');
    const year = ddmmyyyyMatch[3];
    return `${year}-${month}-${day}T00:00:00Z`;
  }

  // 2. Try YYYY-MM-DD
  const yyyymmddMatch = clean.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (yyyymmddMatch) {
    const year = yyyymmddMatch[1];
    const month = yyyymmddMatch[2].padStart(2, '0');
    const day = yyyymmddMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00Z`;
  }

  // 3. Try Date.parse (e.g. "24 October 2026")
  try {
    const parsed = Date.parse(clean);
    if (!isNaN(parsed)) {
      return new Date(parsed).toISOString();
    }
  } catch {
    // ignore
  }

  return fallback;
};

/**
 * Validates whether a given date string complies with ISO 8601 standards
 * (supports YYYY-MM-DD, YYYY-MM-DDTHH:mm:ssZ, YYYY-MM-DDTHH:mm:ss+00:00).
 */
export const validateIso8601 = (dateStr?: string): { isValid: boolean; message?: string } => {
  if (!dateStr || !dateStr.trim()) {
    return { isValid: false, message: 'Date string is empty.' };
  }
  const trimmed = dateStr.trim();
  const isoRegex = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
  if (!isoRegex.test(trimmed)) {
    return { 
      isValid: false, 
      message: 'Invalid ISO 8601 format. Expected YYYY-MM-DD, YYYY-MM-DDTHH:mm:ssZ, or YYYY-MM-DDTHH:mm:ss+00:00.' 
    };
  }
  const timestamp = Date.parse(trimmed);
  if (isNaN(timestamp)) {
    return { isValid: false, message: 'Parsed date resulted in an invalid time.' };
  }
  return { isValid: true };
};

/**
 * Formats an ISO or standard date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss) 
 * into a human-friendly display format: "24 October 2026 | 07:00 PM".
 */
export const formatDisplayDate = (dateStr?: string): string => {
  if (!dateStr) return '24 October 2026 | 07:00 PM';

  const clean = dateStr.split('|')[0].trim();

  let year = 2026;
  let monthIndex = 9; // October
  let day = 24;
  let hours = 19;
  let minutes = 0;

  const isoMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})?)?/);
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    monthIndex = parseInt(isoMatch[2], 10) - 1;
    day = parseInt(isoMatch[3], 10);
    if (isoMatch[4]) hours = parseInt(isoMatch[4], 10);
    if (isoMatch[5]) minutes = parseInt(isoMatch[5], 10);
  } else {
    const ddmmyyyyMatch = clean.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (ddmmyyyyMatch) {
      day = parseInt(ddmmyyyyMatch[1], 10);
      monthIndex = parseInt(ddmmyyyyMatch[2], 10) - 1;
      year = parseInt(ddmmyyyyMatch[3], 10);
    } else {
      const parsed = Date.parse(clean);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        year = d.getFullYear();
        monthIndex = d.getMonth();
        day = d.getDate();
        hours = d.getHours();
        minutes = d.getMinutes();
      }
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = months[monthIndex] || 'October';

  const h12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const minStr = String(minutes).padStart(2, '0');
  const hStr = String(h12).padStart(2, '0');

  return `${day} ${monthName} ${year} | ${hStr}:${minStr} ${ampm}`;
};



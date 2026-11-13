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



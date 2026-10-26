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

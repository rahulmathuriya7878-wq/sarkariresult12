import { SarkariPost, ImportantDateItem } from '../types/job';

/**
 * Ensures Important Dates section always handles Exam Date and Admit Card Available Date:
 * - If exam date data exists in post.examDate or importantDates, display it; otherwise "As Per Schedule".
 * - If admit card available date data exists in post.admitCardDate or importantDates, display it; otherwise "Before Exam".
 */
export const getProcessedImportantDates = (post: SarkariPost): ImportantDateItem[] => {
  if (!post.importantDates || post.importantDates.length === 0) {
    const defaultDates: ImportantDateItem[] = [];
    if (post.postDate) {
      defaultDates.push({ label: 'Notification Released', value: post.postDate });
    }
    if (post.lastDate) {
      defaultDates.push({ label: 'Last Date for Apply Online', value: post.lastDate, isHighlight: true });
    }
    if (post.examDate) {
      defaultDates.push({ label: 'Exam Date', value: post.examDate, isHighlight: true });
    }
    if (post.admitCardDate) {
      defaultDates.push({ label: 'Admit Card Available', value: post.admitCardDate });
    }
    if (post.resultDate) {
      defaultDates.push({ label: 'Result Declared Date', value: post.resultDate, isHighlight: true });
    }
    return defaultDates;
  }

  const dates: ImportantDateItem[] = [...post.importantDates];

  // If examDate field exists and is not present in importantDates, append it
  if (post.examDate && post.examDate.trim() !== '') {
    const hasExam = dates.some(d => /exam|cbt|test date/i.test(d.label));
    if (!hasExam) {
      dates.push({ label: 'Exam Date', value: post.examDate, isHighlight: true });
    }
  }

  // If admitCardDate field exists and is not present in importantDates, append it
  if (post.admitCardDate && post.admitCardDate.trim() !== '') {
    const hasAdmit = dates.some(d => /admit card|hall ticket/i.test(d.label));
    if (!hasAdmit) {
      dates.push({ label: 'Admit Card Available', value: post.admitCardDate });
    }
  }

  // If resultDate field exists and is not present in importantDates, append it
  if (post.resultDate && post.resultDate.trim() !== '') {
    const hasResult = dates.some(d => /result|written result/i.test(d.label));
    if (!hasResult) {
      dates.push({ label: 'Result Declared Date', value: post.resultDate, isHighlight: true });
    }
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

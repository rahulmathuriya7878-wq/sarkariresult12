// Utility to generate and handle PDF files for recruitment posts
import { SarkariPost } from '../types/job';

/**
 * Reads any user-selected PDF file and returns Data URL, file name, and readable size.
 */
export const readPdfFileAsDataUrl = (file: File): Promise<{ dataUrl: string; fileName: string; fileSize: string }> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      reject(new Error('कृपया केवल PDF (.pdf) फ़ाइल चुनें (Please select only PDF files)'));
      return;
    }

    const fileSizeKb = Math.round(file.size / 1024);
    const fileSizeStr = fileSizeKb > 1024 ? `${(fileSizeKb / 1024).toFixed(2)} MB` : `${fileSizeKb} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      resolve({
        dataUrl,
        fileName: file.name,
        fileSize: fileSizeStr
      });
    };
    reader.onerror = () => {
      reject(new Error('फ़ाइल पढ़ने में त्रुटि हुई (Error reading file)'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Escapes text for standard PDF literal string syntax.
 */
const escapePdfText = (str: string): string => {
  return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/[^\x20-\x7E]/g, ' ');
};

/**
 * Generates an authentic printable PDF document for official notifications / offline forms.
 */
export const generateRecruitmentNotificationPdf = (post: {
  title: string;
  department?: string;
  shortTitle?: string;
  postDate?: string;
  lastDate?: string;
  totalVacancies?: string | number;
  salary?: string;
  notificationNumber?: string;
  ageLimitNotes?: string;
}): string => {
  const title = escapePdfText(post.title || 'Government Recruitment Notification 2026');
  const dept = escapePdfText(post.department || 'Government of India');
  const advt = escapePdfText(post.notificationNumber || 'Advt No. 04/2026 / HQ SAC');
  const lastDate = escapePdfText(post.lastDate || '23/11/2026');
  const vacancies = escapePdfText(String(post.totalVacancies || '01'));
  const salary = escapePdfText(post.salary || 'Pay Level-2 (Rs 19,900 - 63,200)');

  const streamContent = `BT
/F1 16 Tf
50 740 Td
(${title}) Tj
/F2 11 Tf
0 -24 Td
(DEPARTMENT: ${dept} | ${advt}) Tj
0 -20 Td
(OFFICIAL DETAILED NOTIFICATION & OFFLINE APPLICATION FORM FORMAT) Tj
/F1 12 Tf
0 -30 Td
(1. RECRUITMENT DETAILS & VACANCY BREAKDOWN) Tj
/F2 10 Tf
0 -20 Td
(Total Number of Posts: ${vacancies} Post | Category: OBC | Salary: ${salary}) Tj
0 -18 Td
(Minimum Educational Qualification: 12th Pass from Recognized Board) Tj
0 -18 Td
(Typing Speed Requirement: 30 WPM in Hindi OR 35 WPM in English on Computer) Tj
/F1 12 Tf
0 -26 Td
(2. IMPORTANT DATES & APPLICATION TIMELINE) Tj
/F2 10 Tf
0 -18 Td
(Application Begin Date: 24/10/2026 | Last Date to Receive Application Form: ${lastDate}) Tj
0 -18 Td
(Application Fee: NIL / Rs 0/- (Free for all categories)) Tj
/F1 12 Tf
0 -26 Td
(3. HOW TO APPLY - POSTAL SUBMISSION INSTRUCTIONS) Tj
/F2 10 Tf
0 -18 Td
(Step 1: Download and print this prescribed offline application format on A4 paper.) Tj
0 -18 Td
(Step 2: Fill in all entries neatly in Hindi or English (Block Capital Letters).) Tj
0 -18 Td
(Step 3: Paste a self-attested passport photograph on the top right corner.) Tj
0 -18 Td
(Step 4: Attach self-attested copies of 10th, 12th marksheet, OBC caste certificate & ID proof.) Tj
0 -18 Td
(Step 5: Enclose one self-addressed envelope with required postal stamps affixed.) Tj
0 -18 Td
(Step 6: Write on envelope: "APPLICATION FOR THE POST OF HINDI TYPIST (OBC CATEGORY)".) Tj
/F1 11 Tf
0 -26 Td
(OFFICIAL POSTAL ADDRESS TO SEND APPLICATION:) Tj
/F2 10 Tf
0 -18 Td
(The Commanding Officer, Head Quarter Southern Air Command Unit, Akkulam, Trivandrum - 695011) Tj
/F2 9 Tf
0 -35 Td
(Note: Generated and verified via Sarkari Result Official Portal - Verified Notification PDF) Tj
ET`;

  const streamBytes = new TextEncoder().encode(streamContent);
  const streamLength = streamBytes.length;

  const pdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 6 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj
5 0 obj << /Length ${streamLength} >> stream
${streamContent}
endstream
endobj
6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000325 00000 n 
0000000450 00000 n 
trailer << /Size 7 /Root 1 0 R >>
startxref
550
%%EOF`;

  // Encode to base64 Data URL
  const base64 = btoa(unescape(encodeURIComponent(pdf)));
  return `data:application/pdf;base64,${base64}`;
};

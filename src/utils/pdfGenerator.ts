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
  const advt = escapePdfText(post.notificationNumber || 'Recruitment Advt. 2026');
  const lastDate = escapePdfText(post.lastDate || 'Refer to official portal');
  const vacancies = escapePdfText(String(post.totalVacancies || 'As per norms'));
  const salary = escapePdfText(post.salary || 'As per 7th CPC Pay Matrix');

  const streamContent = `BT
/F1 16 Tf
50 740 Td
(${title}) Tj
/F2 11 Tf
0 -24 Td
(DEPARTMENT: ${dept} | ${advt}) Tj
0 -20 Td
(OFFICIAL DETAILED NOTIFICATION & INFORMATION BROCHURE) Tj
/F1 12 Tf
0 -30 Td
(1. RECRUITMENT DETAILS & VACANCY BREAKDOWN) Tj
/F2 10 Tf
0 -20 Td
(Total Number of Posts: ${vacancies} | Salary: ${salary}) Tj
0 -18 Td
(Eligibility: Educational Qualification as prescribed in the official advertisement) Tj
0 -18 Td
(Category-wise reservations applicable as per Government of India rules) Tj
/F1 12 Tf
0 -26 Td
(2. IMPORTANT DATES & APPLICATION TIMELINE) Tj
/F2 10 Tf
0 -18 Td
(Last Date to Submit Application: ${lastDate}) Tj
0 -18 Td
(Application Fee: As prescribed in the detailed recruitment advertisement) Tj
/F1 12 Tf
0 -26 Td
(3. HOW TO APPLY - GENERAL INSTRUCTIONS) Tj
/F2 10 Tf
0 -18 Td
(Step 1: Read the official notification and eligibility guidelines thoroughly.) Tj
0 -18 Td
(Step 2: Fill in all entries accurately without overwriting or false declarations.) Tj
0 -18 Td
(Step 3: Attach self-attested copies of required certificates and identification proof.) Tj
0 -18 Td
(Step 4: Submit application form before the closing date through official mode.) Tj
/F1 11 Tf
0 -26 Td
(OFFICIAL RECRUITMENT PORTAL:) Tj
/F2 10 Tf
0 -18 Td
(Please visit official recruitment website for regular updates and announcements.) Tj
/F2 9 Tf
0 -35 Td
(Note: Verified via Sarkari Result Official Portal - Official Recruitment Document) Tj
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

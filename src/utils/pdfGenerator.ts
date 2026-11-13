// Utility to handle PDF files for recruitment posts

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

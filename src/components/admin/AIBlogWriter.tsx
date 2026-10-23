import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Bot, 
  RefreshCw, 
  FileText, 
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Wand2,
  Share2
} from 'lucide-react';
import { SarkariPost } from '../../types/job';

interface AIBlogWriterProps {
  posts: SarkariPost[];
  currentPost?: SarkariPost | null;
  onApplyToPostInfo?: (post: SarkariPost, updatedInfo: string) => void;
  onSwitchToPostEditor?: (post: SarkariPost) => void;
}

export type BlogTemplateType = 
  | 'full_notification'
  | 'salary_and_perks'
  | 'exam_pattern_syllabus'
  | 'admit_card_alert'
  | 'result_cutoff';

export type BlogTone = 'official_hindi' | 'student_friendly' | 'bilingual';

export const AIBlogWriter: React.FC<AIBlogWriterProps> = ({
  posts,
  currentPost,
  onApplyToPostInfo,
  onSwitchToPostEditor
}) => {
  // Selected Source Post
  const [selectedPostId, setSelectedPostId] = useState<string>(currentPost?.id || (posts.length > 0 ? posts[0].id : ''));
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  
  // Custom Topic Inputs
  const [customTitle, setCustomTitle] = useState('');
  const [customDept, setCustomDept] = useState('Railway / SSC');
  const [customVacancies, setCustomVacancies] = useState('5000+ Posts');
  const [customLastDate, setCustomLastDate] = useState('30/11/2026');

  // Generator Options
  const [templateType, setTemplateType] = useState<BlogTemplateType>('full_notification');
  const [blogTone, setBlogTone] = useState<BlogTone>('official_hindi');
  const [includeDates, setIncludeDates] = useState(true);
  const [includeVacancy, setIncludeVacancy] = useState(true);
  const [includeSalary, setIncludeSalary] = useState(true);
  const [includePattern, setIncludePattern] = useState(true);
  const [includeApplySteps, setIncludeApplySteps] = useState(true);
  const [includeLinks, setIncludeLinks] = useState(true);
  const [includeFaqs, setIncludeFaqs] = useState(true);

  // Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'preview' | 'markdown'>('preview');

  // Selected post object
  const activePost = posts.find(p => p.id === selectedPostId) || currentPost || posts[0];

  // Update selected post when currentPost prop changes
  useEffect(() => {
    if (currentPost?.id) {
      setSelectedPostId(currentPost.id);
    }
  }, [currentPost?.id]);

  // Generate Blog Post Function
  const handleGenerateBlog = () => {
    setIsGenerating(true);
    setAppliedSuccess(false);

    setTimeout(() => {
      const title = isCustomTopic ? customTitle || 'सरकारी भर्ती 2026' : (activePost?.title || 'सरकारी भर्ती 2026');
      const shortTitle = isCustomTopic ? customTitle || 'Govt Job 2026' : (activePost?.shortTitle || activePost?.title || 'Recruitment 2026');
      const dept = isCustomTopic ? customDept : (activePost?.department || 'Government of India');
      const vacancies = isCustomTopic ? customVacancies : (activePost?.totalVacancies || 'अधिसूचना अनुसार');
      const lastDate = isCustomTopic ? customLastDate : (activePost?.lastDate || 'जल्द घोषित होगी');
      const salary = activePost?.salary || '₹ 25,500 - ₹ 81,100/- (Pay Level 4-7)';
      const qualifications = activePost?.qualifications?.join(', ') || '10th / 12th / Graduate';
      const notifNo = activePost?.notificationNumber || 'CEN 01/2026';
      const ageDetails = activePost?.ageLimit 
        ? `${activePost.ageLimit.minAge || 18} से ${activePost.ageLimit.maxAge || 33} वर्ष (गणना तिथि: ${activePost.ageLimit.asOnDate || '01/01/2026'})`
        : '18 से 33 वर्ष (नियमानुसार छूट लागू)';

      let content = '';

      if (templateType === 'full_notification') {
        content = `# ${title} : संपूर्ण अधिसूचना, योग्यता, वेतन सारणी व ऑनलाइन आवेदन गाइड 2026

**विभाग:** ${dept} | **अधिसूचना क्रमांक:** ${notifNo} | **कुल पद:** ${vacancies}
**पोस्ट प्रकाशित तिथि:** ${new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })}

---

## 📌 1. भर्ती का संक्षिप्त विवरण (Overview)
${dept} द्वारा **${title}** के लिए आधिकारिक अधिसूचना जारी कर दी गई है। इस भर्ती के तहत योग्य एवं इच्छुक उम्मीदवारों से विभिन्न पदों के लिए ऑनलाइन आवेदन आमंत्रित किए गए हैं। ऐसे सभी अभ्यर्थी जो निर्धारित शैक्षिक योग्यता एवं आयु सीमा पूरी करते हैं, वे अंतिम तिथि **${lastDate}** से पूर्व आधिकारिक पोर्टल पर जाकर ऑनलाइन आवेदन कर सकते हैं।

---

${includeDates ? `## 📅 2. महत्वपूर्ण तिथियां (Important Dates)
अभ्यर्थियों की सुविधा हेतु सभी प्रमुख तिथियों का विवरण नीचे सारणी में दिया गया है:

| महत्वपूर्ण घटना (Event) | निर्धारित तिथि (Schedule) |
| :--- | :--- |
| ऑनलाइन आवेदन प्रारंभ तिथि | ${activePost?.importantDates?.find(d => d.label.toLowerCase().includes('begin'))?.value || 'आवेदन शुरू हो चुके हैं'} |
| ऑनलाइन आवेदन की अंतिम तिथि | **${lastDate}** (महत्वपूर्ण) |
| आवेदन शुल्क भुगतान की अंतिम तिथि | ${activePost?.importantDates?.find(d => d.label.toLowerCase().includes('fee'))?.value || lastDate} |
| फॉर्म संशोधन (Correction Window) | As per Schedule |
| परीक्षा शहर सूचना (Exam City Slip) | परीक्षा से 10 दिन पूर्व |
| प्रवेश पत्र डाउनलोड (Admit Card) | परीक्षा से 4 दिन पूर्व |
| सीबीटी परीक्षा तिथि (Exam Date) | ${activePost?.examDate || 'आधिकारिक शेड्यूल अनुसार'} |

` : ''}

${includeVacancy ? `## 👥 3. पद विवरण व योग्यता (Vacancy Details & Eligibility)
इस भर्ती के अंतर्गत कुल **${vacancies}** पदों पर सीधी भर्ती की जाएगी:

| पद का नाम (Post Name) | कुल पद (Total Vacancy) | न्यूनतम शैक्षिक योग्यता (Eligibility) |
| :--- | :--- | :--- |
${activePost?.vacancyBreakdown && activePost.vacancyBreakdown.length > 0 ? activePost.vacancyBreakdown.map(v => `| ${v.postName} | ${v.totalPosts || 'पदों का विवरण देखें'} | ${v.eligibility || qualifications} |`).join('\n') : `| ${shortTitle} | ${vacancies} | मान्यता प्राप्त बोर्ड/विश्वविद्यालय से ${qualifications} |`}

### 🎂 आयु सीमा (Age Limit Criteria):
* **न्यूनतम आयु:** ${activePost?.ageLimit?.minAge || 18} वर्ष
* **अधिकतम आयु:** ${activePost?.ageLimit?.maxAge || 33} वर्ष
* **आयु गणना आधार:** ${activePost?.ageLimit?.asOnDate || '01/01/2026'}
* **आयु में छूट:** ओबीसी वर्ग को 3 वर्ष, एससी/एसटी वर्ग को 5 वर्ष तथा दिव्यांग अभ्यर्थियों को नियमानुसार छूट देय होगी।

` : ''}

${includeSalary ? `## 💰 4. वेतन सारणी व पे-मैट्रिक्स (Pay Scale & Salary Details)
चयनित अभ्यर्थियों को 7वें केंद्रीय वेतन आयोग (7th Central Pay Commission) के अनुसार आकर्षक वेतनमान प्रदान किया जाएगा:

| पद का नाम (Post) | 7th CPC पे लेवल | मूल वेतन (Basic Pay) | अनुमानित सकल वेतन (Gross Pay) |
| :--- | :--- | :--- | :--- |
${activePost?.salaryBreakdown && activePost.salaryBreakdown.length > 0 ? activePost.salaryBreakdown.map(s => `| ${s.postName} | ${s.payLevel || 'Level 4/6'} | ${s.basicPay || '₹ 25,500 - ₹ 35,400/-'} | ${s.grossSalary || s.inHandSalary || '₹ 38,000 - ₹ 56,000/-'} |`).join('\n') : `| ${shortTitle} | Pay Level 6 / Level 4 | ₹ 25,500 - ₹ 35,400/- | ₹ 42,000 - ₹ 58,000/- प्रति माह |`}

* **अन्य देय भत्ते:** मूल वेतन के अतिरिक्त महंगाई भत्ता (DA), मकान किराया भत्ता (HRA), परिवहन भत्ता (TA) और राष्ट्रीय पेंशन प्रणाली (NPS) का लाभ देय होगा।

` : ''}

${includePattern ? `## 📝 5. परीक्षा पैटर्न व चयन प्रक्रिया (Exam Pattern & Selection Scheme)
उम्मीदवारों का अंतिम चयन कंप्यूटर आधारित परीक्षा (CBT), दस्तावेज सत्यापन और चिकित्सा परीक्षण के आधार पर किया जाएगा:

* **परीक्षा का माध्यम:** कंप्यूटर आधारित परीक्षा (Online CBT)
* **प्रश्नों का प्रकार:** वस्तुनिष्ठ बहुविकल्पीय प्रश्न (Objective Multiple Choice MCQs)
* **नकारात्मक अंकन (Negative Marking):** 1/3 अंक प्रत्येक गलत उत्तर पर काटा जाएगा।

| विषय (Subject) | प्रश्नों की संख्या | कुल अंक | समय अवधि |
| :--- | :--- | :--- | :--- |
| सामान्य जागरूकता (General Awareness) | 30 | 30 | 90 मिनट |
| गणित (Mathematics) | 30 | 30 | (दिव्यांगों हेतु |
| सामान्य बुद्धिमत्ता व रीजनिंग (General Intelligence & Reasoning) | 30 | 30 | 120 मिनट) |
| सामान्य विज्ञान / तकनीकी ज्ञान | 10 | 10 | |
| **कुल योग (Total)** | **100 प्रश्न** | **100 अंक** | **90 मिनट** |

` : ''}

${includeApplySteps ? `## 📋 6. ऑनलाइन आवेदन कैसे करें (Step-by-Step Application Process)
1. सबसे पहले आधिकारिक वेबसाइट पर जाएं अथवा नीचे दिए गए **"Apply Online"** लिंक पर क्लिक करें।
2. नए अभ्यर्थी **"New Registration"** पर क्लिक कर अपना मोबाइल नंबर व ईमेल आईडी दर्ज करके ओटीपी सत्यापित करें।
3. पंजीकरण सफल होने के बाद लॉगिन करें और अपनी व्यक्तिगत जानकारी, शैक्षणिक विवरण एवं श्रेणी भरें।
4. निर्धारित प्रारूप (JPG/JPEG) में हालिया पासपोर्ट साइज फोटो एवं स्पष्ट हस्ताक्षर अपलोड करें।
5. अपनी श्रेणी अनुसार निर्धारित आवेदन शुल्क का भुगतान ऑनलाइन माध्यम (UPI / Net Banking / Debit Card) से करें।
6. आवेदन पत्र को पूर्ण रूप से जांचने (Preview) के बाद **Final Submit** करें और पावती रसीद का प्रिंटआउट सुरक्षित रख लें।

` : ''}

${includeLinks ? `## 🔗 7. महत्वपूर्ण आधिकारिक लिंक्स (Important Direct Links)
उम्मीदवारों की सुविधा के लिए सभी सत्यापित आधिकारिक लिंक्स नीचे दी गई हैं:

| विवरण (Description) | आधिकारिक लिंक (Direct Link) |
| :--- | :--- |
| ऑनलाइन आवेदन करें (Apply Online) | [Click Here to Apply Online](${activePost?.directLinks?.find(l => l.type === 'apply')?.url || '#'}) |
| आधिकारिक अधिसूचना डाउनलोड करें (Notification PDF) | [Download Official PDF](${activePost?.directLinks?.find(l => l.type === 'notification')?.url || '#'}) |
| आधिकारिक वेबसाइट (Official Website) | [Visit Official Website](${activePost?.directLinks?.find(l => l.type === 'official')?.url || '#'}) |
| Sarkari Result आधिकारिक व्हाट्सएप चैनल | [Join WhatsApp Channel](https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j) |
| Sarkari Result टेलीग्राम चैनल | [Join Telegram Channel](https://t.me/newsarkariresultt) |

` : ''}

${includeFaqs ? `## ❓ अक्सर पूछे जाने वाले प्रश्न (FAQs)

**Q1: ${shortTitle} 2026 के लिए ऑनलाइन आवेदन की अंतिम तिथि क्या है?**  
**उत्तर:** ऑनलाइन आवेदन जमा करने की अंतिम तिथि **${lastDate}** है। अभ्यर्थियों को सलाह दी जाती है कि वे अंतिम समय की तकनीकी समस्याओं से बचने के लिए समय से पूर्व फॉर्म भरें।

**Q2: इस भर्ती में कुल कितने रिक्त पद हैं?**  
**उत्तर:** कुल **${vacancies}** पदों के लिए यह भर्ती अधिसूचना जारी की गई है।

**Q3: क्या इस परीक्षा में नेगेटिव मार्किंग लागू होगी?**  
**उत्तर:** हां, कंप्यूटर आधारित परीक्षा (CBT) में प्रत्येक गलत उत्तर के लिए 1/3 अंक की नकारात्मक कटौती की जाएगी।
` : ''}

---
*अस्वीकरण (Disclaimer): यह लेख केवल अभ्यर्थियों की सूचना एवं मार्गदर्शन हेतु तैयार किया गया है। आवेदन करने से पूर्व अभ्यर्थी संबंधित विभाग की मूल अधिसूचना का ध्यानपूर्वक अध्ययन अवश्य करें।*`;
      } else if (templateType === 'salary_and_perks') {
        content = `# ${shortTitle} Salary 2026: 7th Pay Commission Pay Scale, In-Hand Salary, Allowances & Job Profile

${dept} के अंतर्गत **${title}** के पदों पर चयनित होने वाले कर्मचारियों का वेतन 7वें वेतन आयोग की सिफारिशों के अनुरूप निर्धारित किया जाता है। यहां आपको पे-लेवल, बेसिक पे, ग्रेड पे, भत्ते एवं इन-हैंड सैलरी की विस्तृत जानकारी दी गई है।

---

## 💵 वेतन संरचना सारणी (Salary Breakdown Table)

| पद का नाम (Post) | पे लेवल (Pay Level) | मूल वेतन (Basic Pay) | ग्रेड पे (Grade Pay) | अनुमानित सकल वेतन (Gross) |
| :--- | :--- | :--- | :--- | :--- |
${activePost?.salaryBreakdown && activePost.salaryBreakdown.length > 0 ? activePost.salaryBreakdown.map(s => `| ${s.postName} | ${s.payLevel || 'Level 6'} | ${s.basicPay || '₹ 35,400/-'} | ${s.gradePay || '₹ 4,200/-'} | ${s.grossSalary || s.inHandSalary || '₹ 56,000/-'} |`).join('\n') : `| ${shortTitle} | 7th CPC Level 6 | ₹ 35,400/- | ₹ 4,200/- | ₹ 56,500/- प्रति माह |`}

### 🎁 अतिरिक्त भत्ते व सुविधाएं (Allowances & Perks):
1. **महंगाई भत्ता (Dearness Allowance - DA):** केंद्र सरकार के वर्तमान 50%+ नियम अनुसार।
2. **मकान किराया भत्ता (House Rent Allowance - HRA):** शहर की श्रेणी (X, Y, Z Class) के अनुसार 30%, 20% या 10%।
3. **परिवहन भत्ता (Transport Allowance - TA):** यात्रा खर्च के लिए निश्चित भत्ता।
4. **चिकित्सा सुविधा (Medical Facility):** कर्मचारी और उनके आश्रितों के लिए निःशुल्क स्वास्थ्य सुरक्षा।
5. **पेंशन व भविष्य निधि (NPS & PF):** सेवानिवृत्ति के बाद वित्तीय सुरक्षा।

---

## 📈 करियर ग्रोथ व पदोन्नति (Career Progression)
इस पद पर चयनित कर्मचारी अपने उत्कृष्ट कार्य एवं विभागीय पदोन्नति परीक्षा (LDCE) के माध्यम से उच्च पदों पर पदोन्नत हो सकते हैं।`;
      } else if (templateType === 'exam_pattern_syllabus') {
        content = `# ${shortTitle} Exam Pattern & Syllabus 2026: विस्तृत परीक्षा योजना, विषयवार अंक व समय सारणी

${dept} द्वारा आयोजित की जाने वाली **${title}** भर्ती परीक्षा की तैयारी कर रहे सभी अभ्यर्थियों के लिए संपूर्ण परीक्षा पैटर्न और अंक योजना का विवरण नीचे दिया गया है।

---

## 🎯 परीक्षा का स्वरूप (Examination Scheme)
* **परीक्षा मोड:** ऑनलाइन कंप्यूटर आधारित परीक्षा (Computer Based Test - CBT)
* **प्रश्नों की प्रकृति:** वस्तुनिष्ठ बहुविकल्पीय प्रश्न (MCQ Based)
* **कुल समय अवधि:** 90 मिनट (1 घंटा 30 मिनट)
* **नकारात्मक अंकन (Negative Marking):** 1/3 (प्रत्येक गलत उत्तर पर एक तिहाई अंक काटा जाएगा)

---

## 📊 विषयवार प्रश्नों और अंकों का विवरण

| क्रम | विषय (Subject) | प्रश्नों की संख्या (Questions) | कुल अंक (Max Marks) |
| :--- | :--- | :--- | :--- |
| 1 | सामान्य बुद्धिमत्ता एवं तर्कशक्ति (General Intelligence & Reasoning) | 30 प्रश्न | 30 अंक |
| 2 | सामान्य ज्ञान व समसामयिकी (General Awareness & Current Affairs) | 30 प्रश्न | 30 अंक |
| 3 | संख्यात्मक अभियोग्यता (Mathematics / Quantitative Aptitude) | 30 प्रश्न | 30 अंक |
| 4 | सामान्य विज्ञान (General Science) | 10 प्रश्न | 10 अंक |
| **योग** | **संपूर्ण प्रश्न पत्र (Full Exam)** | **100 प्रश्न** | **100 अंक** |

---

## 💡 मुख्य तैयारी रणनीतियाँ (Preparation Tips)
1. **गत वर्षों के प्रश्न पत्र (Previous Year Papers):** पिछले 5 वर्षों के हल किए गए प्रश्न पत्रों का प्रतिदिन अभ्यास करें।
2. **समय प्रबंधन (Time Management):** 90 मिनट में 100 प्रश्नों को हल करने के लिए नियमित ऑनलाइन मॉक टेस्ट दें।
3. **करंट अफेयर्स (Current Affairs):** पिछले 6 से 8 महीनों के राष्ट्रीय एवं अंतर्राष्ट्रीय घटनाक्रम का निरंतर रिवीजन करें।`;
      } else if (templateType === 'admit_card_alert') {
        content = `# ${shortTitle} Admit Card 2026 Released: प्रवेश पत्र डाउनलोड लिंक व परीक्षा केंद्र दिशा-निर्देश

**${dept}** द्वारा **${title}** के लिए आयोजित होने वाली लिखित/सीबीटी परीक्षा के प्रवेश पत्र (Hall Ticket / Admit Card) आधिकारिक पोर्टल पर जारी कर दिए गए हैं।

---

## 📢 महत्वपूर्ण परीक्षा तिथियां व अलर्ट
* **परीक्षा शहर पर्ची (Exam City Slip Date):** परीक्षा से 10 दिन पूर्व जारी
* **एडमिट कार्ड डाउनलोड प्रारंभ:** परीक्षा तिथि से 4 दिन पूर्व
* **परीक्षा तिथि (Exam Date):** ${activePost?.examDate || 'शेड्यूल अनुसार'}
* **परीक्षा का माध्यम:** कंप्यूटर आधारित परीक्षा (CBT)

---

## 📲 एडमिट कार्ड कैसे डाउनलोड करें (How to Download Admit Card)
1. नीचे दिए गए **"Download Admit Card"** के आधिकारिक लिंक पर क्लिक करें।
2. अपना **Registration Number** और **Password / Date of Birth (DD-MM-YYYY)** दर्ज करें।
3. प्रदर्शित सुरक्षा कैप्चा कोड भरें और **"Login"** बटन पर क्लिक करें।
4. स्क्रीन पर प्रदर्शित अपने एडमिट कार्ड की जांच करें और **"Download PDF"** पर क्लिक करें।
5. परीक्षा केंद्र पर ले जाने हेतु एडमिट कार्ड का साफ रंगीन अथवा ब्लैक & व्हाइट प्रिंटआउट निकाल लें।

---

## ⚠️ परीक्षा केंद्र पर ले जाने हेतु अनिवार्य दस्तावेज:
1. एडमिट कार्ड की मूल हार्ड कॉपी (Original Printout)।
2. सरकार द्वारा जारी मूल पहचान पत्र (आधार कार्ड / पैन कार्ड / वोटर आईडी / ड्राइविंग लाइसेंस)।
3. दो हालिया पासपोर्ट साइज रंगीन फोटो।
4. पारदर्शी बॉलपॉइंट पेन।`;
      } else {
        content = `# ${shortTitle} Result & Merit List 2026: कट-ऑफ मार्क्स व स्कोर कार्ड जांचने का सीधा लिंक

**${dept}** ने **${title}** भर्ती परीक्षा का अंतिम परिणाम एवं वर्गवार कट-ऑफ अंक आधिकारिक पोर्टल पर घोषित कर दिए हैं। जिन उम्मीदवारों ने इस परीक्षा में भाग लिया था, वे अपना परिणाम देख सकते हैं।

---

## 🏆 कट-ऑफ मार्क्स विवरण (Category-wise Cut-off Marks)

| श्रेणी (Category) | अपेक्षित कट-ऑफ (Expected Cut-off Marks) |
| :--- | :--- |
| अनारक्षित (UR / General) | 74 - 78 अंक |
| अन्य पिछड़ा वर्ग (OBC) | 70 - 74 अंक |
| आर्थिक रूप से कमजोर (EWS) | 68 - 72 अंक |
| अनुसूचित जाति (SC) | 62 - 66 अंक |
| अनुसूचित जनजाति (ST) | 58 - 62 अंक |

---

## 🔍 परिणाम कैसे चेक करें (How to Check Result)
1. आधिकारिक परिणाम लिंक पर जाएं।
2. 'Result PDF' डाउनलोड करें।
3. 'Ctrl + F' दबाकर अपना अनुक्रमांक (Roll Number) अथवा नाम खोजें।
4. चयन सूची में अपना नाम आने पर भविष्य के संदर्भ हेतु परिणाम सुरक्षित रख लें।`;
      }

      setGeneratedBlog(content);
      setIsGenerating(false);
    }, 600);
  };

  // Copy Generated Blog
  const handleCopyBlog = () => {
    if (!generatedBlog) return;
    navigator.clipboard.writeText(generatedBlog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download Blog as .md file
  const handleDownloadBlog = () => {
    if (!generatedBlog) return;
    const blob = new Blob([generatedBlog], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activePost?.slug || 'sarkari-blog'}-article.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Apply to post description
  const handleApplyToPost = () => {
    if (!generatedBlog || !activePost) return;
    if (onApplyToPostInfo) {
      onApplyToPostInfo(activePost, generatedBlog);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 3000);
    }
  };

  // Word count & read time
  const wordCount = generatedBlog.trim() ? generatedBlog.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-white text-slate-800">
      
      {/* Left Sidebar: Generator Controls & Options */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col shrink-0 overflow-y-auto p-4 space-y-4">
        
        {/* Header Ribbon */}
        <div className="bg-linear-to-r from-red-700 to-amber-600 text-white p-3 rounded shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black">
              🤖
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight">AI ब्लॉग राइटर</h3>
              <p className="text-[11px] text-amber-100">Smart Sarkari Article Generator</p>
            </div>
          </div>
          <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded">
            PRO
          </span>
        </div>

        {/* 1. Source Post Selector */}
        <div className="space-y-1.5 bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <label className="block text-xs font-black text-slate-800">
            1. पोस्ट चुनें जिसके लिए ब्लॉग लिखना है:
          </label>
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setIsCustomTopic(false)}
              className={`flex-1 py-1 text-xs font-bold rounded border transition-colors cursor-pointer ${
                !isCustomTopic
                  ? 'bg-red-700 text-white border-red-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              पोर्टल की पोस्ट
            </button>
            <button
              type="button"
              onClick={() => setIsCustomTopic(true)}
              className={`flex-1 py-1 text-xs font-bold rounded border transition-colors cursor-pointer ${
                isCustomTopic
                  ? 'bg-red-700 text-white border-red-800'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
            >
              कस्टम टॉपिक
            </button>
          </div>

          {!isCustomTopic ? (
            <div>
              <select
                value={selectedPostId}
                onChange={(e) => setSelectedPostId(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700"
              >
                {posts.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.category.toUpperCase().replace('_', ' ')}] {p.shortTitle || p.title}
                  </option>
                ))}
              </select>

              {activePost && (
                <div className="mt-2 text-[11px] bg-amber-50 text-amber-900 border border-amber-200 p-2 rounded space-y-0.5 font-medium">
                  <div><strong>विभाग:</strong> {activePost.department}</div>
                  <div><strong>पद संख्या:</strong> {activePost.totalVacancies || 'अधिसूचना अनुसार'}</div>
                  <div><strong>अंतिम तिथि:</strong> {activePost.lastDate || 'जल्द उपलब्ध'}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="भर्ती / विषय का नाम (e.g. RRB ALP 2026)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded font-bold"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="विभाग (e.g. Railway)"
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded"
                />
                <input
                  type="text"
                  placeholder="कुल पद (e.g. 5000+)"
                  value={customVacancies}
                  onChange={(e) => setCustomVacancies(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Blog Template Type */}
        <div className="space-y-1.5 bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <label className="block text-xs font-black text-slate-800">
            2. ब्लॉग का प्रकार व थीम (Template):
          </label>
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value as BlogTemplateType)}
            className="w-full text-xs font-bold bg-white border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700"
          >
            <option value="full_notification">1. संपूर्ण भर्ती अधिसूचना व गाइड (Complete Guide)</option>
            <option value="salary_and_perks">2. वेतन सारणी, पे-मैट्रिक्स व भत्ते (Salary & Perks)</option>
            <option value="exam_pattern_syllabus">3. परीक्षा पैटर्न, अंक योजना व सिलेबस (Exam Pattern)</option>
            <option value="admit_card_alert">4. एडमिट कार्ड व परीक्षा तिथि अलर्ट (Admit Card Alert)</option>
            <option value="result_cutoff">5. परिणाम व कट-ऑफ मार्क्स विश्लेषण (Result & Cutoff)</option>
          </select>
        </div>

        {/* 3. Tone & Language */}
        <div className="space-y-1.5 bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <label className="block text-xs font-black text-slate-800">
            3. भाषा व टोन (Language & Tone):
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setBlogTone('official_hindi')}
              className={`py-1.5 text-[11px] font-bold rounded border text-center transition-colors cursor-pointer ${
                blogTone === 'official_hindi'
                  ? 'bg-red-700 text-white border-red-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              आधिकारिक हिंदी
            </button>
            <button
              type="button"
              onClick={() => setBlogTone('student_friendly')}
              className={`py-1.5 text-[11px] font-bold rounded border text-center transition-colors cursor-pointer ${
                blogTone === 'student_friendly'
                  ? 'bg-red-700 text-white border-red-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              सरल छात्र गाइड
            </button>
            <button
              type="button"
              onClick={() => setBlogTone('bilingual')}
              className={`py-1.5 text-[11px] font-bold rounded border text-center transition-colors cursor-pointer ${
                blogTone === 'bilingual'
                  ? 'bg-red-700 text-white border-red-800'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              द्विभाषी
            </button>
          </div>
        </div>

        {/* 4. Content Inclusions */}
        <div className="space-y-2 bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <label className="block text-xs font-black text-slate-800">
            4. ब्लॉग में क्या-क्या शामिल करें:
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold text-slate-700">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeDates} 
                onChange={(e) => setIncludeDates(e.target.checked)} 
                className="rounded text-red-600"
              />
              <span>महत्वपूर्ण तिथियां</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeVacancy} 
                onChange={(e) => setIncludeVacancy(e.target.checked)} 
                className="rounded text-red-600"
              />
              <span>पद विवरण व कोटा</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeSalary} 
                onChange={(e) => setIncludeSalary(e.target.checked)} 
                className="rounded text-red-600"
              />
              <span>वेतन सारणी (Salary)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includePattern} 
                onChange={(e) => setIncludePattern(e.target.checked)} 
                className="rounded text-red-600"
              />
              <span>परीक्षा पैटर्न सारणी</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeApplySteps} 
                onChange={(e) => setIncludeApplySteps(e.target.checked)} 
                className="rounded text-red-600"
              />
              <span>आवेदन के चरण</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={includeLinks} 
                onChange={(e) => setIncludeLinks(e.target.checked)} 
                className="rounded text-red-600"
              />
              <span>डायरेक्ट लिंक्स</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer col-span-2">
              <input 
                type="checkbox" 
                checked={includeFaqs} 
                onChange={(e) => setIncludeFaqs(e.target.checked)} 
                className="rounded text-red-600"
              />
              <span>अक्सर पूछे जाने वाले प्रश्न (FAQs)</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerateBlog}
          disabled={isGenerating}
          className="w-full bg-linear-to-r from-[#ab1616] to-red-800 hover:from-red-800 hover:to-red-900 text-white font-black text-xs sm:text-sm py-3 px-4 rounded shadow-md cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AI ब्लॉग लिख रहा है...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>🚀 AI से ब्लॉग जनरेट करें</span>
            </>
          )}
        </button>

      </div>

      {/* Right Content Area: Generated Blog & Actions */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        
        {/* Top Sticky Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-300 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPreviewMode('preview')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  previewMode === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                विजुअल प्रीव्यू (Preview)
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('markdown')}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  previewMode === 'markdown' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-black'
                }`}
              >
                मार्कडाउन कोड (Markdown)
              </button>
            </div>

            {generatedBlog && (
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                <strong>{wordCount}</strong> शब्द • अनुमानित पढ़ने का समय: <strong>{readTime} मिनट</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {generatedBlog && (
              <>
                <button
                  type="button"
                  onClick={handleCopyBlog}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded cursor-pointer transition-colors shadow-2xs"
                  title="Copy full article to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copied ? 'कॉपी हो गया!' : 'कॉपी करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBlog}
                  className="inline-flex items-center gap-1 text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded cursor-pointer transition-colors shadow-2xs"
                  title="Download as Markdown file"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">डाउनलोड .md</span>
                </button>

                {onApplyToPostInfo && activePost && (
                  <button
                    type="button"
                    onClick={handleApplyToPost}
                    className="inline-flex items-center gap-1 text-xs font-black bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded cursor-pointer transition-colors shadow-2xs"
                    title="Insert generated article directly into this post's short info"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{appliedSuccess ? 'पोस्ट में डाला गया!' : '📥 पोस्ट के विवरण में डालें'}</span>
                  </button>
                )}

                {onSwitchToPostEditor && activePost && (
                  <button
                    type="button"
                    onClick={() => onSwitchToPostEditor(activePost)}
                    className="inline-flex items-center gap-1 text-xs font-black bg-[#ab1616] hover:bg-red-800 text-white px-3 py-1.5 rounded cursor-pointer transition-colors shadow-2xs"
                    title="Open post in Direct Section Editor"
                  >
                    <span>⚡ पोस्ट एडिट करें</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white">
          {!generatedBlog ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#ab1616] flex items-center justify-center text-2xl shadow-inner">
                ✨
              </div>
              <div className="max-w-md">
                <h4 className="text-base font-black text-slate-800">
                  AI ब्लॉग राइटर तैयार है
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  बाईं ओर से अपनी पोस्ट और ब्लॉग का प्रकार चुनें, और <strong>"AI से ब्लॉग जनरेट करें"</strong> पर क्लिक करें। आपका पूरा SEO ब्लॉग, वेतन सारणी, परीक्षा पैटर्न व लिंक्स सहित तुरंत तैयार हो जाएगा।
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateBlog}
                  className="bg-[#ab1616] hover:bg-red-800 text-white text-xs font-black px-4 py-2 rounded cursor-pointer shadow-xs"
                >
                  🚀 अभी तुरंत टेस्ट ब्लॉग जनरेट करें
                </button>
              </div>
            </div>
          ) : previewMode === 'markdown' ? (
            <textarea
              value={generatedBlog}
              onChange={(e) => setGeneratedBlog(e.target.value)}
              className="w-full h-full p-4 font-mono text-xs bg-slate-50 text-slate-800 border border-slate-300 rounded focus:outline-none focus:border-red-600 resize-none leading-relaxed"
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4 font-sans text-slate-800 pb-10">
              {/* Blog Rendered Article */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-md shadow-2xs">
                <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SEO तैयार ब्लॉग आलेख (Ready for Publication)</span>
                </div>
                <div className="text-xs text-slate-600">
                  <strong>SEO Meta Title:</strong> {activePost?.title || 'सरकारी भर्ती 2026'} | Sarkari Result
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  <strong>Meta Description:</strong> {activePost?.shortTitle || activePost?.title} भर्ती 2026 की संपूर्ण जानकारी, योग्यता, वेतन सारणी, परीक्षा पैटर्न और ऑनलाइन आवेदन का आधिकारिक डायरेक्ट लिंक यहां देखें।
                </div>
              </div>

              {/* Rendered Text with Simple Markdown-like Formatting */}
              <div className="prose max-w-none text-slate-800 space-y-3 leading-relaxed text-sm whitespace-pre-wrap font-sans">
                {generatedBlog}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

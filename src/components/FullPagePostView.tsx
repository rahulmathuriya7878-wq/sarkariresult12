import React, { useEffect, useState } from 'react';
import { SarkariPost } from '../types/job';
import { 
  ArrowLeft, 
  Printer, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  ExternalLink, 
  Calendar, 
  CreditCard, 
  UserCheck, 
  FileText, 
  Calculator, 
  AlertCircle,
  Building,
  GraduationCap,
  ChevronRight,
  Send,
  Home,
  LogIn,
  UserPlus
} from 'lucide-react';

interface FullPagePostViewProps {
  post: SarkariPost;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  onOpenAgeCalculator: () => void;
  onOpenPhotoResizer: () => void;
  isHindi: boolean;
}

const getJobSelectionStages = (post: SarkariPost): string[] => {
  if (post.selectionProcess && post.selectionProcess.length > 0) {
    return post.selectionProcess;
  }

  const titleLower = (post.title + ' ' + post.slug).toLowerCase();

  // आंगनवाड़ी भर्ती (सीधी मेरिट, कोई परीक्षा नहीं)
  if (titleLower.includes('anganwadi')) {
    return [
      'चरण 1: सीधी मेरिट सूची - कक्षा 10वीं (हाईस्कूल) एवं 12वीं (इंटरमीडिएट) के प्राप्तांकों के आधार पर तैयार मेरिट (कोई लिखित परीक्षा नहीं)',
      'चरण 2: ऑफलाइन दस्तावेज़ सत्यापन - मूल अंकतालिकाएं, आधार कार्ड, निवास प्रमाण पत्र, जाति व आय प्रमाण पत्र की जांच',
      'चरण 3: जिला चयन समिति (जिलाधिकारी / DM की अध्यक्षता में) द्वारा अंतिम चयन व नियुक्ति पत्र जारी होना'
    ];
  }

  // मेडिकल ऑफिसर / RUHS / डॉक्टर भर्ती
  if (post.department === 'Medical' || titleLower.includes('medical-officer') || titleLower.includes('mo medical')) {
    return [
      'चरण 1: ऑनलाइन कंप्यूटर आधारित लिखित परीक्षा (CBT) - MBBS पाठ्यक्रम पर आधारित 100 वस्तुनिष्ठ बहुविकल्पीय प्रश्न',
      'चरण 2: राजस्थान मेडिकल काउंसिल (RMC / NMC) में स्थायी पंजीकरण एवं इंटर्नशिप पूर्णता प्रमाण पत्र सत्यापन',
      'चरण 3: सरकारी चिकित्सा संस्थानों / कोविड-19 संविदा सेवा का अनुभव बोनस अंक (राजस्थान सेवा नियमानुसार अधिकतम 30 अंक)',
      'चरण 4: मूल दस्तावेज़ सत्यापन (DV), मेडिकल फिटनेस एवं अंतिम मेरिट आवंटन'
    ];
  }

  // पुलिस / कांस्टेबल / सब-इंस्पेक्टर
  if (post.department === 'Police' || titleLower.includes('police') || titleLower.includes('constable')) {
    return [
      'चरण 1: कंप्यूटर आधारित टेस्ट (CBT) या OMR आधारित लिखित परीक्षा (सामान्य ज्ञान, रीजनिंग व महिला-बाल सुरक्षा कानून)',
      'चरण 2: शारीरिक दक्षता परीक्षा (PET - पुरुष अभ्यर्थियों के लिए 25 मिनट में 5 किमी दौड़, महिलाओं के लिए 35 मिनट)',
      'चरण 3: शारीरिक मापदंड परीक्षण (PST - ऊंचाई, सीना व वजन की माप)',
      'चरण 4: मूल दस्तावेज़ सत्यापन (DV) एवं पुलिस चरित्र सत्यापन (Verification)',
      'चरण 5: मेडिकल परीक्षण एवं प्रशिक्षण हेतु अंतिम चयन सूची'
    ];
  }

  // सेना / अग्निवीर / रक्षा सेवाएं
  if (post.department === 'Defence' || titleLower.includes('agniveer') || titleLower.includes('army') || titleLower.includes('navy')) {
    return [
      'चरण 1: ऑनलाइन सामान्य प्रवेश परीक्षा (CEE - कंप्यूटर आधारित लिखित परीक्षा)',
      'चरण 2: शारीरिक फिटनेस परीक्षण (PFT - 1.6 किमी दौड़, बीम पर 10 पुल-अप्स, 9 फीट गड्ढा कूद व बैलेंसिंग)',
      'चरण 3: शारीरिक माप परीक्षण (PMT) एवं मूल प्रमाण पत्रों की जांच',
      'चरण 4: सैन्य अस्पताल में विस्तृत चिकित्सा परीक्षण (Medical Exam)'
    ];
  }

  // संघ लोक सेवा आयोग (UPSC Civil Services - IAS / IPS)
  if (post.department === 'UPSC' || titleLower.includes('civil-services') || titleLower.includes('ias')) {
    return [
      'चरण 1: सिविल सेवा प्रारंभिक परीक्षा (ऑब्जेक्टिव GS पेपर 1 एवं CSAT क्वालीफाइंग पेपर 2)',
      'चरण 2: सिविल सेवा मुख्य परीक्षा (9 वर्णनात्मक/विस्तृत प्रश्न पत्र - कुल 1750 अंक)',
      'चरण 3: व्यक्तित्व परीक्षण / साक्षात्कार (इंटरव्यू - 275 अंक, धौलपुर हाउस, नई दिल्ली)',
      'चरण 4: मुख्य परीक्षा एवं साक्षात्कार के प्राप्तांकों के आधार पर अखिल भारतीय अंतिम रैंक सूची'
    ];
  }

  // शिक्षक भर्ती (REET / 1st & 2nd Grade / Teacher Bharti)
  if (post.department === 'Teaching' || titleLower.includes('teacher') || titleLower.includes('reet')) {
    return [
      'चरण 1: शिक्षक पात्रता परीक्षा (REET / CTET / TET उत्तीर्णता प्रमाण पत्र)',
      'चरण 2: मुख्य प्रतियोगी लिखित परीक्षा (संबंधित विषय ज्ञान, शैक्षणिक मनोविज्ञान व शिक्षण विधियां)',
      'चरण 3: मूल दस्तावेज़ सत्यापन (DV) एवं शैक्षणिक प्राप्तांकों की वेटेज गणना',
      'चरण 4: राज्य / संभाग स्तर पर स्कूल आवंटन एवं अंतिम चयन सूची'
    ];
  }

  // बैंकिंग (IBPS, SBI, RBI PO & Clerk)
  if (post.department === 'Banking') {
    return [
      'चरण 1: प्रारंभिक ऑनलाइन परीक्षा (अंग्रेजी भाषा, संख्यात्मक अभियोग्यता व रीजनिंग)',
      'चरण 2: मुख्य ऑनलाइन परीक्षा (रीजनिंग, कंप्यूटर, डाटा एनालिसिस, बैंकिंग जागरूकता व अंग्रेजी वर्णनात्मक टेस्ट)',
      'चरण 3: समूह चर्चा (GD) एवं व्यक्तिगत साक्षात्कार (अधिकारी संवर्ग हेतु)',
      'चरण 4: सहभागी सार्वजनिक क्षेत्र के बैंकों में प्रोविजनल आवंटन व अंतिम मेरिट सूची'
    ];
  }

  // रेलवे भर्ती (RRB NTPC, ग्रुप डी, ALP)
  if (post.department === 'Railway') {
    return [
      'चरण 1: प्रथम चरण कंप्यूटर आधारित टेस्ट (CBT-1 स्क्रीनिंग परीक्षा)',
      'चरण 2: द्वितीय चरण कंप्यूटर आधारित टेस्ट (CBT-2 मुख्य परीक्षा)',
      'चरण 3: टाइपिंग स्किल टेस्ट / कंप्यूटर आधारित एप्टीट्यूड टेस्ट (CBAT - पद के नियमानुसार)',
      'चरण 4: दस्तावेज़ सत्यापन (DV) एवं रेलवे मेडिकल फिटनेस परीक्षण'
    ];
  }

  // प्रवेश परीक्षाएं (NEET, JEE, राजस्थान पीजी एडमिशन)
  if (post.category === 'admission') {
    return [
      'चरण 1: प्रवेश परीक्षा प्राप्तांक अथवा स्नातक/12वीं के कुल अंकों के आधार पर मेरिट निर्धारण',
      'चरण 2: केंद्रीकृत ऑनलाइन काउंसलिंग एवं कॉलेज/विषय विकल्प भरना (Online Choice Filling)',
      'चरण 3: श्रेणीवार आरक्षण एवं मेरिट के आधार पर सीट आवंटन परिणाम',
      'चरण 4: आवंटित कॉलेज में मूल प्रमाण पत्रों का सत्यापन एवं प्रवेश शुल्क जमा करना'
    ];
  }

  // राजस्थान समान पात्रता परीक्षा (CET)
  if (titleLower.includes('cet')) {
    return [
      'चरण 1: एकल चरण बहुविकल्पीय लिखित परीक्षा (300 अंक, 150 प्रश्न)',
      'चरण 2: न्यूनतम निर्धारित क्वालीफाइंग अंक व 3 वर्ष के लिए वैध CET स्कोर कार्ड जारी होना',
      'चरण 3: विभिन्न मुख्य भर्ती परीक्षाओं (पटवारी, एलडीसी, कांस्टेबल आदि) के लिए 15 गुना अभ्यर्थियों की शॉर्टलिस्टिंग'
    ];
  }

  // कर्मचारी चयन आयोग (SSC CGL, CHSL, GD, MTS)
  if (post.department === 'SSC') {
    return [
      'चरण 1: टियर-1 कंप्यूटर आधारित परीक्षा (सामान्य बुद्धिमत्ता, सामान्य ज्ञान, गणित व अंग्रेजी)',
      'चरण 2: टियर-2 कंप्यूटर आधारित मुख्य परीक्षा (गणित, रीजनिंग, अंग्रेजी, सामान्य जागरूकता व कंप्यूटर ज्ञान)',
      'चरण 3: डाटा एंट्री स्पीड टेस्ट (DEST) / टाइपिंग टेस्ट (पद के नियमानुसार)',
      'चरण 4: संबंधित विभागों द्वारा दस्तावेज़ सत्यापन एवं अंतिम चयन सूची'
    ];
  }

  return [
    'चरण 1: लिखित परीक्षा / कंप्यूटर आधारित टेस्ट (CBT)',
    'चरण 2: कौशल परीक्षा / टाइपिंग टेस्ट / शारीरिक परीक्षा (पद के नियमानुसार)',
    'चरण 3: मूल दस्तावेज़ सत्यापन (Document Verification)',
    'चरण 4: चिकित्सा परीक्षण (Medical Examination) एवं अंतिम चयन सूची'
  ];
};

const getDetailedHowToApplyHindi = (post: SarkariPost, isRajasthanJob: boolean) => {
  const portalName = isRajasthanJob 
    ? 'राजस्थान SSO आधिकारिक पोर्टल (sso.rajasthan.gov.in) अथवा संबंधित बोर्ड की वेबसाइट'
    : 'आधिकारिक भर्ती बोर्ड की आधिकारिक वेबसाइट';

  return [
    {
      stepNumber: '1',
      title: 'आधिकारिक पोर्टल पर जाएं व नया पंजीकरण (Registration / OTR) करें',
      desc: `सर्वप्रथम ${portalName} पर जाएं। यदि आप पोर्टल पर नए अभ्यर्थी हैं तो "New Candidate Registration / One Time Registration (OTR)" लिंक पर क्लिक करें। अपना सक्रिय मोबाइल नंबर, ईमेल आईडी एवं आधार कार्ड दर्ज करके ओटीपी (OTP) सत्यापन के माध्यम से पंजीकरण पूर्ण करें।`
    },
    {
      stepNumber: '2',
      title: 'पंजीकरण संख्या / SSO ID से लॉगिन करें',
      desc: `पंजीकरण के पश्चात अपने मोबाइल या ईमेल पर प्राप्त रजिस्ट्रेशन नंबर / SSO ID और पासवर्ड के माध्यम से पोर्टल पर लॉगिन करें। इसके बाद रिक्रूटमेंट डैशबोर्ड पर "${post.shortTitle}" के सक्रिय ऑनलाइन फॉर्म लिंक पर क्लिक करें।`
    },
    {
      stepNumber: '3',
      title: 'व्यक्तिगत, पत्राचार एवं शैक्षणिक विवरण भरें',
      desc: `कक्षा 10वीं (मैट्रिक), 12वीं (इंटरमीडिएट), स्नातक अथवा पद हेतु निर्धारित तकनीकी/चिकित्सा डिग्री की मूल अंकतालिका के अनुसार अपना नाम, पिता का नाम, जन्मतिथि, आरक्षण श्रेणी (General/OBC/EWS/SC/ST) और स्थायी पता सावधानीपूर्वक दर्ज करें।`
    },
    {
      stepNumber: '4',
      title: 'नवीनतम फोटो, हस्ताक्षर व आवश्यक प्रमाण पत्र अपलोड करें',
      desc: `हाल ही में खींची गई पासपोर्ट साइज रंगीन फोटो (हल्के बैकग्राउंड के साथ, 20 KB से 50 KB) और साफ सफेद कागज पर किए गए हस्ताक्षर (10 KB से 20 KB) जेपीजी/जेपीईजी (JPG/JPEG) प्रारूप में स्कैन करके अपलोड करें। आवश्यकतानुसार जाति, मूल निवास एवं ईडब्ल्यूएस प्रमाण पत्र अपलोड करें।`
    },
    {
      stepNumber: '5',
      title: 'आवेदन पत्र का पूर्वावलोकन (Preview) कर सभी कॉलम जांचें',
      desc: `फाइनल सबमिट करने से पूर्व "Preview Application" विकल्प पर क्लिक करके नाम की वर्तनी (Spelling), जन्मतिथि, श्रेणी व अन्य प्रविष्टियों की दोबारा गहन जांच अवश्य कर लें। एक बार अंतिम रूप से सबमिट होने के बाद संशोधन में कठिनाई हो सकती है।`
    },
    {
      stepNumber: '6',
      title: 'श्रेणीवार निर्धारित परीक्षा शुल्क का ऑनलाइन भुगतान करें',
      desc: post.applicationFee && post.applicationFee.length > 0
        ? `अपनी श्रेणी के अनुसार निर्धारित आवेदन शुल्क का भुगतान नेट बैंकिंग, डेबिट कार्ड, क्रेडिट कार्ड, यूपीआई (UPI) अथवा ई-मित्र कियोस्क के माध्यम से सफलतापूर्वक पूरा करें। यदि आपकी श्रेणी के लिए शुल्क शून्य (Free) है तो सीधे सबमिट करें।`
        : `आवेदन पत्र को अंतिम रूप से सबमिट करें।`
    },
    {
      stepNumber: '7',
      title: 'भरे हुए फाइनल फॉर्म एवं शुल्क रसीद का प्रिंटआउट सुरक्षित रखें',
      desc: `सफल आवेदन जमा होने के पश्चात "Print Application Form" पर क्लिक करके भरे हुए फॉर्म एवं ई-चालान रसीद की 2-3 प्रतियां (PDF) निकाल कर सुरक्षित रख लें। यह भविष्य में एडमिट कार्ड डाउनलोड करने एवं चयन के समय दस्तावेज़ सत्यापन (DV) में अनिवार्य रूप से प्रस्तुत करनी होगी।`
    }
  ];
};

export const FullPagePostView: React.FC<FullPagePostViewProps> = ({
  post,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onOpenAgeCalculator,
  onOpenPhotoResizer,
  isHindi
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSimulationLink, setActiveSimulationLink] = useState<{ title: string; action: string; content: string } | null>(null);
  const [linksList, setLinksList] = useState(post.directLinks);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customActionText, setCustomActionText] = useState('Click Here');
  const [customUrl, setCustomUrl] = useState('');
  const [customType, setCustomType] = useState<'apply' | 'notification' | 'syllabus' | 'official'>('apply');

  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel || !customUrl) {
      alert('Please enter both Link Label and URL / PDF link.');
      return;
    }
    const newLink = {
      label: customLabel,
      actionText: customActionText || 'Click Here',
      type: customType,
      url: customUrl,
      isPrimary: customType === 'apply'
    };
    setLinksList([...linksList, newLink]);
    setCustomLabel('');
    setCustomUrl('');
    setCustomActionText('Click Here');
    setIsAddModalOpen(false);
  };

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [post.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '#' + post.slug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out ${post.title} on Sarkari Result Portal`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  const handleWhatsAppShare = () => {
    const text = `🚨 ${post.title}\n\nCheck all details, eligibility & apply links here:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleTelegramShare = () => {
    const text = `🚨 ${post.title}\n\nCheck all details & apply online:`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const isRajasthanJob = 
    post.state === 'Rajasthan' || 
    post.title.toLowerCase().includes('rajasthan') || 
    post.slug.toLowerCase().includes('rajasthan') || 
    post.shortTitle.toLowerCase().includes('rajasthan') ||
    post.title.toLowerCase().includes('rsmssb') ||
    post.title.toLowerCase().includes('rpsc') ||
    post.title.toLowerCase().includes('ruhs');

  const handleLinkAction = (link: { label: string; actionText: string; type: string; url?: string }) => {
    // Automatic Rajasthan SSO Portal Routing for all Rajasthan jobs
    if (isRajasthanJob && link.type === 'apply') {
      const text = (link.label + ' ' + link.actionText).toLowerCase();
      if (text.includes('register') || text.includes('registration') || text.includes('apply') || text.includes('new student') || text.includes('otr')) {
        window.open('https://sso.rajasthan.gov.in/register', '_blank');
        return;
      }
      if (text.includes('login') || text.includes('sign in') || text.includes('signin') || text.includes('already registered')) {
        window.open('https://sso.rajasthan.gov.in/signin', '_blank');
        return;
      }
    }

    if (link.url) {
      window.open(link.url, '_blank');
      return;
    }
    let content = '';
    if (link.type === 'apply') {
      content = `Application Portal for ${post.shortTitle} is ACTIVE. Register your One Time Registration (OTR), upload candidate photograph & signature, and submit online fee before ${post.lastDate || 'the closing date'}.`;
    } else if (link.type === 'notification') {
      content = `Official Notification Document (${post.notificationNumber || 'Official Advt Notice'}) has been verified. Download and read all terms and conditions before applying.`;
    } else if (link.type === 'admit_card') {
      content = `E-Admit Card / Hall Ticket gateway for ${post.shortTitle}. Enter your Registration No. and Date of Birth to check your allotted Exam City & download Call Letter.`;
    } else if (link.type === 'result') {
      content = `Official Selection Merit List & Category-wise Cutoff marks published for ${post.shortTitle}.`;
    } else if (link.type === 'syllabus') {
      content = `Complete Subject Syllabus & Examination Scheme PDF for ${post.shortTitle}.`;
    } else {
      content = `Official Portal link for ${post.department} recruitment authority.`;
    }

    setActiveSimulationLink({
      title: link.label,
      action: link.actionText,
      content
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-100/70 pb-16">


      {/* 2. Main Document Container */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
          <button onClick={onBack} className="hover:text-[#ab1616] flex items-center gap-1 cursor-pointer font-medium">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="capitalize text-slate-600">{post.category.replace('_', ' ')}</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-900 truncate max-w-xs">{post.shortTitle}</span>
        </nav>

        {/* Paper Container */}
        <article className="bg-white rounded-xs shadow-xs border border-slate-300 overflow-hidden">
          {/* Post Header */}
          <div className="p-5 sm:p-8 text-center border-b border-slate-200 bg-linear-to-b from-red-50/30 to-white">
            <div className="inline-block bg-[#ab1616] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-xs uppercase tracking-wider mb-2">
              {post.department} · {post.state}
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-[#ab1616] leading-tight font-sans">
              {post.title}
            </h1>

            {post.hindiTitle && (
              <p className="text-base sm:text-lg font-bold text-slate-800 mt-2 font-serif">
                {post.hindiTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-4 text-xs text-slate-600 border-t border-slate-200/80 pt-3">
              <span>Post Date: <strong className="text-slate-900">{post.postDate}</strong></span>
              <span aria-hidden="true" className="text-slate-300">|</span>
              <span>Advertisement No: <strong className="text-slate-900">{post.notificationNumber || 'Official Notice'}</strong></span>
              {post.totalVacancies && (
                <>
                  <span aria-hidden="true" className="text-slate-300">|</span>
                  <span>Total Vacancies: <strong className="text-emerald-700 font-bold">{post.totalVacancies} Posts</strong></span>
                </>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-8 space-y-6 text-slate-800 text-sm">
            {/* Share Web Share API Banner */}
            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-md flex items-center justify-between gap-3 text-xs shadow-2xs">
              <span className="font-bold text-emerald-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Share this job notification with friends on WhatsApp & social media:</span>
              </span>
              <button
                type="button"
                onClick={handleWebShare}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded font-extrabold text-xs uppercase tracking-wide shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Job</span>
              </button>
            </div>




            {/* 2-Column Split: Important Dates & Application Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Important Dates Box */}
              <div className="border-2 border-[#ab1616] rounded-xs overflow-hidden bg-white shadow-2xs">
                <div className="bg-[#ab1616] text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-300" />
                  Important Dates (महत्वपूर्ण तिथियां)
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {post.importantDates.map((d, idx) => (
                    <div 
                      key={idx} 
                      className={`flex items-center justify-between p-3 ${d.isHighlight ? 'bg-red-50/90 font-bold text-red-950' : 'text-slate-800'}`}
                    >
                      <span>{d.label}</span>
                      <span className={d.isHighlight ? 'text-[#ab1616] font-extrabold' : 'text-slate-900 font-semibold'}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Application Fee Box */}
              <div className="border-2 border-slate-800 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-slate-900 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  Application Fee (आवेदन शुल्क)
                </div>
                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {post.applicationFee.length > 0 ? (
                    post.applicationFee.map((fee, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3">
                        <span className="text-slate-700">{fee.category}</span>
                        <strong className="text-slate-900 font-bold">{fee.amount}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-slate-500 italic">No Application Fee for this notification / Result update.</div>
                  )}
                  {post.feePaymentMode && (
                    <div className="p-3 bg-slate-50 text-xs text-slate-600">
                      <strong>Payment Mode: </strong>{post.feePaymentMode}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Age Limit Box */}
            {post.ageLimit.asOnDate && (
              <div className="border border-emerald-800 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-emerald-800 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-200" />
                    Age Limit as on {post.ageLimit.asOnDate} (आयु सीमा)
                  </div>
                  <button
                    onClick={onOpenAgeCalculator}
                    className="text-xs underline text-amber-200 hover:text-white transition-colors cursor-pointer"
                  >
                    Calculate My Age Now →
                  </button>
                </div>
                <div className="p-4 text-xs sm:text-sm space-y-2 bg-emerald-50/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-medium text-slate-800">
                    {post.ageLimit.minAge && <div>Minimum Age: <strong className="text-slate-900 font-bold">{post.ageLimit.minAge} Years.</strong></div>}
                    {post.ageLimit.maxAge && <div>Maximum Age: <strong className="text-slate-900 font-bold">{post.ageLimit.maxAge} Years.</strong></div>}
                  </div>
                  {post.ageLimit.notes && (
                    <p className="text-xs text-slate-600 italic pt-1 border-t border-slate-100">
                      {post.ageLimit.notes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Vacancy Details Table */}
            {post.vacancyBreakdown.length > 0 && (
              <div className="border border-blue-900 rounded-md overflow-hidden bg-white shadow-2xs">
                <div className="bg-blue-950 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  Vacancy Details & Eligibility Criteria (कुल पद व पात्रता)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                        <th className="p-3">Post Name</th>
                        <th className="p-3 w-28 text-center">Total Posts</th>
                        <th className="p-3">Eligibility Criteria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {post.vacancyBreakdown.map((vac, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{vac.postName}</td>
                          <td className="p-3 text-center font-bold text-emerald-700 text-base">{vac.totalPosts}</td>
                          <td className="p-3 text-slate-700 leading-relaxed">{vac.eligibility}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mode of Selection Box */}
            <div className="border border-purple-800 rounded-md overflow-hidden bg-white shadow-2xs">
              <div className="bg-purple-900 text-white px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-300" />
                  चयन प्रक्रिया (Mode of Selection)
                </span>
                <span className="text-[10px] bg-purple-700 text-purple-100 px-2 py-0.5 rounded font-bold normal-case">
                  भर्ती नियमानुसार
                </span>
              </div>
              <div className="p-4 text-xs sm:text-sm text-slate-800 space-y-2 bg-purple-50/20">
                <p className="leading-relaxed">
                  <strong className="text-purple-950 font-bold">{post.shortTitle}</strong> के लिए अभ्यर्थियों का चयन निम्नलिखित चरणों के आधार पर किया जाएगा:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-900">
                  {getJobSelectionStages(post).map((stage, idx) => (
                    <li key={idx} className="leading-relaxed">{stage}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed How to Fill Form Steps in Hindi */}
            <div className="border-2 border-slate-700 rounded-md overflow-hidden bg-white shadow-xs">
              <div className="bg-slate-900 text-white px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-300" />
                  {post.shortTitle} : ऑनलाइन आवेदन कैसे करें (Step-by-Step Complete Guide)
                </span>
                <span className="text-[11px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded font-black normal-case">
                  विस्तृत दिशा-निर्देश
                </span>
              </div>

              <div className="p-4 sm:p-5 space-y-4 bg-slate-50/40 text-xs sm:text-sm">
                {/* Crucial Instructions Banner */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-amber-950 space-y-1.5 text-xs">
                  <div className="font-extrabold flex items-center gap-1.5 text-slate-900">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>ऑनलाइन फॉर्म भरने से पूर्व महत्वपूर्ण सावधानियां:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-800 leading-relaxed font-medium">
                    <li>
                      अंतिम तिथि (<strong className="text-red-700 font-bold">{post.lastDate || 'अंतिम तिथि'}</strong>) का इंतजार न करें; सर्वर व्यस्तता और तकनीकी समस्या से बचने के लिए समय से पहले आवेदन पूर्ण करें।
                    </li>
                    <li>
                      आवेदन पत्र में अपना सक्रिय मोबाइल नंबर और वैध ईमेल आईडी ही दर्ज करें, क्योंकि आगामी एडमिट कार्ड, परीक्षा तिथि एवं रिजल्ट का अलर्ट SMS / Email द्वारा भेजा जाएगा।
                    </li>
                    <li>
                      फोटो और हस्ताक्षर का साइज निर्धारित सीमा (Photo: 20-50 KB, Sign: 10-20 KB) में रखने के लिए पोर्टल पर उपलब्ध <strong className="text-[#0000cc]">Photo Resizer</strong> टूल का प्रयोग करें।
                    </li>
                  </ul>
                </div>

                {/* Step-by-Step Cards */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide border-b border-slate-200 pb-1">
                    क्रमवार आवेदन प्रक्रिया (Step-by-Step Application Steps):
                  </h4>
                  <div className="space-y-2.5">
                    {getDetailedHowToApplyHindi(post, isRajasthanJob).map((item) => (
                      <div key={item.stepNumber} className="bg-white border border-slate-200 rounded p-3 shadow-2xs hover:border-slate-400 transition-colors">
                        <div className="font-extrabold text-slate-900 flex items-start gap-2 mb-1">
                          <span className="w-5 h-5 rounded-full bg-[#ab1616] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                            {item.stepNumber}
                          </span>
                          <span className="text-[#ab1616] text-xs sm:text-sm font-black">{item.title}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed pl-7 text-xs">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Board Note */}
                {post.howToApplySteps && post.howToApplySteps.length > 0 && (
                  <div className="bg-slate-100 border border-slate-300 rounded p-3 text-xs space-y-1">
                    <span className="font-bold text-slate-800 block">आधिकारिक बोर्ड के विशेष दिशा-निर्देश (Board Specific Points):</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      {post.howToApplySteps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* The Iconic Sarkari Useful Links Table */}
            <div className="border-2 border-[#ab1616] rounded-xs overflow-hidden bg-white shadow-sm">
              <div className="bg-[#ab1616] text-white py-3 px-4 font-extrabold text-sm sm:text-base tracking-wide uppercase flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="text-center sm:text-left">
                  Interested Candidates Can Read the Full Notification Before Apply Online
                  <span className="block text-xs font-normal text-yellow-200 mt-0.5">
                    SOME USEFUL IMPORTANT LINKS (महत्वपूर्ण उपयोगी लिंक्स)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-1.5 rounded text-xs font-black shadow-xs cursor-pointer shrink-0 uppercase tracking-normal"
                >
                  + Add Link / PDF
                </button>
              </div>
              <div className="divide-y divide-slate-200 text-sm sm:text-base">
                {linksList.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <span className="font-extrabold text-[#0000cc]">
                      {link.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLinkAction(link)}
                      className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xs font-black text-sm sm:text-base shadow-xs transition-all cursor-pointer uppercase shrink-0 ${
                        link.isPrimary 
                          ? 'bg-slate-900 hover:bg-black text-white' 
                          : 'bg-[#0000cc] hover:bg-blue-900 text-white'
                      }`}
                    >
                      {link.actionText.toLowerCase().includes('login') ? (
                        <>
                          <LogIn className="w-4 h-4" />
                          <span>Login</span>
                        </>
                      ) : link.actionText.toLowerCase().includes('register') || link.actionText.toLowerCase().includes('registration') ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Registration</span>
                        </>
                      ) : (
                        <>
                          <span>{link.actionText}</span>
                          <ExternalLink className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                ))}
                {/* Join Sarkari Result Channel Row */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-2">
                    <span>Join Sarkari Result Channel</span>
                    <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded font-bold">Fast Updates</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => window.open('https://t.me/newsarkariresultt', '_blank')}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xs font-black text-sm sm:text-base shadow-xs transition-all cursor-pointer uppercase bg-sky-700 hover:bg-sky-800 text-white"
                  >
                    <span>Telegram</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Back to Home Button at bottom of page */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={onBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isHindi ? 'मुख्य पृष्ठ पर वापस जाएं' : 'Back to Sarkari Result Home Page'}</span>
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-xs text-red-700 hover:underline font-semibold cursor-pointer"
              >
                ↑ Go to Top of Page
              </button>
            </div>
          </div>
        </article>
      </div>

      {/* Simulated Action Gateway Modal */}
      {activeSimulationLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700" />
                {activeSimulationLink.title}
              </h3>
              <button 
                onClick={() => setActiveSimulationLink(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeSimulationLink.content}
            </p>
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-800 font-mono">
              ✓ Verified Official Gateway Link
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSimulationLink(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-800 hover:bg-red-900 rounded transition-colors cursor-pointer"
              >
                Close Gateway
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Custom Link / PDF Addition Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl border border-slate-300 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                ➕ Add Custom Link or PDF
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddCustomLink} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Title / Label (e.g. Download Admit Card)</label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="e.g. Download District Merit List PDF"
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Button Text (e.g. Click Here / PDF / Download)</label>
                <input
                  type="text"
                  value={customActionText}
                  onChange={(e) => setCustomActionText(e.target.value)}
                  placeholder="Click Here"
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link URL or PDF URL (https://...)</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/notification.pdf"
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700 font-mono text-xs"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Link Category</label>
                <select
                  value={customType}
                  onChange={(e: any) => setCustomType(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-slate-900 focus:outline-none focus:border-red-700 bg-white"
                >
                  <option value="apply">Apply Online / Registration</option>
                  <option value="notification">Notification PDF</option>
                  <option value="syllabus">Syllabus PDF</option>
                  <option value="official">Official Website</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#ab1616] hover:bg-red-900 rounded shadow-xs cursor-pointer"
                >
                  Add Link Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Send, AlertTriangle, MessageCircle, ExternalLink } from 'lucide-react';
import { SarkariPost } from '../types/job';

interface SarkariFooterProps {
  onOpenAgeCalculator?: () => void;
  onOpenPhotoResizer?: () => void;
  onOpenJobFinder?: () => void;
  onOpenAdmin?: () => void;
  onSelectPost?: (post: SarkariPost) => void;
  onOpenPostBySlug: (slug: string) => void;
  isHindi: boolean;
}

export const SarkariFooter: React.FC<SarkariFooterProps> = ({
  onOpenAgeCalculator: _onOpenAgeCalculator,
  onOpenPhotoResizer: _onOpenPhotoResizer,
  onOpenJobFinder: _onOpenJobFinder,
  onOpenAdmin,
  onOpenPostBySlug,
  isHindi
}) => {
  return (
    <footer 
      className="w-full bg-white text-slate-800 mt-10 border-t-4 border-[#ab1616] shadow-sm font-post font-mangal"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: '10pt'
      }}
    >
      {/* 1. Official Social Alert Ribbon */}
      <div className="bg-[#ab1616] text-white py-2.5 px-4 text-center border-b border-red-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12.5px] font-bold flex items-center gap-2">
            <span className="text-amber-300 font-black text-base">★</span>
            <span>Join Sarkari Result Official Channels for Fastest Job Alerts & Exam Updates</span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-3.5 py-1.5 rounded-xs font-black text-[11.5px] shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-300"
              title="Join Official WhatsApp Channel"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-slate-950 text-emerald-100" />
              <span>WhatsApp Channel</span>
            </a>

            <a 
              href="https://t.me/newsarkariresultt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#229ED9] hover:bg-[#1d8cb0] text-white px-3.5 py-1.5 rounded-xs font-black text-[11.5px] shadow-md transition-all active:scale-95 cursor-pointer"
              title="Join Official Telegram Channel"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Telegram Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Official Welcome & Trademark Banner from SarkariResult.com */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4 text-center space-y-3.5 border-b border-slate-300">
        <p className="text-slate-800 font-bold leading-relaxed max-w-4xl mx-auto text-[11.5pt]">
          Welcome to this official website of Sarkari Result <sup>®</sup><br />
          Thank you for visiting the official website of Sarkari Result SarkariResult.Com, through this website you will get information related to Job / Recruitment / Admission / Admit Card / Answer Key very easily. For you our Sarkari Result Mobile App 2026 is also available for free on Google Play and Apple Store, as well as you can connect with Sarkari Result 2026 on our social media accounts: X Twitter, Facebook, Instagram, Threads, Telegram, WhatsApp, and YouTube.
        </p>

        <p className="text-slate-700 font-semibold text-[11.5pt] max-w-3xl mx-auto">
          Registered Trademark of <strong>Sarkari Result <sup>®</sup></strong> under Intellectual Property India. Official website: <strong>SarkariResult.com (Since 2012)</strong> www.sarkariresult.com<br />
          For Feedback / advertising on this website contact us at <span className="text-blue-700 font-bold">support@sarkariresult.com</span>
        </p>

        {/* Red Disclaimer */}
        <div className="bg-red-50/60 border border-red-200 p-3 sm:p-4 rounded max-w-4xl mx-auto text-left shadow-2xs">
          <p className="text-[#ca0000] font-bold text-[11pt] sm:text-[11.5pt] leading-relaxed">
            <span className="font-black underline mr-1">Disclaimer :</span>
            The examination results, marks, notifications, and other content published on SarkariResult.com (Since 2012) are provided for informational purposes only and should not be considered as a legal or official document. While efforts are made to ensure accuracy, we do not guarantee completeness or correctness, and users are advised to verify details from official sources. We are not responsible for any errors, omissions, or any loss arising from the use of this information. Sarkari Result® is a registered trademark, including Word Mark (Application No. 4531613) and Device Mark (Logo) (Application No. 5569166) under Intellectual Property India, and any unauthorized use may violate applicable laws. This website is not affiliated with any government organization and provides information for reference purposes only.
          </p>
        </div>

        {/* Central Logo Stamp */}
        <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#ab183d] rounded-full flex items-center justify-center text-white font-black text-xl">
              SR
            </div>
          </div>
          <p className="text-[#ca0000] font-bold text-[11.5pt] max-w-xl mx-auto">
            Sarkari Result®️ is a registered and legally protected trademark (Reg. Nos. 4531613 &amp; 5569166). Unauthorized use of the name, logo, or brand may result in legal action.
          </p>
        </div>
      </div>

      {/* 3. Main 3-Column Directory Grid (Page, App, Follow Us) */}
      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 border-b border-slate-300">
          
          {/* Column 1: Page */}
          <div className="space-y-2.5">
            <h3 className="text-slate-900 font-black text-[13pt] uppercase tracking-wider border-b border-slate-300 pb-1.5 flex items-center gap-1.5 font-sans">
              <span className="text-amber-500">■</span>
              <span>Page (भर्ती एवं आयोग)</span>
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-700 text-[11.5pt]">
              <a href="#bpsc" className="hover:text-[#7e22ce] hover:underline">• BPSC</a>
              <a href="#up-scholarship" className="hover:text-[#7e22ce] hover:underline">• UP-Scholarship</a>
              <a href="#upsssc" className="hover:text-[#7e22ce] hover:underline">• UPSSSC</a>
              <a href="#ssc" className="hover:text-[#7e22ce] hover:underline">• SSC</a>
              <a href="#ibps" className="hover:text-[#7e22ce] hover:underline">• IBPS</a>
              <a href="#upsc" className="hover:text-[#7e22ce] hover:underline">• UPSC</a>
              <a href="#airforce" className="hover:text-[#7e22ce] hover:underline">• Air Force</a>
              <a href="#navy" className="hover:text-[#7e22ce] hover:underline">• Navy</a>
              <a href="#rpsc" className="hover:text-[#7e22ce] hover:underline">• RPSC</a>
              <a href="#delhi-dsssb" className="hover:text-[#7e22ce] hover:underline">• Delhi DSSSB</a>
              <a href="#hssc" className="hover:text-[#7e22ce] hover:underline">• HSSC</a>
              <a href="#tet" className="hover:text-[#7e22ce] hover:underline">• TET / CTET</a>
              <a href="#police" className="hover:text-[#7e22ce] hover:underline">• Police</a>
              <a href="#railways" className="hover:text-[#7e22ce] hover:underline">• Railways (RRB)</a>
            </div>
          </div>

          {/* Column 2: App & Official Portals */}
          <div className="space-y-2.5">
            <h3 className="text-slate-900 font-black text-[13pt] uppercase tracking-wider border-b border-slate-300 pb-1.5 flex items-center gap-1.5 font-sans">
              <span className="text-amber-500">■</span>
              <span>Mobile Apps (मोबाइल ऍप्स)</span>
            </h3>
            <ul className="space-y-2 text-slate-700 text-[11.5pt]">
              <li>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.app.app14f269771c01" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#7e22ce] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <span>• Sarkari Result Android App (Google Play)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://apps.apple.com/us/app/sarkari-result/id1051363935?ls=1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#7e22ce] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <span>• Sarkari Result Apple iOS App (App Store)</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.sarkariresult.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#7e22ce] hover:underline flex items-center gap-1.5 font-semibold"
                >
                  <span>• SarkariResult.Com Official Web Portal</span>
                </a>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPostBySlug('supreme-court-of-india-jca-oct26')} 
                  className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer"
                >
                  • Supreme Court JCA Online Form 2026
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPostBySlug('upessc-up-primary-teacher-05-2026')} 
                  className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer"
                >
                  • UP Primary Teacher Online Form 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us & Social Accounts */}
          <div className="space-y-2.5">
            <h3 className="text-slate-900 font-black text-[13pt] uppercase tracking-wider border-b border-slate-300 pb-1.5 flex items-center gap-1.5 font-sans">
              <span className="text-amber-500">■</span>
              <span>Follow Us (सोशल मीडिया नेटवर्क)</span>
            </h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-slate-700 text-[11.5pt]">
              <a href="https://www.instagram.com/sarkariresult.comofficial" target="_blank" rel="noopener noreferrer" className="hover:text-[#E1306C] hover:underline">• Instagram</a>
              <a href="https://www.youtube.com/c/SarkariResultOfficial" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 hover:underline">• YouTube</a>
              <a href="https://t.me/newsarkariresultt" target="_blank" rel="noopener noreferrer" className="hover:text-[#229ED9] hover:underline">• Telegram</a>
              <a href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] hover:underline">• WhatsApp</a>
              <a href="https://x.com/srofficial2012" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline">• X (Twitter)</a>
              <a href="https://www.threads.com/@sarkariresult.comofficial" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 hover:underline">• Threads</a>
              <a href="https://www.facebook.com/SarkariResult.ComOfficial/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 hover:underline">• Facebook</a>
              <a href="https://www.linkedin.com/company/sarkariresult-com/" target="_blank" rel="noopener noreferrer" className="hover:text-sky-700 hover:underline">• LinkedIn</a>
              <button onClick={() => onOpenPostBySlug('contact-us')} className="hover:text-[#7e22ce] hover:underline text-left cursor-pointer font-bold col-span-2 mt-1">
                • Contact Us (संपर्क करें)
              </button>
            </div>
          </div>

        </div>

        {/* 3. Comprehensive Legal, Educational & Portal Information Section (विस्तृत कानूनी एवं शैक्षणिक जानकारी) */}
        <div className="my-6 space-y-5">

          {/* Section A: About the Portal & Educational Purpose */}
          <div className="border border-slate-200 bg-white rounded-xs p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 text-[#ab1616] font-black text-[12.5px] uppercase pb-2 border-b border-red-100">
              <span className="text-base">🏛️</span>
              <h4>{isHindi ? 'वेबसाइट के बारे में एवं शैक्षणिक उद्देश्य (About Sarkari Result & Educational Mission)' : 'About Sarkari Result & Educational Mission'}</h4>
            </div>
            <div className="mt-2.5 text-[11.5px] text-slate-700 leading-relaxed space-y-2">
              <p>
                <strong>Sarkari Result (सरकारी रिजल्ट)</strong> भारत का एक प्रमुख, स्वतंत्र और पूर्णतः निःशुल्क शैक्षणिक सूचना पोर्टल (Educational Information Portal) है। इस वेबसाइट का मुख्य उद्देश्य देश के ग्रामीण व शहरी क्षेत्रों के सभी छात्र-छात्राओं, युवा बेरोजगारों और प्रतियोगी परीक्षा अभ्यर्थियों को केंद्र एवं राज्य सरकारों द्वारा जारी की जाने वाली सभी भर्तियों (Recruitment Notifications), प्रवेश परीक्षाओं (Entrance Exams), परीक्षा तिथियों (Exam Dates), प्रवेश पत्र (Admit Cards), उत्तर कुंजी (Answer Keys), परिणाम (Results), पाठ्यक्रम (Syllabus) तथा प्रमाण पत्र सत्यापन (Certificate Verification) की समयबद्ध, सुलभ और सटीक जानकारी एक ही मंच पर उपलब्ध कराना है।
              </p>
              <p>
                यह पोर्टल UPSC, SSC, Railway Recruitment Boards (RRB/RRC), Defence (Army, Navy, Airforce, NDA, CDS), Banking (IBPS, SBI, RBI), Teaching (CTET, State TET, REET), State Public Service Commissions (UPPSC, BPSC, RPSC, MPPSC, HSSC, UKPSC, WBPSC, आदि) एवं पुलिस भर्ती बोर्डों द्वारा जारी सार्वजनिक विज्ञप्तियों का संकलन कर छात्रों के मार्गदर्शन हेतु सरल भाषा में प्रस्तुत करता है।
              </p>
            </div>
          </div>

          {/* Section B: Grid of 4 Detailed Legal & Educational Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Card 1: Legal Status & Non-Governmental Declaration */}
            <div className="border-2 border-red-300 bg-red-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-red-800 font-black text-[12px] uppercase">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{isHindi ? 'कानूनी स्थिति व गैर-सरकारी संस्था घोषणा (Legal Disclaimer)' : 'Legal Status & Non-Government Entity Disclaimer'}</span>
              </div>
              <p className="text-[11.5px] text-slate-700 leading-relaxed font-normal">
                <strong className="text-red-700">अति महत्वपूर्ण घोषणा (Strict Non-Affiliation Declaration): </strong>
                Sarkari Result एक स्वतंत्र, निजी शैक्षणिक सूचना मंच है। इस वेबसाइट का किसी भी केंद्र सरकार, राज्य सरकार, मंत्रालय, आयोग (जैसे UPSC, SSC, RRB, NTA) या संवैधानिक भर्ती संस्था से कोई प्रत्यक्ष अथवा अप्रत्यक्ष आधिकारिक संबंध (Affiliation, Association or Endorsement) नहीं है। 
              </p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                भारत सरकार अथवा राज्य सरकारों की सभी आधिकारिक वेबसाइटें केवल <strong>.gov.in</strong> अथवा <strong>.nic.in</strong> डोमेन पर संचालित होती हैं। हमारे द्वारा दिए जाने वाले ऑनलाइन आवेदन एवं आधिकारिक लिंक अभ्यर्थियों की सुविधा हेतु सीधे संबंधित सरकारी आयोग के मूल पोर्टल पर निर्देशित (Redirect) किए जाते हैं।
              </p>
            </div>

            {/* Card 2: Double Verification & Candidate Due Diligence */}
            <div className="border-2 border-amber-300 bg-amber-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-black text-[12px] uppercase">
                <span className="text-amber-600 text-base">⚖️</span>
                <span>{isHindi ? 'सूचना की प्रामाणिकता एवं दोहरी जांच (Double Verification)' : 'Accuracy & Candidate Verification Rule'}</span>
              </div>
              <p className="text-[11.5px] text-slate-700 leading-relaxed">
                <strong className="text-amber-800">उम्मीदवारों के लिए अनिवार्य सूचना: </strong>
                इस पोर्टल पर प्रकाशित समस्त सूचनाएं केवल परीक्षार्थियों की तत्काल सुविधा व शैक्षणिक मार्गदर्शन हेतु हैं। इसे किसी भी न्यायालय या विधिक प्रक्रिया में कानूनी दस्तावेज (Legal Document) नहीं माना जा सकता है।
              </p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                यद्यपि हमारी टीम प्रत्येक पद संख्या, आयु सीमा, आवेदन शुल्क, शैक्षणिक योग्यता व तिथियों की दोहरी जांच (Double Verification) करके ही सामग्री प्रकाशित करती है, तथापि किसी भी भर्ती में आवेदन करने, शुल्क जमा करने अथवा यात्रा टिकट बुक करने से पूर्व संबंधित आयोग के मूल राजपत्र / आधिकारिक नोटिफिकेशन (Official Notification) का गहन अध्ययन अवश्य करें।
              </p>
            </div>

            {/* Card 3: 100% Free Service & Anti-Fraud Advisory */}
            <div className="border-2 border-emerald-300 bg-emerald-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-[12px] uppercase">
                <span className="text-emerald-600 text-base">🛡️</span>
                <span>{isHindi ? '100% निःशुल्क सेवा व दलालों से सतर्कता (Anti-Fraud Advisory)' : '100% Free Public Service & Anti-Fraud Alert'}</span>
              </div>
              <p className="text-[11.5px] text-slate-700 leading-relaxed">
                <strong className="text-emerald-800">धोखाधड़ी व फर्जी दलालों से सावधान: </strong>
                Sarkari Result विद्यार्थियों से किसी भी प्रकार का कोई शुल्क, चंदा अथवा सदस्यता शुल्क नहीं लेता है। हमारे सभी जॉब अलर्ट, पीडीएफ पाठ्यक्रम और सूचनाएं पूर्णतः निःशुल्क हैं।
              </p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                सरकारी नौकरियों में चयन केवल आयोग की पारदर्शी एवं मेरिट आधारित परीक्षा प्रणाली द्वारा होता है। ऐसे किसी भी दलाल, ठग अथवा फर्जी एजेंट के झांसे में न आएं जो रुपये लेकर सरकारी नौकरी दिलाने का दावा करते हों। अपनी बैंकिंग जानकारी, ओटीपी या व्यक्तिगत दस्तावेज किसी अज्ञात व्यक्ति से साझा न करें।
              </p>
            </div>

            {/* Card 4: Intellectual Property, Trademarks & Fair Use */}
            <div className="border-2 border-blue-300 bg-blue-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-blue-900 font-black text-[12px] uppercase">
                <span className="text-blue-600 text-base">📑</span>
                <span>{isHindi ? 'बौद्धिक संपदा एवं कॉपीराइट (Copyright & Trademarks)' : 'Intellectual Property & Trademarks Notice'}</span>
              </div>
              <p className="text-[11.5px] text-slate-700 leading-relaxed">
                <strong className="text-blue-800">ट्रेडमार्क एवं कॉपीराइट अधिकार: </strong>
                संबंधित सरकारी विभागों, मंत्रालयों, आयोगों (UPSC, SSC, RRB, NTA, आदि) के नाम, लोगो (Logos) तथा आधिकारिक प्रतीक उनके संबंधित स्वामियों की संपत्ति हैं, जिनका उपयोग यहां केवल सूचनात्मक पहचान (Fair Use) हेतु किया गया है।
              </p>
              <p className="text-[11.5px] text-slate-600 leading-relaxed">
                Sarkari Result की विशिष्ट तालिका संरचना, सामग्री प्रारूपण एवं संकलित शैक्षणिक डेटा का अनधिकृत व्यावसायिक प्रतिरूपण (Commercial Scraping/Reproduction) कॉपीराइट अधिनियम के तहत प्रतिबंधित है। छात्र शैक्षणिक उपयोग हेतु लिंक साझा करने के लिए स्वतंत्र हैं।
              </p>
            </div>

          </div>

          {/* Section C: Candidate Support & Transparency Commitment Banner */}
          <div className="bg-slate-100 border border-slate-300 rounded-xs p-3.5 text-[11.5px] text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="text-blue-600 text-base font-bold">ℹ️</span>
              <span>
                <strong>पारदर्शिता एवं त्रुटि निवारण (Grievance Redressal): </strong>
                यदि आपको किसी अधिसूचना, परीक्षा तिथि अथवा लिंक में कोई विसंगति दिखाई दे, तो कृपया तुरंत आधिकारिक आयोग की वेबसाइट से मिलान करें अथवा हमें सूचित करें।
              </span>
            </div>
            <button
              onClick={() => onOpenPostBySlug('contact-us')}
              className="shrink-0 bg-[#ab1616] hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-xs text-[11.5px] cursor-pointer shadow-xs"
            >
              Contact Support
            </button>
          </div>

        </div>

        {/* 4. Bottom Copyright & Legal Navigation Strip */}
        <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-[11.5px]">
          <div className="text-center sm:text-left">
            <span>Copyright © 2026 Sarkari Result - </span>
            <span 
              onClick={onOpenAdmin} 
              className="cursor-default select-none font-medium hover:text-[#ab1616]"
              title="Sarkari Result"
            >
              All Rights Reserved.
            </span>
            <span className="block sm:inline sm:ml-2 text-slate-500 text-[11px]">
              (An Educational & Career Public Information Portal for Aspirants)
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11.5px] font-semibold flex-wrap justify-center sm:justify-end">
            <button
              onClick={() => onOpenPostBySlug('about-us')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              About Us
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPostBySlug('privacy-policy')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPostBySlug('disclaimer')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPostBySlug('rules-and-regulations')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Terms & Rules
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPostBySlug('contact-us')}
              className="text-[#7e22ce] hover:text-purple-900 underline cursor-pointer font-bold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

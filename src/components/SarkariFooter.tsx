import React from 'react';
import { Send, AlertTriangle, MessageCircle } from 'lucide-react';
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
    <footer className="w-full bg-white text-slate-800 mt-10 border-t-4 border-[#ab1616] shadow-sm font-serif">
      {/* 1. Official Social Alert Ribbon */}
      <div className="bg-[#ab1616] text-white py-2.5 px-4 text-center border-b border-red-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
            <span className="text-amber-300 font-black text-base">★</span>
            <span>Join Sarkari Result Official Channels for Fastest Job Alerts & Exam Updates</span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://whatsapp.com/channel/0029VbEOVh74dTnTUUmjcS0j"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 px-3.5 py-1.5 rounded-xs font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-300"
              title="Join Official WhatsApp Channel"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-slate-950 text-emerald-100" />
              <span>WhatsApp Channel</span>
            </a>

            <a 
              href="https://t.me/newsarkariresultt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#229ED9] hover:bg-[#1d8cb0] text-white px-3.5 py-1.5 rounded-xs font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              title="Join Official Telegram Channel"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Telegram Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Official Welcome Banner from SarkariResult.com */}
      <div className="max-w-7xl mx-auto px-4 py-3 text-center border-b border-slate-300">
        <p className="text-slate-800 font-bold text-xs sm:text-sm">
          Sarkari Result (सरकारी रिजल्ट) - भारत का प्रमुख, स्वतंत्र और पूर्णतः निःशुल्क शैक्षणिक सूचना पोर्टल, जहाँ सभी सरकारी नौकरियों, प्रवेश पत्रों, परिणामों और उत्तर कुंजियों की सटीक जानकारी उपलब्ध कराई जाती है।
        </p>
      </div>

      {/* 3. Main Directory Grid (Page) & Legal Sections */}
      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="max-w-xl mx-auto pb-6 border-b border-slate-300">
          
          {/* Column 1: Page */}
          <div className="space-y-2.5">
            <h3 className="text-slate-900 font-black text-sm sm:text-base uppercase tracking-wider border-b border-slate-300 pb-1.5 flex items-center justify-center gap-1.5 text-center">
              <span className="text-amber-500">■</span>
              <span>Page (भर्ती एवं आयोग)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-2 text-slate-700 text-xs sm:text-sm text-center">
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
            </div>
          </div>

        </div>

        {/* 3. Comprehensive Legal, Educational & Portal Information Section */}
        <div className="my-6 space-y-5">

          {/* Section A: About the Portal & Educational Purpose */}
          <div className="border border-slate-200 bg-white rounded-xs p-3.5 sm:p-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#ab1616] font-black text-xs sm:text-sm uppercase pb-1.5 border-b border-red-100">
              <span className="text-base">🏛️</span>
              <h4>{isHindi ? 'वेबसाइट के बारे में (About Sarkari Result)' : 'About Sarkari Result'}</h4>
            </div>
            <div className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>Sarkari Result (सरकारी रिजल्ट)</strong> एक स्वतंत्र शैक्षणिक सूचना मंच है जिसका उद्देश्य देश के युवाओं को सभी केंद्र एवं राज्य स्तरीय सरकारी भर्तियों, प्रवेश परीक्षाओं, एडमिट कार्ड, और परीक्षा परिणामों की समयबद्ध जानकारी एक ही स्थान पर निःशुल्क उपलब्ध कराना है।
              </p>
            </div>
          </div>

          {/* Section B: Grid of 4 Detailed Legal & Educational Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Card 1: Legal Status & Non-Governmental Declaration */}
            <div className="border-2 border-red-300 bg-red-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-red-800 font-black text-xs sm:text-sm uppercase">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{isHindi ? 'कानूनी स्थिति व गैर-सरकारी संस्था घोषणा (Legal Disclaimer)' : 'Legal Status & Non-Government Entity Disclaimer'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                <strong className="text-red-700">अति महत्वपूर्ण घोषणा (Strict Non-Affiliation Declaration): </strong>
                Sarkari Result एक स्वतंत्र, निजी शैक्षणिक सूचना मंच है। इस वेबसाइट का किसी भी केंद्र सरकार, राज्य सरकार, मंत्रालय, आयोग (जैसे UPSC, SSC, RRB, NTA) या संवैधानिक भर्ती संस्था से कोई प्रत्यक्ष अथवा अप्रत्यक्ष आधिकारिक संबंध (Affiliation, Association or Endorsement) नहीं है। 
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                भारत सरकार अथवा राज्य सरकारों की सभी आधिकारिक वेबसाइटें केवल <strong>.gov.in</strong> अथवा <strong>.nic.in</strong> डोमेन पर संचालित होती हैं। हमारे द्वारा दिए जाने वाले ऑनलाइन आवेदन एवं आधिकारिक लिंक अभ्यर्थियों की सुविधा हेतु सीधे संबंधित सरकारी आयोग के मूल पोर्टल पर निर्देशित (Redirect) किए जाते हैं।
              </p>
            </div>

            {/* Card 2: Double Verification & Candidate Due Diligence */}
            <div className="border-2 border-amber-300 bg-amber-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs sm:text-sm uppercase">
                <span className="text-amber-600 text-base">⚖️</span>
                <span>{isHindi ? 'सूचना की प्रामाणिकता एवं दोहरी जांच (Double Verification)' : 'Accuracy & Candidate Verification Rule'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-amber-800">उम्मीदवारों के लिए अनिवार्य सूचना: </strong>
                इस पोर्टल पर प्रकाशित समस्त सूचनाएं केवल परीक्षार्थियों की तत्काल सुविधा व शैक्षणिक मार्गदर्शन हेतु हैं। इसे किसी भी न्यायालय या विधिक प्रक्रिया में कानूनी दस्तावेज (Legal Document) नहीं माना जा सकता है।
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                यद्यपि हमारी टीम प्रत्येक पद संख्या, आयु सीमा, आवेदन शुल्क, शैक्षणिक योग्यता व तिथियों की दोहरी जांच (Double Verification) करके ही सामग्री प्रकाशित करती है, तथापि किसी भी भर्ती में आवेदन करने, शुल्क जमा करने अथवा यात्रा टिकट बुक करने से पूर्व संबंधित आयोग के मूल राजपत्र / आधिकारिक नोटिफिकेशन (Official Notification) का गहन अध्ययन अवश्य करें।
              </p>
            </div>

            {/* Card 3: 100% Free Service & Anti-Fraud Advisory */}
            <div className="border-2 border-emerald-300 bg-emerald-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm uppercase">
                <span className="text-emerald-600 text-base">🛡️</span>
                <span>{isHindi ? '100% निःशुल्क सेवा व दलालों से सतर्कता (Anti-Fraud Advisory)' : '100% Free Public Service & Anti-Fraud Alert'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-emerald-800">धोखाधड़ी व फर्जी दलालों से सावधान: </strong>
                Sarkari Result विद्यार्थियों से किसी भी प्रकार का कोई शुल्क, चंदा अथवा सदस्यता शुल्क नहीं लेता है। हमारे सभी जॉब अलर्ट, पीडीएफ पाठ्यक्रम और सूचनाएं पूर्णतः निःशुल्क हैं।
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                सरकारी नौकरियों में चयन केवल आयोग की पारदर्शी एवं मेरिट आधारित परीक्षा प्रणाली द्वारा होता है। ऐसे किसी भी दलाल, ठग अथवा फर्जी एजेंट के झांसे में न आएं जो रुपये लेकर सरकारी नौकरी दिलाने का दावा करते हों। अपनी बैंकिंग जानकारी, ओटीपी या व्यक्तिगत दस्तावेज किसी अज्ञात व्यक्ति से साझा न करें।
              </p>
            </div>

            {/* Card 4: Intellectual Property, Trademarks & Fair Use */}
            <div className="border-2 border-blue-300 bg-blue-50/40 rounded-xs p-3.5 sm:p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-blue-900 font-black text-xs sm:text-sm uppercase">
                <span className="text-blue-600 text-base">📑</span>
                <span>{isHindi ? 'बौद्धिक संपदा एवं कॉपीराइट (Copyright & Trademarks)' : 'Intellectual Property & Trademarks Notice'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-blue-800">ट्रेडमार्क एवं कॉपीराइट अधिकार: </strong>
                संबंधित सरकारी विभागों, मंत्रालयों, आयोगों (UPSC, SSC, RRB, NTA, आदि) के नाम, लोगो (Logos) तथा आधिकारिक प्रतीक उनके संबंधित स्वामियों की संपत्ति हैं, जिनका उपयोग यहां केवल सूचनात्मक पहचान (Fair Use) हेतु किया गया है।
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sarkari Result की विशिष्ट तालिका संरचना, सामग्री प्रारूपण एवं संकलित शैक्षणिक डेटा का अनधिकृत व्यावसायिक प्रतिरूपण (Commercial Scraping/Reproduction) कॉपीराइट अधिनियम के तहत प्रतिबंधित है। छात्र शैक्षणिक उपयोग हेतु लिंक साझा करने के लिए स्वतंत्र हैं।
              </p>
            </div>

          </div>

          {/* Section C: Candidate Support & Transparency Commitment Banner */}
          <div className="bg-slate-100 border border-slate-300 rounded-xs p-3.5 text-xs sm:text-sm text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="text-blue-600 text-base font-bold">ℹ️</span>
              <span>
                <strong>पारदर्शिता एवं त्रुटि निवारण (Grievance Redressal): </strong>
                यदि आपको किसी अधिसूचना, परीक्षा तिथि अथवा लिंक में कोई विसंगति दिखाई दे, तो कृपया तुरंत आधिकारिक आयोग की वेबसाइट से मिलान करें अथवा हमें सूचित करें।
              </span>
            </div>
            <button
              onClick={() => onOpenPostBySlug('contact-us')}
              className="shrink-0 bg-[#ab1616] hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-xs text-xs cursor-pointer shadow-xs"
            >
              Contact Support
            </button>
          </div>

        </div>

        {/* 4. Bottom Copyright & Legal Navigation Strip */}
        <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs sm:text-sm">
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

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold flex-wrap justify-center sm:justify-end">
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

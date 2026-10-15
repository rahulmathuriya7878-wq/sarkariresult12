import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  questionHindi: string;
  questionEng: string;
  answerHindi: string;
  categoryHindi: string;
}

export const SarkariFAQSection: React.FC<{ isHindi: boolean }> = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      categoryHindi: 'आवेदन प्रक्रिया',
      questionHindi: 'राजस्थान व केंद्र सरकार की सरकारी नौकरियों (Sarkari Jobs) के लिए ऑनलाइन आवेदन कैसे करें?',
      questionEng: 'How to apply online for Rajasthan Government & Central Sarkari Jobs?',
      answerHindi: 'ऑनलाइन आवेदन करने के लिए Sarkari Result पोर्टल के "नवीनतम नौकरियां (Latest Jobs)" या "राज्य भर्ती" सेक्शन में जाएं। अपनी इच्छित भर्ती (जैसे RSMSSB, RPSC, UP Police, SSC) पर क्लिक करें। आधिकारिक विज्ञप्ति को ध्यानपूर्वक पढ़ें और "Apply Online" लिंक पर क्लिक करके SSO पोर्टल या संबंधित बोर्ड की आधिकारिक वेबसाइट पर फॉर्म भरें, फोटो व हस्ताक्षर अपलोड करें और परीक्षा शुल्क का भुगतान करें।'
    },
    {
      categoryHindi: 'आवश्यक दस्तावेज',
      questionHindi: 'सरकारी नौकरी का ऑनलाइन फॉर्म भरने के लिए कौन-कौन से दस्तावेज (Documents) आवश्यक हैं?',
      questionEng: 'What documents are required for filling government job application forms?',
      answerHindi: 'मुख्य आवश्यक दस्तावेजों में शामिल हैं: 10वीं व 12वीं की अंकतालिका/प्रमाण पत्र (जन्म तिथि प्रमाण हेतु), स्नातक/डिग्री सर्टिफिकेट (यदि लागू हो), जाति प्रमाण पत्र (SC/ST/OBC/EWS), मूल निवास (Bonafide Domicile) प्रमाण पत्र, पासपोर्ट साइज स्कैन फोटो, उम्मीदवार के हस्ताक्षर, आधार कार्ड / फोटो आईडी एवं सक्रिय मोबाइल नंबर व ईमेल आईडी।'
    },
    {
      categoryHindi: 'परीक्षा परिणाम',
      questionHindi: 'सरकारी रिजल्ट (Sarkari Result) और मेरिट लिस्ट कब और कैसे घोषित होते हैं?',
      questionEng: 'How and when are Sarkari Result and merit lists announced?',
      answerHindi: 'सरकारी रिजल्ट, लिखित परीक्षा का स्कोरकार्ड, मेरिट सूची और उत्तर कुंजी (Answer Key) संबंधित भर्ती बोर्ड (जैसे RPSC, RSMSSB, SSC, UPSC, NTA) द्वारा आधिकारिक वेबसाइट पर जारी किए जाते हैं। Sarkari Result आपको परिणाम जारी होते ही तुरंत डाउनलोड का सीधा सत्यापित लिंक प्रदान करता है।'
    },
    {
      categoryHindi: 'एडमिट कार्ड व परीक्षा',
      questionHindi: 'परीक्षा का एडमिट कार्ड (Admit Card / हॉल टिकट) कैसे डाउनलोड करें?',
      questionEng: 'How can I download my exam Admit Card / Hall Ticket?',
      answerHindi: 'एडमिट कार्ड डाउनलोड करने के लिए हमारे मुख्य पृष्ठ पर "Admit Card" सेक्शन में जाएं, अपनी परीक्षा चुनें और "Download Admit Card" लिंक पर क्लिक करें। अपना आवेदन क्रमांक (Registration Number/Roll No) और जन्म तिथि (DOB) या पासवर्ड डालकर अपना हॉल टिकट प्रिंट करें।'
    },
    {
      categoryHindi: 'आवेदन निर्देश',
      questionHindi: 'ऑनलाइन फॉर्म में फोटो और हस्ताक्षर (Photo & Signature Size) की क्या साइज होनी चाहिए?',
      questionEng: 'What is the standard photo and signature size requirement for online forms?',
      answerHindi: 'अधिकांश भर्ती बोर्ड (जैसे RSMSSB, RPSC, SSC) में पासपोर्ट फोटो JPEG/JPG प्रारूप में (20KB से 100KB) और उम्मीदवार के हस्ताक्षर (10KB से 50KB) में मांगे जाते हैं। आप पोर्टल के फुटर में उपलब्ध निःशुल्क फोटो रीसाइज़र टूल से फोटो को तुरंत रीसाइज कर सकते हैं।'
    },
    {
      categoryHindi: 'पात्रता परीक्षा (CET)',
      questionHindi: 'राजस्थान में समान पात्रता परीक्षा (CET - Common Eligibility Test) क्या है?',
      questionEng: 'What is CET (Common Eligibility Test) in Rajasthan?',
      answerHindi: 'राजस्थान कर्मचारी चयन बोर्ड (RSMSSB) द्वारा स्नातक व 12वीं (सीनियर सेकेंडरी) स्तर के विभिन्न अधीनस्थ व मंत्रालयिक पदों (जैसे पटवारी, एलडीसी, कांस्टेबल, कनिष्ठ लेखाकार) के लिए समान पात्रता परीक्षा (CET) आयोजित की जाती है। CET में योग्य अभ्यर्थी ही विज्ञापित पदों हेतु मुख्य आवेदन के पात्र होते हैं।'
    }
  ];

  return (
    <section className="w-full bg-white border border-slate-300 rounded-sm shadow-xs my-6 p-4 sm:p-6 text-slate-800">
      <div className="flex items-center gap-2 border-b-2 border-[#ab1616] pb-3 mb-4">
        <HelpCircle className="w-6 h-6 text-[#ab1616] shrink-0" />
        <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wide">
          सामान्यतः पूछे जाने वाले प्रश्न (FAQ) - Sarkari Exam & Application Guide
        </h2>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
        सरकारी नौकरी आवेदन, आवश्यक दस्तावेज, एडमिट कार्ड डाउनलोड और परिणाम घोषणाओं से संबंधित महत्वपूर्ण प्रश्नों के उत्तर यहाँ प्राप्त करें।
      </p>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="border border-slate-200 rounded-sm overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                  isOpen ? 'bg-[#ab1616] text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider self-start sm:self-auto ${
                    isOpen ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {faq.categoryHindi}
                  </span>
                  <span>{faq.questionHindi}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" />}
              </button>

              {isOpen && (
                <div className="p-4 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200 space-y-2">
                  <p className="text-slate-800 font-medium">{faq.answerHindi}</p>
                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                    English: {faq.questionEng}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

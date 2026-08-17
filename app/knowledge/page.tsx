'use client';
import { useState } from 'react';
import { BookOpen, FileText, AlertCircle, ShoppingCart, Scale, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

const SECTIONS = [
  {
    id: 'rti',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    titleEn: 'Right to Information (RTI)',
    titleHi: 'सूचना का अधिकार (RTI)',
    titleMr: 'माहितीचा अधिकार (RTI)',
    items: [
      {
        qEn: 'Who can file RTI?', qHi: 'RTI कौन दाखिल कर सकता है?', qMr: 'RTI कोण दाखल करू शकतो?',
        aEn: 'Any Indian citizen can file RTI. You don\'t need to give any reason. BPL card holders file for free. Application fee is just ₹10.',
        aHi: 'कोई भी भारतीय नागरिक RTI दाखिल कर सकता है। कोई कारण देने की जरूरत नहीं। BPL कार्डधारक मुफ्त में दाखिल करते हैं। आवेदन शुल्क सिर्फ ₹10 है।',
        aMr: 'कोणताही भारतीय नागरिक RTI दाखल करू शकतो. कारण द्यावे लागत नाही. BPL कार्डधारक मोफत दाखल करतात. अर्ज फी फक्त ₹10 आहे.',
      },
      {
        qEn: 'What is the time limit for RTI response?', qHi: 'RTI के जवाब की समय सीमा क्या है?', qMr: 'RTI उत्तराची वेळमर्यादा काय आहे?',
        aEn: 'PIO must respond within 30 days. For matters affecting life/liberty: 48 hours. If no response, file First Appeal within 30 days.',
        aHi: 'PIO को 30 दिनों में जवाब देना होगा। जीवन/स्वतंत्रता से जुड़े मामलों में: 48 घंटे। जवाब न आने पर 30 दिनों में प्रथम अपील करें।',
        aMr: 'PIО ला 30 दिवसांत उत्तर द्यावे लागते. जीव/स्वातंत्र्याशी संबंधित: 48 तास. उत्तर न मिळाल्यास 30 दिवसांत प्रथम अपील करा.',
      },
      {
        qEn: 'What if PIO doesn\'t reply?', qHi: 'PIO जवाब न दे तो क्या करें?', qMr: 'PIО उत्तर न दिल्यास काय करावे?',
        aEn: 'File First Appeal with First Appellate Authority (FAA) within 30 days. If still unsatisfied, file Second Appeal with CIC (Central Information Commission) within 90 days.',
        aHi: 'प्रथम अपील प्राधिकरण (FAA) के पास 30 दिनों में प्रथम अपील करें। फिर भी संतुष्ट न हों तो 90 दिनों में CIC में द्वितीय अपील करें।',
        aMr: 'प्रथम अपील प्राधिकरण (FAA) कडे 30 दिवसांत प्रथम अपील करा. समाधान न झाल्यास 90 दिवसांत CIC कडे द्वितीय अपील करा.',
      },
      {
        qEn: 'How to file RTI online?', qHi: 'RTI ऑनलाइन कैसे दाखिल करें?', qMr: 'RTI ऑनलाइन कसे दाखल करावे?',
        aEn: 'For Central Government: Visit rtionline.gov.in. Register, fill form, pay ₹10 online. For state governments, check your state\'s RTI portal.',
        aHi: 'केंद्र सरकार के लिए: rtionline.gov.in पर जाएं। रजिस्टर करें, फॉर्म भरें, ₹10 ऑनलाइन भुगतान करें। राज्य सरकार के लिए अपने राज्य का RTI पोर्टल देखें।',
        aMr: 'केंद्र सरकारसाठी: rtionline.gov.in ला भेट द्या. नोंदणी करा, फॉर्म भरा, ₹10 ऑनलाइन द्या. राज्य सरकारसाठी राज्याचे RTI पोर्टल पहा.',
      },
    ],
    links: [
      { name: 'RTI Online Portal', url: 'https://rtionline.gov.in' },
      { name: 'Central Information Commission', url: 'https://cic.gov.in' },
      { name: 'RTI Act 2005 — India Code', url: 'https://indiacode.nic.in/bitstream/123456789/2082/1/200527.pdf' },
    ],
  },
  {
    id: 'fir',
    icon: AlertCircle,
    color: 'from-red-500 to-rose-500',
    titleEn: 'FIR & Police Complaints',
    titleHi: 'FIR और पुलिस शिकायत',
    titleMr: 'FIR आणि पोलिस तक्रार',
    items: [
      {
        qEn: 'What is FIR? Who can file it?', qHi: 'FIR क्या है? इसे कौन दाखिल कर सकता है?', qMr: 'FIR म्हणजे काय? कोण दाखल करू शकतो?',
        aEn: 'First Information Report — a written document prepared by police for cognizable offences. Any victim, witness, or person with knowledge of the crime can file FIR.',
        aHi: 'प्रथम सूचना रिपोर्ट — पुलिस द्वारा संज्ञेय अपराधों के लिए तैयार किया गया दस्तावेज। कोई भी पीड़ित, गवाह, या अपराध की जानकारी रखने वाला FIR दाखिल कर सकता है।',
        aMr: 'प्रथम माहिती अहवाल — दखलपात्र गुन्ह्यांसाठी पोलिसांकडून तयार केलेला दस्तऐवज. कोणताही पीडित, साक्षीदार किंवा गुन्ह्याची माहिती असलेला व्यक्ती FIR दाखल करू शकतो.',
      },
      {
        qEn: 'What if police refuse to register FIR?', qHi: 'पुलिस FIR दर्ज करने से मना करे तो?', qMr: 'पोलिस FIR नोंदवण्यास नकार दिल्यास?',
        aEn: '1. Request SP/DCP in writing. 2. File before Judicial Magistrate (Section 156(3) CrPC). 3. File complaint with NHRC or State Human Rights Commission.',
        aHi: '1. SP/DCP को लिखित अनुरोध करें। 2. न्यायिक मजिस्ट्रेट के सामने आवेदन (धारा 156(3) CrPC)। 3. NHRC या राज्य मानवाधिकार आयोग में शिकायत करें।',
        aMr: '1. SP/DCP ला लेखी विनंती करा. 2. न्यायिक दंडाधिकाऱ्यापुढे अर्ज (कलम 156(3) CrPC). 3. NHRC किंवा राज्य मानवाधिकार आयोगात तक्रार करा.',
      },
      {
        qEn: 'What is a Zero FIR?', qHi: 'जीरो FIR क्या है?', qMr: 'Zero FIR म्हणजे काय?',
        aEn: 'Zero FIR can be filed at ANY police station regardless of where the crime happened. The station must then transfer it to the correct jurisdiction. This is useful in emergencies.',
        aHi: 'Zero FIR किसी भी पुलिस स्टेशन में दर्ज कराई जा सकती है, चाहे अपराध कहीं भी हुआ हो। स्टेशन इसे सही क्षेत्राधिकार में भेजेगा। आपातकाल में उपयोगी।',
        aMr: 'Zero FIR कोणत्याही पोलिस ठाण्यात दाखल करता येते, गुन्हा कुठेही घडला असला तरी. ते योग्य अधिकारक्षेत्रात हस्तांतरित केले जाते. आत्कालीन परिस्थितीत उपयुक्त.',
      },
      {
        qEn: 'What are my rights after arrest?', qHi: 'गिरफ्तारी के बाद मेरे अधिकार?', qMr: 'अटकेनंतर माझे अधिकार?',
        aEn: 'Right to be told the reason for arrest. Right to a lawyer. Right to be produced before magistrate within 24 hours. Right to bail (for bailable offences). Right to inform family.',
        aHi: 'गिरफ्तारी का कारण जानने का अधिकार। वकील का अधिकार। 24 घंटे में मजिस्ट्रेट के सामने पेश करने का अधिकार। जमानती अपराधों में जमानत का अधिकार। परिवार को सूचित करने का अधिकार।',
        aMr: 'अटकेचे कारण जाणण्याचा अधिकार. वकिलाचा अधिकार. 24 तासांत दंडाधिकाऱ्यासमोर हजर करण्याचा अधिकार. जामीनपात्र गुन्ह्यात जामिनाचा अधिकार. कुटुंबाला सूचित करण्याचा अधिकार.',
      },
    ],
    links: [
      { name: 'Cybercrime Portal', url: 'https://cybercrime.gov.in' },
      { name: 'National Human Rights Commission', url: 'https://nhrc.nic.in' },
      { name: 'CrPC — India Code', url: 'https://indiacode.nic.in' },
    ],
  },
  {
    id: 'consumer',
    icon: ShoppingCart,
    color: 'from-green-500 to-emerald-500',
    titleEn: 'Consumer Rights',
    titleHi: 'उपभोक्ता अधिकार',
    titleMr: 'ग्राहक हक्क',
    items: [
      {
        qEn: 'When can I file a consumer complaint?', qHi: 'उपभोक्ता शिकायत कब दर्ज करें?', qMr: 'ग्राहक तक्रार कधी दाखल करावी?',
        aEn: 'For defective goods, deficiency in services (banking, insurance, hospitals, etc.), unfair trade practices, overcharging above MRP, or misleading advertisements.',
        aHi: 'दोषपूर्ण सामान, सेवाओं में कमी (बैंकिंग, बीमा, अस्पताल आदि), अनुचित व्यापार प्रथाओं, MRP से अधिक शुल्क, या भ्रामक विज्ञापनों के लिए।',
        aMr: 'दोषयुक्त वस्तू, सेवांमधील त्रुटी (बँकिंग, विमा, रुग्णालये), अनुचित व्यापार पद्धती, MRP पेक्षा अधिक आकार, किंवा दिशाभूल करणाऱ्या जाहिरातींसाठी.',
      },
      {
        qEn: 'Which forum to approach for my complaint?', qHi: 'शिकायत के लिए कौन से मंच पर जाएं?', qMr: 'तक्रारीसाठी कोणत्या मंचाकडे जावे?',
        aEn: 'District Commission: up to ₹50 Lakhs. State Commission: ₹50L to ₹2 Crore. National Commission (NCDRC): Above ₹2 Crore. File online at edaakhil.nic.in.',
        aHi: 'जिला आयोग: ₹50 लाख तक। राज्य आयोग: ₹50L से ₹2 करोड़। राष्ट्रीय आयोग (NCDRC): ₹2 करोड़ से अधिक। edaakhil.nic.in पर ऑनलाइन दाखिल करें।',
        aMr: 'जिल्हा आयोग: ₹50 लाखांपर्यंत. राज्य आयोग: ₹50L ते ₹2 कोटी. राष्ट्रीय आयोग (NCDRC): ₹2 कोटींपेक्षा जास्त. edaakhil.nic.in वर ऑनलाइन दाखल करा.',
      },
      {
        qEn: 'What is the time limit for filing complaint?', qHi: 'शिकायत दर्ज करने की समय सीमा?', qMr: 'तक्रार दाखल करण्याची वेळमर्यादा?',
        aEn: 'File within 2 years from the date the problem occurred. Courts may admit complaints after 2 years if there is sufficient reason for the delay.',
        aHi: 'समस्या होने की तारीख से 2 साल के भीतर शिकायत करें। पर्याप्त कारण होने पर अदालत 2 साल बाद भी स्वीकार कर सकती है।',
        aMr: 'समस्या घडल्यापासून 2 वर्षांत तक्रार दाखल करा. पुरेसे कारण असल्यास न्यायालय 2 वर्षांनंतरही स्वीकारू शकते.',
      },
    ],
    links: [
      { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in' },
      { name: 'eDaakhil — Online Filing', url: 'https://edaakhil.nic.in' },
      { name: 'NCDRC', url: 'https://ncdrc.nic.in' },
    ],
  },
  {
    id: 'rights',
    icon: Scale,
    color: 'from-purple-500 to-violet-500',
    titleEn: 'Fundamental Rights',
    titleHi: 'मौलिक अधिकार',
    titleMr: 'मूलभूत अधिकार',
    items: [
      {
        qEn: 'Article 14 — Right to Equality', qHi: 'अनुच्छेद 14 — समानता का अधिकार', qMr: 'अनुच्छेद 14 — समानतेचा अधिकार',
        aEn: 'The State shall not deny any person equality before law or equal protection of laws. No arbitrary discrimination by the government.',
        aHi: 'राज्य किसी व्यक्ति को कानून के समक्ष समानता या कानूनों के समान संरक्षण से वंचित नहीं करेगा। सरकार द्वारा कोई मनमाना भेदभाव नहीं।',
        aMr: 'राज्य कोणत्याही व्यक्तीला कायद्यापुढे समानता किंवा कायद्यांचे समान संरक्षण नाकारणार नाही. सरकारकडून कोणताही मनमानी भेदभाव नाही.',
      },
      {
        qEn: 'Article 19 — Freedom of Speech & Expression', qHi: 'अनुच्छेद 19 — वाक् और अभिव्यक्ति की स्वतंत्रता', qMr: 'अनुच्छेद 19 — भाषण व अभिव्यक्ती स्वातंत्र्य',
        aEn: 'Every citizen has the right to freedom of speech and expression, peaceful assembly, forming associations, movement across India, and to practice any profession.',
        aHi: 'प्रत्येक नागरिक को वाक् और अभिव्यक्ति, शांतिपूर्वक सभा, संघ बनाने, भारत में कहीं भी घूमने और कोई भी पेशा अपनाने की स्वतंत्रता है।',
        aMr: 'प्रत्येक नागरिकाला भाषण व अभिव्यक्ती, शांततापूर्वक सभा, संघटना स्थापन, भारतात कुठेही संचार आणि कोणताही व्यवसाय करण्याचे स्वातंत्र्य आहे.',
      },
      {
        qEn: 'Article 21 — Right to Life & Liberty', qHi: 'अनुच्छेद 21 — जीवन और व्यक्तिगत स्वतंत्रता का अधिकार', qMr: 'अनुच्छेद 21 — जगण्याचा व स्वातंत्र्याचा अधिकार',
        aEn: 'No person shall be deprived of their life or personal liberty except according to procedure established by law. This includes right to health, privacy, education, and speedy trial.',
        aHi: 'कोई भी व्यक्ति अपने जीवन या व्यक्तिगत स्वतंत्रता से कानून द्वारा स्थापित प्रक्रिया के अनुसार ही वंचित किया जा सकता है। इसमें स्वास्थ्य, गोपनीयता, शिक्षा का अधिकार शामिल है।',
        aMr: 'कायद्याने स्थापित प्रक्रियेशिवाय कोणत्याही व्यक्तीला जीवन किंवा वैयक्तिक स्वातंत्र्यापासून वंचित करता येणार नाही. यात आरोग्य, गोपनीयता, शिक्षणाचा अधिकार समाविष्ट आहे.',
      },
      {
        qEn: 'Article 22 — Protection Against Arrest', qHi: 'अनुच्छेद 22 — गिरफ्तारी से सुरक्षा', qMr: 'अनुच्छेद 22 — अटकेपासून संरक्षण',
        aEn: 'On arrest: Must be informed of grounds. Must be allowed to consult a lawyer. Must be produced before a magistrate within 24 hours of arrest.',
        aHi: 'गिरफ्तारी पर: कारण बताना होगा। वकील से परामर्श की अनुमति। गिरफ्तारी के 24 घंटे के भीतर मजिस्ट्रेट के सामने पेश करना।',
        aMr: 'अटकेवर: कारण सांगणे आवश्यक. वकिलाशी सल्लामसलत करण्याची परवानगी. अटकेच्या 24 तासांत दंडाधिकाऱ्यासमोर हजर करणे.',
      },
      {
        qEn: 'Article 32 — Right to Constitutional Remedies', qHi: 'अनुच्छेद 32 — संवैधानिक उपायों का अधिकार', qMr: 'अनुच्छेद 32 — घटनात्मक उपायांचा अधिकार',
        aEn: 'Right to move Supreme Court for enforcement of Fundamental Rights. Called "Heart and Soul of the Constitution" by Dr. Ambedkar. Writs: Habeas Corpus, Mandamus, Certiorari, Prohibition, Quo-Warranto.',
        aHi: 'मौलिक अधिकारों को लागू कराने के लिए सर्वोच्च न्यायालय में जाने का अधिकार। डॉ. अंबेडकर ने इसे "संविधान का हृदय और आत्मा" कहा। रिट: हेबियस कॉर्पस, मंडामस, सर्टियोरारी, प्रोहिबिशन, क्वो-वारंटो।',
        aMr: 'मूलभूत अधिकारांची अंमलबजावणी करण्यासाठी सर्वोच्च न्यायालयात जाण्याचा अधिकार. डॉ. आंबेडकरांनी याला "राज्यघटनेचे हृदय आणि आत्मा" म्हटले. रिट: हेबियस कॉर्पस, मँडामस, सर्टियोरारी, प्रोहिबिशन, क्वो-वारंटो.',
      },
      {
        qEn: 'Free Legal Aid — Who is eligible?', qHi: 'मुफ्त कानूनी सहायता — कौन पात्र है?', qMr: 'मोफत कायदेशीर मदत — कोण पात्र?',
        aEn: 'Free legal aid is available to: women and children, SC/ST members, persons with disabilities, people in custody, and those with annual income below ₹3 Lakh. Contact NALSA: 15100.',
        aHi: 'मुफ्त कानूनी सहायता उपलब्ध है: महिलाओं और बच्चों, SC/ST सदस्यों, विकलांग व्यक्तियों, हिरासत में लोगों, और ₹3 लाख से कम वार्षिक आय वालों को। NALSA: 15100।',
        aMr: 'मोफत कायदेशीर मदत उपलब्ध: महिला व बालके, SC/ST सदस्य, अपंग व्यक्ती, ताब्यातील व्यक्ती, आणि ₹3 लाखांपेक्षा कमी वार्षिक उत्पन्न असलेले. NALSA: 15100.',
      },
    ],
    links: [
      { name: 'India Code — Constitution', url: 'https://indiacode.nic.in' },
      { name: 'Supreme Court of India', url: 'https://sci.nic.in' },
      { name: 'NALSA — Free Legal Aid', url: 'https://nalsa.gov.in' },
    ],
  },
];

export default function KnowledgePage() {
  const { language } = useLanguage();
  const [openSection, setOpenSection] = useState<string>('rti');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getTitle = (section: typeof SECTIONS[0]) => {
    if (language === 'hi') return section.titleHi;
    if (language === 'mr') return section.titleMr;
    return section.titleEn;
  };

  const getQ = (item: typeof SECTIONS[0]['items'][0]) => {
    if (language === 'hi') return item.qHi;
    if (language === 'mr') return item.qMr;
    return item.qEn;
  };

  const getA = (item: typeof SECTIONS[0]['items'][0]) => {
    if (language === 'hi') return item.aHi;
    if (language === 'mr') return item.aMr;
    return item.aEn;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: '#1d4ed8' }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-xl">
              {language === 'mr' ? 'तुमचे अधिकार जाणा' : language === 'hi' ? 'अपने अधिकार जानें' : 'Know Your Rights'}
            </h1>
            <p className="text-gray-500 text-sm">
              {language === 'mr' ? 'RTI, FIR, ग्राहक हक्क आणि मूलभूत अधिकार' : language === 'hi' ? 'RTI, FIR, उपभोक्ता अधिकार और मौलिक अधिकार' : 'RTI, FIR, Consumer & Fundamental Rights'}
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SECTIONS.map(section => {
          const Icon = section.icon;
          const isActive = openSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setOpenSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border ${
                isActive
                  ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {getTitle(section)}
            </button>
          );
        })}
      </div>

      {/* Active Section Content */}
      {SECTIONS.filter(s => s.id === openSection).map(section => (
        <div key={section.id} className="space-y-3">
          {/* FAQ Items */}
          {section.items.map((item, i) => {
            const itemId = `${section.id}-${i}`;
            const isOpen = openItems.has(itemId);
            return (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => toggleItem(itemId)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 text-sm pr-4">{getQ(item)}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50/50">
                    <p className="text-gray-600 text-sm leading-relaxed">{getA(item)}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Official Links */}
          <div className="card p-4 mt-6">
            <h3 className="section-label">
              {language === 'mr' ? 'अधिकृत स्रोत' : language === 'hi' ? 'आधिकारिक स्रोत' : 'Official Sources'}
            </h3>
            <div className="space-y-2">
              {section.links.map(({ name, url }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-interactive flex items-center justify-between p-3 group"
                >
                  <span className="text-gray-700 group-hover:text-blue-700 text-sm font-medium">{name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-700 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

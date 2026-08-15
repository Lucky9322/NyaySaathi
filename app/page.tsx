'use client';
import Link from 'next/link';
import { MessageSquare, FileText, AlertCircle, BookOpen, ExternalLink, Phone, Scale, Shield, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/translations';

const OFFICIAL_SOURCES = [
  {
    name: 'RTI Online Portal',
    description: 'File RTI applications online for Central Government',
    url: 'https://rtionline.gov.in',
    color: 'from-orange-500/20 to-orange-600/10',
    badge: 'Central Govt',
  },
  {
    name: 'India Code',
    description: 'All Central Acts and Laws of India',
    url: 'https://indiacode.nic.in',
    color: 'from-blue-500/20 to-blue-600/10',
    badge: 'Laws',
  },
  {
    name: 'Consumer Helpline',
    description: 'File consumer complaints online',
    url: 'https://consumerhelpline.gov.in',
    color: 'from-green-500/20 to-green-600/10',
    badge: 'Consumer',
  },
  {
    name: 'Cybercrime Portal',
    description: 'Report cybercrime and online fraud',
    url: 'https://cybercrime.gov.in',
    color: 'from-red-500/20 to-red-600/10',
    badge: 'Police',
  },
  {
    name: 'eCourts Services',
    description: 'Case status, orders, and judgments',
    url: 'https://ecourts.gov.in',
    color: 'from-purple-500/20 to-purple-600/10',
    badge: 'Courts',
  },
  {
    name: 'NALSA — Legal Aid',
    description: 'Free legal services for eligible citizens',
    url: 'https://nalsa.gov.in',
    color: 'from-yellow-500/20 to-yellow-600/10',
    badge: 'Free Aid',
  },
];

const HELPLINES = [
  { name: 'Police Emergency', number: '100', icon: '🚔' },
  { name: 'Women Helpline', number: '1091', icon: '👩' },
  { name: 'Child Helpline', number: '1098', icon: '🧒' },
  { name: 'NALSA Legal Aid', number: '15100', icon: '⚖️' },
  { name: 'Consumer Helpline', number: '1800-11-4000', icon: '🛒' },
  { name: 'Cybercrime', number: '1930', icon: '💻' },
];

export default function HomePage() {
  const { language } = useLanguage();

  const quickActions = [
    {
      href: '/chat',
      icon: MessageSquare,
      label: t(language, 'chatWithAI'),
      description: language === 'mr' ? 'Marathi, Hindi, किंवा English मध्ये विचारा' : language === 'hi' ? 'Marathi, Hindi, या English में पूछें' : 'Ask in Marathi, Hindi, or English',
      color: 'from-orange-500 to-red-500',
      badge: 'AI Powered',
    },
    {
      href: '/rti',
      icon: FileText,
      label: t(language, 'learnRTI'),
      description: language === 'mr' ? 'RTI अर्ज तयार करा व PDF डाउनलोड करा' : language === 'hi' ? 'RTI आवेदन तैयार करें और PDF डाउनलोड करें' : 'Generate RTI application & download PDF',
      color: 'from-blue-500 to-indigo-500',
      badge: 'PDF Ready',
    },
    {
      href: '/complaint',
      icon: AlertCircle,
      label: t(language, 'fileFIR'),
      description: language === 'mr' ? 'FIR साठी तक्रार मसुदा तयार करा' : language === 'hi' ? 'FIR के लिए शिकायत प्रारूप तैयार करें' : 'Draft a police complaint for FIR filing',
      color: 'from-red-500 to-rose-500',
      badge: 'Draft Help',
    },
    {
      href: '/knowledge',
      icon: BookOpen,
      label: t(language, 'knowRights'),
      description: language === 'mr' ? 'RTI, FIR, ग्राहक हक्क जाणून घ्या' : language === 'hi' ? 'RTI, FIR, उपभोक्ता अधिकार जानें' : 'Learn about RTI, FIR, consumer rights',
      color: 'from-green-500 to-emerald-500',
      badge: 'Education',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16">

      {/* Hero Section */}
      <section className="text-center py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 rounded-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            {language === 'mr' ? 'स्वतंत्रता दिन विशेष — सर्व नागरिकांसाठी मोफत' : language === 'hi' ? 'स्वतंत्रता दिवस विशेष — सभी नागरिकों के लिए मुफ्त' : 'Independence Day Special — Free for all citizens'}
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">
            <span className="gradient-text">
              {language === 'en' ? 'NyayaSathi' : 'न्यायसाथी'}
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-2">{t(language, 'appTagline')}</p>
          <p className="text-white/50 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t(language, 'appDescription')}
          </p>
          <div className="india-bar max-w-xs mx-auto mb-8" />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/chat" className="btn-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t(language, 'chatWithAI')}
            </Link>
            <Link href="/rti" className="btn-secondary flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t(language, 'learnRTI')}
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-200/80 text-sm leading-relaxed">
          {t(language, 'disclaimer')}
        </p>
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="section-title">{t(language, 'quickActions')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ href, icon: Icon, label, description, color, badge }) => (
            <Link key={href} href={href} className="card-hover p-5 group">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="badge-saffron mb-2">{badge}</div>
              <h3 className="font-semibold text-white text-sm mb-1.5 leading-tight">{label}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{description}</p>
              <div className="flex items-center gap-1 mt-3 text-orange-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {language === 'mr' ? 'सुरू करा' : language === 'hi' ? 'शुरू करें' : 'Get Started'}
                <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Official Sources */}
      <section>
        <h2 className="section-title">{t(language, 'sources')}</h2>
        <p className="section-subtitle">
          {language === 'mr' ? 'सरकारी अधिकृत वेबसाइट्स आणि पोर्टल्स' : language === 'hi' ? 'सरकारी आधिकारिक वेबसाइट और पोर्टल' : 'Official Government Websites & Portals'}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICIAL_SOURCES.map(({ name, description, url, color, badge }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover p-4 group"
            >
              <div className={`w-full h-1 rounded-full bg-gradient-to-r ${color} mb-3`} />
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="badge-blue mb-1.5">{badge}</div>
                  <h3 className="font-semibold text-white text-sm mb-1">{name}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{description}</p>
                  <p className="text-orange-400/60 text-xs mt-1 truncate">{url}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 flex-shrink-0 group-hover:text-orange-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Helplines */}
      <section>
        <h2 className="section-title">{t(language, 'helplines')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {HELPLINES.map(({ name, number, icon }) => (
            <div key={number} className="card p-4 text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-xs text-white/50 mb-1 leading-tight">{name}</p>
              <p className="font-bold text-orange-400 text-sm">{number}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

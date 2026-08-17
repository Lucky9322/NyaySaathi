'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  MessageSquare, FileText, AlertCircle, BookOpen,
  ExternalLink, Scale, Shield, ChevronRight,
  Clock, BarChart2, TrendingUp, Phone, ArrowRight,
  Sparkles, Hash,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { t } from '@/lib/translations';
import {
  getRecentChatSessions,
  getRecentDocumentDrafts,
  getStats,
  getTimeGreeting,
  formatRelativeTime,
  type ChatSession,
  type DocumentDraft,
  type SessionStats,
} from '@/lib/session';
import { SkeletonDashboard } from '@/components/ui/SkeletonLoader';
import EmptyState from '@/components/ui/EmptyState';

// ─── Static Data ──────────────────────────────────────────────────────────────

const OFFICIAL_SOURCES = [
  { name: 'RTI Online Portal',    url: 'https://rtionline.gov.in',      badge: 'Central Govt', icon: '📋' },
  { name: 'India Code',           url: 'https://indiacode.nic.in',      badge: 'Laws',         icon: '⚖️' },
  { name: 'Consumer Helpline',    url: 'https://consumerhelpline.gov.in', badge: 'Consumer',   icon: '🛒' },
  { name: 'Cybercrime Portal',    url: 'https://cybercrime.gov.in',     badge: 'Police',       icon: '💻' },
  { name: 'eCourts Services',     url: 'https://ecourts.gov.in',        badge: 'Courts',       icon: '🏛️' },
  { name: 'NALSA — Legal Aid',    url: 'https://nalsa.gov.in',          badge: 'Free Aid',     icon: '🤝' },
];

const HELPLINES = [
  { name: 'Police',         number: '100',          color: '#dc2626' },
  { name: 'Women Helpline', number: '1091',         color: '#db2777' },
  { name: 'Child Helpline', number: '1098',         color: '#d97706' },
  { name: 'Legal Aid',      number: '15100',        color: '#1d4ed8' },
  { name: 'Consumer',       number: '1800-11-4000', color: '#16a34a' },
  { name: 'Cybercrime',     number: '1930',         color: '#7c3aed' },
];

const SUGGESTED_QUESTIONS = {
  en: [
    'How do I file an RTI application?',
    'What if police refuse to register my FIR?',
    'How to file a consumer complaint online?',
    'What are my fundamental rights?',
  ],
  hi: [
    'RTI आवेदन कैसे दाखिल करें?',
    'पुलिस FIR न दर्ज करे तो क्या करें?',
    'ऑनलाइन उपभोक्ता शिकायत कैसे करें?',
    'मेरे मौलिक अधिकार क्या हैं?',
  ],
  mr: [
    'RTI अर्ज कसा दाखल करावा?',
    'पोलिस FIR नाकारल्यास काय करावे?',
    'ऑनलाइन ग्राहक तक्रार कशी करावी?',
    'माझे मूलभूत अधिकार काय आहेत?',
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="section-label">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function HomePage() {
  const { language } = useLanguage();
  const [mounted, setMounted]         = useState(false);
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [recentDocs,  setRecentDocs]  = useState<DocumentDraft[]>([]);
  const [stats,       setStats]       = useState<SessionStats | null>(null);

  useEffect(() => {
    setRecentChats(getRecentChatSessions(4));
    setRecentDocs(getRecentDocumentDrafts(3));
    setStats(getStats());
    setMounted(true);
  }, []);

  const greeting    = getTimeGreeting(language as 'en' | 'hi' | 'mr');
  const suggestions = SUGGESTED_QUESTIONS[language as keyof typeof SUGGESTED_QUESTIONS] ?? SUGGESTED_QUESTIONS.en;

  const quickActions = [
    {
      href: '/chat',
      icon: MessageSquare,
      label: t(language, 'chatWithAI'),
      description: language === 'mr'
        ? 'AI सह कायदेशीर प्रश्न विचारा'
        : language === 'hi'
        ? 'AI से कानूनी सवाल पूछें'
        : 'Get instant legal guidance',
      iconBg:  '#eff6ff',
      iconBorder: '#bfdbfe',
      iconColor:  '#1d4ed8',
      badge: 'AI',
    },
    {
      href: '/rti',
      icon: FileText,
      label: t(language, 'learnRTI'),
      description: language === 'mr'
        ? 'RTI अर्ज व PDF डाउनलोड'
        : language === 'hi'
        ? 'RTI आवेदन और PDF डाउनलोड'
        : 'Generate & download RTI application',
      iconBg:  '#f0f9ff',
      iconBorder: '#bae6fd',
      iconColor:  '#0369a1',
      badge: 'PDF',
    },
    {
      href: '/complaint',
      icon: AlertCircle,
      label: t(language, 'fileFIR'),
      description: language === 'mr'
        ? 'FIR साठी तक्रार मसुदा'
        : language === 'hi'
        ? 'FIR के लिए शिकायत प्रारूप'
        : 'Draft a police complaint',
      iconBg:  '#fff7ed',
      iconBorder: '#fed7aa',
      iconColor:  '#c2410c',
      badge: 'Draft',
    },
    {
      href: '/knowledge',
      icon: BookOpen,
      label: t(language, 'knowRights'),
      description: language === 'mr'
        ? 'RTI, FIR, ग्राहक हक्क'
        : language === 'hi'
        ? 'RTI, FIR, उपभोक्ता अधिकार'
        : 'RTI, FIR, consumer rights',
      iconBg:  '#f0fdf4',
      iconBorder: '#bbf7d0',
      iconColor:  '#15803d',
      badge: 'Learn',
    },
  ];

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <SkeletonDashboard />
      </div>
    );
  }

  const hasActivity = (stats?.totalQuestions ?? 0) > 0 || (stats?.totalDocuments ?? 0) > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* ── Two-Column Layout ── */}
      <div className="grid lg:grid-cols-[1fr_288px] gap-6 lg:gap-8">

        {/* ═══ Main Column ════════════════════════════════════════════════════ */}
        <div className="space-y-8 min-w-0">

          {/* ── Greeting & Hero CTA ── */}
          <section>
            <p className="text-xs font-medium text-gray-400 mb-0.5 tracking-wide">{greeting}</p>
            <h1
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
              style={{ letterSpacing: '-0.03em' }}
            >
              {language === 'en'
                ? <>Welcome to <span className="text-blue-700">NyayaSathi</span></>
                : language === 'hi'
                ? <><span className="text-blue-700">न्यायसाथी</span> में स्वागत है</>
                : <><span className="text-blue-700">न्यायसाथी</span> मध्ये स्वागत</>
              }
            </h1>
            <p className="text-gray-500 text-sm mb-5 max-w-lg leading-relaxed">
              {t(language, 'appDescription')}
            </p>

            {/* Primary CTA — Ask NyayaSaathi */}
            <Link
              href="/chat"
              id="primary-chat-cta"
              className="group flex items-center gap-3.5 p-4 rounded-lg border border-gray-200
                         bg-white hover:border-blue-300 hover:shadow-md
                         transition-all duration-200 mb-4 max-w-lg"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: '#1d4ed8' }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-900 text-sm">
                    {language === 'mr' ? 'AI ला विचारा' : language === 'hi' ? 'AI से पूछें' : 'Ask NyayaSathi'}
                  </span>
                  <span className="badge-indigo text-[10px]">Gemini AI</span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {language === 'mr'
                    ? 'Marathi, Hindi, English मध्ये कायदेशीर प्रश्न'
                    : language === 'hi'
                    ? 'हिंदी, मराठी, या English में कानूनी सवाल पूछें'
                    : 'Legal questions in Marathi, Hindi, or English'}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Disclaimer */}
            <div className="alert-warning max-w-lg">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>{t(language, 'disclaimer')}</p>
            </div>
          </section>

          {/* ── Quick Actions ── */}
          <section>
            <SectionHeader title={t(language, 'quickActions')} />
            <div className="grid sm:grid-cols-2 gap-3">
              {quickActions.map(({ href, icon: Icon, label, description, iconBg, iconBorder, iconColor, badge }) => (
                <Link
                  key={href}
                  href={href}
                  id={`action-${href.replace('/', '')}`}
                  className="card-interactive p-4 group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{label}</h3>
                        <span className="badge-slate text-[10px]">{badge}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-1
                                            group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Recent Chats ── */}
          <section>
            <SectionHeader
              title={language === 'mr' ? 'अलीकडील संभाषणे' : language === 'hi' ? 'हाल की बातचीत' : 'Recent Conversations'}
              action={{ label: language === 'mr' ? 'नवी चॅट' : language === 'hi' ? 'नई चैट' : 'New Chat', href: '/chat' }}
            />
            {recentChats.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title={
                  language === 'mr' ? 'अद्याप कोणतीही संभाषणे नाहीत'
                  : language === 'hi' ? 'अभी तक कोई बातचीत नहीं'
                  : 'No conversations yet'
                }
                description={
                  language === 'mr' ? 'AI सहाय्यकाशी बोलणे सुरू करा'
                  : language === 'hi' ? 'AI सहायक से बात शुरू करें'
                  : 'Start a conversation with the AI assistant to see your history here'
                }
                action={{ label: language === 'mr' ? 'चॅट सुरू करा' : language === 'hi' ? 'चैट शुरू करें' : 'Start chatting', href: '/chat' }}
                compact
              />
            ) : (
              <div className="space-y-2">
                {recentChats.map((session) => (
                  <Link
                    key={session.id}
                    href={`/chat?session=${session.id}`}
                    className="card-interactive flex items-center gap-3 p-3.5 group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate mb-0.5">{session.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatRelativeTime(session.updatedAt)}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                          {session.messageCount} {language === 'mr' ? 'संदेश' : language === 'hi' ? 'संदेश' : 'messages'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-gray-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ── Document History ── */}
          <section>
            <SectionHeader
              title={language === 'mr' ? 'दस्तऐवज इतिहास' : language === 'hi' ? 'दस्तावेज़ इतिहास' : 'Document History'}
            />
            {recentDocs.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={
                  language === 'mr' ? 'कोणतेही दस्तऐवज नाहीत'
                  : language === 'hi' ? 'कोई दस्तावेज़ नहीं'
                  : 'No documents generated'
                }
                description={
                  language === 'mr' ? 'RTI अर्ज किंवा पोलीस तक्रार तयार करा'
                  : language === 'hi' ? 'RTI आवेदन या पुलिस शिकायत बनाएं'
                  : 'Generate RTI applications or police complaints to see your history here'
                }
                compact
              />
            ) : (
              <div className="space-y-2">
                {recentDocs.map((doc) => (
                  <Link
                    key={doc.id}
                    href={doc.type === 'rti' ? '/rti' : '/complaint'}
                    className="card-interactive flex items-start gap-3 p-3.5 group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={doc.type === 'rti'
                        ? { background: '#f0f9ff', border: '1px solid #bae6fd' }
                        : { background: '#fff7ed', border: '1px solid #fed7aa' }}
                    >
                      {doc.type === 'rti'
                        ? <FileText className="w-3.5 h-3.5 text-sky-600" />
                        : <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm text-gray-800 font-medium truncate">{doc.title}</p>
                        <span className={doc.type === 'rti' ? 'badge-blue text-[10px]' : 'badge-saffron text-[10px]'}>
                          {doc.type === 'rti' ? 'RTI' : 'FIR'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">{doc.preview}</p>
                      <p className="text-xs text-gray-300 mt-0.5">{formatRelativeTime(doc.generatedAt)}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-gray-500 transition-colors mt-1" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ── Suggested Questions ── */}
          <section>
            <SectionHeader
              title={language === 'mr' ? 'सुचवलेले प्रश्न' : language === 'hi' ? 'सुझाए गए प्रश्न' : 'People Often Ask'}
              action={{ label: language === 'mr' ? 'AI विचारा' : language === 'hi' ? 'AI से पूछें' : 'Ask AI', href: '/chat' }}
            />
            <div className="grid sm:grid-cols-2 gap-2">
              {suggestions.map((q, i) => (
                <Link
                  key={i}
                  href={`/chat?q=${encodeURIComponent(q)}`}
                  className="flex items-start gap-2.5 p-3 rounded-md
                             bg-white border border-gray-200 hover:border-blue-300
                             text-xs text-gray-600 hover:text-gray-900
                             hover:shadow-sm transition-all duration-150 group"
                >
                  <Hash className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{q}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Official Sources ── */}
          <section>
            <SectionHeader title={t(language, 'sources')} />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {OFFICIAL_SOURCES.map(({ name, url, badge, icon }) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-interactive p-3.5 group flex items-center gap-3"
                >
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
                    </div>
                    <span className="badge-slate text-[10px]">{badge}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
                </a>
              ))}
            </div>
          </section>

        </div>

        {/* ═══ Right Sidebar ══════════════════════════════════════════════════ */}
        <aside className="space-y-4 lg:sticky lg:top-[4.5rem] lg:self-start">

          {/* ── Activity Stats ── */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">
                {language === 'mr' ? 'तुमची प्रगती' : language === 'hi' ? 'आपकी प्रगति' : 'Your Activity'}
              </h3>
            </div>

            {!hasActivity ? (
              <div className="text-center py-4">
                <TrendingUp className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  {language === 'mr'
                    ? 'अ‍ॅप वापरल्यानंतर इथे आकडेवारी दिसेल'
                    : language === 'hi'
                    ? 'ऐप उपयोग के बाद आंकड़े यहाँ दिखेंगे'
                    : 'Your usage stats will appear here after your first interaction'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: stats?.totalQuestions ?? 0, label: language === 'mr' ? 'प्रश्न' : language === 'hi' ? 'सवाल' : 'Questions', color: '#1d4ed8' },
                  { value: stats?.totalDocuments ?? 0,  label: language === 'mr' ? 'दस्तऐवज' : language === 'hi' ? 'दस्तावेज़' : 'Documents', color: '#0369a1' },
                  { value: stats?.rtiDrafts ?? 0,        label: 'RTI', color: '#d97706' },
                  { value: stats?.complaintDrafts ?? 0,  label: language === 'mr' ? 'तक्रारी' : language === 'hi' ? 'शिकायतें' : 'FIR Drafts', color: '#c2410c' },
                ].map(({ value, label, color }) => (
                  <div
                    key={label}
                    className="rounded-lg p-3 text-center"
                    style={{ background: '#f8f9fb', border: '1px solid #e8eaed' }}
                  >
                    <p className="text-xl font-bold mb-0.5" style={{ color, letterSpacing: '-0.03em' }}>
                      {value}
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            )}

            {stats?.lastActiveAt && (
              <div
                className="mt-3 pt-3 flex items-center gap-2"
                style={{ borderTop: '1px solid #e8eaed' }}
              >
                <Clock className="w-3 h-3 text-gray-400" />
                <p className="text-[10px] text-gray-400">
                  {language === 'mr' ? 'शेवटचे सक्रिय:' : language === 'hi' ? 'अंतिम सक्रिय:' : 'Last active:'}{' '}
                  {formatRelativeTime(stats.lastActiveAt)}
                </p>
              </div>
            )}
          </div>

          {/* ── India Tri-Color / NALSA ── */}
          <div className="card overflow-hidden">
            <div className="india-bar" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-800">
                  {language === 'mr' ? 'NALSA कायदेशीर सहाय्य'
                  : language === 'hi' ? 'NALSA कानूनी सहायता'
                  : 'NALSA Free Legal Aid'}
                </h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {language === 'mr'
                  ? 'पात्र नागरिकांसाठी मोफत कायदेशीर सेवा उपलब्ध आहेत.'
                  : language === 'hi'
                  ? 'योग्य नागरिकों के लिए मुफ्त कानूनी सेवाएं उपलब्ध हैं।'
                  : 'Free legal services available for eligible Indian citizens. Income-based eligibility.'}
              </p>
              <a
                href="https://nalsa.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs px-3 py-1.5 w-full justify-center"
              >
                nalsa.gov.in <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* ── Emergency Helplines ── */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700">{t(language, 'helplines')}</h3>
            </div>
            <div className="space-y-2.5">
              {HELPLINES.map(({ name, number, color }) => (
                <div key={number} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{name}</span>
                  <a
                    href={`tel:${number}`}
                    className="text-sm font-bold font-mono hover:underline transition-colors"
                    style={{ color }}
                  >
                    {number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* ── Trust Signal ── */}
          <div
            className="rounded-lg p-4 text-center"
            style={{ background: '#f8f9fb', border: '1px solid #e8eaed' }}
          >
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {language === 'mr'
                ? 'NyayaSathi सामान्य कायदेशीर माहिती प्रदान करते. हे कायदेशीर सल्ला नाही.'
                : language === 'hi'
                ? 'NyayaSathi सामान्य कानूनी जानकारी प्रदान करता है। यह कानूनी सलाह नहीं है।'
                : 'NyayaSathi provides general legal information only — not legal advice. Consult a qualified lawyer for your specific situation.'}
            </p>
          </div>

        </aside>
      </div>
    </div>
  );
}

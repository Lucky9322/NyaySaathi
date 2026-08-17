'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Scale, ChevronDown, Menu, X, Check } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { type Language } from '@/lib/translations';

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi',   native: 'हिंदी'   },
  { code: 'mr', label: 'Marathi', native: 'मराठी'   },
];

const NAV_LINKS = [
  { href: '/',          labelEn: 'Dashboard',       labelHi: 'डैशबोर्ड',    labelMr: 'डॅशबोर्ड'   },
  { href: '/chat',      labelEn: 'Ask AI',          labelHi: 'AI से पूछें', labelMr: 'AI विचारा'  },
  { href: '/rti',       labelEn: 'RTI Application', labelHi: 'RTI आवेदन',   labelMr: 'RTI अर्ज'   },
  { href: '/complaint', labelEn: 'Police Complaint', labelHi: 'FIR मसौदा',   labelMr: 'FIR मसुदा'  },
  { href: '/knowledge', labelEn: 'Know Your Rights', labelHi: 'अधिकार जानें', labelMr: 'हक्क जाणा' },
];

function navLabel(link: typeof NAV_LINKS[0], language: string) {
  if (language === 'hi') return link.labelHi;
  if (language === 'mr') return link.labelMr;
  return link.labelEn;
}

export default function Navbar() {
  const pathname  = usePathname();
  const { language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen,   setLangOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => { setMobileOpen(false); setLangOpen(false); }, [pathname]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0];

  return (
    <header
      id="navbar"
      className="sticky top-0 z-50 transition-shadow duration-200"
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-6 h-14">

          {/* ── Wordmark ── */}
          <Link
            href="/"
            id="navbar-logo"
            className="flex items-center gap-2.5 flex-shrink-0"
          >
            <div
              className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: '#1d4ed8' }}
            >
              <Scale className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-gray-900 text-[15px] tracking-tight">NyayaSathi</span>
              <span
                className="block text-[9px] font-medium tracking-widest uppercase"
                style={{ color: '#6b7280', letterSpacing: '0.12em' }}
              >
                Legal Companion
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.href.replace('/', '') || 'home'}`}
                  className={active ? 'nav-link-active' : 'nav-link'}
                >
                  {navLabel(link, language)}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button
                id="lang-toggle"
                onClick={() => setLangOpen(v => !v)}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                className="btn-ghost px-2.5 py-1.5 text-xs gap-1.5"
              >
                <span className="font-medium text-gray-600">{currentLang.native}</span>
                <ChevronDown
                  className={`w-3 h-3 text-gray-400 transition-transform duration-150 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {langOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-1 w-36 rounded-lg overflow-hidden z-50
                             border border-gray-200 bg-white fade-in"
                  style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                >
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={language === lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm text-left
                                  hover:bg-gray-50 transition-colors
                                  ${language === lang.code
                                    ? 'text-blue-700 bg-blue-50'
                                    : 'text-gray-700'}`}
                    >
                      <span>{lang.native}</span>
                      {language === lang.code && (
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(v => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
              className="md:hidden btn-ghost p-2"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-gray-100 py-2 px-4 space-y-0.5 fade-in"
          style={{ background: '#ffffff' }}
        >
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? 'nav-link-active block' : 'nav-link block'}
              >
                {navLabel(link, language)}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

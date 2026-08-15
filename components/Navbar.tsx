'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, MessageSquare, FileText, AlertCircle, BookOpen, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { t, Language } from '@/lib/translations';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇮🇳' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navItems = [
    { href: '/', label: t(language, 'home'), icon: Scale },
    { href: '/chat', label: t(language, 'chat'), icon: MessageSquare },
    { href: '/rti', label: t(language, 'rti'), icon: FileText },
    { href: '/complaint', label: t(language, 'complaint'), icon: AlertCircle },
    { href: '/knowledge', label: t(language, 'knowledge'), icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm leading-none block">
                {language === 'en' ? 'NyayaSathi' : 'न्यायसाथी'}
              </span>
              <span className="text-orange-400/70 text-[10px] leading-none">
                {t(language, 'appTagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={pathname === href ? 'nav-link-active' : 'nav-link'}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Language Selector + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-white/70 hover:text-white"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{LANGUAGES.find(l => l.code === language)?.label}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 glass rounded-xl border border-white/10 shadow-xl overflow-hidden z-50">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-white/10 transition-colors ${language === lang.code ? 'text-orange-400 bg-orange-500/10' : 'text-white/70'}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-white/5 flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={pathname === href ? 'nav-link-active' : 'nav-link'}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NyayaSathi — Your Legal Companion | न्यायसाथी',
  description:
    'Free multilingual legal assistance for Indian citizens. File RTI applications, get help with police complaints, know your consumer rights and fundamental rights in English, Hindi, and Marathi.',
  keywords:
    'RTI, FIR, consumer rights, legal aid India, fundamental rights, RTI application, police complaint, Marathi legal help, Hindi legal help, NyayaSathi',
  authors: [{ name: 'NyayaSathi' }],
  openGraph: {
    title: 'NyayaSathi — Your Legal Companion',
    description: 'Free multilingual legal assistance for Indian citizens.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className="h-full"
        style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
      >
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer
              className="px-6 py-4 text-center"
              style={{ borderTop: '1px solid #e5e7eb', background: '#ffffff' }}
            >
              <p className="text-[11px] text-gray-400 leading-relaxed">
                ⚠️ NyayaSathi provides general legal information only — not legal advice.
                Consult a qualified lawyer for your specific situation.
              </p>
              <p className="text-[11px] mt-1 text-gray-400">
                NALSA Free Legal Aid:{' '}
                <a href="tel:15100" className="text-blue-700 font-semibold hover:text-blue-900">15100</a>
                {' · '}
                Cybercrime:{' '}
                <a href="tel:1930" className="text-blue-700 font-semibold hover:text-blue-900">1930</a>
                {' · '}
                Police:{' '}
                <a href="tel:100" className="text-red-600 font-semibold hover:text-red-800">100</a>
              </p>
            </footer>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

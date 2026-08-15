import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NyayaSathi — Your Legal Companion | न्यायसाथी',
  description: 'Free multilingual legal assistance for Indian citizens. File RTI applications, get help with police complaints, know your consumer rights and fundamental rights in English, Hindi, and Marathi.',
  keywords: 'RTI, FIR, consumer rights, legal aid India, fundamental rights, RTI application, police complaint, Marathi legal help, Hindi legal help',
  authors: [{ name: 'NyayaSathi' }],
  openGraph: {
    title: 'NyayaSathi — Your Legal Companion',
    description: 'Free multilingual legal assistance for Indian citizens.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0d1a]">
        <LanguageProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <footer className="border-t border-white/5 py-6 text-center text-white/30 text-xs">
            <p>⚠️ NyayaSathi provides general legal information only, not legal advice. Consult a qualified lawyer for your specific situation.</p>
            <p className="mt-1">NALSA Free Legal Aid: <strong className="text-orange-400">15100</strong> | Cybercrime: <strong className="text-orange-400">1930</strong> | Police: <strong className="text-orange-400">100</strong></p>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}

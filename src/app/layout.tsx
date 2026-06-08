import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../index.css';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'DigiPowerX - Energy & Infrastructure Layer',
  description: 'DigiPowerX is an innovative energy infrastructure company that develops cutting-edge data centers to drive the expansion of sustainable energy assets.',
  metadataBase: new URL('https://digipowerx.com'),
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-dark-base text-white overflow-x-hidden antialiased" suppressHydrationWarning>
        <ScrollToTop />
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

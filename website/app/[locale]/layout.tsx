import { Inter, Cairo, Manrope, Almarai } from 'next/font/google';
import { routing } from '@/proxy';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import '../../styles/globals.css';

const inter   = Inter   ({ subsets: ['latin'],           variable: '--font-inter',   display: 'swap' });
const cairo   = Cairo   ({ subsets: ['arabic', 'latin'], variable: '--font-cairo',   display: 'swap' });
const manrope = Manrope ({ subsets: ['latin'],           variable: '--font-manrope', display: 'swap' });
const almarai = Almarai ({
  subsets: ['arabic'],
  weight:  ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default:  'TEDx Damascus',
    template: '%s | TEDx Damascus',
  },
  description: 'TEDx Damascus — independently organized TED event bringing ideas worth spreading from the heart of Syria.',
  openGraph: {
    title:       'TEDx Damascus',
    description: 'Ideas worth spreading from the heart of Syria.',
    siteName:    'TEDx Damascus',
    locale:      'en_US',
    type:        'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor:   '#101010',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body suppressHydrationWarning className={`${inter.variable} ${cairo.variable} ${manrope.variable} ${almarai.variable}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

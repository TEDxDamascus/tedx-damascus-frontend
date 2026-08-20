'use client';

import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';
import { NotFoundPage } from './NotFoundPage';
import en from '@/messages/en.json';
import ar from '@/messages/ar.json';

const TIME_ZONE = 'Asia/Damascus';
const NOW = new Date('2026-01-01T00:00:00.000Z');

function resolveLocale(pathname: string | null): 'en' | 'ar' {
  const first = pathname?.split('/').filter(Boolean)[0];
  return first === 'ar' ? 'ar' : 'en';
}

export function NotFoundShell() {
  const pathname = usePathname();
  const locale = resolveLocale(pathname);
  const messages = locale === 'ar' ? ar : en;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={TIME_ZONE}
      now={NOW}
    >
      <NotFoundPage locale={locale} />
    </NextIntlClientProvider>
  );
}

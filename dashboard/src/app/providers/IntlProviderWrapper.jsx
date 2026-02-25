import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { selectLocale } from '../store/localeSlice';
import { messages } from '../../locales';

export default function IntlProviderWrapper({ children }) {
  const locale = useSelector(selectLocale);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', locale === 'ar' ? 'ar' : 'en');
  }, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="ar">
      {children}
    </IntlProvider>
  );
}

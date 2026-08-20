import { Inter, Cairo, Manrope, Almarai } from 'next/font/google';
import { NotFoundShell } from '@/components/not-found/NotFoundShell';
// Root not-found renders outside [locale]/layout, so it must load styles itself.
// @ts-expect-error CSS side-effect import has no type declarations
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
  display: 'swap',
});

export default function NotFound() {
  return (
    <div className={`${inter.variable} ${cairo.variable} ${manrope.variable} ${almarai.variable}`}>
      <NotFoundShell />
    </div>
  );
}

import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';

interface FormHeroProps {
  locale: string;
  backgroundImage: string;
  /** Form type drives gradient tint */
  formType: 'attendee' | 'speaker' | 'volunteer' | 'generic';
  title: React.ReactNode;
}

const TINTS: Record<FormHeroProps['formType'], string> = {
  attendee:  'from-[#101010] via-[#101010]/70 to-[#101010]/25',
  speaker:   'from-[#101010] via-[#1a0a0a]/70 to-[#1a0a0a]/25',
  volunteer: 'from-[#101010] via-[#0a0a14]/60 to-transparent',
  generic:   'from-[#101010] via-[#101010]/70 to-[#101010]/25',
};

export function FormHero({ locale, backgroundImage, formType, title }: FormHeroProps) {
  return (
    <section className="relative h-[420px] md:h-[500px] overflow-hidden">
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      {/* Gradient overlay — darkens from bottom */}
      <div className={`absolute inset-0 bg-gradient-to-t ${TINTS[formType]}`} />

      {/* Red decorative line (top-right) */}
      <div
        className="absolute top-0 right-0 w-[200px] h-[200px] opacity-40 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 60%, rgba(235,0,40,0.15) 100%)',
        }}
      />

      {/* Navbar sits over the hero */}
      <Navbar locale={locale} />

      {/* Centered title */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: '4.5rem' }}>
        <div className="text-center px-6">
          {title}
        </div>
      </div>
    </section>
  );
}

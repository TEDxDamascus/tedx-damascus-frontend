'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout';
import { partnersApi, type PartnerData } from '@/lib/api/partners';
import { mapPartnerToDetailsView } from '@/mappers/partner.mapper';
import { normalizePartnerSlug, resolvePartnerSlug } from '@/lib/partner-slug';
import PartnerDetails from '@/components/partner/PartnerDetails';

interface PartnerDetailClientProps {
  locale: string;
}

function matchPartner(partners: PartnerData[], slug: string): PartnerData | undefined {
  const want = normalizePartnerSlug(slug);
  if (!want) return undefined;

  return partners.find((partner) => {
    if (String(partner._id) === want) return true;
    const en = partner.slug?.en ? normalizePartnerSlug(partner.slug.en) : '';
    const ar = partner.slug?.ar ? normalizePartnerSlug(partner.slug.ar) : '';
    const nameEn = typeof partner.name === 'object' ? partner.name.en : partner.name;
    const nameMatch = nameEn ? normalizePartnerSlug(nameEn) === want : false;
    return en === want || ar === want || nameMatch;
  });
}

export function PartnerDetailClient({ locale }: PartnerDetailClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ slug?: string }>();
  const slug = resolvePartnerSlug(pathname, searchParams.get('slug'), params.slug);
  const lang = locale === 'ar' ? 'ar' : 'en';

  const [partner, setPartner] = useState<PartnerData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setPartner(undefined);
      setLoading(false);
      return;
    }

    setLoading(true);
    partnersApi
      .getAll({ limit: 500 })
      .then((res) => {
        const list: PartnerData[] = Array.isArray(res)
          ? res
          : ((res as { data?: PartnerData[] })?.data ?? []);
        setPartner(matchPartner(list, slug));
      })
      .catch(() => setPartner(undefined))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#101010]">
        <Navbar locale={locale} />
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="animate-pulse font-helvetica text-white/50">Loading...</span>
        </div>
      </main>
    );
  }

  if (!partner) {
    return (
      <main className="min-h-screen bg-[#101010]">
        <Navbar locale={locale} />
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="font-helvetica text-white/50">
            Could not load partner. Please try again later.
          </span>
        </div>
      </main>
    );
  }

  return (
    <PartnerDetails
      locale={lang}
      slug={slug}
      partner={mapPartnerToDetailsView(partner, lang)}
    />
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import {
  formatOrganizer,
  getOrganizerById,
  type OrganizerViewData,
} from '@/lib/api/organizers';
import { resolveOrganizerId } from '@/lib/organizer-id';
import OrganizerDetails from './OrganizerDetails';

interface OrganizerDetailClientProps {
  locale: string;
}

export function OrganizerDetailClient({ locale }: OrganizerDetailClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams<{ id?: string }>();
  const id = resolveOrganizerId(pathname, searchParams.get('id'), params.id);
  const lang = locale === 'ar' ? 'ar' : 'en';

  const [organizer, setOrganizer] = useState<OrganizerViewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setOrganizer(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getOrganizerById(id, lang)
      .then((raw) => {
        setOrganizer(raw ? formatOrganizer(raw, lang) : null);
      })
      .catch(() => setOrganizer(null))
      .finally(() => setLoading(false));
  }, [id, lang]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col bg-[#101010]">
        <Navbar locale={locale} />
        <div className="flex flex-1 items-center justify-center">
          <span className="animate-pulse font-helvetica text-white/50">Loading...</span>
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="flex min-h-[60vh] flex-col bg-[#101010]">
        <Navbar locale={locale} />
        <div className="flex flex-1 items-center justify-center">
          <span className="font-helvetica text-white/50">
            Could not load organizer. Please try again later.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar locale={locale} />
      <OrganizerDetails organizer={organizer} locale={locale} />
    </>
  );
}

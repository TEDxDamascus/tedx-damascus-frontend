import { redirect } from 'next/navigation';
import { CAMPAIGN_FORM_PATHS } from '@/lib/forms-routes';

// Bare campaign URLs with no locale segment
// (e.g. https://tedxdamascus.sy/forms/Attender/2026/attendees) have no [locale]
// to match against app/[locale]/forms, so without this route they'd fall
// through to the root not-found handler. Forms are Arabic-only, so this
// redirects straight to the /ar variant.
export function generateStaticParams() {
  return CAMPAIGN_FORM_PATHS.map(({ type, year, formSlug }) => ({
    slug: type,
    year,
    formSlug,
  }));
}

export default async function BareCampaignFormRedirect({
  params,
}: {
  params: Promise<{ slug: string; year: string; formSlug: string }>;
}) {
  const { slug, year, formSlug } = await params;
  redirect(`/ar/forms/${slug}/${year}/${formSlug}`);
}

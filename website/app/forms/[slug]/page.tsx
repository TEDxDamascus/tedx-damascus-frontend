import { redirect } from 'next/navigation';
import { FORM_SLUGS } from '@/lib/forms-routes';

// Bare URLs with no locale segment (e.g. https://tedxdamascus.sy/forms/attendee)
// have no [locale] to match against app/[locale]/forms, so without this route
// they'd fall through to the root not-found handler. Forms are Arabic-only,
// so this redirects straight to the /ar variant.
export function generateStaticParams() {
  return FORM_SLUGS.map((slug) => ({ slug }));
}

export default async function BareFormRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/ar/forms/${slug}`);
}

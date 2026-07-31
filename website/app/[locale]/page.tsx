import { redirect } from "next/navigation";

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function LocaleRootPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/home`);
}

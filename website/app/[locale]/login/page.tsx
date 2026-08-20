import { Suspense } from "react";
import { Navbar, Footer } from "@/components/layout";
import LoginForm from "@/components/auth/LoginForm";
import { routing } from "@/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LoginPageProps {
  params: Promise<{ locale: "en" | "ar" }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-[#101010]">
      <Navbar locale={locale} />
      <Suspense fallback={null}>
        <LoginForm locale={locale} />
      </Suspense>
      <Footer locale={locale} />
    </main>
  );
}

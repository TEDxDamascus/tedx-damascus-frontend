"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/client";

interface LoginFormProps {
  locale: "en" | "ar";
}

function extractToken(res: any): string | null {
  return (
    res?.data?.token ??
    res?.token ??
    res?.data?.accessToken ??
    res?.accessToken ??
    null
  );
}

// Redirect target must stay inside the site — otherwise this becomes an
// open redirect via ?redirect=https://evil.example.
function safeRedirect(raw: string | null, fallback: string): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return fallback;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const isRtl = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res: any = await authApi.login(email, password);
      const token = extractToken(res);
      if (!token) throw new Error("No token in response");

      localStorage.setItem("token", token);
      const target = safeRedirect(searchParams.get("redirect"), `/${locale}/organizers`);
      router.push(target);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (isRtl ? "فشل تسجيل الدخول. تحقق من بياناتك." : "Login failed. Check your credentials."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="min-h-[70vh] flex items-center justify-center px-6 sm:px-12"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] flex flex-col gap-6 py-24"
      >
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold text-primary tracking-[2.4px] uppercase font-helvetica">
            {isRtl ? "تسجيل الدخول" : "SIGN IN"}
          </p>
          <h1
            className={[
              "text-white font-light text-3xl sm:text-4xl leading-[1.2]",
              isRtl ? "font-arabic text-right" : "font-helvetica",
            ].join(" ")}
          >
            {isRtl ? "مرحبًا بعودتك" : "Welcome back"}
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-white/40 tracking-[1.2px] uppercase font-helvetica">
              {isRtl ? "البريد الإلكتروني" : "Email"}
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/20 px-4 py-3 text-white text-sm font-helvetica outline-none focus:border-primary transition-colors"
              dir="ltr"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold text-white/40 tracking-[1.2px] uppercase font-helvetica">
              {isRtl ? "كلمة المرور" : "Password"}
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/20 px-4 py-3 text-white text-sm font-helvetica outline-none focus:border-primary transition-colors"
              dir="ltr"
            />
          </label>
        </div>

        {error && (
          <p className="text-red-400 text-xs font-helvetica" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white text-[12px] font-semibold tracking-[1.2px] uppercase font-helvetica py-3 disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? (isRtl ? "جارٍ الدخول…" : "Signing in…") : isRtl ? "دخول" : "Log in"}
        </button>
      </form>
    </section>
  );
}

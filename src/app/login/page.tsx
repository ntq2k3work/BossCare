"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { BrandMark } from "@/components/ui/pet-ui";

function PawLogo({ slogan }: { slogan: string }) {
  return <BrandMark showSlogan slogan={slogan} />;
}

function FloatingPaw({ className }: { className: string }) {
  return (
    <div className={`absolute h-12 w-12 rotate-12 text-violet-200/55 ${className}`} aria-hidden="true">
      <span className="absolute left-[17px] top-[20px] h-6 w-7 rounded-[50%_50%_55%_55%] bg-current" />
      <span className="absolute left-[5px] top-[16px] h-4 w-4 rounded-full bg-current" />
      <span className="absolute left-[14px] top-[4px] h-4.5 w-4 rounded-full bg-current" />
      <span className="absolute left-[27px] top-[4px] h-4.5 w-4 rounded-full bg-current" />
      <span className="absolute left-[36px] top-[16px] h-4 w-4 rounded-full bg-current" />
    </div>
  );
}

function LineIcon({ children, tone }: { children: ReactNode; tone: "violet" | "green" | "amber" }) {
  const tones = {
    violet: "bg-violet-600",
    green: "bg-emerald-500",
    amber: "bg-amber-400",
  };

  return <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-white ${tones[tone]}`}>{children}</span>;
}

function EyeIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 6h16v12H4V6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.44 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { copy, locale } = useI18n();
  const auth = copy.auth.login;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);
    if (!response.ok) {
      setError(auth.invalidCredentials);
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <main className="relative min-h-screen bg-[#f8f7ff] px-4 py-4 text-slate-950 md:h-screen md:overflow-hidden md:px-6">
      <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
        <LanguageSwitcher />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_29%_40%,rgba(124,58,237,0.08),transparent_33%),radial-gradient(circle_at_72%_12%,rgba(255,255,255,0.92),transparent_28%)]" />
      <section className="relative mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1470px] grid-cols-1 gap-6 lg:grid-cols-[1fr_600px]">
        <div className="relative hidden min-h-[calc(100vh-2rem)] overflow-hidden lg:block">
          <div className="pt-3">
            <PawLogo slogan={copy.brand.slogan} />
          </div>

          <FloatingPaw className="right-[180px] top-[58px]" />
          <FloatingPaw className="right-[160px] top-[390px] scale-75" />

          <div className="mt-16 max-w-[560px] 2xl:mt-24">
            <h1 className="text-[36px] font-extrabold leading-[1.25] tracking-[-0.02em] text-slate-950 2xl:text-[42px]">
              {auth.heroTitle1}
              <br />
              {auth.heroTitle2}
            </h1>
            <p className="mt-5 max-w-[500px] text-[17px] leading-[1.65] text-slate-600 2xl:mt-8 2xl:text-[19px]">
              {auth.heroDescription}
            </p>
          </div>

          <div className="absolute bottom-[50px] left-[-30px] h-[300px] w-[440px] rounded-full bg-[#d8c5ff] 2xl:bottom-0 2xl:h-[480px] 2xl:w-[560px]" />
          <img
            src="https://images.unsplash.com/photo-1744207503498-a0218ad58ff8?auto=format&fit=crop&w=680&q=88"
            alt={locale === "vi" ? "Chó corgi vui vẻ" : "Happy corgi"}
            className="absolute bottom-[88px] left-[48px] h-[250px] w-[205px] object-cover object-center [clip-path:ellipse(46%_50%_at_50%_50%)] 2xl:bottom-[84px] 2xl:left-[34px] 2xl:h-[430px] 2xl:w-[342px]"
          />
          <img
            src="https://images.unsplash.com/photo-1775643063566-703f22da6adc?auto=format&fit=crop&w=520&q=88"
            alt={locale === "vi" ? "Mèo tabby ngồi cạnh chó" : "Tabby cat beside a dog"}
            className="absolute bottom-[96px] left-[230px] h-[178px] w-[125px] object-cover object-center [clip-path:ellipse(45%_50%_at_50%_50%)] 2xl:bottom-[92px] 2xl:left-[318px] 2xl:h-[305px] 2xl:w-[210px]"
          />

          <div className="absolute bottom-[320px] left-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-200 bg-white/85 text-violet-600 shadow-[0_10px_25px_rgba(79,70,229,0.12)] 2xl:bottom-[420px] 2xl:h-14 2xl:w-14">
            <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
              <path d="M12 3 4.5 6v5.5c0 4.1 3 7.4 7.5 9.5 4.5-2.1 7.5-5.4 7.5-9.5V6L12 3Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="m8.5 12 2.2 2.2 4.8-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <div className="absolute bottom-[300px] left-[385px] flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-violet-600 shadow-[0_10px_25px_rgba(15,23,42,0.12)] 2xl:bottom-[394px] 2xl:left-[515px] 2xl:h-14 2xl:w-14">
            <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
              <path d="M7 3v4M17 3v4M4.5 9h15M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>
          <div className="absolute bottom-[195px] left-[330px] flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-pink-500 shadow-[0_10px_25px_rgba(15,23,42,0.12)] 2xl:bottom-[270px] 2xl:left-[470px] 2xl:h-16 2xl:w-16">
            <svg aria-hidden="true" className="h-8 w-8" fill="none" viewBox="0 0 24 24">
              <path d="M20.5 9.5c0 5.2-8.5 10-8.5 10s-8.5-4.8-8.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 2.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              <path d="M8 12h2l1.2-2.4 2 5L15 12h1.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </div>

          <div className="absolute bottom-0 left-[-16px] flex w-[570px] items-center justify-between rounded-xl border border-slate-200/80 bg-white/95 px-4 py-3 text-xs text-slate-600 shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur 2xl:w-[610px] 2xl:px-5 2xl:py-4 2xl:text-sm">
            <span className="flex items-center gap-3">
              <LineIcon tone="violet">
                <MailIcon />
              </LineIcon>
              {auth.safeStorage}
            </span>
            <span className="flex items-center gap-3">
              <LineIcon tone="green">
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path d="M7 3v4M17 3v4M5 8h14M5 5h14v15H5V5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </LineIcon>
              {auth.smartReminders}
            </span>
            <span className="flex items-center gap-3">
              <LineIcon tone="amber">
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <path d="M12 3 5 7v7c0 3 2.2 5.6 7 7 4.8-1.4 7-4 7-7V7l-7-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                  <path d="M9.5 13.5 12 9l2.5 4.5M10.4 12h3.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                </svg>
              </LineIcon>
              {auth.aiGuidance}
            </span>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-2rem)] flex-col items-center justify-center">
          <div className="mb-4 lg:hidden">
            <PawLogo slogan={copy.brand.slogan} />
          </div>

          <form
            onSubmit={onSubmit}
            className="w-full max-w-[600px] rounded-2xl bg-white/95 px-6 py-6 shadow-[0_22px_55px_rgba(15,23,42,0.08)] ring-1 ring-white sm:px-12 md:py-8"
          >
            <div className="text-center">
              <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-slate-950">{auth.welcomeBack}</h2>
              <p className="mt-3 text-[14px] text-slate-500">{auth.signInToContinue}</p>
            </div>

            <div className="mt-7 grid gap-4">
              <label className="grid gap-3 text-[15px] font-semibold text-slate-950">
                {auth.email}
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={auth.emailPlaceholder}
                  className="h-12 w-full rounded-lg border border-slate-300 bg-white px-5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <label className="grid gap-3 text-[15px] font-semibold text-slate-950">
                {auth.password}
                <span className="relative">
                  <input
                    name="password"
                    type="password"
                    aria-label={auth.password}
                    required
                    placeholder={auth.passwordPlaceholder}
                    className="h-12 w-full rounded-lg border border-slate-300 bg-white px-5 pr-12 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500">
                    <EyeIcon />
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-4 text-right">
              <Link href="/login" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                {auth.forgotPassword}
              </Link>
            </div>

            {error ? <p className="mt-4 rounded-lg bg-rose-50 px-4 py-2 text-sm text-rose-600">{error}</p> : null}

            <button
              type="submit"
              aria-label={auth.signInButton}
              disabled={loading || !ready}
              className="mt-5 h-12 w-full rounded-lg bg-violet-600 text-base font-bold text-white shadow-[0_12px_24px_rgba(109,40,217,0.22)] transition hover:bg-violet-700 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? auth.signingIn : auth.signInButton}
            </button>

            <div className="my-5 flex items-center gap-6 text-sm text-slate-500">
              <span className="h-px flex-1 bg-slate-200" />
              {auth.or}
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid gap-4">
              <button
                type="button"
                onClick={() => setError(auth.googleDisabled)}
                className="flex h-12 w-full items-center justify-center gap-4 rounded-lg border border-slate-300 bg-white text-[15px] font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <GoogleIcon />
                {auth.googleDisabled}
              </button>
              <button
                type="button"
                onClick={() => setError(auth.magicLinkDisabled)}
                className="flex h-12 w-full items-center justify-center gap-4 rounded-lg border border-slate-300 bg-white text-[15px] font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <MailIcon />
                {auth.magicLinkDisabled}
              </button>
            </div>

            <p className="mt-6 text-center text-[15px] text-slate-500">
              {auth.noAccount}{" "}
              <Link href="/register" className="font-bold text-violet-600 hover:text-violet-700">
                {auth.signUpNow}
              </Link>
            </p>
          </form>

          <footer className="mt-4 text-center text-xs text-slate-500 md:text-sm">
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2">
              <Link href="/login" className="hover:text-slate-800">
                {auth.terms}
              </Link>
              <span>•</span>
              <Link href="/login" className="hover:text-slate-800">
                {auth.privacy}
              </Link>
              <span>•</span>
              <Link href="/login" className="hover:text-slate-800">
                {auth.help}
              </Link>
            </div>
            <p className="mt-3">{auth.rights}</p>
          </footer>
        </div>
      </section>
    </main>
  );
}

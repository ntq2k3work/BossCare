"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { BrandMark, Button, Card, fieldClass, labelClass } from "@/components/ui/pet-ui";

type RegistrationDraft = {
  email: string;
  displayName: string;
  householdName: string;
  password: string;
  passwordConfirm: string;
};

export default function RegisterPage() {
  const { copy } = useI18n();
  const auth = copy.auth.register;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<"details" | "otp">("details");
  const [draft, setDraft] = useState<RegistrationDraft | null>(null);
  const [devOtp, setDevOtp] = useState("");

  useEffect(() => {
    setReady(true);
  }, []);

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setDevOtp("");

    const form = new FormData(event.currentTarget);
    const nextDraft = {
      email: String(form.get("email") ?? ""),
      displayName: String(form.get("displayName") ?? ""),
      householdName: String(form.get("householdName") ?? ""),
      password: String(form.get("password") ?? ""),
      passwordConfirm: String(form.get("passwordConfirm") ?? ""),
    };

    if (nextDraft.password !== nextDraft.passwordConfirm) {
      setError(auth.mismatchPassword);
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/register/otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(nextDraft),
    });

    setLoading(false);
    if (!response.ok) {
      setError(auth.sendOtpError);
      return;
    }

    const body = await response.json();
    setDraft(nextDraft);
    setDevOtp(body.devOtp ?? "");
    setStep("otp");
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;

    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: draft.email,
        otp: form.get("otp"),
      }),
    });

    setLoading(false);
    if (!response.ok) {
      setError(auth.verifyError);
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <main className="relative min-h-screen bg-[var(--bc-bg)] px-5 py-8 text-slate-900">
      <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
        <LanguageSwitcher />
      </div>
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_520px]">
        <div className="hidden space-y-9 lg:block">
          <BrandMark showSlogan slogan={copy.brand.slogan} />
          <div className="max-w-lg">
            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.055em] text-[var(--bc-ink)]">{copy.brand.slogan}</h1>
            <p className="mt-4 text-lg leading-8 text-[var(--bc-muted)]">{auth.heroDescription}</p>
          </div>
        </div>
        <Card>
          {step === "details" ? (
            <form onSubmit={requestOtp} className="grid gap-5">
              <div className="space-y-2">
                <div className="lg:hidden">
                  <BrandMark slogan={copy.brand.slogan} />
                </div>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-[var(--bc-ink)]">{auth.signUpTitle}</h2>
                <p className="text-sm text-[var(--bc-muted)]">{auth.signUpDescription}</p>
              </div>
              <label className={labelClass}>
                {auth.email}
                <input name="email" type="email" required placeholder={auth.emailPlaceholder} className={fieldClass} />
              </label>
              <label className={labelClass}>
                {auth.displayName}
                <input name="displayName" required minLength={2} className={fieldClass} />
              </label>
              <label className={labelClass}>
                {auth.householdName}
                <input name="householdName" placeholder={auth.householdPlaceholder} className={fieldClass} />
              </label>
              <label className={labelClass}>
                {auth.password}
                <input name="password" type="password" required minLength={8} className={fieldClass} />
              </label>
              <label className={labelClass}>
                {auth.confirmPassword}
                <input name="passwordConfirm" type="password" required minLength={8} className={fieldClass} />
              </label>
              {error ? <p className="rounded-[var(--bc-radius-sm)] bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
              <Button disabled={loading || !ready}>{loading ? auth.requestingOtp : auth.requestOtp}</Button>
              <Link href="/login" className="text-center text-sm font-medium text-[var(--bc-accent)] hover:text-[var(--bc-accent-active)]">
                {auth.haveAccount}
              </Link>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="grid gap-5">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-[-0.04em] text-[var(--bc-ink)]">{auth.verifyEmailTitle}</h2>
                <p className="text-sm text-[var(--bc-muted)]">{auth.verifyEmailDescription(draft?.email ?? "")}</p>
              </div>
              <label className={labelClass}>
                {auth.otp}
                <input name="otp" inputMode="numeric" pattern="[0-9]{6}" required minLength={6} maxLength={6} className={fieldClass} />
              </label>
              {devOtp ? (
                <p className="rounded-[var(--bc-radius-sm)] bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  {auth.devOtp} <strong>{devOtp}</strong>
                </p>
              ) : null}
              {error ? <p className="rounded-[var(--bc-radius-sm)] bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
              <Button disabled={loading || !ready}>{loading ? auth.verifying : auth.verifyAndCreate}</Button>
              <button type="button" onClick={() => setStep("details")} className="text-center text-sm font-medium text-slate-500 hover:text-slate-700">
                {auth.backToDetails}
              </button>
            </form>
          )}
        </Card>
      </section>
    </main>
  );
}

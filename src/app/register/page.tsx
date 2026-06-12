"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { BrandMark, Button, Card, fieldClass, labelClass } from "@/components/ui/pet-ui";

type RegistrationDraft = {
  email: string;
  displayName: string;
  householdName: string;
  password: string;
  passwordConfirm: string;
};

export default function RegisterPage() {
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
      setError("Mat khau xac nhan khong khop.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/register/otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(nextDraft),
    });

    setLoading(false);
    const body = await response.json();
    if (!response.ok) {
      setError(body.error?.message ?? "Could not send verification code.");
      return;
    }

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
      const body = await response.json();
      setError(body.error?.message ?? "Could not verify email.");
      return;
    }

    window.location.assign("/app");
  }

  return (
    <main className="min-h-screen bg-[#f7f7ff] px-5 py-8 text-slate-900">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_460px]">
        <div className="hidden space-y-8 lg:block">
          <BrandMark />
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">Tao nha cham soc rieng.</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Moi tai khoan co household mac dinh, plan starter va luong ghi chep suc khoe co san.
            </p>
          </div>
        </div>
        <Card>
          {step === "details" ? (
            <form onSubmit={requestOtp} className="grid gap-5">
              <div className="space-y-2">
                <div className="lg:hidden">
                  <BrandMark />
                </div>
                <h2 className="text-2xl font-bold text-slate-950">Dang ky</h2>
                <p className="text-sm text-slate-500">Nhap thong tin, sau do xac thuc OTP qua email.</p>
              </div>
              <label className={labelClass}>
                Email
                <input name="email" type="email" required placeholder="name@email.com" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Ten hien thi
                <input name="displayName" required minLength={2} className={fieldClass} />
              </label>
              <label className={labelClass}>
                Ten ho gia dinh
                <input name="householdName" placeholder="Nguyen household" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Mat khau
                <input name="password" type="password" required minLength={8} className={fieldClass} />
              </label>
              <label className={labelClass}>
                Xac nhan mat khau
                <input name="passwordConfirm" type="password" required minLength={8} className={fieldClass} />
              </label>
              {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
              <Button disabled={loading || !ready}>{loading ? "Dang gui OTP..." : "Gui ma OTP"}</Button>
              <Link href="/login" className="text-center text-sm font-medium text-violet-600 hover:text-violet-700">
                Da co tai khoan? Dang nhap
              </Link>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="grid gap-5">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-950">Xac thuc email</h2>
                <p className="text-sm text-slate-500">Nhap ma OTP 6 so da gui den {draft?.email}.</p>
              </div>
              <label className={labelClass}>
                Ma OTP
                <input name="otp" inputMode="numeric" pattern="[0-9]{6}" required minLength={6} maxLength={6} className={fieldClass} />
              </label>
              {devOtp ? (
                <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-700">
                  Dev OTP: <strong>{devOtp}</strong>
                </p>
              ) : null}
              {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
              <Button disabled={loading || !ready}>{loading ? "Dang xac thuc..." : "Xac thuc va tao tai khoan"}</Button>
              <button type="button" onClick={() => setStep("details")} className="text-center text-sm font-medium text-slate-500 hover:text-slate-700">
                Sua thong tin dang ky
              </button>
            </form>
          )}
        </Card>
      </section>
    </main>
  );
}

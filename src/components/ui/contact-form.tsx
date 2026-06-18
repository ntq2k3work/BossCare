"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button, fieldClass, labelClass } from "./pet-ui";

type ContactFormCopy = {
  name: string;
  email: string;
  role: string;
  message: string;
  submit: string;
  success: string;
  helper: string;
};

export function ContactForm({ copy, locale }: { copy: ContactFormCopy; locale: "vi" | "en" }) {
  const [sent, setSent] = useState(false);
  const subject = useMemo(
    () => encodeURIComponent(locale === "vi" ? "Tư vấn BossCare" : "BossCare consultation"),
    [locale],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = encodeURIComponent(
      [
        `${copy.name}: ${form.get("name") ?? ""}`,
        `${copy.email}: ${form.get("email") ?? ""}`,
        `${copy.role}: ${form.get("role") ?? ""}`,
        "",
        `${copy.message}:`,
        String(form.get("message") ?? ""),
      ].join("\n"),
    );

    setSent(true);
    window.location.href = `mailto:contact@bosscare.app?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" aria-label={locale === "vi" ? "Form liên hệ BossCare" : "BossCare contact form"}>
      <label className={labelClass}>
        {copy.name}
        <input name="name" required minLength={2} className={fieldClass} autoComplete="name" />
      </label>
      <label className={labelClass}>
        {copy.email}
        <input name="email" type="email" required className={fieldClass} autoComplete="email" />
      </label>
      <label className={labelClass}>
        {copy.role}
        <select name="role" required className={fieldClass} defaultValue="">
          <option value="" disabled>
            {locale === "vi" ? "Chọn nhu cầu" : "Choose a need"}
          </option>
          <option value="busy-owner">{locale === "vi" ? "Chủ nuôi bận rộn" : "Busy owner"}</option>
          <option value="multi-pet-household">{locale === "vi" ? "Gia đình nhiều pet" : "Multi-pet household"}</option>
          <option value="first-time-owner">{locale === "vi" ? "Người mới nuôi pet" : "First-time owner"}</option>
          <option value="clinic-partner">{locale === "vi" ? "Đối tác/phòng khám" : "Partner or clinic"}</option>
        </select>
      </label>
      <label className={labelClass}>
        {copy.message}
        <textarea name="message" required minLength={10} rows={5} className={`${fieldClass} resize-none py-3`} />
      </label>
      <Button type="submit" className="min-h-12 cursor-pointer">
        {copy.submit}
      </Button>
      <p className="text-xs leading-5 text-[var(--bc-muted)]">{sent ? copy.success : copy.helper}</p>
    </form>
  );
}

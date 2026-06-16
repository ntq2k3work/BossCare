"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CheckIn } from "@/lib/checkins/types";
import { formatDateTime } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Button, Card, EmptyState, fieldClass, labelClass } from "@/components/ui/pet-ui";

type Props = {
  petId: string;
  checkIns: CheckIn[];
};

function dateTimeLocal(value: string) {
  return value.slice(0, 16);
}

export function CheckInControls({ petId, checkIns }: Props) {
  const router = useRouter();
  const { copy, locale } = useI18n();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const target = event.currentTarget;
    const form = new FormData(target);
    const storageKey = String(form.get("storageKey") ?? "").trim();
    const byteSize = Number(form.get("byteSize") ?? 0);
    const media = storageKey
      ? {
          storageKey,
          mimeType: form.get("mimeType"),
          byteSize,
        }
      : null;
    const response = await fetch(`/api/pets/${petId}/checkins`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        occurredAt: new Date(String(form.get("occurredAt"))).toISOString(),
        mood: form.get("mood"),
        note: form.get("note"),
        media,
      }),
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? copy.checkins.saveError);
      return;
    }
    target.reset();
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <Card>
        <h2 className="text-lg font-bold text-slate-950">{copy.checkins.addCheckIn}</h2>
        <form onSubmit={submit} className="mt-5 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              {copy.checkins.time}
              <input name="occurredAt" type="datetime-local" required defaultValue={dateTimeLocal(new Date().toISOString())} className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.checkins.mood}
              <input name="mood" placeholder={locale === "vi" ? "Vui vẻ" : "Playful"} className={fieldClass} />
            </label>
          </div>
          <label className={labelClass}>
            {copy.checkins.note}
            <textarea name="note" className={`${fieldClass} min-h-24`} />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className={labelClass}>
              {copy.checkins.mediaStorageKey}
              <input name="storageKey" placeholder="demo/milo.webp" className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.checkins.mimeType}
              <select name="mimeType" className={fieldClass}>
                <option value="image/jpeg">image/jpeg</option>
                <option value="image/png">image/png</option>
                <option value="image/webp">image/webp</option>
              </select>
            </label>
            <label className={labelClass}>
              {copy.checkins.byteSize}
              <input name="byteSize" type="number" min="1" defaultValue={1024} className={fieldClass} />
            </label>
          </div>
          {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
          <Button disabled={!ready} className="w-fit">
            {copy.checkins.addCheckIn}
          </Button>
        </form>
      </Card>

      <section className="grid gap-3">
        {checkIns.length ? (
          checkIns.map((checkIn) => (
            <Card key={checkIn.id} className="grid gap-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-bold text-slate-950">{checkIn.mood || copy.checkins.title}</p>
                <p className="text-sm text-slate-500">{formatDateTime(locale, checkIn.occurredAt)}</p>
              </div>
              {checkIn.note ? <p className="text-sm text-slate-600">{checkIn.note}</p> : null}
              {checkIn.mediaAssets.length ? (
                <p className="text-sm text-slate-500">
                  {copy.checkins.media} {checkIn.mediaAssets[0].storageKey} ({checkIn.mediaAssets[0].mimeType})
                </p>
              ) : null}
            </Card>
          ))
        ) : (
          <EmptyState title={copy.checkins.noCheckInsTitle} description={copy.checkins.noCheckInsDescription} />
        )}
      </section>
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CheckIn } from "@/lib/checkins/types";

type Props = {
  petId: string;
  checkIns: CheckIn[];
};

function dateTimeLocal(value: string) {
  return value.slice(0, 16);
}

export function CheckInControls({ petId, checkIns }: Props) {
  const router = useRouter();
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
      setError(result.error?.message ?? "Could not save check-in.");
      return;
    }
    target.reset();
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-md border border-foreground/15 p-5">
        <h2 className="text-xl font-semibold">Add check-in</h2>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Occurred at
              <input name="occurredAt" type="datetime-local" required defaultValue={dateTimeLocal(new Date().toISOString())} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
            <label className="grid gap-2 text-sm">
              Mood
              <input name="mood" placeholder="Playful" className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Note
            <textarea name="note" className="min-h-24 rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm">
              Media storage key
              <input name="storageKey" placeholder="demo/milo.webp" className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
            <label className="grid gap-2 text-sm">
              MIME type
              <select name="mimeType" className="rounded-md border border-foreground/20 bg-background px-3 py-3">
                <option value="image/jpeg">image/jpeg</option>
                <option value="image/png">image/png</option>
                <option value="image/webp">image/webp</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Byte size
              <input name="byteSize" type="number" min="1" defaultValue="1024" className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
          </div>
          {error ? <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
          <button disabled={!ready} className="w-fit rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
            Add check-in
          </button>
        </form>
      </section>

      <section className="grid gap-3">
        {checkIns.length ? (
          checkIns.map((checkIn) => (
            <article key={checkIn.id} className="grid gap-2 rounded-md border border-foreground/15 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-semibold">{checkIn.mood || "Check-in"}</p>
                <p className="text-sm text-foreground/60">{new Date(checkIn.occurredAt).toLocaleString()}</p>
              </div>
              {checkIn.note ? <p className="text-sm text-foreground/75">{checkIn.note}</p> : null}
              {checkIn.mediaAssets.length ? (
                <p className="text-sm text-foreground/60">
                  Media: {checkIn.mediaAssets[0].storageKey} ({checkIn.mediaAssets[0].mimeType})
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-md border border-foreground/15 p-4 text-sm text-foreground/60">
            No check-ins yet.
          </p>
        )}
      </section>
    </div>
  );
}

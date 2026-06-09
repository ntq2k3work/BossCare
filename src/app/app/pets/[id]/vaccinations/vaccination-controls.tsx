"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { VaccinationRecord } from "@/lib/vaccinations/types";

type Props = {
  petId: string;
  records: VaccinationRecord[];
};

function statusLabel(status: string) {
  if (status === "overdue") return "Overdue";
  if (status === "upcoming") return "Upcoming";
  if (status === "scheduled") return "Scheduled";
  return "Complete";
}

export function VaccinationControls({ petId, records }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState<VaccinationRecord | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const body = {
      vaccineName: form.get("vaccineName"),
      givenAt: form.get("givenAt"),
      nextDueAt: form.get("nextDueAt"),
      clinicName: form.get("clinicName"),
      note: form.get("note"),
    };
    const response = await fetch(editing ? `/api/vaccinations/${editing.id}` : `/api/pets/${petId}/vaccinations`, {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Could not save vaccination.");
      return;
    }

    setEditing(null);
    router.refresh();
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-md border border-foreground/15 p-5">
        <h2 className="text-xl font-semibold">{editing ? "Edit vaccination" : "Add vaccination"}</h2>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Vaccine name
              <input name="vaccineName" required defaultValue={editing?.vaccineName ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
            <label className="grid gap-2 text-sm">
              Given at
              <input name="givenAt" type="date" required defaultValue={editing?.givenAt ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
            <label className="grid gap-2 text-sm">
              Next due at
              <input name="nextDueAt" type="date" defaultValue={editing?.nextDueAt ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
            <label className="grid gap-2 text-sm">
              Clinic
              <input name="clinicName" defaultValue={editing?.clinicName ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Note
            <textarea name="note" defaultValue={editing?.note ?? ""} className="min-h-24 rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
          </label>
          {error ? <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
          <div className="flex flex-wrap gap-3">
            <button disabled={!ready} className="rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
              {editing ? "Save vaccination" : "Add vaccination"}
            </button>
            {editing ? (
              <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-foreground/20 px-4 py-3 text-sm font-semibold">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="grid gap-3">
        {records.length ? (
          records.map((record) => (
            <article key={record.id} className="grid gap-3 rounded-md border border-foreground/15 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{record.vaccineName}</p>
                  <p className="text-sm text-foreground/60">
                    Given {record.givenAt}
                    {record.nextDueAt ? ` · Due ${record.nextDueAt}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs">
                    {statusLabel(record.status)}
                  </span>
                  <button onClick={() => setEditing(record)} className="rounded-md border border-foreground/15 px-3 py-2 text-sm">
                    Edit
                  </button>
                </div>
              </div>
              {record.clinicName ? <p className="text-sm text-foreground/70">Clinic: {record.clinicName}</p> : null}
              {record.note ? <p className="text-sm text-foreground/75">{record.note}</p> : null}
            </article>
          ))
        ) : (
          <p className="rounded-md border border-foreground/15 p-4 text-sm text-foreground/60">
            No vaccination records yet.
          </p>
        )}
      </section>
    </div>
  );
}

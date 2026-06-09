"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HealthLog } from "@/lib/health-logs/types";

type Props = {
  petId: string;
  logs: HealthLog[];
  selectedType: string;
};

const types = ["weight", "symptom", "medication", "appetite", "stool", "behavior", "vet_visit"];

function dateTimeLocal(value: string) {
  return value.slice(0, 16);
}

function isoFromLocal(value: FormDataEntryValue | null) {
  if (!value) {
    return new Date().toISOString();
  }
  return new Date(String(value)).toISOString();
}

export function HealthLogControls({ petId, logs, selectedType }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<HealthLog | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const body = {
      type: form.get("type"),
      occurredAt: isoFromLocal(form.get("occurredAt")),
      title: form.get("title"),
      note: form.get("note"),
      metadataJson: null,
    };
    const response = await fetch(editing ? `/api/health-logs/${editing.id}` : `/api/pets/${petId}/health-logs`, {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Could not save health log.");
      return;
    }

    setEditing(null);
    router.refresh();
  }

  async function remove(logId: string) {
    const response = await fetch(`/api/health-logs/${logId}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Could not delete health log.");
      return;
    }
    router.refresh();
  }

  function filter(type: string) {
    router.push(type ? `/app/pets/${petId}/health?type=${type}` : `/app/pets/${petId}/health`);
  }

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 rounded-md border border-foreground/15 p-5">
        <h2 className="text-xl font-semibold">{editing ? "Edit health log" : "Add health log"}</h2>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Type
              <select name="type" defaultValue={editing?.type ?? "weight"} className="rounded-md border border-foreground/20 bg-background px-3 py-3">
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              Occurred at
              <input
                name="occurredAt"
                type="datetime-local"
                required
                defaultValue={editing ? dateTimeLocal(editing.occurredAt) : dateTimeLocal(new Date().toISOString())}
                className="rounded-md border border-foreground/20 bg-transparent px-3 py-3"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm">
            Title
            <input name="title" required defaultValue={editing?.title ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm">
            Note
            <textarea name="note" defaultValue={editing?.note ?? ""} className="min-h-24 rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
          </label>
          {error ? <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
          <div className="flex gap-3">
            <button disabled={!ready} className="rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
              {editing ? "Save log" : "Add log"}
            </button>
            {editing ? (
              <button type="button" onClick={() => setEditing(null)} className="rounded-md border border-foreground/20 px-4 py-3 text-sm font-semibold">
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => filter("")} className="rounded-md border border-foreground/15 px-3 py-2 text-sm">
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => filter(type)}
              className={`rounded-md border px-3 py-2 text-sm ${selectedType === type ? "border-emerald-500" : "border-foreground/15"}`}
            >
              {type}
            </button>
          ))}
        </div>
        {logs.length ? (
          logs.map((log) => (
            <article key={log.id} className="grid gap-3 rounded-md border border-foreground/15 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{log.title}</p>
                  <p className="text-sm text-foreground/60">
                    {log.type} · {new Date(log.occurredAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(log)} className="rounded-md border border-foreground/15 px-3 py-2 text-sm">
                    Edit
                  </button>
                  <button onClick={() => remove(log.id)} className="rounded-md border border-foreground/15 px-3 py-2 text-sm">
                    Delete
                  </button>
                </div>
              </div>
              {log.note ? <p className="text-sm text-foreground/75">{log.note}</p> : null}
            </article>
          ))
        ) : (
          <p className="rounded-md border border-foreground/15 p-4 text-sm text-foreground/60">
            No health logs match this view.
          </p>
        )}
      </section>
    </div>
  );
}

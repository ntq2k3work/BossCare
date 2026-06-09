"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PetProfile } from "@/lib/pets/types";

type Props = {
  mode: "create" | "edit";
  pet?: PetProfile;
};

export function PetForm({ mode, pet }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch(mode === "create" ? "/api/pets" : `/api/pets/${pet?.id}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        species: form.get("species"),
        breed: form.get("breed"),
        sex: form.get("sex"),
        birthdate: form.get("birthdate"),
        estimatedAge: form.get("estimatedAge"),
        allergies: form.get("allergies"),
        medicalNotes: form.get("medicalNotes"),
      }),
    });

    setLoading(false);
    if (!response.ok) {
      const body = await response.json();
      setError(body.error?.message ?? "Could not save pet.");
      return;
    }

    const saved = await response.json();
    router.push(`/app/pets/${saved.id}`);
    router.refresh();
  }

  async function archive() {
    if (!pet) {
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/pets/${pet.id}/archive`, { method: "POST" });
    setLoading(false);
    if (!response.ok) {
      const body = await response.json();
      setError(body.error?.message ?? "Could not archive pet.");
      return;
    }
    router.push("/app/pets");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Name
          <input name="name" required defaultValue={pet?.name} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
        <label className="grid gap-2 text-sm">
          Species
          <input name="species" required defaultValue={pet?.species} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
        <label className="grid gap-2 text-sm">
          Breed
          <input name="breed" defaultValue={pet?.breed ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
        <label className="grid gap-2 text-sm">
          Sex
          <input name="sex" defaultValue={pet?.sex ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
        <label className="grid gap-2 text-sm">
          Birthdate
          <input name="birthdate" type="date" defaultValue={pet?.birthdate ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
        <label className="grid gap-2 text-sm">
          Estimated age
          <input name="estimatedAge" defaultValue={pet?.estimatedAge ?? ""} className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Allergies
        <textarea name="allergies" defaultValue={pet?.allergies ?? ""} className="min-h-24 rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
      </label>
      <label className="grid gap-2 text-sm">
        Medical notes
        <textarea name="medicalNotes" defaultValue={pet?.medicalNotes ?? ""} className="min-h-24 rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
      </label>
      {error ? <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button disabled={loading || !ready} className="rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
          {loading ? "Saving..." : mode === "create" ? "Create pet" : "Save pet"}
        </button>
        {mode === "edit" && !pet?.archivedAt ? (
          <button
            type="button"
            onClick={archive}
            disabled={loading || !ready}
            className="rounded-md border border-foreground/20 px-4 py-3 text-sm font-semibold disabled:opacity-60"
          >
            Archive pet
          </button>
        ) : null}
      </div>
    </form>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PetProfile } from "@/lib/pets/types";
import { Button, fieldClass, labelClass } from "@/components/ui/pet-ui";

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
        <label className={labelClass}>
          Ten
          <input name="name" required defaultValue={pet?.name} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Loai
          <input name="species" required defaultValue={pet?.species} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Giong
          <input name="breed" defaultValue={pet?.breed ?? ""} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Gioi tinh
          <input name="sex" defaultValue={pet?.sex ?? ""} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Ngay sinh
          <input name="birthdate" type="date" defaultValue={pet?.birthdate ?? ""} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Tuoi uoc tinh
          <input name="estimatedAge" defaultValue={pet?.estimatedAge ?? ""} className={fieldClass} />
        </label>
      </div>
      <label className={labelClass}>
        Di ung
        <textarea name="allergies" defaultValue={pet?.allergies ?? ""} className={`${fieldClass} min-h-24`} />
      </label>
      <label className={labelClass}>
        Ghi chu y te
        <textarea name="medicalNotes" defaultValue={pet?.medicalNotes ?? ""} className={`${fieldClass} min-h-24`} />
      </label>
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={loading || !ready}>{loading ? "Dang luu..." : mode === "create" ? "Tao ho so" : "Luu ho so"}</Button>
        {mode === "edit" && !pet?.archivedAt ? (
          <Button
            type="button"
            onClick={archive}
            disabled={loading || !ready}
            variant="secondary"
          >
            Luu tru ho so
          </Button>
        ) : null}
      </div>
    </form>
  );
}

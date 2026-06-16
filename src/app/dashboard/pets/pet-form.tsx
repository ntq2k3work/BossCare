"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PetProfile } from "@/lib/pets/types";
import { useI18n } from "@/components/i18n-provider";
import { Button, fieldClass, labelClass } from "@/components/ui/pet-ui";

type Props = {
  mode: "create" | "edit";
  pet?: PetProfile;
};

export function PetForm({ mode, pet }: Props) {
  const router = useRouter();
  const { copy, locale } = useI18n();
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
      setError(locale === "vi" ? "Không thể lưu hồ sơ thú cưng." : "Could not save pet.");
      return;
    }

    const saved = await response.json();
    router.push(`/dashboard/pets/${saved.id}`);
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
      setError(locale === "vi" ? "Không thể lưu trữ hồ sơ thú cưng." : "Could not archive pet.");
      return;
    }
    router.push("/dashboard/pets");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {copy.labels.name}
          <input name="name" required defaultValue={pet?.name} className={fieldClass} />
        </label>
        <label className={labelClass}>
          {copy.labels.species}
          <input name="species" required defaultValue={pet?.species} className={fieldClass} />
        </label>
        <label className={labelClass}>
          {copy.labels.breed}
          <input name="breed" defaultValue={pet?.breed ?? ""} className={fieldClass} />
        </label>
        <label className={labelClass}>
          {copy.labels.gender}
          <input name="sex" defaultValue={pet?.sex ?? ""} className={fieldClass} />
        </label>
        <label className={labelClass}>
          {copy.labels.birthday}
          <input name="birthdate" type="date" defaultValue={pet?.birthdate ?? ""} className={fieldClass} />
        </label>
        <label className={labelClass}>
          {copy.labels.estimatedAge}
          <input name="estimatedAge" defaultValue={pet?.estimatedAge ?? ""} className={fieldClass} />
        </label>
      </div>
      <label className={labelClass}>
        {copy.labels.allergies}
        <textarea name="allergies" defaultValue={pet?.allergies ?? ""} className={`${fieldClass} min-h-24`} />
      </label>
      <label className={labelClass}>
        {copy.labels.medicalNotes}
        <textarea name="medicalNotes" defaultValue={pet?.medicalNotes ?? ""} className={`${fieldClass} min-h-24`} />
      </label>
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={loading || !ready}>{loading ? (locale === "vi" ? "Đang lưu..." : "Saving...") : mode === "create" ? "Tạo hồ sơ" : "Lưu hồ sơ"}</Button>
        {mode === "edit" && !pet?.archivedAt ? (
          <Button
            type="button"
            onClick={archive}
            disabled={loading || !ready}
            variant="secondary"
          >
            {locale === "vi" ? "Lưu trữ hồ sơ" : "Archive profile"}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

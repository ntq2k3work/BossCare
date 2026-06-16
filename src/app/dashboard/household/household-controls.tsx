"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { Button, Card, fieldClass, labelClass } from "@/components/ui/pet-ui";

export function HouseholdInviteForm() {
  const router = useRouter();
  const { copy } = useI18n();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/household/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    if (!response.ok) {
      setError(copy.household.couldNotInvite);
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-3">
        <h2 className="text-lg font-bold text-slate-950">{copy.household.availableMembers}</h2>
        <label className={labelClass}>
          {copy.labels.email}
          <input name="email" type="email" required className={fieldClass} />
        </label>
        {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
        <Button className="w-fit">{copy.household.inviteButton}</Button>
      </form>
    </Card>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, fieldClass, labelClass } from "@/components/ui/pet-ui";

export function HouseholdInviteForm() {
  const router = useRouter();
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
      const result = await response.json();
      setError(result.error?.message ?? "Could not invite member.");
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={submit} className="grid gap-3">
      <h2 className="text-lg font-bold text-slate-950">Moi thanh vien co san</h2>
      <label className={labelClass}>
        Email
        <input name="email" type="email" required className={fieldClass} />
      </label>
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      <Button className="w-fit">Moi thanh vien</Button>
      </form>
    </Card>
  );
}

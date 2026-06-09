"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
    <form onSubmit={submit} className="grid gap-3 rounded-md border border-foreground/15 p-5">
      <h2 className="text-xl font-semibold">Invite existing user</h2>
      <label className="grid gap-2 text-sm">
        Email
        <input name="email" type="email" required className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
      </label>
      {error ? <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
      <button className="w-fit rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950">
        Invite member
      </button>
    </form>
  );
}

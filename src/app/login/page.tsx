"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    setLoading(false);
    if (!response.ok) {
      const body = await response.json();
      setError(body.error?.message ?? "Could not sign in.");
      return;
    }

    window.location.assign("/app");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <form onSubmit={onSubmit} className="grid w-full max-w-md gap-5">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-500">
            Pet Healthy
          </p>
          <h1 className="text-3xl font-semibold">Sign in</h1>
        </div>
        <label className="grid gap-2 text-sm">
          Email
          <input name="email" type="email" required className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
        <label className="grid gap-2 text-sm">
          Password
          <input name="password" type="password" required className="rounded-md border border-foreground/20 bg-transparent px-3 py-3" />
        </label>
        {error ? <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p> : null}
        <button disabled={loading || !ready} className="rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <Link href="/register" className="text-sm text-foreground/70 hover:text-foreground">
          Need an account? Create one
        </Link>
      </form>
    </main>
  );
}

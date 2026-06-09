import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-10 px-6 py-16">
        <div className="max-w-2xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-500">
            Pet Healthy
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
            Household pet care records, ready for the first MVP slice.
          </h1>
          <p className="text-lg text-foreground/70">
            Create an account, receive a default household, and enter the private app surface with starter plan limits.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-foreground/20 px-5 py-3 text-sm font-semibold transition hover:bg-foreground/10"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}

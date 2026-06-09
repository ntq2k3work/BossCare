import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { LogoutButton } from "./logout-button";

export default async function AppPage() {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto grid w-full max-w-5xl gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-500">
              Pet Healthy
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Welcome, {context.user.displayName}</h1>
          </div>
          <LogoutButton />
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-md border border-foreground/15 p-5">
            <p className="text-sm text-foreground/60">Active household</p>
            <p className="mt-2 text-xl font-semibold">{context.activeHousehold?.name ?? "None"}</p>
            <p className="mt-1 text-sm text-foreground/60">{context.activeHousehold?.role ?? "No role"}</p>
          </section>
          <section className="rounded-md border border-foreground/15 p-5">
            <p className="text-sm text-foreground/60">Plan</p>
            <p className="mt-2 text-xl font-semibold">{context.entitlements.plan}</p>
            <p className="mt-1 text-sm text-foreground/60">Starter MVP entitlement</p>
          </section>
          <section className="rounded-md border border-foreground/15 p-5">
            <p className="text-sm text-foreground/60">Limits</p>
            <p className="mt-2 text-xl font-semibold">{context.entitlements.petLimit} pet</p>
            <p className="mt-1 text-sm text-foreground/60">
              {context.entitlements.aiSessionsPerMonth} AI sessions/month
            </p>
          </section>
        </div>
        <div className="rounded-md border border-foreground/15 p-5 text-sm text-foreground/70">
          Member limit: {context.entitlements.memberLimit} · Media limit: {context.entitlements.mediaLimitMb} MB
        </div>
        <Link
          href="/app/pets"
          className="w-fit rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Manage pets
        </Link>
        <Link
          href="/app/household"
          className="w-fit rounded-md border border-foreground/20 px-5 py-3 text-sm font-semibold transition hover:bg-foreground/10"
        >
          Household
        </Link>
      </section>
    </main>
  );
}

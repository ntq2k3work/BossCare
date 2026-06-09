import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { getAuthStore } from "@/lib/auth/store";
import { listMembers } from "@/lib/households/service";
import { HouseholdInviteForm } from "./household-controls";
import { LogoutButton } from "../logout-button";

export default async function HouseholdPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const members = await listMembers(context, getAuthStore());

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto grid w-full max-w-4xl gap-8">
        <header>
          <Link href="/app" className="text-sm text-foreground/60 hover:text-foreground">
            App
          </Link>
          <h1 className="mt-2 text-3xl font-semibold">Household</h1>
          <p className="mt-1 text-sm text-foreground/60">{context.activeHousehold?.name}</p>
        </header>
        <LogoutButton />
        <section className="grid gap-3">
          {members.map((member) => (
            <article key={member.id} className="rounded-md border border-foreground/15 p-4">
              <p className="font-semibold">{member.displayName}</p>
              <p className="text-sm text-foreground/60">
                {member.email} · {member.role}
              </p>
            </article>
          ))}
        </section>
        {context.activeHousehold?.role === "OWNER" ? <HouseholdInviteForm /> : null}
      </section>
    </main>
  );
}

import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { getAuthStore } from "@/lib/auth/store";
import { listMembers } from "@/lib/households/service";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui/pet-ui";
import { LogoutButton } from "../logout-button";
import { HouseholdInviteForm } from "./household-controls";

export default async function HouseholdPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const members = await listMembers(context, getAuthStore());

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <PageHeader
          title="Ho gia dinh"
          description={context.activeHousehold?.name}
          action={<Badge tone="violet">{context.activeHousehold?.role ?? "Member"}</Badge>}
        />
        <section className="grid gap-3">
          {members.map((member) => (
            <Card key={member.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <p className="font-bold text-slate-950">{member.displayName}</p>
                <p className="text-sm text-slate-500">{member.email}</p>
              </div>
              <Badge>{member.role}</Badge>
            </Card>
          ))}
        </section>
        {context.activeHousehold?.role === "OWNER" ? <HouseholdInviteForm /> : null}
      </div>
    </AppShell>
  );
}

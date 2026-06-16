import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { getAuthStore } from "@/lib/auth/store";
import { listMembers } from "@/lib/households/service";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, Card, PageHeader } from "@/components/ui/pet-ui";
import { formatRoleLabel, getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { LogoutButton } from "../logout-button";
import { HouseholdInviteForm } from "./household-controls";

export default async function HouseholdPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  const members = await listMembers(context, getAuthStore());

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <PageHeader
          title={copy.household.title}
          description={context.activeHousehold?.name}
          action={<Badge tone="violet">{formatRoleLabel(locale, context.activeHousehold?.role)}</Badge>}
        />
        <section className="grid gap-3">
          {members.map((member) => (
            <Card key={member.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
              <div>
                <p className="font-bold text-slate-950">{member.displayName}</p>
                <p className="text-sm text-slate-500">{member.email}</p>
              </div>
              <Badge>{formatRoleLabel(locale, member.role)}</Badge>
            </Card>
          ))}
        </section>
        {context.activeHousehold?.role === "OWNER" ? <HouseholdInviteForm /> : null}
      </div>
    </AppShell>
  );
}

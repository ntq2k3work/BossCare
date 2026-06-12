import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, PageHeader } from "@/components/ui/pet-ui";
import { LogoutButton } from "../logout-button";
import { CareGuideControls } from "./care-guide-controls";

export default async function CareGuidePage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <PageHeader
          title="AI Care Guide"
          description="Educational pet-care guidance with emergency warnings, quota limits, and no veterinarian replacement claims."
          action={<Badge tone="violet">{context.entitlements.aiSessionsPerMonth} sessions/month</Badge>}
        />
        <CareGuideControls />
      </div>
    </AppShell>
  );
}

import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, PageHeader } from "@/components/ui/pet-ui";
import { getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { LogoutButton } from "../logout-button";
import { CareGuideControls } from "./care-guide-controls";

export default async function CareGuidePage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const locale = await getRequestLocale();
  const copy = getCopy(locale);

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <PageHeader
          title={copy.careGuide.title}
          description={copy.careGuide.description}
          action={<Badge tone="violet">{copy.careGuide.sessionsPerMonth(context.entitlements.aiSessionsPerMonth)}</Badge>}
        />
        <CareGuideControls />
      </div>
    </AppShell>
  );
}

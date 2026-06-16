import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { listPaymentReviewItems } from "@/lib/payments/service";
import { getPaymentStore } from "@/lib/payments/store";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui/pet-ui";
import { getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { PaymentReviewControls } from "./payment-review-controls";

export default async function AdminPaymentsPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  const items = await listPaymentReviewItems(context, getPaymentStore());

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <PageHeader
          title={copy.adminPayments.title}
          description={copy.adminPayments.description}
          action={<Badge tone={items.length ? "warn" : "good"}>{copy.adminPayments.badgeOpen(items.length)}</Badge>}
        />
        <Card>
          {items.length ? (
            <PaymentReviewControls items={items} />
          ) : (
            <EmptyState title={copy.adminPayments.noReviewsTitle} description={copy.adminPayments.noReviewsDescription} />
          )}
        </Card>
      </div>
    </AppShell>
  );
}

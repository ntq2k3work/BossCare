import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { listPaymentReviewItems } from "@/lib/payments/service";
import { getPaymentStore } from "@/lib/payments/store";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui/pet-ui";
import { LogoutButton } from "@/app/app/logout-button";
import { PaymentReviewControls } from "./payment-review-controls";

export default async function AdminPaymentsPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const items = await listPaymentReviewItems(context, getPaymentStore());

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <PageHeader
          title="Admin payment review"
          description="Resolve unmatched or mismatched SePay bank transactions after manual review."
          action={<Badge tone={items.length ? "warn" : "good"}>{items.length} open</Badge>}
        />
        <Card>
          {items.length ? (
            <PaymentReviewControls items={items} />
          ) : (
            <EmptyState title="No payment reviews" description="Unmatched and review-required transactions will appear here." />
          )}
        </Card>
      </div>
    </AppShell>
  );
}

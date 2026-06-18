import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { PaymentError } from "@/lib/payments/errors";
import { getPaymentOrder } from "@/lib/payments/service";
import { getPaymentStore } from "@/lib/payments/store";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, ButtonLink, Card, PageHeader, Panel } from "@/components/ui/pet-ui";
import { formatPaymentStatus, formatPlanLabel, getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { LogoutButton } from "../../logout-button";

type Props = { params: Promise<{ id: string }> };

export default async function PaymentDetailPage({ params }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  try {
    const { id } = await params;
    const payment = await getPaymentOrder(context, getPaymentStore(), id);
    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
        <div className="grid gap-6">
          <PageHeader
            eyebrow={
              <ButtonLink href="/dashboard/billing" variant="ghost" className="px-0">
                {copy.billing.backToBilling}
              </ButtonLink>
            }
            title={copy.billing.completePayment}
            description={`${locale === "vi" ? "Mã đơn" : "Order"} ${payment.providerOrderCode}`}
            action={<Badge tone="warn">{formatPaymentStatus(locale, payment.status)}</Badge>}
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <h2 className="text-lg font-bold text-[var(--bc-ink)]">{copy.billing.orderInfo}</h2>
              <div className="mt-5 grid gap-3">
                <Panel className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--bc-muted)]">{copy.billing.servicePlan}</span>
                  <span className="font-semibold text-[var(--bc-ink)]">{formatPlanLabel(locale, payment.plan)}</span>
                </Panel>
                <Panel className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--bc-muted)]">{copy.billing.amount}</span>
                  <span className="font-semibold text-[var(--bc-ink)]">
                    {payment.expectedAmountVnd.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} {locale === "vi" ? "VND" : "VND"}
                  </span>
                </Panel>
                <Panel className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--bc-muted)]">{copy.billing.transferContent}</span>
                  <span className="font-mono text-sm font-semibold text-[var(--bc-accent)]">{payment.providerOrderCode}</span>
                </Panel>
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-bold text-[var(--bc-ink)]">{copy.billing.guide}</h2>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-[var(--bc-muted)]">
                {copy.billing.guideSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </AppShell>
    );
  } catch (error) {
    if (error instanceof PaymentError && error.status === 404) notFound();
    throw error;
  }
}

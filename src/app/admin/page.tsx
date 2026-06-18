import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { getAuthStore } from "@/lib/auth/store";
import { getPetStore } from "@/lib/pets/store";
import { getPaymentStore } from "@/lib/payments/store";
import { getAdminOverviewStats } from "@/lib/admin/stats";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, ButtonLink, Card, PageHeader, StatCard } from "@/components/ui/pet-ui";
import { getCopy, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { LogoutButton } from "@/app/dashboard/logout-button";

export default async function AdminOverviewPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");

  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  const stats = await getAdminOverviewStats(context, {
    authStore: getAuthStore(),
    petStore: getPetStore(),
    paymentStore: getPaymentStore(),
  });

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="admin">
      <div className="grid gap-6">
        <PageHeader
          eyebrow={copy.adminOverview.eyebrow}
          title={copy.adminOverview.title}
          description={copy.adminOverview.description}
          action={
            <ButtonLink href="/admin/payments" variant="secondary">
              {copy.adminOverview.reviewPayments}
            </ButtonLink>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard label={copy.adminOverview.stats.users} value={stats.users} note={copy.adminOverview.notes.users(stats.members)} />
          <StatCard label={copy.adminOverview.stats.households} value={stats.households} note={copy.adminOverview.notes.households} />
          <StatCard label={copy.adminOverview.stats.pets} value={stats.pets.total} note={copy.adminOverview.notes.pets(stats.pets.active, stats.pets.archived)} />
          <StatCard label={copy.adminOverview.stats.payments} value={stats.payments.total} note={copy.adminOverview.notes.payments(stats.payments.paid, stats.payments.pending)} />
          <StatCard label={copy.adminOverview.stats.revenue} value={formatVnd(locale, stats.payments.paidRevenueVnd)} note={copy.adminOverview.notes.revenue} />
          <StatCard
            label={copy.adminOverview.stats.openReviews}
            value={stats.payments.openReviews}
            note={<Badge tone={stats.payments.openReviews ? "warn" : "good"}>{copy.adminOverview.notes.openReviews(stats.payments.openReviews)}</Badge>}
          />
        </div>

        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-[var(--bc-ink)]">{copy.adminOverview.paymentHealthTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--bc-muted)]">{copy.adminOverview.paymentHealthDescription}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={stats.payments.reviewRequired ? "warn" : "good"}>
                {copy.adminOverview.reviewRequired(stats.payments.reviewRequired)}
              </Badge>
              <Badge tone="violet">{copy.adminOverview.paidPayments(stats.payments.paid)}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function formatVnd(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

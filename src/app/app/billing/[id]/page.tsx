import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { PaymentError } from "@/lib/payments/errors";
import { getPaymentOrder } from "@/lib/payments/service";
import { getPaymentStore } from "@/lib/payments/store";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, ButtonLink, Card, PageHeader, Panel } from "@/components/ui/pet-ui";
import { LogoutButton } from "../../logout-button";

type Props = { params: Promise<{ id: string }> };

export default async function PaymentDetailPage({ params }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  try {
    const { id } = await params;
    const payment = await getPaymentOrder(context, getPaymentStore(), id);
    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
        <div className="grid gap-6">
          <PageHeader
            eyebrow={<ButtonLink href="/app/billing" variant="ghost" className="px-0">Quay lai thanh toan</ButtonLink>}
            title="Hoan tat thanh toan"
            description={`Ma don ${payment.providerOrderCode}`}
            action={<Badge tone="warn">{payment.status}</Badge>}
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <h2 className="text-lg font-bold text-slate-950">Thong tin don hang</h2>
              <div className="mt-5 grid gap-3">
                <Panel className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Goi dich vu</span>
                  <span className="font-semibold text-slate-950">{payment.plan}</span>
                </Panel>
                <Panel className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">So tien</span>
                  <span className="font-semibold text-slate-950">{payment.expectedAmountVnd.toLocaleString("vi-VN")} VND</span>
                </Panel>
                <Panel className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">Noi dung chuyen khoan</span>
                  <span className="font-mono text-sm font-semibold text-violet-700">{payment.providerOrderCode}</span>
                </Panel>
              </div>
            </Card>
            <Card>
              <h2 className="text-lg font-bold text-slate-950">Huong dan</h2>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
                <li>1. Mo ung dung ngan hang.</li>
                <li>2. Chuyen dung so tien va noi dung.</li>
                <li>3. He thong tu dong doi soat sau khi nhan tien.</li>
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

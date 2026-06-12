import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { AppShell } from "@/components/ui/app-shell";
import { PageHeader } from "@/components/ui/pet-ui";
import { LogoutButton } from "../logout-button";
import { BillingControls } from "./billing-controls";

export default async function BillingPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <PageHeader
          title="Thanh toan va nang cap"
          description="Chon goi phu hop, tao lenh chuyen khoan SePay va theo doi trang thai."
        />
        <BillingControls />
      </div>
    </AppShell>
  );
}

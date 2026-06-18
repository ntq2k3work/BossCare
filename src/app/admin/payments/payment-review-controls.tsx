"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentReviewItem } from "@/lib/payments/types";
import { formatTransactionStatus } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Button, fieldClass, labelClass } from "@/components/ui/pet-ui";

function formatMismatchReason(locale: "vi" | "en", reason: string) {
  if (locale === "vi") {
    if (reason === "missing_payment_code") return "Thiếu mã thanh toán";
    if (reason === "missing_or_wrong_payment_code") return "Sai hoặc thiếu mã thanh toán";
    if (reason === "underpayment") return "Chuyển thiếu";
    if (reason === "overpayment") return "Chuyển dư";
    if (reason === "expired_payment") return "Giao dịch đã hết hạn";
    if (reason === "non_inbound_transfer") return "Không phải giao dịch vào";
    return reason;
  }

  if (reason === "missing_payment_code") return "Missing payment code";
  if (reason === "missing_or_wrong_payment_code") return "Wrong or missing payment code";
  if (reason === "underpayment") return "Underpayment";
  if (reason === "overpayment") return "Overpayment";
  if (reason === "expired_payment") return "Expired payment";
  if (reason === "non_inbound_transfer") return "Non-inbound transfer";
  return reason;
}

export function PaymentReviewControls({ items }: { items: PaymentReviewItem[] }) {
  const router = useRouter();
  const { copy, locale } = useI18n();
  const [error, setError] = useState("");

  async function resolve(event: FormEvent<HTMLFormElement>, transactionId: string) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/admin/payments/${transactionId}/resolve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        paymentCode: form.get("paymentCode"),
        note: form.get("note"),
      }),
    });
    if (!response.ok) {
      setError(copy.billing.couldNotResolve);
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      {error ? <p className="rounded-[var(--bc-radius-sm)] bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      {items.map((item) => (
        <form key={item.id} onSubmit={(event) => resolve(event, item.id)} className="grid gap-4 rounded-[var(--bc-radius-md)] border border-sky-100 bg-white p-4">
          <div className="grid gap-2">
            <p className="font-bold text-[var(--bc-ink)]">{item.providerTransactionId}</p>
            <p className="text-sm text-[var(--bc-muted)]">
              {item.transferAmountVnd.toLocaleString(locale === "vi" ? "vi-VN" : "en-US")} VND · {formatMismatchReason(locale, item.mismatchReason)} ·{" "}
              {formatTransactionStatus(locale, item.processingStatus)}
            </p>
            {item.transactionContent ? <p className="text-sm text-[var(--bc-muted)]">{item.transactionContent}</p> : null}
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className={labelClass}>
              {copy.billing.paymentCode}
              <input name="paymentCode" defaultValue={item.payment?.providerOrderCode ?? item.paymentCode ?? ""} className={fieldClass} required />
            </label>
            <label className={labelClass}>
              {copy.billing.adminNote}
              <input name="note" placeholder={copy.billing.reviewedBankTransfer} className={fieldClass} />
            </label>
            <Button className="self-end">{copy.billing.resolve}</Button>
          </div>
        </form>
      ))}
    </div>
  );
}

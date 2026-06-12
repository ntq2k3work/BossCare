"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PaymentReviewItem } from "@/lib/payments/types";
import { Button, fieldClass, labelClass } from "@/components/ui/pet-ui";

export function PaymentReviewControls({ items }: { items: PaymentReviewItem[] }) {
  const router = useRouter();
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
      const result = await response.json();
      setError(result.error?.message ?? "Could not resolve payment.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      {items.map((item) => (
        <form key={item.id} onSubmit={(event) => resolve(event, item.id)} className="grid gap-4 rounded-lg border border-violet-100 bg-white p-4">
          <div className="grid gap-2">
            <p className="font-bold text-slate-950">{item.providerTransactionId}</p>
            <p className="text-sm text-slate-500">
              {item.transferAmountVnd.toLocaleString("vi-VN")} VND · {item.mismatchReason} · {item.processingStatus}
            </p>
            {item.transactionContent ? <p className="text-sm text-slate-600">{item.transactionContent}</p> : null}
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className={labelClass}>
              Payment code
              <input name="paymentCode" defaultValue={item.payment?.providerOrderCode ?? item.paymentCode ?? ""} className={fieldClass} required />
            </label>
            <label className={labelClass}>
              Admin note
              <input name="note" placeholder="Reviewed bank transfer" className={fieldClass} />
            </label>
            <Button className="self-end">Resolve</Button>
          </div>
        </form>
      ))}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Badge, Button, Card } from "@/components/ui/pet-ui";

export function BillingControls() {
  const router = useRouter();
  const { copy, locale } = useI18n();
  const [error, setError] = useState("");

  const plans = [
    {
      id: "plus" as const,
      name: copy.billing.plus.name,
      price: locale === "vi" ? "88.000đ" : "88,000 VND",
      note: copy.billing.plus.note,
      perks: copy.billing.plus.perks,
    },
    {
      id: "family" as const,
      name: copy.billing.family.name,
      price: locale === "vi" ? "149.000đ" : "149,000 VND",
      note: copy.billing.family.note,
      perks: copy.billing.family.perks,
    },
  ] as const;

  async function create(plan: "plus" | "family") {
    setError("");
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    if (!response.ok) {
      setError(copy.billing.couldNotCreatePayment);
      return;
    }
    const payment = await response.json();
    router.push(`/dashboard/billing/${payment.id}`);
  }

  return (
    <div className="grid gap-4">
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col">
          <Badge>{copy.common.free}</Badge>
          <p className="mt-5 text-3xl font-bold text-slate-950">0</p>
          <p className="text-sm text-slate-500">{copy.billing.forever}</p>
          <ul className="mt-5 grid gap-2 text-sm text-slate-600">
            {copy.billing.freePlan.perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
          <Button disabled variant="secondary" className="mt-auto">
            {copy.common.current}
          </Button>
        </Card>
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col border-violet-200">
            <Badge tone="violet">{plan.name}</Badge>
            <p className="mt-5 text-3xl font-bold text-slate-950">{plan.price}</p>
            <p className="text-sm text-slate-500">{copy.billing.monthly}</p>
            <p className="mt-4 text-sm text-slate-600">{plan.note}</p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-600">
              {plan.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <Button onClick={() => create(plan.id)} className="mt-6">
              {copy.billing.choosePlan}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

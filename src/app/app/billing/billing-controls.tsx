"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Button, Card } from "@/components/ui/pet-ui";

const plans = [
  {
    id: "plus",
    name: "Premium",
    price: "88.000d",
    note: "Cho mot be can cham soc day du",
    perks: ["5 thu cung", "500MB luu tru", "AI Care Guide"],
  },
  {
    id: "family",
    name: "Family",
    price: "149.000d",
    note: "Cho gia dinh nhieu thu cung",
    perks: ["15 thu cung", "2GB luu tru", "Nhieu thanh vien"],
  },
] as const;

export function BillingControls() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function create(plan: "plus" | "family") {
    setError("");
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Could not create payment.");
      return;
    }
    const payment = await response.json();
    router.push(`/app/billing/${payment.id}`);
  }

  return (
    <div className="grid gap-4">
      {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col">
          <Badge>Free</Badge>
          <p className="mt-5 text-3xl font-bold text-slate-950">0d</p>
          <p className="text-sm text-slate-500">Vinh vien</p>
          <ul className="mt-5 grid gap-2 text-sm text-slate-600">
            <li>1 thu cung</li>
            <li>100MB luu tru</li>
            <li>5 AI luot / thang</li>
          </ul>
          <Button disabled variant="secondary" className="mt-auto">
            Hien tai
          </Button>
        </Card>
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col border-violet-200">
            <Badge tone="violet">{plan.name}</Badge>
            <p className="mt-5 text-3xl font-bold text-slate-950">{plan.price}</p>
            <p className="text-sm text-slate-500">/ thang</p>
            <p className="mt-4 text-sm text-slate-600">{plan.note}</p>
            <ul className="mt-5 grid gap-2 text-sm text-slate-600">
              {plan.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <Button onClick={() => create(plan.id)} className="mt-6">
              Chon goi
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

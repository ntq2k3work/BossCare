"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PetProfile } from "@/lib/pets/types";
import type { VaccinationRecord } from "@/lib/vaccinations/types";
import { Button, ButtonLink, Card, dogPhoto, fieldClass, labelClass } from "@/components/ui/pet-ui";

type Props = {
  pet: PetProfile;
  records: VaccinationRecord[];
};

const upcomingVaccines = [
  { title: "Vaccine dại", date: "Hạn: 01/06/2025", due: "Còn 12 ngày", tone: "amber", icon: "R" },
  { title: "Vaccine 5 bệnh (DHPPi)", date: "Hạn: 15/06/2025", due: "Còn 26 ngày", tone: "info", icon: "V" },
  { title: "Tẩy giun", date: "Hạn: 20/06/2025", due: "Còn 31 ngày", tone: "good", icon: "G" },
] as const;

export function VaccinationControls({ pet, records }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const recentRecords = useMemo(() => {
    if (records.length) return records.slice(0, 3);
    return [
      { id: "demo-5", vaccineName: "Vaccine 5 bệnh (DHPPi)", givenAt: "2024-06-15", clinicName: "Phòng khám PetCare", status: "complete" },
      { id: "demo-rabies", vaccineName: "Vaccine dại", givenAt: "2024-06-01", clinicName: "Phòng khám PetCare", status: "complete" },
      { id: "demo-worm", vaccineName: "Tẩy giun", givenAt: "2024-03-20", clinicName: "Phòng khám PetCare", status: "complete" },
    ] as Array<Pick<VaccinationRecord, "id" | "vaccineName" | "givenAt" | "clinicName" | "status">>;
  }, [records]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const body = {
      vaccineName: form.get("vaccineName"),
      givenAt: form.get("givenAt"),
      nextDueAt: form.get("nextDueAt"),
      clinicName: form.get("clinicName"),
      note: form.get("note"),
    };
    const response = await fetch(`/api/pets/${pet.id}/vaccinations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error?.message ?? "Could not save vaccination.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
      <Card>
        <form onSubmit={submit} className="grid gap-7">
          <FormSection title="1. Thông tin vaccine">
            <label className={`${labelClass} md:col-span-2`}>
              Tên vaccine *
              <div className="grid gap-3 md:grid-cols-[1fr_140px]">
                <select name="vaccineName" required defaultValue="Vaccine 5 bệnh (DHPPi)" className={fieldClass}>
                  <option value="">Tìm kiếm hoặc chọn vaccine</option>
                  <option>Vaccine 5 bệnh (DHPPi)</option>
                  <option>Vaccine dại</option>
                  <option>Tẩy giun</option>
                  <option>Vaccine ho cũi</option>
                </select>
                <Button type="button" variant="secondary" className="gap-2">
                  <span className="text-xl">+</span>
                  Thêm mới
                </Button>
              </div>
            </label>
            <label className={labelClass}>
              Loại vaccine
              <select className={fieldClass} defaultValue="">
                <option value="">Chọn loại vaccine</option>
                <option>Core vaccine</option>
                <option>Non-core vaccine</option>
              </select>
            </label>
            <label className={labelClass}>
              Nhà sản xuất
              <select className={fieldClass} defaultValue="">
                <option value="">Chọn nhà sản xuất</option>
                <option>Zoetis</option>
                <option>Merial</option>
              </select>
            </label>
          </FormSection>

          <FormSection title="2. Thông tin mũi tiêm">
            <label className={labelClass}>
              Ngày tiêm *
              <input name="givenAt" type="date" required defaultValue="2024-05-20" className={fieldClass} />
            </label>
            <label className={labelClass}>
              Số lô (Lot)
              <input placeholder="Nhập số lô vaccine" className={fieldClass} />
            </label>
            <label className={labelClass}>
              Hạn sử dụng
              <input type="date" className={fieldClass} />
            </label>
            <label className={labelClass}>
              Phòng khám
              <input name="clinicName" defaultValue="PetCare Veterinary Clinic" className={fieldClass} />
            </label>
            <label className={labelClass}>
              Bác sĩ
              <input defaultValue="Dr. Nguyễn Minh Anh" className={fieldClass} />
            </label>
          </FormSection>

          <FormSection title="3. Thông tin khác">
            <label className={labelClass}>
              Liều lượng *
              <select className={fieldClass} defaultValue="5 ml">
                <option>5 ml</option>
                <option>2 ml</option>
                <option>1 ml</option>
              </select>
            </label>
            <label className={labelClass}>
              Đường tiêm
              <select className={fieldClass} defaultValue="Tiêm dưới da (SC)">
                <option>Tiêm dưới da (SC)</option>
                <option>Tiêm bắp (IM)</option>
              </select>
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              Ghi chú
              <textarea name="note" maxLength={500} placeholder="Nhập ghi chú (phản ứng, tình trạng sau tiêm...)" className={`${fieldClass} min-h-20`} />
              <span className="text-right text-xs text-slate-500">0/500</span>
            </label>
            <input name="nextDueAt" type="hidden" value="2025-06-15" />
          </FormSection>

          <section className="grid gap-3">
            <p className="text-sm font-bold text-slate-900">Đính kèm (nếu có)</p>
            <div className="grid gap-3 md:grid-cols-[1fr_96px_96px_96px]">
              <div className="flex min-h-24 items-center gap-4 rounded-lg border border-dashed border-violet-300 bg-violet-50/30 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600">U</span>
                <div>
                  <p className="font-bold text-violet-700">Kéo thả file vào đây hoặc click để tải lên</p>
                  <p className="mt-1 text-sm text-slate-500">Hỗ trợ: JPG, PNG, PDF (tối đa 5MB)</p>
                </div>
              </div>
              <Attachment />
              <Attachment />
              <div className="grid min-h-24 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-3xl text-slate-600">+</div>
            </div>
          </section>

          {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <ButtonLink href={`/app/pets/${pet.id}`} variant="secondary" className="min-w-36">
              Hủy bỏ
            </ButtonLink>
            <Button disabled={!ready} className="min-w-72">
              Lưu mũi tiêm
            </Button>
          </div>
        </form>
      </Card>

      <aside className="grid content-start gap-5">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-950">Thông tin thú cưng</h2>
            <ButtonLink href={`/app/pets/${pet.id}`} variant="ghost" className="min-h-8 px-2 text-violet-700">
              Chỉnh sửa
            </ButtonLink>
          </div>
          <div className="mt-5 flex gap-4">
            <img src={dogPhoto} alt={pet.name} className="h-24 w-24 rounded-lg object-cover" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-slate-950">{pet.name}</p>
                <span className="text-xl font-black text-blue-600">♂</span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {pet.breed || pet.species} · {pet.estimatedAge || "2 tuổi 3 tháng"} · 5.2 kg
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">Khỏe mạnh</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">Đã triệt sản</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">Vaccine sắp tới</h2>
            <ButtonLink href={`/app/pets/${pet.id}/vaccinations`} variant="ghost" className="min-h-8 px-2 text-violet-700">
              Xem tất cả
            </ButtonLink>
          </div>
          <div className="mt-5 grid gap-3">
            {upcomingVaccines.map((item) => (
              <UpcomingVaccine key={item.title} item={item} />
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">Lịch sử tiêm gần nhất</h2>
            <ButtonLink href={`/app/pets/${pet.id}/vaccinations`} variant="ghost" className="min-h-8 px-2 text-violet-700">
              Xem tất cả
            </ButtonLink>
          </div>
          <div className="mt-5 grid gap-4">
            {recentRecords.map((record) => (
              <RecentRecord key={record.id} record={record} />
            ))}
          </div>
        </Card>

        <Card className="bg-violet-50/70">
          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600">i</span>
            <div>
              <p className="font-black text-slate-950">Lưu ý</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                <li>• Sau khi tiêm, theo dõi thú cưng trong 24-48h.</li>
                <li>• Nếu có phản ứng lạ, liên hệ bác sĩ ngay.</li>
              </ul>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-b border-slate-200 pb-6 last:border-b-0">
      <h2 className="font-black text-violet-700">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Attachment() {
  return (
    <div className="relative min-h-24 rounded-lg border border-slate-200 bg-white p-2">
      <div className="h-full rounded bg-slate-100" />
      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-500 shadow">×</span>
    </div>
  );
}

function UpcomingVaccine({ item }: { item: (typeof upcomingVaccines)[number] }) {
  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-lg border border-slate-100 bg-white p-3">
      <Icon tone={item.tone}>{item.icon}</Icon>
      <div>
        <p className="font-black text-slate-950">{item.title}</p>
        <p className="mt-1 text-sm text-slate-600">{item.date}</p>
      </div>
      <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">{item.due}</span>
    </div>
  );
}

function RecentRecord({ record }: { record: Pick<VaccinationRecord, "id" | "vaccineName" | "givenAt" | "clinicName" | "status"> }) {
  return (
    <div className="grid grid-cols-[26px_1fr_auto] gap-3">
      <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-600">✓</span>
      <div>
        <p className="font-black text-slate-950">{record.vaccineName}</p>
        <p className="mt-1 text-sm text-slate-600">
          {record.givenAt} · {record.clinicName || "Phòng khám PetCare"}
        </p>
      </div>
      <span className="h-fit rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">Đã hoàn thành</span>
    </div>
  );
}

function Icon({ tone, children }: { tone: "amber" | "info" | "good"; children: React.ReactNode }) {
  const tones = {
    amber: "bg-amber-50 text-amber-600",
    info: "bg-blue-50 text-blue-600",
    good: "bg-emerald-50 text-emerald-600",
  };
  return <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-black ${tones[tone]}`}>{children}</span>;
}

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PetProfile } from "@/lib/pets/types";
import type { VaccinationRecord } from "@/lib/vaccinations/types";
import type { ReactNode } from "react";
import { formatDate, getCopy } from "@/lib/i18n";
import { useI18n } from "@/components/i18n-provider";
import { Button, ButtonLink, Card, dogPhoto, fieldClass, labelClass } from "@/components/ui/pet-ui";

type Props = {
  pet: PetProfile;
  records: VaccinationRecord[];
};

function upcoming(locale: "vi" | "en") {
  return [
    { title: locale === "vi" ? "Vaccine dại" : "Rabies vaccine", date: locale === "vi" ? "Hạn: 01/06/2025" : "Due: 06/01/2025", due: locale === "vi" ? "Còn 12 ngày" : "12 days left", tone: "amber", icon: "R" },
    { title: locale === "vi" ? "Vaccine 5 bệnh (DHPPi)" : "5-in-1 vaccine (DHPPi)", date: locale === "vi" ? "Hạn: 15/06/2025" : "Due: 06/15/2025", due: locale === "vi" ? "Còn 26 ngày" : "26 days left", tone: "info", icon: "V" },
    { title: locale === "vi" ? "Tẩy giun" : "Deworming", date: locale === "vi" ? "Hạn: 20/06/2025" : "Due: 06/20/2025", due: locale === "vi" ? "Còn 31 ngày" : "31 days left", tone: "good", icon: "G" },
  ] as const;
}

export function VaccinationControls({ pet, records }: Props) {
  const router = useRouter();
  const { copy, locale } = useI18n();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const upcomingVaccines = useMemo(() => upcoming(locale), [locale]);
  const recentRecords = useMemo(() => {
    if (records.length) return records.slice(0, 3);
    return [
      { id: "demo-5", vaccineName: locale === "vi" ? "Vaccine 5 bệnh (DHPPi)" : "5-in-1 vaccine (DHPPi)", givenAt: "2024-06-15", clinicName: locale === "vi" ? "Phòng khám PetCare" : "PetCare Veterinary Clinic", status: "complete" },
      { id: "demo-rabies", vaccineName: locale === "vi" ? "Vaccine dại" : "Rabies vaccine", givenAt: "2024-06-01", clinicName: locale === "vi" ? "Phòng khám PetCare" : "PetCare Veterinary Clinic", status: "complete" },
      { id: "demo-worm", vaccineName: locale === "vi" ? "Tẩy giun" : "Deworming", givenAt: "2024-03-20", clinicName: locale === "vi" ? "Phòng khám PetCare" : "PetCare Veterinary Clinic", status: "complete" },
    ] as Array<Pick<VaccinationRecord, "id" | "vaccineName" | "givenAt" | "clinicName" | "status">>;
  }, [records, locale]);

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
      setError(copy.vaccinations.saveError);
      return;
    }

    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
      <Card>
        <form onSubmit={submit} className="grid gap-7">
          <FormSection title={copy.vaccinations.form.section1}>
            <label className={`${labelClass} md:col-span-2`}>
              {copy.vaccinations.form.vaccineName}
              <div className="grid gap-3 md:grid-cols-[1fr_140px]">
                <select name="vaccineName" required defaultValue={locale === "vi" ? "Vaccine 5 bệnh (DHPPi)" : "5-in-1 vaccine (DHPPi)"} className={fieldClass}>
                  <option value="">{copy.vaccinations.form.searchOrChoose}</option>
                  <option>{locale === "vi" ? "Vaccine 5 bệnh (DHPPi)" : "5-in-1 vaccine (DHPPi)"}</option>
                  <option>{locale === "vi" ? "Vaccine dại" : "Rabies vaccine"}</option>
                  <option>{locale === "vi" ? "Tẩy giun" : "Deworming"}</option>
                  <option>{locale === "vi" ? "Vaccine ho cũi" : "Kennel cough vaccine"}</option>
                </select>
                <Button type="button" variant="secondary" className="gap-2">
                  <span className="text-xl">+</span>
                  {copy.vaccinations.form.addNew}
                </Button>
              </div>
            </label>
            <label className={labelClass}>
              {copy.vaccinations.form.vaccineType}
              <select className={fieldClass} defaultValue="">
                <option value="">{copy.vaccinations.form.chooseType}</option>
                <option>{locale === "vi" ? "Vaccine cốt lõi" : "Core vaccine"}</option>
                <option>{locale === "vi" ? "Vaccine bổ sung" : "Non-core vaccine"}</option>
              </select>
            </label>
            <label className={labelClass}>
              {copy.vaccinations.form.manufacturer}
              <select className={fieldClass} defaultValue="">
                <option value="">{copy.vaccinations.form.chooseManufacturer}</option>
                <option>Zoetis</option>
                <option>Merial</option>
              </select>
            </label>
          </FormSection>

          <FormSection title={copy.vaccinations.form.section2}>
            <label className={labelClass}>
              {copy.vaccinations.form.date}
              <input name="givenAt" type="date" required defaultValue="2024-05-20" className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.vaccinations.form.lot}
              <input placeholder={copy.vaccinations.form.lotPlaceholder} className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.vaccinations.form.expiry}
              <input type="date" className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.vaccinations.form.clinic}
              <input name="clinicName" defaultValue={locale === "vi" ? "Phòng khám PetCare" : "PetCare Veterinary Clinic"} className={fieldClass} />
            </label>
            <label className={labelClass}>
              {copy.vaccinations.form.doctor}
              <input defaultValue="Dr. Nguyễn Minh Anh" className={fieldClass} />
            </label>
          </FormSection>

          <FormSection title={copy.vaccinations.form.section3}>
            <label className={labelClass}>
              {copy.vaccinations.form.dose}
              <select className={fieldClass} defaultValue="5 ml">
                <option>5 ml</option>
                <option>2 ml</option>
                <option>1 ml</option>
              </select>
            </label>
            <label className={labelClass}>
              {copy.vaccinations.form.route}
              <select className={fieldClass} defaultValue={locale === "vi" ? "Tiêm dưới da (SC)" : "Subcutaneous (SC)"}>
                <option>{locale === "vi" ? "Tiêm dưới da (SC)" : "Subcutaneous (SC)"}</option>
                <option>{locale === "vi" ? "Tiêm bắp (IM)" : "Intramuscular (IM)"}</option>
              </select>
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              {copy.vaccinations.form.note}
              <textarea name="note" maxLength={500} placeholder={copy.vaccinations.form.notePlaceholder} className={`${fieldClass} min-h-20`} />
              <span className="text-right text-xs text-slate-500">0/500</span>
            </label>
            <input name="nextDueAt" type="hidden" value="2025-06-15" />
          </FormSection>

          <section className="grid gap-3">
            <p className="text-sm font-bold text-slate-900">{copy.vaccinations.form.attachments}</p>
            <div className="grid gap-3 md:grid-cols-[1fr_96px_96px_96px]">
              <div className="flex min-h-24 items-center gap-4 rounded-lg border border-dashed border-violet-300 bg-violet-50/30 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600">U</span>
                <div>
                  <p className="font-bold text-violet-700">{copy.vaccinations.form.upload}</p>
                  <p className="mt-1 text-sm text-slate-500">{copy.vaccinations.form.support}</p>
                </div>
              </div>
              <Attachment />
              <Attachment />
              <div className="grid min-h-24 place-items-center rounded-lg border border-dashed border-slate-300 bg-white text-3xl text-slate-600">+</div>
            </div>
          </section>

          {error ? <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <ButtonLink href={`/dashboard/pets/${pet.id}`} variant="secondary" className="min-w-36">
              {copy.vaccinations.form.cancel}
            </ButtonLink>
            <Button disabled={!ready} className="min-w-72">
              {copy.vaccinations.form.save}
            </Button>
          </div>
        </form>
      </Card>

      <aside className="grid content-start gap-5">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-950">{copy.vaccinations.petInfo}</h2>
            <ButtonLink href={`/dashboard/pets/${pet.id}`} variant="ghost" className="min-h-8 px-2 text-violet-700">
              {copy.common.edit}
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
                {pet.breed || pet.species} · {pet.estimatedAge || (locale === "vi" ? "2 tuổi 3 tháng" : "2 years 3 months")} · 5.2 kg
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">{locale === "vi" ? "Khỏe mạnh" : "Healthy"}</span>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">{locale === "vi" ? "Đã triệt sản" : "Spayed/neutered"}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-950">{copy.vaccinations.upcomingTitle}</h2>
            <ButtonLink href={`/dashboard/pets/${pet.id}/vaccinations`} variant="ghost" className="min-h-8 px-2 text-violet-700">
              {copy.common.viewAll}
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
            <h2 className="text-lg font-black text-slate-950">{copy.vaccinations.recentTitle}</h2>
            <ButtonLink href={`/dashboard/pets/${pet.id}/vaccinations`} variant="ghost" className="min-h-8 px-2 text-violet-700">
              {copy.common.viewAll}
            </ButtonLink>
          </div>
          <div className="mt-5 grid gap-4">
            {recentRecords.map((record) => (
              <RecentRecord key={record.id} record={record} locale={locale} />
            ))}
          </div>
        </Card>

        <Card className="bg-violet-50/70">
          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600">i</span>
            <div>
              <p className="font-black text-slate-950">{copy.vaccinations.noteTitle}</p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-700">
                {copy.vaccinations.noteBullets.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
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

function UpcomingVaccine({ item }: { item: (ReturnType<typeof upcoming>)[number] }) {
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

function RecentRecord({ record, locale }: { record: Pick<VaccinationRecord, "id" | "vaccineName" | "givenAt" | "clinicName" | "status">; locale: "vi" | "en" }) {
  const copy = getCopy(locale);
  return (
    <div className="grid grid-cols-[26px_1fr_auto] gap-3">
      <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-600">✓</span>
      <div>
        <p className="font-black text-slate-950">{record.vaccineName}</p>
        <p className="mt-1 text-sm text-slate-600">
          {formatDate(locale, record.givenAt)} · {record.clinicName || (locale === "vi" ? "Phòng khám PetCare" : "PetCare Veterinary Clinic")}
        </p>
      </div>
      <span className="h-fit rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">{copy.vaccinations.done}</span>
    </div>
  );
}

function Icon({ tone, children }: { tone: "amber" | "info" | "good"; children: ReactNode }) {
  const tones = {
    amber: "bg-amber-50 text-amber-600",
    info: "bg-blue-50 text-blue-600",
    good: "bg-emerald-50 text-emerald-600",
  };
  return <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-black ${tones[tone]}`}>{children}</span>;
}

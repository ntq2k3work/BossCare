import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import type { PetProfile } from "@/lib/pets/types";
import { formatPetAge, formatSex, formatSpecies, getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { AppShell } from "@/components/ui/app-shell";
import { ButtonLink, Card, Panel, dogPhoto } from "@/components/ui/pet-ui";
import { LogoutButton } from "../../logout-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PetDetailPage({ params }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const copy = getCopy(locale);

  try {
    const { id } = await params;
    const pet = await getPet(context, getPetStore(), id);
    const profile = toProfile(pet, locale);
    const healthTimeline = buildHealthTimeline(locale);
    const checkIns = buildCheckIns(locale);
    const vaccines = buildVaccines(locale);

    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="pets">
        <div className="grid gap-6">
          <header className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <nav className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Link href="/dashboard/pets" className="text-slate-700 hover:text-violet-700">
                {copy.petDetail.backToPets}
              </Link>
              <span>›</span>
              <span>{copy.petDetail.title}</span>
            </nav>
            <ButtonLink href="/dashboard/pets" className="min-h-11 gap-2 rounded-lg px-5">
              <span className="text-xl">+</span>
              {copy.petDetail.addPet}
            </ButtonLink>
          </header>

          <Card className="p-6">
            <div className="grid gap-6 xl:grid-cols-[500px_1fr_1fr]">
              <div className="flex gap-6">
                <div className="relative h-56 w-48 shrink-0 overflow-hidden rounded-lg">
                  <img src={dogPhoto} alt={pet.name} className="h-full w-full object-cover" />
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-md bg-white text-violet-700 shadow-sm">
                    C
                  </span>
                </div>
                <div className="min-w-0 py-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-950">{pet.name}</h1>
                    <span className={profile.sex === copy.formats.female ? "text-2xl font-black text-pink-500" : "text-2xl font-black text-blue-600"}>
                      {profile.sex === copy.formats.female ? "♀" : "♂"}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{profile.sex}</span>
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-700">
                    {profile.breed} · {profile.age}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Tag>{profile.weight}</Tag>
                    <Tag>{copy.petDetail.noSpay}</Tag>
                    <Tag>{copy.petDetail.chipped}</Tag>
                  </div>
                  <div className="mt-5 text-sm leading-6 text-slate-600">
                    <p className="font-bold text-slate-900">{copy.petDetail.description}</p>
                    <p>
                      {pet.medicalNotes ||
                        (locale === "vi"
                          ? `${pet.name} rất năng động, thân thiện và thích chơi bóng.`
                          : `${pet.name} is energetic, friendly, and loves playing ball.`)}
                    </p>
                    <p>{pet.allergies ? `${locale === "vi" ? "Dị ứng" : "Allergy"} ${pet.allergies}.` : locale === "vi" ? "Dị ứng phấn hoa nhẹ." : "Mild pollen allergy."}</p>
                  </div>
                </div>
              </div>

              <InfoGrid
                items={[
                  [copy.labels.birthday, profile.birthday],
                  [copy.petDetail.species, profile.breed],
                  [copy.petDetail.color, locale === "vi" ? "Nâu đỏ" : "Brown-red"],
                  [copy.petDetail.weight, profile.weight],
                ]}
              />
              <InfoGrid
                items={[
                  [copy.petDetail.gender, profile.sex],
                  [copy.petDetail.status, pet.archivedAt ? (locale === "vi" ? "Đã lưu trữ" : "Archived") : copy.statuses.healthy],
                  [copy.petDetail.note, pet.allergies || (locale === "vi" ? "Phấn hoa, gà" : "Pollen, chicken")],
                  [copy.petDetail.chipped, "900215000123456"],
                ]}
              />
            </div>
          </Card>

          <nav className="flex gap-8 overflow-x-auto border-b border-slate-200 text-sm font-bold text-slate-600">
            <DetailTab active href={`/dashboard/pets/${pet.id}`}>
              {copy.petDetail.overview}
            </DetailTab>
            <DetailTab href={`/dashboard/pets/${pet.id}/health`}>{copy.health.title}</DetailTab>
            <DetailTab href={`/dashboard/pets/${pet.id}/vaccinations`}>{copy.petDetail.upcomingVaccinationsTitle}</DetailTab>
            <DetailTab href={`/dashboard/pets/${pet.id}/checkins`}>{copy.petDetail.recentCheckInsTitle}</DetailTab>
            <DetailTab href={`/dashboard/pets/${pet.id}`}>{copy.petDetail.profile}</DetailTab>
          </nav>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr_0.85fr]">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950">{copy.petDetail.healthTimelineTitle}</h2>
                <button className="min-h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600">
                  {copy.petDetail.timelineFilter}
                </button>
              </div>
              <div className="mt-6 grid gap-3">
                {healthTimeline.map((item) => (
                  <TimelineRow key={item.title} item={item} />
                ))}
              </div>
              <FooterLink href={`/dashboard/pets/${pet.id}/health`}>{copy.petDetail.viewAllHealthLogs}</FooterLink>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950">{copy.petDetail.recentCheckInsTitle}</h2>
                <ButtonLink href={`/dashboard/pets/${pet.id}/checkins`} variant="ghost" className="min-h-8 px-2 text-violet-700">
                  {copy.common.viewAll}
                </ButtonLink>
              </div>
              <div className="mt-6 grid gap-4">
                {checkIns.map((item) => (
                  <CheckInRow key={item.date} item={item} />
                ))}
              </div>
              <FooterLink href={`/dashboard/pets/${pet.id}/checkins`}>{copy.petDetail.viewAllCheckIns}</FooterLink>
            </Card>

            <aside className="grid content-start gap-5">
              <Card>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-950">{copy.petDetail.upcomingVaccinationsTitle}</h2>
                  <ButtonLink href={`/dashboard/pets/${pet.id}/vaccinations`} variant="ghost" className="min-h-8 px-2 text-violet-700">
                    {copy.common.viewAll}
                  </ButtonLink>
                </div>
                <div className="mt-5 grid gap-3">
                  {vaccines.map((item) => (
                    <VaccineRow key={item.title} item={item} />
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-black text-slate-950">{copy.petDetail.quickInfoTitle}</h2>
                <div className="mt-5 grid gap-4 text-sm">
                  <QuickInfo label={copy.petDetail.lastVetVisit} value={locale === "vi" ? "20/05/2024" : "05/20/2024"} />
                  <QuickInfo label={copy.petDetail.lastVaccination} value={locale === "vi" ? "01/06/2024" : "06/01/2024"} />
                  <QuickInfo label={copy.petDetail.lastDeworming} value={locale === "vi" ? "20/05/2024" : "05/20/2024"} />
                  <QuickInfo label={copy.petDetail.insurance} value={copy.petDetail.notAvailable} />
                </div>
              </Card>
            </aside>
          </div>

          <Panel className="flex flex-wrap items-center justify-between gap-4 border-blue-200 bg-blue-50/70 px-6 py-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">S</span>
              <div>
                <p className="font-black text-slate-950">{copy.petDetail.importantNoteTitle}</p>
                <p className="mt-1 text-sm text-slate-600">{copy.petDetail.importantNoteBody}</p>
              </div>
            </div>
            <ButtonLink href="/dashboard/care-guide" variant="secondary" className="border-violet-200 text-violet-700">
              {copy.petDetail.findVet}
            </ButtonLink>
          </Panel>
        </div>
      </AppShell>
    );
  } catch (error) {
    if (error instanceof PetError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

function toProfile(pet: PetProfile, locale: "vi" | "en") {
  return {
    breed: pet.breed ? `${pet.breed} (${formatSpecies(locale, pet.species)})` : formatSpecies(locale, pet.species),
    sex: formatSex(locale, pet.sex),
    age: formatPetAge(locale, pet, new Date()),
    birthday: pet.birthdate || (locale === "vi" ? "12/03/2022" : "03/12/2022"),
    weight: pet.medicalNotes?.match(/\d+(\.\d+)?\s?kg/i)?.[0] ?? "5.2 kg",
  };
}

function buildHealthTimeline(locale: "vi" | "en") {
  return [
    { title: locale === "vi" ? "Cân nặng" : "Weight", note: locale === "vi" ? "Cân nặng: 5.2 kg" : "Weight: 5.2 kg", date: locale === "vi" ? "15/06/2024" : "06/15/2024", owner: locale === "vi" ? "Linh Nguyễn" : "Linh Nguyen", tone: "good", icon: "W" },
    { title: locale === "vi" ? "Tiêm phòng" : "Vaccination", note: locale === "vi" ? "Đã tiêm: Vaccine 6 bệnh (DHPPi)" : "Vaccinated: 6-in-1 vaccine (DHPPi)", date: locale === "vi" ? "01/06/2024" : "06/01/2024", owner: locale === "vi" ? "Phòng khám PetCare" : "PetCare Veterinary Clinic", tone: "info", icon: "V" },
    { title: locale === "vi" ? "Khám sức khỏe" : "Vet visit", note: locale === "vi" ? "Khám định kỳ, sức khỏe tốt" : "Routine checkup, in good health", date: locale === "vi" ? "20/05/2024" : "05/20/2024", owner: locale === "vi" ? "Phòng khám PetCare" : "PetCare Veterinary Clinic", tone: "amber", icon: "H" },
    { title: locale === "vi" ? "Tiêu hóa" : "Digestion", note: locale === "vi" ? "Phân bình thường" : "Normal stool", date: locale === "vi" ? "18/05/2024" : "05/18/2024", owner: locale === "vi" ? "Linh Nguyễn" : "Linh Nguyen", tone: "rose", icon: "D" },
    { title: locale === "vi" ? "Ghi chú" : "Notes", note: locale === "vi" ? "Thú cưng ăn tốt, năng động hơn" : "The pet is eating well and more energetic", date: locale === "vi" ? "12/05/2024" : "05/12/2024", owner: locale === "vi" ? "Linh Nguyễn" : "Linh Nguyen", tone: "violet", icon: "N" },
  ] as const;
}

function buildCheckIns(locale: "vi" | "en") {
  return [
    { date: locale === "vi" ? "15/06/2024" : "06/15/2024", title: locale === "vi" ? "Vui vẻ" : "Happy", note: locale === "vi" ? "Đi dạo công viên buổi sáng" : "Morning park walk", mood: "🙂" },
    { date: locale === "vi" ? "10/06/2024" : "06/10/2024", title: locale === "vi" ? "Bình thường" : "Normal", note: locale === "vi" ? "Ăn uống tốt" : "Ate well", mood: "🙂" },
    { date: locale === "vi" ? "05/06/2024" : "06/05/2024", title: locale === "vi" ? "Phấn khích" : "Excited", note: locale === "vi" ? "Được tắm và sấy lông" : "Got a bath and blow-dry", mood: "✨" },
  ] as const;
}

function buildVaccines(locale: "vi" | "en") {
  return [
    { title: locale === "vi" ? "Vaccine dại" : "Rabies vaccine", due: locale === "vi" ? "Đến hạn: 01/06/2025" : "Due: 06/01/2025", badge: locale === "vi" ? "Còn 17 ngày" : "17 days left", tone: "amber", icon: "R" },
    { title: locale === "vi" ? "Vaccine 5 bệnh" : "5-in-1 vaccine", due: locale === "vi" ? "Đến hạn: 01/06/2025" : "Due: 06/01/2025", badge: locale === "vi" ? "Còn 17 ngày" : "17 days left", tone: "info", icon: "V" },
    { title: locale === "vi" ? "Tẩy giun" : "Deworming", due: locale === "vi" ? "Đến hạn: 20/06/2025" : "Due: 06/20/2025", badge: locale === "vi" ? "Còn 36 ngày" : "36 days left", tone: "violet", icon: "G" },
  ] as const;
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">{children}</span>;
}

function InfoGrid({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="grid content-center divide-y divide-slate-200 border-l border-slate-200 pl-6 text-sm">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[150px_1fr] items-center gap-4 py-3.5">
          <span className="font-bold text-slate-900">{label}</span>
          <span className="text-right text-slate-600">{value}</span>
        </div>
      ))}
    </div>
  );
}

function DetailTab({ href, active = false, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <Link href={href} className={`min-h-12 shrink-0 border-b-2 px-1 ${active ? "border-violet-600 text-violet-700" : "border-transparent"}`}>
      {children}
    </Link>
  );
}

function TimelineRow({ item }: { item: (ReturnType<typeof buildHealthTimeline>)[number] }) {
  return (
    <div className="grid grid-cols-[44px_1fr_auto] gap-4 rounded-lg border border-slate-200/80 bg-white p-4">
      <Icon tone={item.tone}>{item.icon}</Icon>
      <div>
        <p className="font-black text-slate-950">{item.title}</p>
        <p className="mt-2 text-sm text-slate-600">{item.note}</p>
      </div>
      <div className="text-right text-xs font-bold text-slate-700">
        <p>{item.date}</p>
        <p className="mt-3 text-slate-500">{item.owner}</p>
      </div>
    </div>
  );
}

function CheckInRow({ item }: { item: (ReturnType<typeof buildCheckIns>)[number] }) {
  return (
    <div className="grid grid-cols-[96px_1fr_auto] gap-4 rounded-lg border border-slate-200/80 bg-white p-3">
      <img src={dogPhoto} alt={item.title} className="h-24 w-24 rounded-md object-cover" />
      <div className="py-1">
        <p className="text-sm font-bold text-slate-700">{item.date}</p>
        <p className="mt-2 font-black text-slate-950">{item.title}</p>
        <p className="mt-2 text-sm text-slate-600">{item.note}</p>
      </div>
      <span className="text-2xl">{item.mood}</span>
    </div>
  );
}

function VaccineRow({ item }: { item: (ReturnType<typeof buildVaccines>)[number] }) {
  return (
    <div className="grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-lg bg-slate-50 p-4">
      <Icon tone={item.tone}>{item.icon}</Icon>
      <div>
        <p className="font-black text-slate-950">{item.title}</p>
        <p className="mt-1 text-sm text-slate-600">{item.due}</p>
      </div>
      <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-violet-700">{item.badge}</span>
    </div>
  );
}

function QuickInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-semibold text-slate-600">{label}</span>
      <span className="font-bold text-slate-700">{value}</span>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mt-6 flex justify-center text-sm font-bold text-violet-700">
      {children}
    </Link>
  );
}

function Icon({ tone, children }: { tone: "good" | "info" | "amber" | "rose" | "violet"; children: ReactNode }) {
  const tones = {
    good: "bg-emerald-50 text-emerald-600",
    info: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-black ${tones[tone]}`}>{children}</span>;
}

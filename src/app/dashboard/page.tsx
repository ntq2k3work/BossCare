import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import type { AuthContext } from "@/lib/auth/types";
import { listCheckIns } from "@/lib/checkins/service";
import { getCheckInStore } from "@/lib/checkins/store";
import { getPrisma } from "@/lib/db/prisma";
import { listHealthLogs } from "@/lib/health-logs/service";
import { getHealthLogStore } from "@/lib/health-logs/store";
import { listPets } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import type { PetProfile } from "@/lib/pets/types";
import { listVaccinations } from "@/lib/vaccinations/service";
import { getVaccinationStore } from "@/lib/vaccinations/store";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, ButtonLink, Card, Panel, catPhoto, corgiPhoto, dogPhoto } from "@/components/ui/pet-ui";
import { daysUntil, formatDate, formatDateTime, formatDue, formatPlanLabel, formatPetAge, formatSex, formatSpecies, formatStorageLimit, getCopy, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { LogoutButton } from "./logout-button";

type IconTone = "violet" | "good" | "info" | "amber";
type BadgeTone = "neutral" | "good" | "warn" | "danger" | "violet";
type ReminderTone = Exclude<IconTone, "amber">;

type DashboardPet = {
  id: string;
  name: string;
  details: string;
  age: string;
  status: string;
  tone: BadgeTone;
  image: string;
  active: boolean;
};

type DashboardReminder = {
  title: string;
  pet: string;
  date: string;
  due: string;
  tone: ReminderTone;
  icon: string;
};

type DashboardStat = {
  label: string;
  value: string;
  tone: IconTone;
  icon: string;
};

type DashboardActivity = {
  pet: string;
  text: string;
  time: string;
  image: string;
};

const petImages = [dogPhoto, catPhoto, corgiPhoto] as const;

export default async function AppPage() {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  const dashboard = await getDashboardData(context, locale, copy);

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <header className="pt-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            {copy.dashboard.welcome(context.user.displayName)} <span className="text-amber-400">👋</span>
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {dashboard.petCount ? copy.dashboard.todayWithPet(dashboard.primaryPetName) : copy.dashboard.noPets}
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_384px]">
          <div className="grid gap-6">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950">{copy.dashboard.petsTitle}</h2>
                <ButtonLink href="/dashboard/pets" variant="secondary" className="min-h-10 gap-2 border-violet-200 px-4 text-violet-700">
                  <span className="text-lg">+</span>
                  {copy.dashboard.addPet}
                </ButtonLink>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                {dashboard.pets.map((pet) => (
                  <Panel
                    key={pet.id}
                    className={[
                      "flex min-h-36 gap-4 p-3 transition hover:-translate-y-0.5 hover:shadow-lg",
                      pet.active ? "border-violet-400 shadow-[0_14px_40px_rgba(124,58,237,0.12)]" : "",
                    ].join(" ")}
                  >
                    <img src={pet.image} alt={pet.name} className="h-28 w-24 rounded-lg object-cover" />
                    <div className="min-w-0 py-3">
                      <p className="text-lg font-black text-slate-950">{pet.name}</p>
                      <p className="mt-2 text-sm text-slate-500">{pet.details}</p>
                      <p className="mt-1 text-sm text-slate-500">{pet.age}</p>
                      <Badge tone={pet.tone} className="mt-3">
                        {pet.status}
                      </Badge>
                    </div>
                  </Panel>
                ))}

                <Panel className="grid min-h-36 place-items-center border-dashed border-slate-300 text-center">
                  <div>
                    <p className="text-4xl font-light text-slate-950">+</p>
                    <p className="mt-3 text-sm font-semibold text-slate-700">{copy.dashboard.addPet}</p>
                  </div>
                </Panel>
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-950">{copy.dashboard.remindersTitle}</h2>
                  <ButtonLink href="/dashboard/pets" variant="ghost" className="min-h-8 px-2 text-xs text-violet-700">
                    {copy.common.viewAll}
                  </ButtonLink>
                </div>
                <div className="mt-6 grid gap-3">
                  {dashboard.reminders.length ? (
                    dashboard.reminders.map((item) => <ReminderRow key={`${item.pet}-${item.title}-${item.date}`} {...item} />)
                  ) : (
                    <EmptyPanel text={copy.dashboard.noUpcomingReminders} />
                  )}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-black text-slate-950">{copy.dashboard.quickStatsTitle}</h2>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {dashboard.quickStats.map((stat) => (
                    <Panel key={stat.label} className="min-h-28 p-4">
                      <div className="flex items-center gap-3">
                        <IconTile tone={stat.tone}>{stat.icon}</IconTile>
                        <p className="text-3xl font-black text-slate-950">{stat.value}</p>
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-600">{stat.label}</p>
                    </Panel>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="mb-4 flex items-center gap-2">
                <span className="font-black text-violet-600">++</span>
                <h2 className="text-lg font-black text-slate-950">{copy.dashboard.aiTitle}</h2>
              </div>
              <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
                <div className="relative min-h-36">
                  <div className="absolute left-3 top-5 h-12 w-16 rounded-lg bg-violet-100" />
                  <div className="absolute left-14 top-16 h-24 w-24 rounded-full bg-violet-600 shadow-xl" />
                  <div className="absolute left-20 top-24 h-5 w-5 rounded-full bg-white" />
                  <div className="absolute left-32 top-24 h-5 w-5 rounded-full bg-white" />
                  <img src={dashboard.heroPetImage} alt="AI Care Guide pet" className="absolute bottom-0 right-4 h-32 w-24 rounded-lg object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-950">{copy.dashboard.aiQuestionTitle}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">{copy.dashboard.aiDescription}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <ButtonLink href="/dashboard/care-guide">{copy.dashboard.aiPrompts[0]}</ButtonLink>
                    {copy.dashboard.aiPrompts.slice(1).map((question) => (
                      <ButtonLink key={question} href="/dashboard/care-guide" variant="secondary" className="min-h-9 rounded-full border-slate-200 px-4 text-xs text-slate-600">
                        {question}
                      </ButtonLink>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <aside className="grid content-start gap-6">
            <Card>
              <p className="text-sm text-slate-500">{copy.dashboard.currentPlanTitle}</p>
              <div className="mt-5 flex items-center gap-3">
                <IconTile tone="violet">P</IconTile>
                <p className="text-xl font-black text-slate-950">{dashboard.plan.name}</p>
              </div>
              <p className="mt-3 text-sm font-semibold text-emerald-600">{dashboard.plan.status}</p>
              <div className="mt-5 grid gap-3 text-sm text-slate-600">
                {dashboard.plan.items.map((item) => (
                  <PlanItem key={item}>{item}</PlanItem>
                ))}
              </div>
              <ButtonLink href="/dashboard/billing" variant="secondary" className="mt-5 w-full border-0 bg-violet-50 text-violet-700">
                {copy.dashboard.managePlan}
              </ButtonLink>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-950">{copy.dashboard.importantRemindersTitle}</h2>
                <span className="text-slate-400">...</span>
              </div>
              <div className="mt-5 grid gap-3">
                {dashboard.reminders.length ? (
                  dashboard.reminders.map((item) => <ReminderRow key={`important-${item.pet}-${item.title}-${item.date}`} compact {...item} />)
                ) : (
                  <EmptyPanel text={copy.dashboard.noImportantReminders} />
                )}
              </div>
              <ButtonLink href="/dashboard/pets" variant="ghost" className="mt-4 w-full justify-between text-violet-700">
                {copy.common.viewAll} <span>›</span>
              </ButtonLink>
            </Card>

            <Card>
              <h2 className="text-lg font-black text-slate-950">{copy.dashboard.recentActivityTitle}</h2>
              <div className="mt-5 grid gap-5">
                {dashboard.activities.length ? (
                  dashboard.activities.map((activity) => (
                    <div key={`${activity.pet}-${activity.text}-${activity.time}`} className="flex gap-3">
                      <img src={activity.image} alt={activity.pet} className="h-10 w-10 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{activity.text}</p>
                        <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyPanel text={copy.dashboard.noRecentActivity} />
                )}
              </div>
              <ButtonLink href="/dashboard/pets" variant="ghost" className="mt-5 w-full justify-between text-violet-700">
                {copy.common.viewAll} <span>›</span>
              </ButtonLink>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

async function getDashboardData(context: AuthContext, locale: Locale, copy = getCopy(locale)) {
  if (!context.activeHousehold) {
    return emptyDashboard(context, locale, copy);
  }

  const now = new Date();
  const pets = await listPets(context, getPetStore());
  const activePets = pets.filter((pet) => !pet.archivedAt);
  const petData = await Promise.all(activePets.map((pet) => loadPetDashboardData(context, pet, now, locale)));
  const allHealthLogs = petData.flatMap((item) => item.healthLogs);
  const allVaccinations = petData.flatMap((item) => item.vaccinations.map((record) => ({ ...record, petName: item.pet.name, image: item.image })));
  const allCheckIns = petData.flatMap((item) => item.checkIns.map((checkIn) => ({ ...checkIn, petName: item.pet.name, image: item.image })));
  const reminders = allVaccinations
    .filter((record) => record.nextDueAt && record.status !== "complete")
    .sort((a, b) => new Date(a.nextDueAt ?? 0).getTime() - new Date(b.nextDueAt ?? 0).getTime())
    .slice(0, 3)
    .map((record): DashboardReminder => ({
      title: record.vaccineName,
      pet: record.petName,
      date: formatDate(locale, record.nextDueAt),
      due: formatDue(locale, record.nextDueAt, now),
      tone: record.status === "overdue" ? "info" : record.status === "upcoming" ? "violet" : "good",
      icon: record.status === "overdue" ? "!" : "V",
    }));

  const dashboardPets = petData.slice(0, 3).map((item, index): DashboardPet => {
    const hasOverdue = item.vaccinations.some((record) => record.status === "overdue");
    const hasUpcoming = item.vaccinations.some((record) => record.status === "upcoming" || record.status === "scheduled");
    return {
      id: item.pet.id,
      name: item.pet.name,
      details: petDetails(item.pet, locale),
      age: formatPetAge(locale, item.pet, now),
      status: hasOverdue ? copy.statuses.attention : hasUpcoming ? copy.statuses.reminder : copy.statuses.healthy,
      tone: hasOverdue ? "warn" : hasUpcoming ? "violet" : "good",
      image: item.image,
      active: index === 0,
    };
  });

  const activities = [
    ...allHealthLogs.map((log) => {
      const item = petData.find((entry) => entry.pet.id === log.petId);
      return {
        kind: "health",
        at: log.occurredAt,
        pet: item?.pet.name ?? copy.common.noData,
        image: item?.image ?? dogPhoto,
        text: `${copy.dashboard.stats.healthLogs}: ${log.title}`,
      };
    }),
    ...allVaccinations.map((record) => ({
      kind: "vaccination",
      at: record.givenAt,
      pet: record.petName,
      image: record.image,
      text: `${copy.dashboard.stats.vaccinations}: ${record.vaccineName}`,
    })),
    ...allCheckIns.map((checkIn) => ({
      kind: "checkin",
      at: checkIn.occurredAt,
      pet: checkIn.petName,
      image: checkIn.image,
      text:
        locale === "vi"
          ? checkIn.mediaAssets.length
            ? "Bé vừa được thêm một khoảnh khắc mới"
            : "Bé vừa được thêm một check-in mới"
          : checkIn.mediaAssets.length
            ? "A new moment was added"
            : "A new check-in was added",
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 3)
    .map((activity): DashboardActivity => ({
      pet: activity.pet,
      text: `${activity.text} for ${activity.pet}`,
      time: formatDateTime(locale, activity.at),
      image: activity.image,
    }));

  const mediaCount = allCheckIns.reduce((total, checkIn) => total + checkIn.mediaAssets.length, 0);
  const remindersThisMonth = allVaccinations.filter((record) => {
    if (!record.nextDueAt) return false;
    const days = daysUntil(record.nextDueAt, now);
    return days >= 0 && days <= 30;
  }).length;

  return {
    petCount: activePets.length,
    primaryPetName: activePets[0]?.name ?? copy.dashboard.heroPetQuestion,
    heroPetImage: dashboardPets[0]?.image ?? dogPhoto,
    pets: dashboardPets,
    reminders,
    quickStats: [
      { label: copy.dashboard.stats.healthLogs, value: String(allHealthLogs.length), tone: "violet", icon: "D" },
      { label: copy.dashboard.stats.vaccinations, value: String(allVaccinations.length), tone: "good", icon: "S" },
      { label: copy.dashboard.stats.moments, value: String(mediaCount), tone: "amber", icon: "C" },
      { label: copy.dashboard.stats.remindersThisMonth, value: String(remindersThisMonth), tone: "info", icon: "R" },
    ] satisfies DashboardStat[],
    activities,
    plan: await loadPlanSummary(context, now, locale, copy),
  };
}

async function loadPetDashboardData(context: AuthContext, pet: PetProfile, now: Date, locale: Locale) {
  const [healthLogs, vaccinations, checkIns] = await Promise.all([
    listHealthLogs(context, getHealthLogStore(), pet.id),
    listVaccinations(context, getVaccinationStore(), pet.id, now),
    listCheckIns(context, getCheckInStore(), pet.id),
  ]);
  return {
    pet,
    healthLogs,
    vaccinations,
    checkIns,
    image: imageForPet(pet),
    locale,
  };
}

async function loadPlanSummary(context: AuthContext, now: Date, locale: Locale, copy = getCopy(locale)) {
  const activeEntitlement = await loadActiveEntitlement(context, now);
  const planName = formatPlanLabel(locale, activeEntitlement?.plan?.code ?? context.entitlements.plan);
  const expiry = activeEntitlement?.expiresAt ? formatDate(locale, activeEntitlement.expiresAt.toISOString()) : null;
  return {
    name: planName,
    status: expiry ? copy.dashboard.planStatusActive(expiry) : context.entitlements.plan === "free" ? copy.dashboard.planStatusFree : copy.dashboard.planStatusRunning,
    items: [
      `${context.entitlements.petLimit} ${locale === "vi" ? "thú cưng" : "pets"}`,
      `${formatStorageLimit(locale, context.entitlements.mediaLimitMb)} ${locale === "vi" ? "lưu trữ" : "storage"}`,
      `${context.entitlements.aiSessionsPerMonth} ${locale === "vi" ? "AI Care Guide / tháng" : "AI Care Guide / month"}`,
      context.entitlements.plan === "free" ? copy.dashboard.planItems.basicFeatures : copy.dashboard.planItems.paidFeatures,
    ],
  };
}

async function loadActiveEntitlement(context: AuthContext, now: Date) {
  if (process.env.AUTH_STORE === "memory" || !context.activeHousehold) {
    return null;
  }

  return getPrisma().userEntitlement.findFirst({
    where: {
      householdId: context.activeHousehold.id,
      status: "active",
      expiresAt: { gte: now },
    },
    include: { plan: true },
    orderBy: { expiresAt: "desc" },
  });
}

function emptyDashboard(context: AuthContext, locale: Locale, copy = getCopy(locale)) {
  return {
    petCount: 0,
    primaryPetName: copy.dashboard.heroPetQuestion,
    heroPetImage: dogPhoto,
    pets: [] as DashboardPet[],
    reminders: [] as DashboardReminder[],
    quickStats: [
      { label: copy.dashboard.stats.healthLogs, value: "0", tone: "violet", icon: "D" },
      { label: copy.dashboard.stats.vaccinations, value: "0", tone: "good", icon: "S" },
      { label: copy.dashboard.stats.moments, value: "0", tone: "amber", icon: "C" },
      { label: copy.dashboard.stats.remindersThisMonth, value: "0", tone: "info", icon: "R" },
    ] satisfies DashboardStat[],
    activities: [] as DashboardActivity[],
    plan: {
      name: formatPlanLabel(locale, context.entitlements.plan),
      status: copy.dashboard.noHousehold,
      items: [
        `${context.entitlements.petLimit} ${locale === "vi" ? "thú cưng" : "pets"}`,
        `${formatStorageLimit(locale, context.entitlements.mediaLimitMb)} ${locale === "vi" ? "lưu trữ" : "storage"}`,
        `${context.entitlements.aiSessionsPerMonth} ${locale === "vi" ? "AI Care Guide / tháng" : "AI Care Guide / month"}`,
        copy.dashboard.planItems.basicFeatures,
      ],
    },
  };
}

function imageForPet(pet: PetProfile) {
  const species = pet.species.toLowerCase();
  if (species.includes("cat") || species.includes("mèo")) return catPhoto;
  if (pet.breed?.toLowerCase().includes("corgi")) return corgiPhoto;
  return petImages[Math.abs(hashString(pet.id)) % petImages.length];
}

function petDetails(pet: PetProfile, locale: Locale) {
  const parts = [pet.breed || formatSpecies(locale, pet.species), formatSex(locale, pet.sex)].filter(Boolean);
  return parts.join(" · ") || formatSpecies(locale, pet.species);
}

function hashString(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}

function ReminderRow({
  title,
  pet,
  date,
  due,
  tone,
  icon,
  compact = false,
}: {
  title: string;
  pet: string;
  date: string;
  due: string;
  tone: ReminderTone;
  icon: string;
  compact?: boolean;
}) {
  return (
    <div className={["flex items-center gap-4 rounded-lg border border-slate-200/80 bg-white p-3", compact ? "" : "min-h-20"].join(" ")}>
      <IconTile tone={tone}>{icon}</IconTile>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950">{title}</p>
        <p className="mt-1 text-sm text-slate-500">
          {pet} · {date}
        </p>
      </div>
      <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600">{due}</span>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <Panel className="border-dashed border-slate-300 bg-slate-50/70 text-sm font-medium text-slate-500">
      {text}
    </Panel>
  );
}

function IconTile({ tone, children }: { tone: IconTone; children: ReactNode }) {
  const tones = {
    violet: "bg-violet-50 text-violet-600",
    good: "bg-emerald-50 text-emerald-600",
    info: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-black ${tones[tone]}`}>
      {children}
    </span>
  );
}

function PlanItem({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3">
      <span className="text-emerald-600">✓</span>
      {children}
    </p>
  );
}

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

  const dashboard = await getDashboardData(context);

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
      <div className="grid gap-6">
        <header className="pt-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
            Xin chào, {context.user.displayName}! <span className="text-amber-400">👋</span>
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {dashboard.petCount
              ? `Hôm nay ${dashboard.primaryPetName} khỏe chứ? Cùng xem nhanh tình trạng các bé nhé.`
              : "Thêm thú cưng đầu tiên để bắt đầu theo dõi sức khỏe."}
          </p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_384px]">
          <div className="grid gap-6">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950">Thú cưng của bạn</h2>
                <ButtonLink href="/app/pets" variant="secondary" className="min-h-10 gap-2 border-violet-200 px-4 text-violet-700">
                  <span className="text-lg">+</span>
                  Thêm thú cưng
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
                    <p className="mt-3 text-sm font-semibold text-slate-700">Thêm thú cưng</p>
                  </div>
                </Panel>
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
              <Card>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-950">Nhắc việc sắp tới</h2>
                  <ButtonLink href="/app/pets" variant="ghost" className="min-h-8 px-2 text-xs text-violet-700">
                    Xem tất cả
                  </ButtonLink>
                </div>
                <div className="mt-6 grid gap-3">
                  {dashboard.reminders.length ? (
                    dashboard.reminders.map((item) => <ReminderRow key={`${item.pet}-${item.title}-${item.date}`} {...item} />)
                  ) : (
                    <EmptyPanel text="Chưa có lịch nhắc sắp tới." />
                  )}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-black text-slate-950">Thống kê nhanh</h2>
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
                <h2 className="text-lg font-black text-slate-950">AI Care Guide</h2>
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
                  <h3 className="text-base font-black text-slate-950">Bạn đang thắc mắc điều gì về thú cưng?</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                    AI Care Guide giúp trả lời câu hỏi chăm sóc, dinh dưỡng, sức khỏe dựa trên kiến thức an toàn và giới hạn quota gói hiện tại.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <ButtonLink href="/app/care-guide">Hỏi ngay</ButtonLink>
                    {["Chó ăn gì tốt?", "Dấu hiệu bệnh ở mèo", "Cách tắm cho chó", "Xem thêm câu hỏi"].map((question) => (
                      <ButtonLink key={question} href="/app/care-guide" variant="secondary" className="min-h-9 rounded-full border-slate-200 px-4 text-xs text-slate-600">
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
              <p className="text-sm text-slate-500">Gói hiện tại</p>
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
              <ButtonLink href="/app/billing" variant="secondary" className="mt-5 w-full border-0 bg-violet-50 text-violet-700">
                Quản lý gói
              </ButtonLink>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-950">Nhắc việc quan trọng</h2>
                <span className="text-slate-400">...</span>
              </div>
              <div className="mt-5 grid gap-3">
                {dashboard.reminders.length ? (
                  dashboard.reminders.map((item) => <ReminderRow key={`important-${item.pet}-${item.title}-${item.date}`} compact {...item} />)
                ) : (
                  <EmptyPanel text="Không có nhắc việc quan trọng." />
                )}
              </div>
              <ButtonLink href="/app/pets" variant="ghost" className="mt-4 w-full justify-between text-violet-700">
                Xem tất cả lịch nhắc <span>›</span>
              </ButtonLink>
            </Card>

            <Card>
              <h2 className="text-lg font-black text-slate-950">Hoạt động gần đây</h2>
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
                  <EmptyPanel text="Chưa có hoạt động gần đây." />
                )}
              </div>
              <ButtonLink href="/app/pets" variant="ghost" className="mt-5 w-full justify-between text-violet-700">
                Xem tất cả <span>›</span>
              </ButtonLink>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

async function getDashboardData(context: AuthContext) {
  if (!context.activeHousehold) {
    return emptyDashboard(context);
  }

  const now = new Date();
  const pets = await listPets(context, getPetStore());
  const activePets = pets.filter((pet) => !pet.archivedAt);
  const petData = await Promise.all(activePets.map((pet) => loadPetDashboardData(context, pet, now)));
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
      date: formatDate(record.nextDueAt),
      due: formatDue(record.nextDueAt, now),
      tone: record.status === "overdue" ? "info" : record.status === "upcoming" ? "violet" : "good",
      icon: record.status === "overdue" ? "!" : "V",
    }));

  const dashboardPets = petData.slice(0, 3).map((item, index): DashboardPet => {
    const hasOverdue = item.vaccinations.some((record) => record.status === "overdue");
    const hasUpcoming = item.vaccinations.some((record) => record.status === "upcoming" || record.status === "scheduled");
    return {
      id: item.pet.id,
      name: item.pet.name,
      details: petDetails(item.pet),
      age: petAge(item.pet, now),
      status: hasOverdue ? "Cần chú ý" : hasUpcoming ? "Có nhắc việc" : "Khỏe mạnh",
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
        pet: item?.pet.name ?? "Thú cưng",
        image: item?.image ?? dogPhoto,
        text: `Bạn đã thêm nhật ký sức khỏe: ${log.title}`,
      };
    }),
    ...allVaccinations.map((record) => ({
      kind: "vaccination",
      at: record.givenAt,
      pet: record.petName,
      image: record.image,
      text: `Bạn đã thêm tiêm phòng: ${record.vaccineName}`,
    })),
    ...allCheckIns.map((checkIn) => ({
      kind: "checkin",
      at: checkIn.occurredAt,
      pet: checkIn.petName,
      image: checkIn.image,
      text: checkIn.mediaAssets.length ? "Bạn đã thêm khoảnh khắc mới" : "Bạn đã thêm check-in mới",
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 3)
    .map((activity): DashboardActivity => ({
      pet: activity.pet,
      text: `${activity.text} cho ${activity.pet}`,
      time: formatDateTime(activity.at),
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
    primaryPetName: activePets[0]?.name ?? "các bé",
    heroPetImage: dashboardPets[0]?.image ?? dogPhoto,
    pets: dashboardPets,
    reminders,
    quickStats: [
      { label: "Nhật ký sức khỏe", value: String(allHealthLogs.length), tone: "violet", icon: "D" },
      { label: "Lần tiêm phòng", value: String(allVaccinations.length), tone: "good", icon: "S" },
      { label: "Khoảnh khắc", value: String(mediaCount), tone: "amber", icon: "C" },
      { label: "Nhắc việc tháng này", value: String(remindersThisMonth), tone: "info", icon: "R" },
    ] satisfies DashboardStat[],
    activities,
    plan: await loadPlanSummary(context, now),
  };
}

async function loadPetDashboardData(context: AuthContext, pet: PetProfile, now: Date) {
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
  };
}

async function loadPlanSummary(context: AuthContext, now: Date) {
  const activeEntitlement = await loadActiveEntitlement(context, now);
  const planName = planLabel(activeEntitlement?.plan?.code ?? context.entitlements.plan);
  const expiry = activeEntitlement?.expiresAt ? formatDate(activeEntitlement.expiresAt.toISOString()) : null;
  return {
    name: planName,
    status: expiry ? `Hiệu lực đến ${expiry}` : context.entitlements.plan === "free" ? "Gói miễn phí đang dùng" : "Gói đang hoạt động",
    items: [
      `${context.entitlements.petLimit} thú cưng`,
      `${formatStorageLimit(context.entitlements.mediaLimitMb)} lưu trữ`,
      `${context.entitlements.aiSessionsPerMonth} AI Care Guide / tháng`,
      context.entitlements.plan === "free" ? "Các tính năng cơ bản" : "Tất cả tính năng trả phí",
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

function emptyDashboard(context: AuthContext) {
  return {
    petCount: 0,
    primaryPetName: "các bé",
    heroPetImage: dogPhoto,
    pets: [] as DashboardPet[],
    reminders: [] as DashboardReminder[],
    quickStats: [
      { label: "Nhật ký sức khỏe", value: "0", tone: "violet", icon: "D" },
      { label: "Lần tiêm phòng", value: "0", tone: "good", icon: "S" },
      { label: "Khoảnh khắc", value: "0", tone: "amber", icon: "C" },
      { label: "Nhắc việc tháng này", value: "0", tone: "info", icon: "R" },
    ] satisfies DashboardStat[],
    activities: [] as DashboardActivity[],
    plan: {
      name: planLabel(context.entitlements.plan),
      status: "Chưa có household hoạt động",
      items: [
        `${context.entitlements.petLimit} thú cưng`,
        `${formatStorageLimit(context.entitlements.mediaLimitMb)} lưu trữ`,
        `${context.entitlements.aiSessionsPerMonth} AI Care Guide / tháng`,
        "Các tính năng cơ bản",
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

function petDetails(pet: PetProfile) {
  const parts = [pet.breed || speciesLabel(pet.species), sexLabel(pet.sex)].filter(Boolean);
  return parts.join(" · ") || speciesLabel(pet.species);
}

function speciesLabel(species: string) {
  const normalized = species.toLowerCase();
  if (normalized === "dog" || normalized === "chó") return "Chó";
  if (normalized === "cat" || normalized === "mèo") return "Mèo";
  return species;
}

function sexLabel(sex: string | null) {
  if (!sex) return null;
  const normalized = sex.toLowerCase();
  if (normalized === "male" || normalized === "đực") return "Đực";
  if (normalized === "female" || normalized === "cái") return "Cái";
  return sex;
}

function petAge(pet: PetProfile, now: Date) {
  if (pet.estimatedAge) return pet.estimatedAge;
  if (!pet.birthdate) return "Chưa rõ tuổi";
  const birthdate = new Date(`${pet.birthdate}T00:00:00.000Z`);
  const months = Math.max(0, (now.getUTCFullYear() - birthdate.getUTCFullYear()) * 12 + now.getUTCMonth() - birthdate.getUTCMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years && remainingMonths) return `${years} tuổi ${remainingMonths} tháng`;
  if (years) return `${years} tuổi`;
  return `${remainingMonths || 1} tháng`;
}

function formatDue(value: string | null, now: Date) {
  if (!value) return "Chưa hẹn";
  const days = daysUntil(value, now);
  if (days < 0) return `Quá hạn ${Math.abs(days)} ngày`;
  if (days === 0) return "Hôm nay";
  return `Còn ${days} ngày`;
}

function daysUntil(value: string, now: Date) {
  const target = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return Math.ceil((target.getTime() - start.getTime()) / 86_400_000);
}

function formatDate(value: string | null) {
  if (!value) return "Chưa hẹn";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStorageLimit(value: number) {
  return value >= 1024 ? `${Math.round(value / 1024)}GB` : `${value}MB`;
}

function planLabel(plan: string) {
  if (plan === "plus") return "Plus";
  if (plan === "family") return "Family";
  return "Free";
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

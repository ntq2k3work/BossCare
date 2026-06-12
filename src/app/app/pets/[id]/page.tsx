import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import type { PetProfile } from "@/lib/pets/types";
import { AppShell } from "@/components/ui/app-shell";
import { ButtonLink, Card, Panel, dogPhoto } from "@/components/ui/pet-ui";
import { LogoutButton } from "../../logout-button";

type Props = {
  params: Promise<{ id: string }>;
};

const healthTimeline = [
  { title: "Cân nặng", note: "Cân nặng: 5.2 kg", date: "15/06/2024", owner: "Linh Nguyễn", tone: "good", icon: "W" },
  { title: "Tiêm phòng", note: "Đã tiêm: Vaccine 6 bệnh (DHPPi)", date: "01/06/2024", owner: "Phòng khám PetCare", tone: "info", icon: "V" },
  { title: "Khám sức khỏe", note: "Khám định kỳ, sức khỏe tốt", date: "20/05/2024", owner: "Phòng khám PetCare", tone: "amber", icon: "H" },
  { title: "Tiêu hóa", note: "Phân bình thường", date: "18/05/2024", owner: "Linh Nguyễn", tone: "rose", icon: "D" },
  { title: "Ghi chú", note: "Milo ăn tốt, năng động hơn", date: "12/05/2024", owner: "Linh Nguyễn", tone: "violet", icon: "N" },
] as const;

const checkIns = [
  { date: "15/06/2024", title: "Vui vẻ", note: "Đi dạo công viên buổi sáng", mood: "🙂" },
  { date: "10/06/2024", title: "Bình thường", note: "Ăn uống tốt", mood: "🙂" },
  { date: "05/06/2024", title: "Phấn khích", note: "Được tắm và sấy lông", mood: "💥" },
] as const;

const vaccines = [
  { title: "Vaccine dại", due: "Đến hạn: 01/06/2025", badge: "Còn 17 ngày", tone: "amber", icon: "R" },
  { title: "Vaccine 5 bệnh", due: "Đến hạn: 01/06/2025", badge: "Còn 17 ngày", tone: "info", icon: "V" },
  { title: "Tẩy giun", due: "Đến hạn: 20/06/2025", badge: "Còn 36 ngày", tone: "violet", icon: "G" },
] as const;

export default async function PetDetailPage({ params }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  try {
    const { id } = await params;
    const pet = await getPet(context, getPetStore(), id);
    const profile = toProfile(pet);

    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="pets">
        <div className="grid gap-6">
          <header className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <nav className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Link href="/app/pets" className="text-slate-700 hover:text-violet-700">← Thú cưng</Link>
              <span>›</span>
              <span>Chi tiết thú cưng</span>
            </nav>
            <ButtonLink href="/app/pets" className="min-h-11 gap-2 rounded-lg px-5">
              <span className="text-xl">+</span>
              Thêm thú cưng
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
                    <span className={profile.sex === "Cái" ? "text-2xl font-black text-pink-500" : "text-2xl font-black text-blue-600"}>
                      {profile.sex === "Cái" ? "♀" : "♂"}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{profile.sex}</span>
                  </div>
                  <p className="mt-4 text-base font-semibold text-slate-700">
                    {profile.breed} · {profile.age}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Tag>{profile.weight}</Tag>
                    <Tag>Không triệt sản</Tag>
                    <Tag>Đã gắn chip</Tag>
                  </div>
                  <div className="mt-5 text-sm leading-6 text-slate-600">
                    <p className="font-bold text-slate-900">Mô tả</p>
                    <p>{pet.medicalNotes || "Milo rất năng động, thân thiện và thích chơi bóng."}</p>
                    <p>{pet.allergies ? `Dị ứng ${pet.allergies}.` : "Dị ứng phấn hoa nhẹ."}</p>
                  </div>
                </div>
              </div>

              <InfoGrid
                items={[
                  ["Ngày sinh", profile.birthday],
                  ["Giống", profile.breed],
                  ["Màu lông", "Nâu đỏ"],
                  ["Cân nặng hiện tại", `${profile.weight} (15/06/2024)`],
                ]}
              />
              <InfoGrid
                items={[
                  ["Giới tính", profile.sex],
                  ["Tình trạng", pet.archivedAt ? "Đã lưu trữ" : "Khỏe mạnh"],
                  ["Dị ứng", pet.allergies || "Phấn hoa, Gà"],
                  ["Gắn chip", "900215000123456"],
                ]}
              />
            </div>
          </Card>

          <nav className="flex gap-8 overflow-x-auto border-b border-slate-200 text-sm font-bold text-slate-600">
            <DetailTab active href={`/app/pets/${pet.id}`}>Tổng quan</DetailTab>
            <DetailTab href={`/app/pets/${pet.id}/health`}>Nhật ký sức khỏe</DetailTab>
            <DetailTab href={`/app/pets/${pet.id}/vaccinations`}>Tiêm phòng</DetailTab>
            <DetailTab href={`/app/pets/${pet.id}/checkins`}>Check-in & Khoảnh khắc</DetailTab>
            <DetailTab href={`/app/pets/${pet.id}`}>Lịch nhắc</DetailTab>
            <DetailTab href={`/app/pets/${pet.id}`}>Hồ sơ</DetailTab>
          </nav>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.95fr_0.85fr]">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950">Dòng thời gian sức khỏe</h2>
                <button className="min-h-10 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600">Tất cả ˅</button>
              </div>
              <div className="mt-6 grid gap-3">
                {healthTimeline.map((item) => (
                  <TimelineRow key={item.title} item={item} />
                ))}
              </div>
              <FooterLink href={`/app/pets/${pet.id}/health`}>Xem tất cả nhật ký →</FooterLink>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950">Check-in gần đây</h2>
                <ButtonLink href={`/app/pets/${pet.id}/checkins`} variant="ghost" className="min-h-8 px-2 text-violet-700">
                  Xem tất cả
                </ButtonLink>
              </div>
              <div className="mt-6 grid gap-4">
                {checkIns.map((item) => (
                  <CheckInRow key={item.date} item={item} />
                ))}
              </div>
              <FooterLink href={`/app/pets/${pet.id}/checkins`}>Xem tất cả check-in →</FooterLink>
            </Card>

            <aside className="grid content-start gap-5">
              <Card>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-950">Tiêm phòng sắp tới</h2>
                  <ButtonLink href={`/app/pets/${pet.id}/vaccinations`} variant="ghost" className="min-h-8 px-2 text-violet-700">
                    Xem tất cả
                  </ButtonLink>
                </div>
                <div className="mt-5 grid gap-3">
                  {vaccines.map((item) => (
                    <VaccineRow key={item.title} item={item} />
                  ))}
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-black text-slate-950">Thông tin nhanh</h2>
                <div className="mt-5 grid gap-4 text-sm">
                  <QuickInfo label="Lần khám gần nhất" value="20/05/2024" />
                  <QuickInfo label="Lần tiêm gần nhất" value="01/06/2024" />
                  <QuickInfo label="Lần tẩy giun gần nhất" value="20/05/2024" />
                  <QuickInfo label="Bảo hiểm thú cưng" value="Chưa có" />
                </div>
              </Card>
            </aside>
          </div>

          <Panel className="flex flex-wrap items-center justify-between gap-4 border-blue-200 bg-blue-50/70 px-6 py-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">S</span>
              <div>
                <p className="font-black text-slate-950">Lưu ý quan trọng</p>
                <p className="mt-1 text-sm text-slate-600">Hồ sơ này chỉ mang tính tham khảo và không thay thế cho chẩn đoán của bác sĩ thú y.</p>
              </div>
            </div>
            <ButtonLink href="/app/care-guide" variant="secondary" className="border-violet-200 text-violet-700">
              Tìm bác sĩ thú y
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

function toProfile(pet: PetProfile) {
  return {
    breed: pet.breed ? `${pet.breed} (${pet.species})` : pet.species,
    sex: normalizeSex(pet.sex),
    age: pet.estimatedAge || "2 tuổi 3 tháng",
    birthday: pet.birthdate || "12/03/2022",
    weight: pet.medicalNotes?.match(/\d+(\.\d+)?\s?kg/i)?.[0] ?? "5.2 kg",
  };
}

function normalizeSex(sex: string | null) {
  if (!sex) return "Đực";
  const value = sex.toLowerCase();
  if (value.includes("female") || value.includes("cái")) return "Cái";
  if (value.includes("male") || value.includes("đực") || value.includes("duc")) return "Đực";
  return sex;
}

function Tag({ children }: { children: React.ReactNode }) {
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

function DetailTab({ href, active = false, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`min-h-12 shrink-0 border-b-2 px-1 ${active ? "border-violet-600 text-violet-700" : "border-transparent"}`}>
      {children}
    </Link>
  );
}

function TimelineRow({ item }: { item: (typeof healthTimeline)[number] }) {
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

function CheckInRow({ item }: { item: (typeof checkIns)[number] }) {
  return (
    <div className="grid grid-cols-[96px_1fr_auto] gap-4 rounded-lg border border-slate-200/80 bg-white p-3">
      <img src={dogPhoto} alt={item.title} className="h-24 w-24 rounded-md object-cover" />
      <div className="py-1">
        <p className="text-sm font-bold text-slate-700">{item.date}</p>
        <p className="mt-2 font-black text-slate-950">{item.title}</p>
        <p className="mt-2 text-sm text-slate-600">{item.note}</p>
      </div>
      <span>{item.mood}</span>
    </div>
  );
}

function VaccineRow({ item }: { item: (typeof vaccines)[number] }) {
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-6 flex justify-center text-sm font-bold text-violet-700">
      {children}
    </Link>
  );
}

function Icon({ tone, children }: { tone: "good" | "info" | "amber" | "rose" | "violet"; children: React.ReactNode }) {
  const tones = {
    good: "bg-emerald-50 text-emerald-600",
    info: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return <span className={`flex h-11 w-11 items-center justify-center rounded-lg text-sm font-black ${tones[tone]}`}>{children}</span>;
}

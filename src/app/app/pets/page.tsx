import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { listPets } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import type { PetProfile } from "@/lib/pets/types";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, ButtonLink, Card, Panel, catPhoto, corgiPhoto, dogPhoto } from "@/components/ui/pet-ui";
import { LogoutButton } from "../logout-button";

type DisplayPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  age: string;
  weight: string;
  birthday: string;
  image: string;
  archived: boolean;
  href: string;
};

const demoPets: DisplayPet[] = [
  {
    id: "demo-milo",
    name: "Milo",
    species: "Chó",
    breed: "Poodle",
    sex: "Đực",
    age: "2 tuổi 3 tháng",
    weight: "5.2 kg",
    birthday: "12/03/2022",
    image: dogPhoto,
    archived: false,
    href: "/app/pets",
  },
  {
    id: "demo-miu",
    name: "Miu",
    species: "Mèo",
    breed: "Mèo ta",
    sex: "Cái",
    age: "1 tuổi 2 tháng",
    weight: "3.6 kg",
    birthday: "20/05/2023",
    image: catPhoto,
    archived: false,
    href: "/app/pets",
  },
  {
    id: "demo-bong",
    name: "Bông",
    species: "Chó",
    breed: "Corgi",
    sex: "Đực",
    age: "3 tuổi 1 tháng",
    weight: "8.7 kg",
    birthday: "10/04/2021",
    image: corgiPhoto,
    archived: false,
    href: "/app/pets",
  },
];

export default async function PetsPage() {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  const pets = await listPets(context, getPetStore());
  const activePets = pets.filter((pet) => !pet.archivedAt);
  const displayPets = pets.length ? pets.map(toDisplayPet) : demoPets;
  const dogCount = displayPets.filter((pet) => pet.species.toLowerCase().includes("chó")).length;
  const catCount = displayPets.filter((pet) => pet.species.toLowerCase().includes("mèo")).length;
  const archivedCount = displayPets.filter((pet) => pet.archived).length;

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="pets">
      <div className="grid gap-7">
        <header className="flex flex-wrap items-start justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Thú cưng</h1>
            <p className="mt-3 text-base text-slate-500">Quản lý thông tin và hồ sơ sức khỏe của các bé thú cưng.</p>
          </div>
          <ButtonLink href="/app/pets" className="min-h-12 gap-2 rounded-lg px-6">
            <span className="text-xl">+</span>
            Thêm thú cưng
          </ButtonLink>
        </header>

        <Card className="p-0">
          <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            <Metric icon="P" tone="violet" value={displayPets.length} label="Thú cưng" />
            <Metric icon="V" tone="good" value={2} label="Tiêm phòng sắp tới" />
            <Metric icon="B" tone="amber" value={1} label="Nhắc việc hôm nay" />
            <Metric icon="C" tone="info" value={48} label="Khoảnh khắc" />
          </div>
        </Card>

        <section className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
            <nav className="flex min-w-0 gap-8 overflow-x-auto text-sm font-bold text-slate-500">
              <Tab active label={`Tất cả (${displayPets.length})`} />
              <Tab label={`Chó (${dogCount})`} />
              <Tab label={`Mèo (${catCount})`} />
              <Tab label={`Đã lưu trữ (${archivedCount})`} />
            </nav>
            <div className="flex items-center gap-3 pb-3">
              <div className="hidden rounded-lg border border-slate-200 bg-white p-1 md:flex">
                <button className="min-h-10 rounded-md bg-violet-50 px-4 text-sm font-bold text-violet-700">Lưới</button>
                <button className="min-h-10 px-4 text-sm font-bold text-slate-500">Danh sách</button>
              </div>
              <button className="min-h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600">
                Sắp xếp ˅
              </button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
            {displayPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
            <AddPetCard />
          </div>
        </section>

        <Panel className="flex items-center gap-4 border-violet-100 bg-violet-50/60 px-6 py-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xl text-violet-600">!</span>
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-700">Mẹo:</span> Thông tin được đồng bộ trong toàn bộ tính năng của ứng dụng.
          </p>
        </Panel>

        {!activePets.length && pets.length === 0 ? (
          <p className="text-xs text-slate-400">
            Demo data đang hiển thị để preview giao diện. Tạo thú cưng đầu tiên để thay bằng dữ liệu thật.
          </p>
        ) : null}
      </div>
    </AppShell>
  );
}

function toDisplayPet(pet: PetProfile, index: number): DisplayPet {
  const fallbackImages = [dogPhoto, catPhoto, corgiPhoto];
  const species = normalizeSpecies(pet.species);

  return {
    id: pet.id,
    name: pet.name,
    species,
    breed: pet.breed ?? species,
    sex: normalizeSex(pet.sex),
    age: pet.estimatedAge ?? "Đang cập nhật tuổi",
    weight: pet.medicalNotes?.match(/\d+(\.\d+)?\s?kg/i)?.[0] ?? "Chưa có cân nặng",
    birthday: pet.birthdate ?? "Chưa có ngày sinh",
    image: fallbackImages[index % fallbackImages.length],
    archived: Boolean(pet.archivedAt),
    href: `/app/pets/${pet.id}`,
  };
}

function normalizeSpecies(species: string) {
  if (species.toLowerCase().includes("cat")) return "Mèo";
  if (species.toLowerCase().includes("dog")) return "Chó";
  return species;
}

function normalizeSex(sex: string | null) {
  if (!sex) return "Chưa rõ";
  const value = sex.toLowerCase();
  if (value.includes("female") || value.includes("cái")) return "Cái";
  if (value.includes("male") || value.includes("đực") || value.includes("duc")) return "Đực";
  return sex;
}

function Metric({ icon, tone, value, label }: { icon: string; tone: "violet" | "good" | "amber" | "info"; value: number; label: string }) {
  const tones = {
    violet: "bg-violet-50 text-violet-600",
    good: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    info: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="flex items-center gap-5 px-8 py-7">
      <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg text-xl font-black ${tones[tone]}`}>
        {icon}
      </span>
      <div>
        <p className="text-2xl font-black text-slate-950">{value}</p>
        <p className="mt-2 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button className={`min-h-12 shrink-0 border-b-2 px-1 ${active ? "border-violet-600 text-violet-700" : "border-transparent"}`}>
      {label}
    </button>
  );
}

function PetCard({ pet }: { pet: DisplayPet }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-72">
        <img src={pet.image} alt={pet.name} className="h-full w-full object-cover" />
        <button className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-lg font-black text-slate-700 shadow-sm">
          ...
        </button>
      </div>
      <div className="grid gap-4 p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-slate-950">{pet.name}</h2>
            {pet.archived ? <Badge tone="neutral">Đã lưu trữ</Badge> : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className={pet.sex === "Cái" ? "font-black text-pink-500" : "font-black text-blue-600"}>
              {pet.sex === "Cái" ? "♀" : "♂"}
            </span>
            <span>{pet.sex}</span>
            <Badge tone="neutral" className="border-0 bg-slate-100 text-slate-600">
              {pet.breed}
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-slate-500">
          <InfoRow icon="A" text={pet.age} />
          <InfoRow icon="W" text={pet.weight} />
          <InfoRow icon="D" text={`Sinh nhật: ${pet.birthday}`} />
        </div>

        <div className="grid grid-cols-[1fr_48px] gap-3">
          <Link
            href={pet.href}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-violet-100 bg-violet-50 text-sm font-bold text-violet-700 transition hover:bg-violet-100"
          >
            Xem hồ sơ
          </Link>
          <Link
            href={`${pet.href}/health`}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-violet-100 bg-white text-sm font-black text-violet-700 transition hover:bg-violet-50"
          >
            ||
          </Link>
        </div>
      </div>
    </Card>
  );
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  return (
    <p className="flex items-center gap-3">
      <span className="flex h-5 w-5 items-center justify-center rounded border border-slate-300 text-[10px] font-black text-slate-400">{icon}</span>
      {text}
    </p>
  );
}

function AddPetCard() {
  return (
    <Link
      href="/app/pets"
      className="grid min-h-[520px] place-items-center rounded-lg border border-dashed border-violet-300 bg-white/60 p-8 text-center shadow-[0_18px_55px_rgba(67,56,202,0.05)] transition hover:border-violet-500 hover:bg-violet-50/40"
    >
      <div>
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-4xl font-light text-violet-600">
          +
        </span>
        <p className="mt-7 text-xl font-black text-violet-700">Thêm thú cưng</p>
        <p className="mt-4 max-w-44 text-sm leading-6 text-slate-500">Thêm bé thú cưng mới vào gia đình bạn</p>
      </div>
    </Link>
  );
}

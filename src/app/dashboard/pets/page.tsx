import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { listPets } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import type { PetProfile } from "@/lib/pets/types";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, ButtonLink, Card, Panel, catPhoto, corgiPhoto, dogPhoto } from "@/components/ui/pet-ui";
import { formatSex, formatSpecies, getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
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

export default async function PetsPage() {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const copy = getCopy(locale);
  const pets = await listPets(context, getPetStore());
  const activePets = pets.filter((pet) => !pet.archivedAt);
  const displayPets = pets.length ? pets.map((pet, index) => toDisplayPet(pet, index, locale)) : demoPets(locale);
  const dogCount = displayPets.filter((pet) => pet.species.toLowerCase().includes(locale === "vi" ? "chó" : "dog")).length;
  const catCount = displayPets.filter((pet) => pet.species.toLowerCase().includes(locale === "vi" ? "mèo" : "cat")).length;
  const archivedCount = displayPets.filter((pet) => pet.archived).length;

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="pets">
      <div className="grid gap-7">
        <header className="flex flex-wrap items-start justify-between gap-4 pt-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{copy.petsList.title}</h1>
            <p className="mt-3 text-base text-slate-500">{copy.petsList.description}</p>
          </div>
          <ButtonLink href="/dashboard/pets" className="min-h-12 gap-2 rounded-lg px-6">
            <span className="text-xl">+</span>
            {copy.petsList.addPet}
          </ButtonLink>
        </header>

        <Card className="p-0">
          <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            <Metric icon="P" tone="violet" value={displayPets.length} label={copy.petsList.metrics.pets} />
            <Metric icon="V" tone="good" value={2} label={copy.petsList.metrics.upcomingVaccinations} />
            <Metric icon="B" tone="amber" value={1} label={copy.petsList.metrics.remindersToday} />
            <Metric icon="C" tone="info" value={48} label={copy.petsList.metrics.moments} />
          </div>
        </Card>

        <section className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200">
            <nav className="flex min-w-0 gap-8 overflow-x-auto text-sm font-bold text-slate-500">
              <Tab active label={copy.petsList.tabs.all(displayPets.length)} />
              <Tab label={copy.petsList.tabs.dogs(dogCount)} />
              <Tab label={copy.petsList.tabs.cats(catCount)} />
              <Tab label={copy.petsList.tabs.archived(archivedCount)} />
            </nav>
            <div className="flex items-center gap-3 pb-3">
              <div className="hidden rounded-lg border border-slate-200 bg-white p-1 md:flex">
                <button className="min-h-10 rounded-md bg-violet-50 px-4 text-sm font-bold text-violet-700">{copy.petsList.tabs.grid}</button>
                <button className="min-h-10 px-4 text-sm font-bold text-slate-500">{copy.petsList.tabs.list}</button>
              </div>
              <button className="min-h-11 rounded-lg border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600">
                {copy.petsList.tabs.sort}
              </button>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
            {displayPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} locale={locale} />
            ))}
            <AddPetCard locale={locale} />
          </div>
        </section>

        <Panel className="flex items-center gap-4 border-violet-100 bg-violet-50/60 px-6 py-5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-xl text-violet-600">!</span>
          <p className="text-sm text-slate-600">
            <span className="font-bold text-slate-700">{copy.petsList.tipTitle}</span> {copy.petsList.tipBody}
          </p>
        </Panel>

        {!activePets.length && pets.length === 0 ? (
          <p className="text-xs text-slate-400">{copy.petsList.demoPreview}</p>
        ) : null}
      </div>
    </AppShell>
  );
}

function demoPets(locale: "vi" | "en"): DisplayPet[] {
  const copy = getCopy(locale);
  return [
    {
      id: "demo-milo",
      name: "Milo",
      species: copy.petsList.emptySpeciesDog,
      breed: "Poodle",
      sex: copy.formats.male,
      age: locale === "vi" ? "2 tuổi 3 tháng" : "2 years 3 months",
      weight: locale === "vi" ? "5.2 kg" : "5.2 kg",
      birthday: "12/03/2022",
      image: dogPhoto,
      archived: false,
      href: "/dashboard/pets",
    },
    {
      id: "demo-miu",
      name: "Miu",
      species: copy.petsList.emptySpeciesCat,
      breed: locale === "vi" ? "Mèo ta" : "Domestic cat",
      sex: copy.formats.female,
      age: locale === "vi" ? "1 tuổi 2 tháng" : "1 year 2 months",
      weight: locale === "vi" ? "3.6 kg" : "3.6 kg",
      birthday: "20/05/2023",
      image: catPhoto,
      archived: false,
      href: "/dashboard/pets",
    },
    {
      id: "demo-bong",
      name: locale === "vi" ? "Bông" : "Bong",
      species: copy.petsList.emptySpeciesDog,
      breed: "Corgi",
      sex: copy.formats.male,
      age: locale === "vi" ? "3 tuổi 1 tháng" : "3 years 1 month",
      weight: locale === "vi" ? "8.7 kg" : "8.7 kg",
      birthday: "10/04/2021",
      image: corgiPhoto,
      archived: false,
      href: "/dashboard/pets",
    },
  ];
}

function toDisplayPet(pet: PetProfile, index: number, locale: "vi" | "en"): DisplayPet {
  const fallbackImages = [dogPhoto, catPhoto, corgiPhoto];
  const species = formatSpecies(locale, pet.species);

  return {
    id: pet.id,
    name: pet.name,
    species,
    breed: pet.breed ?? species,
    sex: formatSex(locale, pet.sex),
    age: pet.estimatedAge ?? (locale === "vi" ? "Đang cập nhật tuổi" : "Updating age"),
    weight: pet.medicalNotes?.match(/\d+(\.\d+)?\s?kg/i)?.[0] ?? (locale === "vi" ? "Chưa có cân nặng" : "No weight yet"),
    birthday: pet.birthdate ?? (locale === "vi" ? "Chưa có ngày sinh" : "No birthday yet"),
    image: fallbackImages[index % fallbackImages.length],
    archived: Boolean(pet.archivedAt),
    href: `/dashboard/pets/${pet.id}`,
  };
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

function PetCard({ pet, locale }: { pet: DisplayPet; locale: "vi" | "en" }) {
  const copy = getCopy(locale);
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
            {pet.archived ? <Badge tone="neutral">{copy.petsList.archived}</Badge> : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className={pet.sex === copy.formats.female ? "font-black text-pink-500" : "font-black text-blue-600"}>
              {pet.sex === copy.formats.female ? "♀" : "♂"}
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
          <InfoRow icon="D" text={`${locale === "vi" ? "Sinh nhật" : "Birthday"}: ${pet.birthday}`} />
        </div>

        <div className="grid grid-cols-[1fr_48px] gap-3">
          <Link
            href={pet.href}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-violet-100 bg-violet-50 text-sm font-bold text-violet-700 transition hover:bg-violet-100"
          >
            {copy.petsList.viewProfile}
          </Link>
          <Link
            href={`${pet.href}/health`}
            aria-label={copy.nav.health}
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

function AddPetCard({ locale }: { locale: "vi" | "en" }) {
  const copy = getCopy(locale);
  return (
    <Link
      href="/dashboard/pets"
      className="grid min-h-[520px] place-items-center rounded-lg border border-dashed border-violet-300 bg-white/60 p-8 text-center shadow-[0_18px_55px_rgba(67,56,202,0.05)] transition hover:border-violet-500 hover:bg-violet-50/40"
    >
      <div>
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-4xl font-light text-violet-600">
          +
        </span>
        <p className="mt-7 text-xl font-black text-violet-700">{copy.petsList.addNewTitle}</p>
        <p className="mt-4 max-w-44 text-sm leading-6 text-slate-500">{copy.petsList.addNewDescription}</p>
      </div>
    </Link>
  );
}

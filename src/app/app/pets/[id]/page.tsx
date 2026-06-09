import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import { PetForm } from "../pet-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PetDetailPage({ params }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  try {
    const { id } = await params;
    const pet = await getPet(context, getPetStore(), id);
    return (
      <main className="min-h-screen bg-background px-6 py-10 text-foreground">
        <section className="mx-auto grid w-full max-w-4xl gap-8">
          <header>
            <Link href="/app/pets" className="text-sm text-foreground/60 hover:text-foreground">
              Pets
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold">{pet.name}</h1>
              {pet.archivedAt ? (
                <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs">Archived</span>
              ) : null}
            </div>
          </header>
          <Link
            href={`/app/pets/${pet.id}/health`}
            className="w-fit rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Health logs
          </Link>
          <Link
            href={`/app/pets/${pet.id}/vaccinations`}
            className="w-fit rounded-md border border-foreground/20 px-5 py-3 text-sm font-semibold transition hover:bg-foreground/10"
          >
            Vaccinations
          </Link>
          <Link
            href={`/app/pets/${pet.id}/checkins`}
            className="w-fit rounded-md border border-foreground/20 px-5 py-3 text-sm font-semibold transition hover:bg-foreground/10"
          >
            Check-ins
          </Link>
          <PetForm mode="edit" pet={pet} />
        </section>
      </main>
    );
  } catch (error) {
    if (error instanceof PetError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

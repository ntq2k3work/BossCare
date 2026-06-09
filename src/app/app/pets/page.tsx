import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { listPets } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import { PetForm } from "./pet-form";

export default async function PetsPage() {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  const pets = await listPets(context, getPetStore());
  const activeCount = pets.filter((pet) => !pet.archivedAt).length;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <section className="mx-auto grid w-full max-w-5xl gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link href="/app" className="text-sm text-foreground/60 hover:text-foreground">
              App
            </Link>
            <h1 className="mt-2 text-3xl font-semibold">Pets</h1>
            <p className="mt-1 text-sm text-foreground/60">
              {activeCount}/{context.entitlements.petLimit} active pet slots used
            </p>
          </div>
        </header>

        <section className="grid gap-3">
          {pets.length ? (
            pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/app/pets/${pet.id}`}
                className="rounded-md border border-foreground/15 p-4 transition hover:bg-foreground/5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{pet.name}</p>
                    <p className="text-sm text-foreground/60">{pet.species}</p>
                  </div>
                  <span className="rounded-full border border-foreground/15 px-3 py-1 text-xs">
                    {pet.archivedAt ? "Archived" : "Active"}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="rounded-md border border-foreground/15 p-4 text-sm text-foreground/60">
              No pets yet.
            </p>
          )}
        </section>

        {!pets.some((pet) => !pet.archivedAt) ? (
          <section className="grid gap-4 rounded-md border border-foreground/15 p-5">
            <h2 className="text-xl font-semibold">Create pet profile</h2>
            <PetForm mode="create" />
          </section>
        ) : (
          <p className="rounded-md border border-foreground/15 p-4 text-sm text-foreground/60">
            Free plan allows one active pet. Archive an active pet before creating another.
          </p>
        )}
      </section>
    </main>
  );
}

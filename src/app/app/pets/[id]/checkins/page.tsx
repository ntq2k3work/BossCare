import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { CheckInError } from "@/lib/checkins/errors";
import { listCheckIns } from "@/lib/checkins/service";
import { getCheckInStore } from "@/lib/checkins/store";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import { CheckInControls } from "./checkin-controls";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PetCheckInsPage({ params }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");

  try {
    const { id } = await params;
    const pet = await getPet(context, getPetStore(), id);
    const checkIns = await listCheckIns(context, getCheckInStore(), id);

    return (
      <main className="min-h-screen bg-background px-6 py-10 text-foreground">
        <section className="mx-auto grid w-full max-w-5xl gap-8">
          <header>
            <Link href={`/app/pets/${pet.id}`} className="text-sm text-foreground/60 hover:text-foreground">
              {pet.name}
            </Link>
            <h1 className="mt-2 text-3xl font-semibold">Check-ins</h1>
          </header>
          <CheckInControls petId={pet.id} checkIns={checkIns} />
        </section>
      </main>
    );
  } catch (error) {
    if ((error instanceof PetError && error.status === 404) || (error instanceof CheckInError && error.status === 404)) {
      notFound();
    }
    throw error;
  }
}

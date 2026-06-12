import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import { VaccinationError } from "@/lib/vaccinations/errors";
import { listVaccinations } from "@/lib/vaccinations/service";
import { getVaccinationStore } from "@/lib/vaccinations/store";
import { AppShell } from "@/components/ui/app-shell";
import { LogoutButton } from "../../../logout-button";
import { VaccinationControls } from "./vaccination-controls";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PetVaccinationsPage({ params }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  try {
    const { id } = await params;
    const pet = await getPet(context, getPetStore(), id);
    const records = await listVaccinations(context, getVaccinationStore(), id);

    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="vaccines">
        <div className="grid gap-6">
          <header className="grid gap-5 pt-1">
            <nav className="flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Link href={`/app/pets/${pet.id}`} className="text-slate-700 hover:text-violet-700">←</Link>
              <Link href={`/app/pets/${pet.id}/vaccinations`} className="hover:text-violet-700">Tiêm phòng</Link>
              <span>›</span>
              <span>Thêm mũi tiêm</span>
            </nav>
            <div className="flex items-center gap-5">
              <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-violet-50 text-2xl font-black text-violet-600">V</span>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Thêm mũi tiêm phòng</h1>
                <p className="mt-3 text-base text-slate-500">Ghi lại thông tin mũi tiêm để theo dõi và nhận nhắc đúng hạn.</p>
              </div>
            </div>
          </header>

          <VaccinationControls pet={pet} records={records} />
        </div>
      </AppShell>
    );
  } catch (error) {
    if (
      (error instanceof PetError && error.status === 404) ||
      (error instanceof VaccinationError && error.status === 404)
    ) {
      notFound();
    }
    throw error;
  }
}

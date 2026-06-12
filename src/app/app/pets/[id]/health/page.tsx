import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { HealthLogError } from "@/lib/health-logs/errors";
import { listHealthLogs } from "@/lib/health-logs/service";
import { getHealthLogStore } from "@/lib/health-logs/store";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import { AppShell } from "@/components/ui/app-shell";
import { ButtonLink, dogPhoto } from "@/components/ui/pet-ui";
import { LogoutButton } from "../../../logout-button";
import { HealthLogControls } from "./health-log-controls";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
};

export default async function PetHealthPage({ params, searchParams }: Props) {
  const context = await getCurrentAuthContext();
  if (!context) {
    redirect("/login");
  }

  try {
    const { id } = await params;
    const { type } = await searchParams;
    const pet = await getPet(context, getPetStore(), id);
    const logs = await listHealthLogs(context, getHealthLogStore(), id, type);

    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="health">
        <div className="grid gap-6">
          <header className="flex flex-wrap items-start justify-between gap-4 pt-1">
            <div>
              <nav className="mb-7 flex items-center gap-3 text-sm font-semibold text-slate-500">
                <Link href={`/app/pets/${pet.id}`} className="text-slate-700 hover:text-violet-700">‹</Link>
                <span>Nhật ký sức khỏe</span>
              </nav>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Nhật ký sức khỏe</h1>
              <p className="mt-3 text-base text-slate-500">Theo dõi và quản lý lịch sử sức khỏe của thú cưng.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex min-h-14 min-w-72 items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={dogPhoto} alt={pet.name} className="h-9 w-9 rounded-full object-cover" />
                  <span className="font-bold text-slate-950">{pet.name}</span>
                </div>
                <span className="text-slate-500">⌄</span>
              </div>
              <ButtonLink href={`/app/pets/${pet.id}/health`} className="min-h-14 gap-2 rounded-lg px-6">
                <span className="text-xl">+</span>
                Thêm nhật ký
              </ButtonLink>
            </div>
          </header>

          <HealthLogControls petId={pet.id} petName={pet.name} logs={logs} selectedType={type ?? ""} />
        </div>
      </AppShell>
    );
  } catch (error) {
    if (
      (error instanceof PetError && error.status === 404) ||
      (error instanceof HealthLogError && error.status === 404)
    ) {
      notFound();
    }
    throw error;
  }
}

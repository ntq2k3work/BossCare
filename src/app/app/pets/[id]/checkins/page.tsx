import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { CheckInError } from "@/lib/checkins/errors";
import { listCheckIns } from "@/lib/checkins/service";
import { getCheckInStore } from "@/lib/checkins/store";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import { AppShell } from "@/components/ui/app-shell";
import { ButtonLink, PageHeader } from "@/components/ui/pet-ui";
import { LogoutButton } from "../../../logout-button";
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
      <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
        <div className="grid gap-6">
          <PageHeader
            eyebrow={<ButtonLink href={`/app/pets/${pet.id}`} variant="ghost" className="px-0">Quay lai {pet.name}</ButtonLink>}
            title="Check-in va khoanh khac"
            description="Luu tam trang, ghi chu va anh hang ngay cua thu cung."
          />
          <CheckInControls petId={pet.id} checkIns={checkIns} />
        </div>
      </AppShell>
    );
  } catch (error) {
    if ((error instanceof PetError && error.status === 404) || (error instanceof CheckInError && error.status === 404)) {
      notFound();
    }
    throw error;
  }
}

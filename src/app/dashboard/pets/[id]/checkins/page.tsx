import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { CheckInError } from "@/lib/checkins/errors";
import { listCheckIns } from "@/lib/checkins/service";
import { getCheckInStore } from "@/lib/checkins/store";
import { PetError } from "@/lib/pets/errors";
import { getPet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";
import { getCopy } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
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

  const locale = await getRequestLocale();
  const copy = getCopy(locale);

  try {
    const { id } = await params;
    const pet = await getPet(context, getPetStore(), id);
    const checkIns = await listCheckIns(context, getCheckInStore(), id);

    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />}>
        <div className="grid gap-6">
          <PageHeader
            eyebrow={
              <ButtonLink href={`/dashboard/pets/${pet.id}`} variant="ghost" className="px-0">
                {copy.checkins.back} {pet.name}
              </ButtonLink>
            }
            title={copy.checkins.title}
            description={copy.checkins.description}
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

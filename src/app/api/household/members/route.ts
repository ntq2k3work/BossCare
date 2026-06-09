import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { getAuthStore } from "@/lib/auth/store";
import { householdErrorBody } from "@/lib/households/errors";
import { inviteMember, listMembers } from "@/lib/households/service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  return NextResponse.json({ members: await listMembers(auth.context, getAuthStore()) });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    const member = await inviteMember(auth.context, getAuthStore(), await request.json());
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    const handled = householdErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

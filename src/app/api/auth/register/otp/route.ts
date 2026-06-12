import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { errorBody } from "@/lib/auth/errors";
import { requestRegistrationOtp } from "@/lib/auth/otp";
import { getAuthStore } from "@/lib/auth/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const result = await requestRegistrationOtp(getAuthStore(), await request.json());
    return NextResponse.json(result, { status: 202 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: "invalid_input", message: "Check the account details and password confirmation." } },
        { status: 400 },
      );
    }
    const handled = errorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

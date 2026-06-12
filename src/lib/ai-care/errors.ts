export class AiCareError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function aiCareErrorBody(error: unknown) {
  if (error instanceof AiCareError) {
    return { status: error.status, body: { error: { code: error.code, message: error.message } } };
  }
  return { status: 500, body: { error: { code: "internal_error", message: "Something went wrong." } } };
}

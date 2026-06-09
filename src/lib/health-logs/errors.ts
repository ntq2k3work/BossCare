export class HealthLogError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export function healthLogErrorBody(error: unknown) {
  if (error instanceof HealthLogError) {
    return {
      status: error.status,
      body: { error: { code: error.code, message: error.message } },
    };
  }

  return {
    status: 500,
    body: { error: { code: "internal_error", message: "Something went wrong." } },
  };
}

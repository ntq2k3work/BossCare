export class VaccinationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export function vaccinationErrorBody(error: unknown) {
  if (error instanceof VaccinationError) {
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

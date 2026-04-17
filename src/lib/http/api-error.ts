import axios from 'axios';
import { z } from 'zod';

const apiErrorBodySchema = z
  .object({
    code: z.string().nullable().optional(),
    error: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
  })
  .passthrough();

export class ApiError extends Error {
  readonly code?: string | null;
  readonly status: number;

  constructor(message: string, status = 0, code?: string | null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const toApiError = (
  error: unknown,
  fallbackMessage = 'Something went wrong.'
) => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const parsedBody = apiErrorBodySchema.safeParse(error.response?.data);
    const body = parsedBody.success ? parsedBody.data : null;

    return new ApiError(
      body?.message ?? body?.error ?? error.message ?? fallbackMessage,
      error.response?.status ?? 0,
      body?.code
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message || fallbackMessage);
  }

  return new ApiError(fallbackMessage);
};

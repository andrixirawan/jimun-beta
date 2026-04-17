import { z } from 'zod';

export const getFirstFieldErrors = <TField extends string>(
  error: z.ZodError
) => {
  const nextErrors: Partial<Record<TField, string>> = {};
  const flattenedErrors = error.flatten()
    .fieldErrors as Record<string, string[] | undefined>;

  Object.entries(flattenedErrors).forEach(([field, messages]) => {
    if (!messages?.length) {
      return;
    }

    nextErrors[field as TField] = messages[0];
  });

  return nextErrors;
};

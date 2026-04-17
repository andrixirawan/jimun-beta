import { z } from 'zod';

const publicApiUrlSchema = z
  .string()
  .url('Set EXPO_PUBLIC_API_BASE_URL to a valid backend URL.');

let cachedApiBaseUrl: string | null = null;

export const getPublicApiBaseUrl = () => {
  if (cachedApiBaseUrl) {
    return cachedApiBaseUrl;
  }

  const parsedApiBaseUrl = publicApiUrlSchema.safeParse(
    process.env.EXPO_PUBLIC_API_BASE_URL ?? process.env.EXPO_PUBLIC_API_URL
  );

  if (!parsedApiBaseUrl.success) {
    throw new Error(
      'Missing EXPO_PUBLIC_API_BASE_URL. Add it to your .env file before using auth.'
    );
  }

  cachedApiBaseUrl = parsedApiBaseUrl.data.replace(/\/+$/, '');

  return cachedApiBaseUrl;
};

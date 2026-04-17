import type { AxiosResponse } from 'axios';
import { ApiError, toApiError } from '../http/api-error';
import { httpClient } from '../http/client';
import type { SignInInput, SignUpInput } from './auth.schemas';
import {
  nullableAuthSessionEnvelopeSchema,
  signInInputSchema,
  signUpInputSchema,
} from './auth.schemas';
import {
  clearStoredAuth,
  readStoredAuthToken,
  writeStoredAuthToken,
  writeStoredSessionSnapshot,
} from './auth.storage';

const AUTH_TOKEN_HEADER = 'set-auth-token';

const getBearerHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

const getAuthTokenFromResponse = (response: AxiosResponse) => {
  const rawHeaderValue =
    response.headers?.[AUTH_TOKEN_HEADER] ??
    response.headers?.[AUTH_TOKEN_HEADER.toLowerCase()];

  if (Array.isArray(rawHeaderValue)) {
    return rawHeaderValue[0] ?? null;
  }

  return typeof rawHeaderValue === 'string' ? rawHeaderValue : null;
};

const syncSessionSnapshot = async (token: string) => {
  const response = await httpClient.get('/api/auth/get-session', {
    headers: getBearerHeaders(token),
  });
  const session = nullableAuthSessionEnvelopeSchema.parse(response.data);

  if (!session) {
    await clearStoredAuth();
    return null;
  }

  await writeStoredSessionSnapshot(session);

  return session;
};

const authenticateWithEmail = async (
  path: '/api/auth/sign-in/email' | '/api/auth/sign-up/email',
  payload: Record<string, unknown>
) => {
  const response = await httpClient.post(path, payload);
  const token = getAuthTokenFromResponse(response);

  if (!token) {
    throw new ApiError(
      'Auth token header is missing from the backend response.',
      response.status,
      'MISSING_AUTH_TOKEN'
    );
  }

  await writeStoredAuthToken(token);

  try {
    return await syncSessionSnapshot(token);
  } catch (error) {
    const apiError = toApiError(
      error,
      'Signed in, but failed to restore the latest session.'
    );

    if (apiError.status === 401) {
      await clearStoredAuth();
      throw apiError;
    }

    return null;
  }
};

export const signInWithEmail = async (input: SignInInput) => {
  const payload = signInInputSchema.parse(input);

  try {
    return await authenticateWithEmail('/api/auth/sign-in/email', {
      ...payload,
      rememberMe: true,
    });
  } catch (error) {
    throw toApiError(error, 'Unable to sign in.');
  }
};

export const signUpWithEmail = async (input: SignUpInput) => {
  const payload = signUpInputSchema.parse(input);

  try {
    return await authenticateWithEmail('/api/auth/sign-up/email', payload);
  } catch (error) {
    throw toApiError(error, 'Unable to create your account.');
  }
};

export const refreshStoredSession = async () => {
  const token = await readStoredAuthToken();

  if (!token) {
    return null;
  }

  try {
    return await syncSessionSnapshot(token);
  } catch (error) {
    const apiError = toApiError(error, 'Unable to refresh your session.');

    if (apiError.status === 401) {
      await clearStoredAuth();
      return null;
    }

    throw apiError;
  }
};

export const signOutCurrentSession = async () => {
  const token = await readStoredAuthToken();

  if (!token) {
    await clearStoredAuth();
    return;
  }

  try {
    await httpClient.post('/api/auth/sign-out', undefined, {
      headers: getBearerHeaders(token),
    });
  } catch (error) {
    const apiError = toApiError(error, 'Unable to sign out.');

    if (apiError.status !== 401) {
      throw apiError;
    }
  }

  await clearStoredAuth();
};

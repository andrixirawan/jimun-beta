import * as SecureStore from 'expo-secure-store';
import type { AuthSessionEnvelope } from './auth.schemas';
import { authSessionEnvelopeSchema } from './auth.schemas';

const AUTH_TOKEN_STORAGE_KEY = 'jimun.auth.token';
const AUTH_SESSION_STORAGE_KEY = 'jimun.auth.session';

const SECURE_STORE_OPTIONS = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  keychainService: 'jimun-auth',
} as const;

const deleteSecureValue = async (key: string) => {
  await SecureStore.deleteItemAsync(key, SECURE_STORE_OPTIONS);
};

export const readStoredAuthToken = async () => {
  return SecureStore.getItemAsync(AUTH_TOKEN_STORAGE_KEY, SECURE_STORE_OPTIONS);
};

export const writeStoredAuthToken = async (token: string) => {
  await SecureStore.setItemAsync(
    AUTH_TOKEN_STORAGE_KEY,
    token,
    SECURE_STORE_OPTIONS
  );
};

export const readStoredSessionSnapshot = async () => {
  const rawSession = await SecureStore.getItemAsync(
    AUTH_SESSION_STORAGE_KEY,
    SECURE_STORE_OPTIONS
  );

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = authSessionEnvelopeSchema.safeParse(
      JSON.parse(rawSession)
    );

    if (!parsedSession.success) {
      await deleteSecureValue(AUTH_SESSION_STORAGE_KEY);
      return null;
    }

    return parsedSession.data;
  } catch {
    await deleteSecureValue(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
};

export const writeStoredSessionSnapshot = async (
  session: AuthSessionEnvelope
) => {
  await SecureStore.setItemAsync(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(session),
    SECURE_STORE_OPTIONS
  );
};

export const clearStoredSessionSnapshot = async () => {
  await deleteSecureValue(AUTH_SESSION_STORAGE_KEY);
};

export const clearStoredAuth = async () => {
  await deleteSecureValue(AUTH_TOKEN_STORAGE_KEY);
  await deleteSecureValue(AUTH_SESSION_STORAGE_KEY);
};

export const readPersistedAuthSnapshot = async () => {
  const [token, session] = await Promise.all([
    readStoredAuthToken(),
    readStoredSessionSnapshot(),
  ]);

  if (!token && session) {
    await clearStoredSessionSnapshot();
    return {
      token: null,
      session: null,
    };
  }

  return {
    token,
    session,
  };
};

import { create } from 'zustand';
import type {
  AuthSessionEnvelope,
  AuthTransitionIntent,
  SignInInput,
  SignUpInput,
} from './auth.schemas';
import { readPersistedAuthSnapshot } from './auth.storage';
import {
  refreshStoredSession,
  signInWithEmail,
  signOutCurrentSession,
  signUpWithEmail,
} from './auth.service';

type AuthStatus = 'authenticated' | 'guest';

type AuthStore = {
  initialize: () => Promise<void>;
  isReady: boolean;
  isRefreshingSession: boolean;
  session: AuthSessionEnvelope | null;
  signIn: (input: SignInInput) => Promise<AuthSessionEnvelope | null>;
  signOut: () => Promise<void>;
  signUp: (input: SignUpInput) => Promise<AuthSessionEnvelope | null>;
  status: AuthStatus;
  transitionIntent: AuthTransitionIntent | null;
  clearTransitionIntent: () => void;
  refreshSession: () => Promise<AuthSessionEnvelope | null>;
};

let initializePromise: Promise<void> | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  isReady: false,
  isRefreshingSession: false,
  session: null,
  status: 'guest',
  transitionIntent: null,

  initialize: async () => {
    if (get().isReady) {
      return;
    }

    if (initializePromise) {
      return initializePromise;
    }

    initializePromise = (async () => {
      const persistedAuth = await readPersistedAuthSnapshot();

      if (!persistedAuth.token) {
        set({
          isReady: true,
          isRefreshingSession: false,
          session: null,
          status: 'guest',
        });
        return;
      }

      if (persistedAuth.session) {
        set({
          isReady: true,
          isRefreshingSession: true,
          session: persistedAuth.session,
          status: 'authenticated',
        });

        try {
          const freshSession = await refreshStoredSession();
          set({
            isRefreshingSession: false,
            session: freshSession,
            status: freshSession ? 'authenticated' : 'guest',
          });
        } catch (error) {
          console.warn('Failed to refresh auth session snapshot.', error);
          set({
            isRefreshingSession: false,
          });
        }

        return;
      }

      set({
        isRefreshingSession: true,
      });

      try {
        const session = await refreshStoredSession();
        set({
          isReady: true,
          isRefreshingSession: false,
          session,
          status: session ? 'authenticated' : 'guest',
        });
      } catch (error) {
        console.warn('Failed to restore secure auth session.', error);
        set({
          isReady: true,
          isRefreshingSession: false,
          session: null,
          status: 'authenticated',
        });
      }
    })().finally(() => {
      initializePromise = null;
    });

    return initializePromise;
  },

  refreshSession: async () => {
    set({
      isRefreshingSession: true,
    });

    try {
      const session = await refreshStoredSession();
      set({
        isReady: true,
        isRefreshingSession: false,
        session,
        status: session ? 'authenticated' : 'guest',
      });

      return session;
    } catch (error) {
      set({
        isReady: true,
        isRefreshingSession: false,
      });
      throw error;
    }
  },

  signIn: async (input) => {
    const session = await signInWithEmail(input);

    set({
      isReady: true,
      session,
      status: 'authenticated',
      transitionIntent: 'sign-in',
    });

    if (!session) {
      void get().refreshSession().catch(() => undefined);
    }

    return session;
  },

  signUp: async (input) => {
    const session = await signUpWithEmail(input);

    set({
      isReady: true,
      session,
      status: 'authenticated',
      transitionIntent: 'register',
    });

    if (!session) {
      void get().refreshSession().catch(() => undefined);
    }

    return session;
  },

  signOut: async () => {
    await signOutCurrentSession();

    set({
      isReady: true,
      isRefreshingSession: false,
      session: null,
      status: 'guest',
      transitionIntent: 'sign-out',
    });
  },

  clearTransitionIntent: () => {
    set({
      transitionIntent: null,
    });
  },
}));

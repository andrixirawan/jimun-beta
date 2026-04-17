import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AuthLoadingScreen } from '../../components/auth/auth-loading-screen';
import {
  authTransitionIntentSchema,
  type AuthTransitionIntent,
} from '../../lib/auth/auth.schemas';
import { useAuthStore } from '../../lib/auth/auth.store';

const SCREEN_COPY: Record<
  AuthTransitionIntent,
  { badge: string; description: string; title: string }
> = {
  'sign-in': {
    badge: 'Signed in',
    title: 'Loading your protected space',
    description: 'Your session is ready. Taking you to the protected area now.',
  },
  register: {
    badge: 'Account ready',
    title: 'Preparing your new session',
    description:
      'Your account has been created successfully. Opening the protected area now.',
  },
  'sign-out': {
    badge: 'Signed out',
    title: 'Closing the active session',
    description:
      'The current device session has been cleared. Returning to the login screen.',
  },
};

export default function AuthLoadingRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ intent?: AuthTransitionIntent }>();

  const transitionIntent = useAuthStore((state) => state.transitionIntent);
  const clearTransitionIntent = useAuthStore(
    (state) => state.clearTransitionIntent
  );

  const rawParamIntent = Array.isArray(params.intent)
    ? params.intent[0]
    : params.intent;
  const parsedParamIntent = authTransitionIntentSchema.safeParse(rawParamIntent);
  const intent = transitionIntent ?? (parsedParamIntent.success
    ? parsedParamIntent.data
    : 'sign-in');
  const screenCopy = SCREEN_COPY[intent];

  useEffect(() => {
    const timeout = setTimeout(() => {
      clearTransitionIntent();
      router.replace(intent === 'sign-out' ? '/sign-in' : '/');
    }, 900);

    return () => {
      clearTimeout(timeout);
    };
  }, [clearTransitionIntent, intent, router]);

  return (
    <AuthLoadingScreen
      badge={screenCopy.badge}
      title={screenCopy.title}
      description={screenCopy.description}
    />
  );
}

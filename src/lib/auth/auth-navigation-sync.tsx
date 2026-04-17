import {
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from './auth.store';

export function AuthNavigationSync() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const segments = useSegments();

  const isReady = useAuthStore((state) => state.isReady);
  const status = useAuthStore((state) => state.status);
  const transitionIntent = useAuthStore((state) => state.transitionIntent);

  useEffect(() => {
    if (!rootNavigationState?.key || !isReady || transitionIntent) {
      return;
    }

    const group = String(segments[0] ?? '');
    const leaf = String(segments[1] ?? '');
    const isAuthGroup = group === '(auth)';
    const isProtectedGroup = group === '(protected)' || group === '(tab)';
    const isSignOutRoute = isAuthGroup && leaf === 'sign-out';
    const isLoadingRoute = isAuthGroup && leaf === 'loading';

    if (status === 'authenticated') {
      if (isAuthGroup && !isSignOutRoute && !isLoadingRoute) {
        router.replace('/');
      }
      return;
    }

    if (isProtectedGroup || isSignOutRoute) {
      router.replace('/sign-in');
    }
  }, [
    isReady,
    rootNavigationState?.key,
    router,
    segments,
    status,
    transitionIntent,
  ]);

  return null;
}

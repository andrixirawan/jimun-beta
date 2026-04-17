import { type ReactNode, useEffect } from 'react';
import { useAuthStore } from './auth.store';

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return children;
}

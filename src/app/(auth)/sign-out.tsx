import { type Href, useRouter } from 'expo-router';
import { Button, Spinner, useThemeColor } from 'heroui-native';
import { startTransition, useState } from 'react';
import { View } from 'react-native';
import { AuthScreenShell } from '../../components/auth/auth-screen-shell';
import { AppText } from '../../components/app-text';
import { useAuthStore } from '../../lib/auth/auth.store';

export default function SignOutScreen() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const signOut = useAuthStore((state) => state.signOut);
  const themeColorDangerForeground = useThemeColor('danger-foreground');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      await signOut();
      startTransition(() => {
        router.replace('/loading' as Href);
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to sign out.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreenShell
      badge="Secure sign out"
      title="Leave this device session"
      description={`You are currently signed in as ${
        session?.user.email ?? 'your account'
      }. We will revoke the current session, show a short loading screen, then send you back to login.`}
    >
      {formError ? (
        <View className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3">
          <AppText className="text-sm font-medium text-danger">{formError}</AppText>
        </View>
      ) : null}

      <Button variant="danger" onPress={handleSignOut} isDisabled={isSubmitting}>
        {isSubmitting ? (
          <Spinner color={themeColorDangerForeground} size="sm" />
        ) : null}
        <Button.Label>{isSubmitting ? 'Signing out' : 'Sign out'}</Button.Label>
      </Button>

      <Button
        variant="secondary"
        onPress={() => {
          router.back();
        }}
        isDisabled={isSubmitting}
      >
        Back
      </Button>
    </AuthScreenShell>
  );
}

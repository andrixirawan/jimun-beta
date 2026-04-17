import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Chip } from 'heroui-native';
import { View } from 'react-native';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { useAuthStore } from '../../../lib/auth/auth.store';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const session = useAuthStore((state) => state.session);

  return (
    <ScreenScrollView contentContainerClassName="gap-4 pb-6">
      <Card className="border border-border bg-background shadow-none">
        <Card.Body className="gap-4 p-5">
          <View className="gap-2">
            <AppText className="text-2xl font-semibold text-foreground">
              Session settings
            </AppText>
            <AppText className="text-sm leading-6 text-muted">
              This screen reads the current Better Auth session returned by
              `get-session` and keeps it available after app relaunch.
            </AppText>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <Chip size="sm" variant="secondary">
              <Chip.Label>{session?.session.clientType ?? 'native'}</Chip.Label>
            </Chip>
            <Chip size="sm" variant="secondary">
              <Chip.Label>
                {session?.session.expiresAt ?? 'Expires when session sync finishes'}
              </Chip.Label>
            </Chip>
          </View>
        </Card.Body>
      </Card>

      <Button variant="secondary" onPress={() => router.push('/demo')}>
        <Button.Label>Browse demos</Button.Label>
      </Button>
      <Button variant="danger-soft" onPress={() => router.push('/sign-out')}>
        <Button.Label>Sign out from this device</Button.Label>
      </Button>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ScreenScrollView>
  );
}

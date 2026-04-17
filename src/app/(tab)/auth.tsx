import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Chip } from 'heroui-native';
import { View } from 'react-native';
import { AppText } from '../../components/app-text';
import { ScreenScrollView } from '../../components/screen-scroll-view';
import { useAppTheme } from '../../contexts/app-theme-context';
import { useAuthStore } from '../../lib/auth/auth.store';

export default function AuthTabScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const session = useAuthStore((state) => state.session);

  return (
    <ScreenScrollView contentContainerClassName="gap-4 pb-6">
      <Card className="border border-border bg-background shadow-none">
        <Card.Header className="px-5 pt-5">
          <Chip size="sm" variant="secondary">
            <Chip.Label>Account</Chip.Label>
          </Chip>
        </Card.Header>
        <Card.Body className="gap-3 px-5 pb-5">
          <Card.Title className="text-3xl text-foreground">
            {session?.user.name ?? 'Authenticated member'}
          </Card.Title>
          <Card.Description className="text-base leading-6 text-muted">
            This tab reflects the persisted auth store. If the app closes and
            the backend session is still valid, you stay signed in.
          </Card.Description>
          <View className="gap-1">
            <AppText className="text-sm font-semibold text-foreground">
              {session?.user.email ?? 'Waiting for session sync'}
            </AppText>
            <AppText className="text-sm text-muted">
              {session?.session.clientType ?? 'native'} client
            </AppText>
          </View>
        </Card.Body>
      </Card>

      <Button variant="secondary" onPress={() => router.push('/settings')}>
        <Button.Label>Review session settings</Button.Label>
      </Button>
      <Button variant="danger-soft" onPress={() => router.push('/sign-out')}>
        <Button.Label>Sign out</Button.Label>
      </Button>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ScreenScrollView>
  );
}

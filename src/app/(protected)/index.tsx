import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, Card, Chip } from 'heroui-native';
import { View } from 'react-native';
import { AppText } from '../../components/app-text';
import { ScreenScrollView } from '../../components/screen-scroll-view';
import { useAppTheme } from '../../contexts/app-theme-context';
import { useAuthStore } from '../../lib/auth/auth.store';

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const session = useAuthStore((state) => state.session);

  return (
    <ScreenScrollView contentContainerClassName="gap-5 pb-6">
      <Card className="border border-border bg-background shadow-none">
        <Card.Header className="px-5 pt-5">
          <Chip size="sm" variant="secondary">
            <Chip.Label>Protected area</Chip.Label>
          </Chip>
        </Card.Header>
        <Card.Body className="gap-3 px-5 pb-5">
          <Card.Title className="text-3xl text-foreground">
            {`Welcome, ${session?.user.name ?? 'Member'}`}
          </Card.Title>
          <Card.Description className="text-base leading-6 text-muted">
            Your session is active on this device. Closing or minimizing the app
            will keep you signed in until you explicitly sign out.
          </Card.Description>
          <View className="flex-row flex-wrap gap-2">
            <Chip size="sm" variant="secondary">
              <Chip.Label>{session?.user.email ?? 'Session syncing'}</Chip.Label>
            </Chip>
            <Chip size="sm" variant="secondary">
              <Chip.Label>{session?.user.role ?? 'User'}</Chip.Label>
            </Chip>
          </View>
        </Card.Body>
      </Card>

      <View className="gap-3">
        <Button onPress={() => router.push('/demo')}>
          <Button.Label>Open component demos</Button.Label>
        </Button>
        <Button variant="secondary" onPress={() => router.push('/settings')}>
          <Button.Label>Open settings</Button.Label>
        </Button>
        <Button variant="secondary" onPress={() => router.push('/auth')}>
          <Button.Label>Open account</Button.Label>
        </Button>
        <Button variant="danger-soft" onPress={() => router.push('/sign-out')}>
          <Button.Label>Sign out</Button.Label>
        </Button>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ScreenScrollView>
  );
}

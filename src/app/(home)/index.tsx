import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { Pressable, View } from 'react-native';
import { AppText } from '../../components/app-text';
import { ScreenScrollView } from '../../components/screen-scroll-view';

export default function HomeScreen() {
  const themeColorForeground = useThemeColor('foreground');

  return (
    <ScreenScrollView contentContainerClassName="flex-1 justify-center items-center">
      <View className="w-full px-6 gap-3">
        <AppText className="text-3xl font-semibold text-foreground text-center">
          Home
        </AppText>
        <AppText className="text-sm text-muted text-center mb-2">
          Simple home screen untuk navigasi cepat.
        </AppText>

        <Link href="/(tab)/demo" asChild>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-xl bg-foreground py-3">
            <Feather name="grid" size={16} color="#ffffff" />
            <AppText className="text-background font-semibold">Demo</AppText>
          </Pressable>
        </Link>

        <Link href="/(tab)/settings" asChild>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-border py-3">
            <Feather name="settings" size={16} color={themeColorForeground} />
            <AppText className="text-foreground font-semibold">Settings</AppText>
          </Pressable>
        </Link>

        <Link href="/(auth)/sign-in" asChild>
          <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-border py-3">
            <Feather name="log-in" size={16} color={themeColorForeground} />
            <AppText className="text-foreground font-semibold">Sign In</AppText>
          </Pressable>
        </Link>
      </View>
    </ScreenScrollView>
  );
}

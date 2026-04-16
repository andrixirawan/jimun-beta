import Feather from '@expo/vector-icons/Feather';
import { Link } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { Pressable, View } from 'react-native';
import { AppText } from '../../components/app-text';
import { ScreenScrollView } from '../../components/screen-scroll-view';

export default function SignInScreen() {
  const themeColorForeground = useThemeColor('foreground');

  return (
    <ScreenScrollView contentContainerClassName="flex-1 justify-center items-center">
      <View className="w-full items-center px-6 gap-3">
        <AppText className="text-2xl font-semibold text-foreground">
          Sign In
        </AppText>
        <AppText className="text-sm text-muted text-center mt-2">
          Blank UI placeholder untuk halaman sign in.
        </AppText>

        <View className="w-full gap-3 mt-3">
          <Link href="/(tab)" asChild>
            <Pressable className="flex-row items-center justify-center gap-2 rounded-xl bg-foreground py-3">
              <Feather name="home" size={16} color="#ffffff" />
              <AppText className="text-background font-semibold">Home</AppText>
            </Pressable>
          </Link>

          <Link href="/(auth)/register" asChild>
            <Pressable className="flex-row items-center justify-center gap-2 rounded-xl border border-border py-3">
              <Feather name="user-plus" size={16} color={themeColorForeground} />
              <AppText className="text-foreground font-semibold">
                Register
              </AppText>
            </Pressable>
          </Link>
        </View>
      </View>
    </ScreenScrollView>
  );
}

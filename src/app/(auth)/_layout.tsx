import { Stack } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { useCallback } from 'react';
import { Platform, View } from 'react-native';
import { ThemeToggle } from '../../components/theme-toggle';
import { useAppTheme } from '../../contexts/app-theme-context';

export default function AuthLayout() {
  const { isDark } = useAppTheme();
  const [themeColorForeground, themeColorBackground] = useThemeColor([
    'foreground',
    'background',
  ]);
  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <View className="flex-1 bg-background">
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerTransparent: true,
          headerBlurEffect: isDark ? 'dark' : 'light',
          headerTintColor: themeColorForeground,
          headerStyle: {
            backgroundColor: Platform.select({
              ios: undefined,
              android: themeColorBackground,
            }),
          },
          headerTitleStyle: {
            fontFamily: 'Inter_600SemiBold',
          },
          headerRight: renderThemeToggle,
          headerBackButtonDisplayMode: 'generic',
          contentStyle: {
            backgroundColor: themeColorBackground,
          },
        }}
      >
        <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
        <Stack.Screen name="register" options={{ title: 'Register' }} />
        <Stack.Screen name="sign-out" options={{ title: 'Sign Out' }} />
      </Stack>
    </View>
  );
}

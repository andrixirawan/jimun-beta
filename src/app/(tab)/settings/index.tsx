import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AppText } from '../../../components/app-text';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { useAppTheme } from '../../../contexts/app-theme-context';

export default function SettingsScreen() {
  const { isDark } = useAppTheme();

  return (
    <ScreenScrollView contentContainerClassName="flex-1 justify-center items-center">
      <View className="w-full items-center px-6">
        <AppText className="text-2xl font-semibold text-foreground">
          Settings
        </AppText>
        <AppText className="text-sm text-muted text-center mt-2">
          Blank UI placeholder untuk halaman settings.
        </AppText>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ScreenScrollView>
  );
}

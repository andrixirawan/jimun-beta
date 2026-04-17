import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Spinner, Surface, useThemeColor } from 'heroui-native';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../contexts/app-theme-context';
import { AppText } from '../app-text';

type AuthLoadingScreenProps = {
  badge?: string;
  description: string;
  title: string;
};

export function AuthLoadingScreen({
  badge = 'Secure session',
  description,
  title,
}: AuthLoadingScreenProps) {
  const { isDark } = useAppTheme();
  const [themeColorAccent, themeColorAccentForeground] = useThemeColor([
    'accent',
    'accent-foreground',
  ]);

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={
          isDark
            ? ['rgba(14,165,233,0.16)', 'rgba(2,6,23,0)']
            : ['rgba(14,165,233,0.14)', 'rgba(255,255,255,0)']
        }
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View className="flex-1 items-center justify-center px-6">
        <Surface className="w-full rounded-[28px] border border-border/60 px-6 py-7">
          <View className="flex-row items-center gap-4">
            <View
              className="size-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: themeColorAccent }}
            >
              <Spinner color={themeColorAccentForeground} size="sm" />
            </View>
            <View className="flex-1 gap-1">
              <AppText className="text-xs font-semibold uppercase text-muted">
                {badge}
              </AppText>
              <AppText className="text-xl font-semibold text-foreground">
                {title}
              </AppText>
              <AppText className="text-sm leading-6 text-muted">
                {description}
              </AppText>
            </View>
          </View>
        </Surface>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

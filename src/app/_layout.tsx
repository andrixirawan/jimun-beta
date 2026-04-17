import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  Saira_400Regular,
  Saira_500Medium,
  Saira_600SemiBold,
  Saira_700Bold,
} from '@expo-google-fonts/saira';
import {
  SNPro_400Regular,
  SNPro_500Medium,
  SNPro_600SemiBold,
  SNPro_700Bold,
} from '@expo-google-fonts/sn-pro';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { HeroUINativeProvider } from 'heroui-native';
import { type ReactNode, useCallback, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  KeyboardAvoidingView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import '../../global.css';
import { AuthLoadingScreen } from '../components/auth/auth-loading-screen';
import { AppThemeProvider, useAppTheme } from '../contexts/app-theme-context';
import { AuthNavigationSync } from '../lib/auth/auth-navigation-sync';
import { AuthProvider } from '../lib/auth/auth-provider';
import { useAuthStore } from '../lib/auth/auth.store';

SplashScreen.setOptions({
  duration: 300,
  fade: true,
});

/**
 * Component that wraps app content inside KeyboardProvider
 * Contains the contentWrapper and HeroUINativeProvider configuration
 */
function AppContent() {
  const contentWrapper = useCallback(
    (children: ReactNode) => (
      <KeyboardAvoidingView
        pointerEvents="box-none"
        behavior="padding"
        keyboardVerticalOffset={12}
        className="flex-1"
      >
        {children}
      </KeyboardAvoidingView>
    ),
    []
  );

  return (
    <AppThemeProvider>
      <AuthProvider>
        <HeroUINativeProvider
          config={{
            textProps: {
              maxFontSizeMultiplier: 2,
            },
            toast: {
              contentWrapper,
            },
            devInfo: {
              stylingPrinciples: false,
            },
          }}
        >
          <AppShell />
        </HeroUINativeProvider>
      </AuthProvider>
    </AppThemeProvider>
  );
}

function AppShell() {
  const { isHydrated, isDark } = useAppTheme();
  const isAuthReady = useAuthStore((state) => state.isReady);

  useEffect(() => {
    if (!isHydrated || Platform.OS !== 'android') return;

    const syncAndroidNavigationBarStyle = async () => {
      try {
        NavigationBar.setStyle(isDark ? 'dark' : 'light');
      } catch {
        // Navigation bar style may be unavailable on some Android configurations.
      }
    };

    syncAndroidNavigationBarStyle();
  }, [isDark, isHydrated]);

  if (!isHydrated) {
    return <View className="flex-1 bg-background" />;
  }

  if (!isAuthReady) {
    return (
      <AuthLoadingScreen
        badge="Secure bootstrap"
        title="Checking your session"
        description="We are restoring your secure session before opening the app."
      />
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AuthNavigationSync />
      <Slot />
    </View>
  );
}

export default function Layout() {
  const fonts = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Saira_400Regular,
    Saira_500Medium,
    Saira_600SemiBold,
    Saira_700Bold,
    SNPro_400Regular,
    SNPro_500Medium,
    SNPro_600SemiBold,
    SNPro_700Bold,
  });

  useEffect(() => {
    if (fonts) {
      SplashScreen.hideAsync();
    }
  }, [fonts]);

  if (!fonts) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <AppContent />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

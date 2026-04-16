import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Uniwind, useUniwind } from 'uniwind';

type ThemeName =
  | 'light'
  | 'dark'
  | 'lavender-light'
  | 'lavender-dark'
  | 'mint-light'
  | 'mint-dark'
  | 'sky-light'
  | 'sky-dark';

interface AppThemeContextType {
  currentTheme: string;
  isLight: boolean;
  isDark: boolean;
  isHydrated: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(
  undefined
);

const THEME_STORAGE_KEY = 'app-theme';

const AVAILABLE_THEMES: ThemeName[] = [
  'light',
  'dark',
  'lavender-light',
  'lavender-dark',
  'mint-light',
  'mint-dark',
  'sky-light',
  'sky-dark',
];

const isThemeName = (theme: string | null): theme is ThemeName => {
  if (!theme) return false;
  return AVAILABLE_THEMES.includes(theme as ThemeName);
};

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme } = useUniwind();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hydrateTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (!isMounted) return;

        if (isThemeName(savedTheme)) {
          Uniwind.setTheme(savedTheme);
          setIsHydrated(true);
          return;
        }

        Uniwind.setTheme('light');
        setIsHydrated(true);
      } catch {
        if (!isMounted) return;
        Uniwind.setTheme('light');
        setIsHydrated(true);
      }
    };

    hydrateTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch(() => undefined);
  }, [isHydrated, theme]);

  const isLight = useMemo(() => {
    return theme === 'light' || theme.endsWith('-light');
  }, [theme]);

  const isDark = useMemo(() => {
    return theme === 'dark' || theme.endsWith('-dark');
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeName) => {
    Uniwind.setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    switch (theme) {
      case 'light':
        Uniwind.setTheme('dark');
        break;
      case 'dark':
        Uniwind.setTheme('light');
        break;
      case 'lavender-light':
        Uniwind.setTheme('lavender-dark');
        break;
      case 'lavender-dark':
        Uniwind.setTheme('lavender-light');
        break;
      case 'mint-light':
        Uniwind.setTheme('mint-dark');
        break;
      case 'mint-dark':
        Uniwind.setTheme('mint-light');
        break;
      case 'sky-light':
        Uniwind.setTheme('sky-dark');
        break;
      case 'sky-dark':
        Uniwind.setTheme('sky-light');
        break;
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      currentTheme: theme,
      isLight,
      isDark,
      isHydrated,
      setTheme,
      toggleTheme,
    }),
    [theme, isLight, isDark, isHydrated, setTheme, toggleTheme]
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
};

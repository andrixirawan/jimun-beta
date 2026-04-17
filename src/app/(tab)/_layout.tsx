import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useCallback } from "react";
import { Platform } from "react-native";
import { ThemeToggle } from "../../components/theme-toggle";
import { useAppTheme } from "../../contexts/app-theme-context";

export default function TabLayout() {
  const { isDark } = useAppTheme();
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const themeColorMuted = useThemeColor("muted");
  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Tabs
      backBehavior="none"
      screenOptions={{
        headerTitleAlign: "center",
        headerTransparent: true,
        headerTintColor: themeColorForeground,
        headerStyle: {
          backgroundColor: Platform.select({
            ios: undefined,
            android: themeColorBackground,
          }),
        },
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
        },
        headerRight: renderThemeToggle,
        tabBarActiveTintColor: themeColorForeground,
        tabBarInactiveTintColor: themeColorMuted,
        tabBarStyle: {
          backgroundColor: themeColorBackground,
          borderTopColor: isDark
            ? "rgba(255,255,255,0.12)"
            : "rgba(0,0,0,0.08)",
        },
        sceneStyle: {
          backgroundColor: themeColorBackground,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="demo"
        options={{
          title: "Demo",
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="auth"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

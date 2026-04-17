import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Card, Chip, cn } from 'heroui-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../contexts/app-theme-context';
import { AppText } from '../app-text';
import { ScreenScrollView } from '../screen-scroll-view';

type AuthScreenShellProps = {
  badge: string;
  children: ReactNode;
  description: string;
  footer?: ReactNode;
  title: string;
};

export function AuthScreenShell({
  badge,
  children,
  description,
  footer,
  title,
}: AuthScreenShellProps) {
  const { isDark } = useAppTheme();

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={
          isDark
            ? ['rgba(8,145,178,0.18)', 'rgba(2,6,23,0)']
            : ['rgba(14,165,233,0.14)', 'rgba(255,255,255,0)']
        }
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
      <ScreenScrollView contentContainerClassName="flex-1 justify-center py-10">
        <View className="gap-6">
          <View className="gap-3">
            <Chip size="sm" variant="secondary" className="self-start">
              <Chip.Label>{badge}</Chip.Label>
            </Chip>
            <View className="gap-2">
              <AppText className="text-4xl font-semibold tracking-tight text-foreground">
                {title}
              </AppText>
              <AppText className="text-base leading-6 text-muted">
                {description}
              </AppText>
            </View>
          </View>
          <Card
            className={cn(
              'border border-border bg-background/95 shadow-none',
              isDark && 'border-white/10 bg-background/90'
            )}
          >
            <Card.Body className="gap-5 p-5">{children}</Card.Body>
          </Card>
          {footer ? <View className="items-center px-2">{footer}</View> : null}
        </View>
      </ScreenScrollView>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

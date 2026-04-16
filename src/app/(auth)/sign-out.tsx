import { View } from 'react-native';
import { AppText } from '../../components/app-text';
import { ScreenScrollView } from '../../components/screen-scroll-view';

export default function SignOutScreen() {
  return (
    <ScreenScrollView contentContainerClassName="flex-1 justify-center items-center">
      <View className="w-full items-center px-6">
        <AppText className="text-2xl font-semibold text-foreground">
          Sign Out
        </AppText>
        <AppText className="text-sm text-muted text-center mt-2">
          Blank UI placeholder untuk halaman sign out.
        </AppText>
      </View>
    </ScreenScrollView>
  );
}

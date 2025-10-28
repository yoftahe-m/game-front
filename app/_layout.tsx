import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { router, Slot, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { Provider, useSelector } from 'react-redux';
import { persistor, RootState, store } from '@/store';
import { ActivityIndicator } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator size="large" />} persistor={persistor}>
        <GluestackUIProvider mode="system">
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthProvider>
              <Slot />
              <StatusBar style="auto" />
            </AuthProvider>
          </ThemeProvider>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const isRehydrated = useSelector((state: RootState) => state._persist.rehydrated);
  const { refreshToken } = useSelector((state: RootState) => state.user);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    if (isRehydrated && !refreshToken) router.replace('/signin');
    else if (isRehydrated && refreshToken) {
      setIsFirstLoad(false);
      router.replace('/(app)/(tabs)');
    }
  }, [isRehydrated, refreshToken]);
  useEffect(() => {
    if (isRehydrated) SplashScreen.hideAsync();
  }, [isRehydrated]);
  if (!isRehydrated) return null;
  return <>{children}</>;
}

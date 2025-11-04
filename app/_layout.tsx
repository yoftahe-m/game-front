import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { router, Slot, Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fab, FabIcon } from '@/components/ui/fab';
import { MoonIcon, SunIcon } from '@/components/ui/icon';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { persistor, RootState, store } from '@/store';
import { ActivityIndicator, View } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import baseQuery from '@/store/baseQuery';
import { logout, setCredentials } from '@/store/slice/user';
import { RootSiblingParent } from 'react-native-root-siblings';
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
    <RootSiblingParent>
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator size="large" />} persistor={persistor}>
          <GestureHandlerRootView>
            <GluestackUIProvider>
              {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}

              <AuthProvider>
                {/* <Slot screenOptions={{ headerStyle: { backgroundColor: 'red' },}}/> */}
                <Stack
                  screenOptions={{
                    contentStyle: { backgroundColor: '#071843' },
                  }}
                >
                  <Stack.Screen name="(app)" options={{ headerShown: false }} />
                  <Stack.Screen name="signin" options={{ headerShown: false }} />
                  <Stack.Screen name="signup" options={{ headerShown: false }} />
                </Stack>

                <StatusBar style="light" />
              </AuthProvider>
              {/* </ThemeProvider> */}
            </GluestackUIProvider>
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </RootSiblingParent>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { refreshToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const [targetRoute, setTargetRoute] = useState<'/(app)/(tabs)' | '/signin' | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (!refreshToken) {
          setTargetRoute('/signin');
          return;
        }

        const res = await baseQuery(
          { url: '/user/refreshToken', method: 'POST', body: { refreshToken } },
          { getState: () => store.getState(), dispatch } as any,
          {}
        );

        if (res.data) {
          const { accessToken: newAccess, refreshToken: newRefresh } = res.data as any;
          dispatch(setCredentials({ accessToken: newAccess, refreshToken: newRefresh }));
          setTargetRoute('/(app)/(tabs)');
        } else {
          dispatch(logout());
          setTargetRoute('/signin');
        }
      } catch {
        dispatch(logout());
        setTargetRoute('/signin');
      } finally {
        await SplashScreen.hideAsync();
        setReady(true);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (ready && targetRoute) router.replace(targetRoute);
  }, [ready, targetRoute]);

  if (!ready) return null;

  return <>{children}</>;
}

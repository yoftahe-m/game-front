import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { router, Stack } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { PersistGate } from 'redux-persist/integration/react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import baseQuery from '@/store/baseQuery';
import { persistor, RootState, store } from '@/store';
import { logout, setCoins, setCredentials } from '@/store/slice/user';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

import '@/global.css';

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
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <PersistGate loading={<ActivityIndicator size="large" />} persistor={persistor}>
          <GestureHandlerRootView>
            <GluestackUIProvider>
              <AuthProvider>
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
          const { accessToken: newAccess, refreshToken: newRefresh, coins } = res.data as any;
          dispatch(setCredentials({ accessToken: newAccess, refreshToken: newRefresh }));
          dispatch(setCoins({ coins }));
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

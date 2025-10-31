import { Tabs } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: { backgroundColor: '#0c2665' },
        headerStyle: { backgroundColor: '#0c2665' },
        headerTitleStyle: { color: 'white' },
        headerShown: false,
        tabBarActiveTintColor: '#fbbf24',
        tabBarInactiveTintColor: 'white',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <Ionicons name="game-controller-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="crown-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

import { View, Animated } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { useEffect, useRef } from 'react';

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const animValues = useRef(state.routes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    state.routes.forEach((_, i) => {
      Animated.spring(animValues[i], {
        toValue: state.index === i ? 1 : 0,
        useNativeDriver: false,
      }).start();
    });
  }, [state.index]);
  return (
    <View className="flex flex-row items-end h-[80px] ">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const height = animValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [60, 80],
        });
        const radius = animValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 8],
        });

        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={index}
            style={{ flex: 1 }}
          >
            <Animated.View
              style={{
                height,
                borderTopLeftRadius: radius,
                borderTopRightRadius: radius,
                backgroundColor: isFocused ? '#22c55e' : '#0c2665',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: isFocused ? colors.primary : colors.text }}>{label}</Text>
            </Animated.View>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

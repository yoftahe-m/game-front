import { Tabs } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Home from '@/assets/icons/Home';
import Game from '@/assets/icons/Game';
import Trophy from '@/assets/icons/Trophy';

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
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="crown-outline" size={24} color={color} />,
        }}
      />
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
    </Tabs>
  );
}

import { View, Animated } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

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
    <LinearGradient
      colors={['#1d3285', '#0e1f4d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex flex-row items-end h-[60px] border-t border-[#113da6]"
    >
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
          outputRange: [0, 10],
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
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderBottomWidth: 0,
                borderColor: isFocused ? '#113da6' : '#081939',
                borderTopColor: '#113da6',
                overflow:"hidden"
              }}
            >
              <LinearGradient
              colors={isFocused ? ['#004fde', '#1d3285'] : ['#1d3285', '#0e1f4d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center"}}
            >
              {label === 'Home' && <Home width={isFocused ? 60 : 40} height={isFocused ? 60 : 40} />}
              {label === 'Games' && <Game width={isFocused ? 60 : 40} height={isFocused ? 60 : 40} />}
              {label === 'Leaderboard' && <Trophy width={isFocused ? 60 : 40} height={isFocused ? 60 : 40} />}
              </LinearGradient>
            </Animated.View>
          </PlatformPressable>
        );
      })}
    </LinearGradient>
  );
}

//  <View className="flex flex-row items-end h-[60px] ">
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

//         const isFocused = state.index === index;

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         const height = animValues[index].interpolate({
//           inputRange: [0, 1],
//           outputRange: [60, 80],
//         });
//         const radius = animValues[index].interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, 10],
//         });

//         return (
//           <PlatformPressable
//             href={buildHref(route.name, route.params)}
//             accessibilityState={isFocused ? { selected: true } : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarButtonTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             key={index}
//             style={{ flex: 1 }}
//           >
//             <LinearGradient
//               colors={isFocused ? ['#004fde', '#1d3285'] : ['#1d3285', '#0e1f4d']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 0, y: 1 }}
//               style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
//             >
//               <Animated.View
//                 style={{
//                   height,
//                   borderTopLeftRadius: 10,
//                   borderTopRightRadius: 10,
//                   // backgroundColor: isFocused ? '#1d3285' : '#0e1f4d',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   borderWidth: 1,
//                   borderBottomWidth: 0,
//                   borderColor: isFocused ? '#113da6' : '#081939',
//                   borderTopColor: '#113da6',
//                 }}
//               >
//                 {/* <Text style={{ color: 'white' }}>{label}</Text> */}
//                 {label === 'Home' && <Home width={isFocused ? 60 : 40} height={isFocused ? 60 : 40} />}
//                 {label === 'Games' && <Game width={isFocused ? 60 : 40} height={isFocused ? 60 : 40} />}
//                 {label === 'Leaderboard' && <Trophy width={isFocused ? 60 : 40} height={isFocused ? 60 : 40} />}
//               </Animated.View>
//             </LinearGradient>
//           </PlatformPressable>
//         );
//       })}
//     </View>

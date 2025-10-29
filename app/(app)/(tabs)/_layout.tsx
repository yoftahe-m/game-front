import { Tabs } from 'expo-router';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: { backgroundColor: '#0c2665' },
        headerStyle: { backgroundColor: '#0c2665' },
        headerTitleStyle: { color: 'white' },
        headerShown: false,
        tabBarActiveTintColor:"#fbbf24",
        tabBarInactiveTintColor:"white",
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

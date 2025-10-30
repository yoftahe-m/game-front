import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ff2a2a', '#d80000']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.panel}>
        <View className="w-[85%] aspect-square bg-white/20 rounded-lg" />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4b5563', // gray-700
  },

  panel: {
    width: 180,
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#a80000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  innerGrid: {
    width: '85%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
});

export default App;

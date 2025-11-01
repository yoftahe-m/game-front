import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import bg from '@/assets/images/ss.png';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { EditIcon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@/components/ui/modal';
import { FontAwesome5 } from '@expo/vector-icons';
const App = () => {
  const [forfeitModal, setForfeitModal] = useState(false);
  return <SafeAreaView style={{ flex: 1 }}></SafeAreaView>;
};

export default App;

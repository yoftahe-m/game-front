import EditUsername from '@/components/edit-username';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { RootState } from '@/store';
import { useChangeProfilePicMutation } from '@/store/service/user';
import { logout } from '@/store/slice/user';
import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

const options = [
  {
    link: '/wallet',
    icon: 'plus-circle',
    title: 'Wallet',
    subtitle: 'Buy and withdraw a coin',
  },
  {
    link: '/referral',
    icon: 'plus-circle',
    title: 'Referral',
    subtitle: 'Invite friends to earn reward',
  },

  {
    link: '/(app)/policy',
    icon: 'file-text',
    title: 'Terms and Privacy',
    subtitle: 'Read our terms and privacy policy',
  },
];

export default function SettingsScreen() {
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logout());
    router.replace('/signin');
  }
  const [image, setImage] = useState('');
  const user = useSelector((state: RootState) => state.user.data);
  const [changeProfilePic, { isLoading }] = useChangeProfilePicMutation();
  function addImage(newImage: string) {
    setImage(newImage);
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 8, paddingTop: 0 }}>
      <VStack className="justify-between flex-1">
        <VStack>
          <Center style={{ alignItems: 'center', gap: 10, paddingVertical: 20 }}>
            {/* <AddImage image={image} addImage={addImage} showPreview={true} changePic={changePic} isLoading={isLoading}>
            {user && user.profilePic ? (
              <Image source={{ uri: user.profilePic }} style={styles.image} />
            ) : (
              <View style={{ ...styles.image, borderWidth: 1, borderColor: Colors[theme].border }}>
                <ThemedText style={styles.imageText}>{user?.fullName[0]}</ThemedText>
              </View>
            )}
          </AddImage>*/}
            <Avatar size="xl">
              <AvatarFallbackText>{user?.fullName}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: user?.profilePic,
                }}
              />
            </Avatar>
            <EditUsername />
            <Text>{user?.phone}</Text>
          </Center>
          <VStack space="sm">
            {options.map((option, idx) => (
              <Option
                key={idx}
                link={option.link}
                icon={option.icon as React.ComponentProps<typeof Feather>['name']}
                title={option.title}
                subtitle={option.subtitle}
              />
            ))}
          </VStack>
        </VStack>
        <Button className="h-12" onPress={handleLogout} action="negative">
          <ButtonText>Log Out</ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}

function Option({
  title,
  subtitle,
  icon,
  link,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  link: string;
}) {
  return (
    <Pressable onPress={() => router.push(link)} className="flex flex-row justify-between items-center ">
      <HStack space="sm" className="items-center">
        <Box className="size-10 items-center justify-center rounded-lg bg-red-400">
          <Feather name={icon} size={24} color={'black'} />
        </Box>
        <VStack>
          <Text bold size="md">
            {title}
          </Text>
          <Text>{subtitle}</Text>
        </VStack>
      </HStack>

      <Feather color="black" name="chevron-right" size={19} />
    </Pressable>
  );
}

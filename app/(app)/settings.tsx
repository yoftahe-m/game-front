import EditUsername from '@/components/edit-username';
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

const sections = [
  {
    title: 'User',
    options: [
      {
        link: '/(app)/bookmark',
        icon: 'mic',
        title: 'Bookmarks',
        subtitle: 'Saved restaurants and menus',
      },
    ],
  },

  {
    title: 'Token',
    options: [
      {
        link: '/restaurant',
        icon: 'plus-circle',
        title: 'Buy Token',
        subtitle: 'buy token to play games',
      },
      {
        link: '/my',
        icon: 'home',
        title: 'Send Token',
        subtitle: 'Send token to your friends',
      },
      {
        link: '/my',
        icon: 'home',
        title: 'withdraw Token',
        subtitle: 'Send token to your friends',
      },
    ],
  },
  {
    title: 'Referral',
    options: [
      {
        link: '/create',
        icon: 'plus-square',
        title: 'Post Advertisement',
        subtitle: 'Create a new advertisement',
      },
    ],
  },
  {
    title: '2FA',
    options: [
      {
        link: '/create',
        icon: 'plus-square',
        title: 'Post Advertisement',
        subtitle: 'Create a new advertisement',
      },
    ],
  },
  {
    title: 'Resources',
    options: [
      {
        link: '/(app)/contact',
        icon: 'mail',
        title: 'Contact Us',
        subtitle: 'Get in touch for support',
      },
      {
        link: '/(app)/policy',
        icon: 'file-text',
        title: 'Terms and Privacy',
        subtitle: 'Read our terms and privacy policy',
      },
    ],
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 8, paddingTop: 0 }}>
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
          <EditUsername />
          <Text>{user?.email}dd</Text>
        </Center>
        <VStack space="sm">
          {sections.map((section, index) => (
            <Section key={index} label={section.title}>
              {section.options.map((option, idx) => (
                <Option
                  key={idx}
                  link={option.link}
                  icon={option.icon as React.ComponentProps<typeof Feather>['name']}
                  title={option.title}
                  subtitle={option.subtitle}
                />
              ))}
            </Section>
          ))}
        </VStack>
        <Button className="h-12" onPress={handleLogout}>
          <ButtonText>Log Out</ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <VStack space="sm">
      <Text>{label}</Text>
      {children}
    </VStack>
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
    <Pressable className="flex flex-row justify-between items-center ">
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

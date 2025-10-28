import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { RootState } from '@/store';
import Toast from 'react-native-root-toast';
import { useChangeNameMutation } from '@/store/service/user';
import { setUser } from '@/store/slice/user';
import { Text } from './ui/text';
// import { Colors } from '@/constants/Colors';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from './ui/actionsheet';
import { Pressable } from 'react-native';
import { VStack } from './ui/vstack';
import { HStack } from './ui/hstack';
import { Box } from './ui/box';

const EditUsername = () => {
  const dispatch = useDispatch();
  // const theme = useColorScheme() ?? 'light';
  // const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const user = useSelector((state: RootState) => state.user.data);
  const [name, setName] = useState(user?.fullName);
  const [changeName, { isLoading }] = useChangeNameMutation();

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       bottomSheetModalRef.current?.close();
  //     };
  //   }, [])
  // );

  // const handlePresentModal = useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  // const handleModalClose = useCallback(() => {
  //   bottomSheetModalRef.current?.close();
  // }, []);
  const [showActionsheet, setShowActionsheet] = useState(false);

  async function edit() {
    if (name && name.trim().length < 2) {
      Toast.show('Full name should be at least 2 letters.', {
        duration: Toast.durations.LONG,
      });
      return;
    }

    try {
      const user = await changeName({ fullName: name }).unwrap();
      dispatch(setUser(user));
      Toast.show('Updating username Successfully.', {
        duration: Toast.durations.LONG,
      });
    } catch (_) {
      Toast.show('Updating username failed.', {
        duration: Toast.durations.LONG,
      });
    }
  }

  function openActionSheet() {
    console.log('openActionSheet');
    setShowActionsheet(true);
  }
const handleClose = () => setShowActionsheet(false);
  console.log("showActionsheet",showActionsheet)

  return (
    <>
      <Pressable onPress={openActionSheet}>
        <Text className="capitalize" size="2xl" bold>
          {user?.fullName}
        </Text>
      </Pressable>

     <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[36]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full pt-5">
            <HStack space="md" className="justify-center items-center">
              
              <VStack className="flex-1">
                <Text className="font-bold">Mastercard</Text>
                <Text>Card ending in 2345</Text>
              </VStack>
            </HStack>
            
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
      {/* <BottomSheetModal
        enableOverDrag={false}
        ref={bottomSheetModalRef}
        enableContentPanningGesture={false}
        backgroundStyle={{ backgroundColor: Colors[theme].background }}
        handleIndicatorStyle={{ backgroundColor: Colors[theme].tint }}
        backdropComponent={({ style }) => (
          <Pressable
            onPress={handleModalClose}
            style={[
              style,
              {
                backgroundColor: Colors[theme].overlay,
              },
            ]}
          />
        )}
      >
        <BottomSheetView>
          <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            <ThemedText style={styles.label} secondary={true}>
              Full name
            </ThemedText>
            <TextInput
              value={name}
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Full name"
              onChangeText={(name) => setName(name)}
              placeholderTextColor={Colors[theme].tint}
              style={{ ...styles.input, borderColor: Colors[theme].border, color: Colors[theme].tint }}
            />
            <TouchableOpacity onPress={edit} disabled={isLoading}>
              <View
                style={{
                  ...styles.btn,
                  backgroundColor: Colors[theme].primary,
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading && <ActivityIndicator color={'white'} />}
                <ThemedText style={styles.btnText}>Change Name</ThemedText>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </BottomSheetView>
      </BottomSheetModal> */}
    </>
  );
};

export default EditUsername;

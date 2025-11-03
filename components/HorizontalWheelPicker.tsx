import React, { useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
// import LinearGradient from 'react-native-linear-gradient'; // Keep if used in item, but removed since it wasn't in the provided code

type Props = {
  data: string[];
  itemWidth?: number;
  itemHeight?: number;
  initialIndex?: number;
  onChange?: (index: number) => void;
  containerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
};

type WheelItemProps = {
  item: any;
  index: number;
  itemWidth: number;
  itemHeight: number;
  itemStyle?: ViewStyle;
  scrollX: Animated.Value;
  scrollToIndex: (index: number) => void;
};

const { width: screenWidth } = Dimensions.get("window");

const WheelItem = React.memo(
  ({
    item,
    index,
    itemWidth,
    itemHeight,
    itemStyle,
    scrollX,
    scrollToIndex,
  }: WheelItemProps) => {
    // Defines the distance range over which the item's animations will run
    const inputRange = [
      (index - 2) * itemWidth,
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
      (index + 2) * itemWidth,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 0.95, 1.15, 0.95, 0.85],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 0.8, 1, 0.8, 0.5],
      extrapolate: "clamp",
    });

    // Interpolate color based on position for a smooth transition
    const color = scrollX.interpolate({
      inputRange,
      outputRange: ["#7f8c8d", "#34495e", "#1a73e8", "#34495e", "#7f8c8d"],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => scrollToIndex(index)}
        style={{ width: 110 }}
      >
        <Animated.View
          style={[
            styles.item,
            {
              height: itemHeight,
              transform: [{ scale }],
              opacity,
            },
            itemStyle,
          ]}
        >
          <Animated.Text
            numberOfLines={1}
            style={[styles.itemText, { color }]}
          >
            {String(item)}
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

export default function HorizontalWheelPicker({
  data,
  itemWidth = 120,
  itemHeight = 80,
  initialIndex = 0,
  onChange,
  containerStyle,
  itemStyle,
}: Props) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<string>>(null);
  const sidePadding = (screenWidth - itemWidth) / 2;

  // *** Optimization 1: Use getItemLayout for performance ***
  // This tells FlatList the size of items up front, skipping expensive runtime measurements.
  const getItemLayout = useCallback(
    (_: ArrayLike<string> | null | undefined, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth]
  );

  const scrollToIndex = useCallback((index: number) => {
    listRef.current?.scrollToOffset({ offset: index * itemWidth, animated: true });
    if (onChange) onChange(index);
  }, [itemWidth, onChange]);

  useEffect(() => {
    // Initial scroll setup (kept asynchronous to ensure FlatList has measured its layout)
    setTimeout(() => {
      listRef.current?.scrollToOffset({
        offset: initialIndex * itemWidth,
        animated: false,
      });
    }, 10);
  }, [initialIndex, itemWidth]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / itemWidth);
    // Ensure index is within the bounds of the data array
    const safeIndex = Math.min(Math.max(0, index), data.length - 1);
    
    // Report the final snapped index
    if (onChange) onChange(safeIndex);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <WheelItem
      item={item}
      index={index}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      itemStyle={itemStyle}
      scrollX={scrollX}
      scrollToIndex={scrollToIndex}
    />
  );

  return (
    <View style={[{ height: itemHeight + 20, justifyContent: "center" }, containerStyle]}>
      
      {/* Center Indicator */}
      <View
        pointerEvents="none"
        style={[
          styles.centerIndicator,
          {
            width: Math.round(itemWidth * 1.1),
            left: (screenWidth - Math.round(itemWidth * 1.1)) / 2,
            height: itemHeight + 20,
          },
        ]}
      />

      <Animated.FlatList
        ref={listRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        
        snapToInterval={itemWidth}
        decelerationRate="fast"
        // *** Optimization 2: Allow native momentum snapping for smoother deceleration ***
        // This makes the scroll less abrupt when it snaps to the final resting point.
        disableIntervalMomentum={false} 

        bounces={false}
        contentContainerStyle={{ paddingHorizontal: sidePadding }}
        onMomentumScrollEnd={handleScrollEnd}

        // *** Optimization 3: Performance tuning for rendering efficiency ***
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        windowSize={10} 
        maxToRenderPerBatch={5}

        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0,
    borderRadius: 14,
    backgroundColor: "#f0f0f3",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 5,
  },
  centerIndicator: {
    position: "absolute",
    borderWidth: 3,
    borderColor: "#1a73e8",
    borderRadius: 16,
    backgroundColor: "rgba(26, 115, 232, 0.05)",
    zIndex: 1,
  },
});

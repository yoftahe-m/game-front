import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, SharedValue } from 'react-native-reanimated';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Box } from 'lucide-react-native';

export const DURATION_MS = 15000;
export const INTERVAL_MS = 50;

export const interpolateColor = (value: number): string => {
  const red = parseInt('dc2626', 16);
  const yellow = parseInt('facc15', 16);
  const green = parseInt('16a34a', 16);

  let startColor = red;
  let endColor = green;
  let startValue = 0;
  let endValue = 100;

  if (value >= 50) {
    startColor = yellow;
    endColor = green;
    startValue = 50;
    endValue = 100;
  } else {
    startColor = red;
    endColor = yellow;
    startValue = 0;
    endValue = 50;
  }

  const fraction = (value - startValue) / (endValue - startValue);

  const rStart = (startColor >> 16) & 0xff;
  const gStart = (startColor >> 8) & 0xff;
  const bStart = startColor & 0xff;

  const rEnd = (endColor >> 16) & 0xff;
  const gEnd = (endColor >> 8) & 0xff;
  const bEnd = endColor & 0xff;

  const r = Math.round(rStart + (rEnd - rStart) * fraction);
  const g = Math.round(gStart + (gEnd - gStart) * fraction);
  const b = Math.round(bStart + (bEnd - bStart) * fraction);

  return `rgb(${r},${g},${b})`;
};

interface AnimatedCircularProgressProps {
  size: number;
  width: number;
  fill: SharedValue<number>;
  tintColor: SharedValue<string>;
  backgroundColor: string;
  children?: ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({ size, width, fill, tintColor, backgroundColor, children }) => {
  const radius = size / 2 - width / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (fill.value / 100) * circumference,
    stroke: tintColor.value,
  }));

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={width}
          fill="transparent"
        />

        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={width}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Centered children */}
      <View >
        {children}
      </View>
    </View>
  );
};

export default AnimatedCircularProgress;

import React from 'react';
import { Animated, View } from 'react-native';

import useAnimatedValue from './useAnimatedValue';

const styles = {
  root: {
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: 'red',
  },
};

export default function LevelBar({
  style,
  barStyle,
  minLevel,
  maxLevel,
  level,
  ...props
}) {
  const height = useAnimatedValue({
    inputRange: [minLevel, maxLevel],
    outputRange: ['0%', '100%'],
    value: level,
  });

  return (
    <View style={[styles.root, style]} {...props}>
      <Animated.View
        style={[
          styles.bar,
          {
            height,
          },
          barStyle,
        ]}
      />
    </View>
  );
}

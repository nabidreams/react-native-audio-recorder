import React from 'react';
import { Animated } from 'react-native';

export default ({ inputRange, outputRange, value, duration }) => {
  const [animatedValue] = React.useState(new Animated.Value(value));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
    }).start();
  }, [value]);

  return animatedValue.interpolate({
    inputRange,
    outputRange,
  });
};

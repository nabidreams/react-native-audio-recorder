import React from 'react';
import { Animated } from 'react-native';

import config from './config';

export default ({
  inputRange,
  outputRange,
  value,
  duration = config.animationDuration,
}) => {
  const [animatedValue] = React.useState(new Animated.Value(value));

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
  }, [value]);

  return animatedValue.interpolate({
    inputRange,
    outputRange,
  });
};

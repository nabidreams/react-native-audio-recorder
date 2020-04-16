import { Recorder } from '@nabidreams/react-native-audio';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import config from './config';
import LevelBar from './LevelBar';
import useRecorder from './useRecorder';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  levelBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  levelTextContainer: {
    marginVertical: 8,
  },
  levelText: {
    textAlign: 'right',
  },
});

export default function RecorderExample({
  style = {},
  disabled = false,
  ...props
}) {
  const { state, isStarted, level, start, stop } = useRecorder();

  const toggleRecording = React.useCallback(async () => {
    if (isStarted) {
      await stop();
    } else {
      await start(config.filePath);
    }
  }, [isStarted]);

  return (
    <View style={[styles.root, style]} {...props}>
      <LevelBar
        style={styles.levelBar}
        minLevel={Recorder.MIN_LEVEL}
        maxLevel={Recorder.MAX_LEVEL}
        level={level}
      />

      <View style={styles.levelTextContainer}>
        <Text style={styles.levelText}>Level</Text>
        <Text style={styles.levelText}>
          {level.toFixed(2)}
          {' dB'}
        </Text>
      </View>

      <Button
        title={isStarted ? 'Stop Recording' : 'Start Recording'}
        onPress={toggleRecording}
        disabled={disabled || !state}
      />
    </View>
  );
}

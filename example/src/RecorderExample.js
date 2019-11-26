import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { Recorder } from '@nabidreams/react-native-audio';

import useRecorder from './useRecorder';
import LevelBar from './LevelBar';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 8,
  },
  levelBarContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
  },
  levelBar: {
    flex: 1,
    height: '100%',
  },
  amplitudeLevelBar: {
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  powerLevelBar: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
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
  const { state, amplitudeLevel, powerLevel, toggleRecording } = useRecorder();

  return (
    <View style={[styles.root, style]} {...props}>
      <View style={styles.levelBarContainer}>
        <LevelBar
          style={styles.levelBar}
          barStyle={styles.amplitudeLevelBar}
          minLevel={Recorder.MIN_AMPLITUDE}
          maxLevel={Recorder.MAX_AMPLITUDE}
          level={amplitudeLevel}
        />

        <LevelBar
          style={styles.levelBar}
          barStyle={styles.powerLevelBar}
          minLevel={Recorder.MIN_POWER}
          maxLevel={Recorder.MAX_POWER}
          level={powerLevel}
        />
      </View>

      <View style={styles.levelTextContainer}>
        <Text style={styles.levelText}>Peak Level</Text>
        <Text style={styles.levelText}>
          {amplitudeLevel.toFixed(2)}
          {' (Amplitude)'}
        </Text>
        <Text style={styles.levelText}>
          {powerLevel.toFixed(2)}
          {' dB  (Power)'}
        </Text>
      </View>

      <Button
        title={
          state !== Recorder.State.STARTED
            ? 'Start Recording'
            : 'Stop Recording'
        }
        onPress={toggleRecording}
        disabled={disabled || !state}
      />
    </View>
  );
}

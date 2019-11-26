import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { Player } from '@nabidreams/react-native-audio';

import usePlayer from './usePlayer';
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

export default function PlayerExample({
  style = {},
  disabled = false,
  ...props
}) {
  const { state, amplitudeLevel, powerLevel, togglePlaying } = usePlayer();

  return (
    <View style={[styles.root, style]} {...props}>
      <View style={styles.levelBarContainer}>
        <LevelBar
          style={styles.levelBar}
          barStyle={styles.amplitudeLevelBar}
          minLevel={Player.MIN_AMPLITUDE}
          maxLevel={Player.MAX_AMPLITUDE}
          level={amplitudeLevel}
        />

        <LevelBar
          style={styles.levelBar}
          barStyle={styles.powerLevelBar}
          minLevel={Player.MIN_POWER}
          maxLevel={Player.MAX_POWER}
          level={powerLevel}
        />
      </View>

      <View style={styles.levelTextContainer}>
        <Text style={styles.levelText}>RMS Level</Text>
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
          state !== Player.State.STARTED ? 'Start Playing' : 'Stop Playing'
        }
        onPress={togglePlaying}
        disabled={disabled || !state}
      />
    </View>
  );
}

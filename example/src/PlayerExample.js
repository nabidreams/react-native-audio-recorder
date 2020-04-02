import { Player } from '@nabidreams/react-native-audio';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import LevelBar from './LevelBar';
import usePlayer from './usePlayer';

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

export default function PlayerExample({
  style = {},
  disabled = false,
  ...props
}) {
  const { state, level, togglePlaying } = usePlayer();

  return (
    <View style={[styles.root, style]} {...props}>
      <LevelBar
        style={styles.levelBar}
        minLevel={Player.MIN_LEVEL}
        maxLevel={Player.MAX_LEVEL}
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
        title={
          state !== Player.State.STARTED ? 'Start Playing' : 'Stop Playing'
        }
        onPress={togglePlaying}
        disabled={disabled || !state}
      />
    </View>
  );
}

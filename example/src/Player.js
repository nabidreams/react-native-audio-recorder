import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  InteractionManager,
} from 'react-native';
import { AudioPlayer } from '@nabidreams/react-native-audio';
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

export default function Player({ style = {}, disabled = false, ...props }) {
  const [state, setState] = React.useState();

  React.useEffect(function listenStateChange() {
    (async () => {
      setState(await AudioPlayer.getState());
    })();

    const subscription = AudioPlayer.addListener(
      AudioPlayer.EventType.STATE_CHANGE,
      ({ state }) => {
        setState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  const [amplitudeLevel, setAmplitudeLevel] = React.useState(
    AudioPlayer.MIN_AMPLITUDE,
  );

  const [powerLevel, setPowerLevel] = React.useState(AudioPlayer.MIN_AMPLITUDE);

  React.useEffect(
    function handleLevelChange() {
      async function updateLevel() {
        if ((await AudioPlayer.getState()) !== AudioPlayer.State.STARTED) {
          setAmplitudeLevel(AudioPlayer.MIN_AMPLITUDE);
          setPowerLevel(AudioPlayer.MIN_POWER);
          return;
        }

        setAmplitudeLevel(await AudioPlayer.getRmsAmplitude());
        setPowerLevel(await AudioPlayer.getRmsPower());

        InteractionManager.runAfterInteractions({
          name: 'updateLevel',
          gen: () => updateLevel(),
        });
      }

      InteractionManager.runAfterInteractions({
        name: 'updateLevel',
        gen: () => updateLevel(),
      });
    },
    [state],
  );

  async function togglePlaying() {
    try {
      switch (state) {
        case AudioPlayer.State.STARTED:
          await AudioPlayer.stop();
          return;
        case AudioPlayer.State.STOPPED:
          await AudioPlayer.start();
          return;
        default:
          return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    return () => {
      AudioPlayer.stop();
    };
  }, []);

  return (
    <View style={[styles.root, style]} {...props}>
      <View style={styles.levelBarContainer}>
        <LevelBar
          style={styles.levelBar}
          barStyle={styles.amplitudeLevelBar}
          minLevel={AudioPlayer.MIN_AMPLITUDE}
          maxLevel={AudioPlayer.MAX_AMPLITUDE}
          level={amplitudeLevel}
        />

        <LevelBar
          style={styles.levelBar}
          barStyle={styles.powerLevelBar}
          minLevel={AudioPlayer.MIN_POWER}
          maxLevel={AudioPlayer.MAX_POWER}
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
          state !== AudioPlayer.State.STARTED ? 'Start Playing' : 'Stop Playing'
        }
        onPress={togglePlaying}
        disabled={disabled || !state}
      />
    </View>
  );
}

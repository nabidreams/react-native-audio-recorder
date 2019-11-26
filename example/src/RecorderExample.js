import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  InteractionManager,
} from 'react-native';
import { Recorder as AudioRecorder } from '@nabidreams/react-native-audio';
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
  const [state, setState] = React.useState();

  React.useEffect(function listenStateChange() {
    (async () => {
      setState(await AudioRecorder.getState());
    })();

    const subscription = AudioRecorder.addListener(
      AudioRecorder.EventType.STATE_CHANGE,
      ({ state }) => {
        setState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  const [amplitudeLevel, setAmplitudeLevel] = React.useState(
    AudioRecorder.MIN_AMPLITUDE,
  );

  const [powerLevel, setPowerLevel] = React.useState(AudioRecorder.MIN_POWER);

  React.useEffect(
    function handleLevelChange() {
      async function updateLevel() {
        if ((await AudioRecorder.getState()) !== AudioRecorder.State.STARTED) {
          setAmplitudeLevel(AudioRecorder.MIN_AMPLITUDE);
          setPowerLevel(AudioRecorder.MIN_POWER);
          return;
        }

        setAmplitudeLevel(await AudioRecorder.getPeakAmplitude());
        setPowerLevel(await AudioRecorder.getPeakPower());

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

  async function toggleRecording() {
    try {
      if (state !== AudioRecorder.State.STARTED) {
        await AudioRecorder.start();
      } else {
        await AudioRecorder.stop();
      }
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    return () => {
      AudioRecorder.stop();
    };
  }, []);

  return (
    <View style={[styles.root, style]} {...props}>
      <View style={styles.levelBarContainer}>
        <LevelBar
          style={styles.levelBar}
          barStyle={styles.amplitudeLevelBar}
          minLevel={AudioRecorder.MIN_AMPLITUDE}
          maxLevel={AudioRecorder.MAX_AMPLITUDE}
          level={amplitudeLevel}
        />

        <LevelBar
          style={styles.levelBar}
          barStyle={styles.powerLevelBar}
          minLevel={AudioRecorder.MIN_POWER}
          maxLevel={AudioRecorder.MAX_POWER}
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
          state !== AudioRecorder.State.STARTED
            ? 'Start Recording'
            : 'Stop Recording'
        }
        onPress={toggleRecording}
        disabled={disabled || !state}
      />
    </View>
  );
}

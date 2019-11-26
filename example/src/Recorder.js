import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  InteractionManager,
} from 'react-native';
import { AudioRecorder } from '@nabidreams/react-native-audio';

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
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  amplitudeLevelBar: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  powerLevelBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  levelTextContainer: {
    marginVertical: 8,
  },
  levelText: {
    textAlign: 'right',
  },
});

export default function Recorder({
  styles: stylesProp = {},
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
  const amplitudeLevelBarHeight =
    (100 * (amplitudeLevel - AudioRecorder.MIN_AMPLITUDE)) /
    (AudioRecorder.MAX_AMPLITUDE - AudioRecorder.MIN_AMPLITUDE);

  const [powerLevel, setPowerLevel] = React.useState(AudioRecorder.MIN_POWER);
  const powerLevelBarHeight =
    (100 * (powerLevel - AudioRecorder.MIN_POWER)) /
    (AudioRecorder.MAX_POWER - AudioRecorder.MIN_POWER);

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
      switch (state) {
        case AudioRecorder.State.STARTED:
          await AudioRecorder.stop();
          return;
        case AudioRecorder.State.STOPPED:
          await AudioRecorder.start();
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
      AudioRecorder.stop();
    };
  }, []);

  return (
    <View style={{ ...styles.root, ...stylesProp }} {...props}>
      <View style={styles.levelBarContainer}>
        <View
          style={{
            ...styles.amplitudeLevelBar,
            height: `${amplitudeLevelBarHeight}%`,
          }}
        />

        <View
          style={{
            ...styles.powerLevelBar,
            height: `${powerLevelBarHeight}%`,
          }}
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

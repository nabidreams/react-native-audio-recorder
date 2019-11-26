import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  Text,
  InteractionManager,
} from 'react-native';
import { AudioPlayer } from '@nabidreams/react-native-audio';

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

export default function Player({
  styles: stylesProp = {},
  disabled = false,
  ...props
}) {
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
  const amplitudeLevelBarHeight =
    (100 * (amplitudeLevel - AudioPlayer.MIN_AMPLITUDE)) /
    (AudioPlayer.MAX_AMPLITUDE - AudioPlayer.MIN_AMPLITUDE);

  const [powerLevel, setPowerLevel] = React.useState(AudioPlayer.MIN_AMPLITUDE);
  const powerLevelBarHeight =
    (100 * (powerLevel - AudioPlayer.MIN_POWER)) /
    (AudioPlayer.MAX_POWER - AudioPlayer.MIN_POWER);

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

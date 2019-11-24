import React from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  Button,
  Text,
} from 'react-native';
import { recorder, player } from '@nabidreams/react-native-audio';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  levelText: {
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  amplitudeLevelBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  powerLevelBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  playerLevelBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,

    backgroundColor: 'rgba(0, 255, 0, 0.5)',
  },
});

export default function App() {
  const [
    recordAudioPermissionGranted,
    setRecordAudioPermissionGranted,
  ] = React.useState();

  const requestRecordAudioPermission = React.useCallback(async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      setRecordAudioPermissionGranted(
        result === PermissionsAndroid.RESULTS.GRANTED,
      );
    } catch (err) {
      console.warn(err);
    }
  }, []);

  React.useEffect(function requestPermission() {
    requestRecordAudioPermission();
  }, []);

  const [recorderState, setRecorderState] = React.useState();

  React.useEffect(function listenRecorderStateChange() {
    (async () => {
      setRecorderState(await recorder.getState());
    })();

    const subscription = recorder.addListener(
      recorder.EventType.STATE_CHANGE,
      ({ state }) => {
        setRecorderState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    return () => {
      recorder.stop();
      player.stop();
    };
  }, []);

  const [amplitudeLevel, setAmplitudeLevel] = React.useState(
    recorder.MIN_AMPLITUDE,
  );
  const amplitudeLevelBarHeight =
    (100 * (amplitudeLevel - recorder.MIN_AMPLITUDE)) /
    (recorder.MAX_AMPLITUDE - recorder.MIN_AMPLITUDE);

  const [powerLevel, setPowerLevel] = React.useState(recorder.MIN_POWER);
  const powerLevelBarHeight =
    (100 * (powerLevel - recorder.MIN_POWER)) /
    (recorder.MAX_POWER - recorder.MIN_POWER);

  React.useEffect(
    function handleRecordingLevelChange() {
      async function updateLevel() {
        if ((await recorder.getState()) !== recorder.State.STARTED) {
          setAmplitudeLevel(recorder.MIN_AMPLITUDE);
          setPowerLevel(recorder.MIN_POWER);
          return;
        }

        setAmplitudeLevel(await recorder.getPeakAmplitude());
        setPowerLevel(await recorder.getPeakPower());

        requestAnimationFrame(updateLevel);
      }

      updateLevel();
    },
    [recorderState],
  );

  const [playerState, setPlayerState] = React.useState();

  React.useEffect(function listenPlayerStateChange() {
    (async () => {
      setPlayerState(await player.getState());
    })();

    const subscription = player.addListener(
      player.EventType.STATE_CHANGE,
      ({ state }) => {
        setPlayerState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  const [playerLevel, setPlayerLevel] = React.useState(0);
  const playerLevelBarHeight =
    (100 * (playerLevel - player.MIN_LEVEL)) /
    (player.MAX_LEVEL - player.MIN_LEVEL);

  React.useEffect(
    function handlePlayingLevelChange() {
      async function updateLevel() {
        if ((await player.getState()) !== player.State.STARTED) {
          setPlayerLevel(0);
          return;
        }

        setPlayerLevel(await player.getLevel());

        requestAnimationFrame(updateLevel);
      }

      updateLevel();
    },
    [playerState],
  );

  async function toggleRecording() {
    try {
      switch (recorderState) {
        case recorder.State.STARTED:
          await recorder.stop();
          return;
        case recorder.State.STOPPED:
          await recorder.start();
          return;
        default:
          return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function togglePlaying() {
    try {
      switch (playerState) {
        case player.State.STARTED:
          await player.stop();
          return;
        case player.State.STOPPED:
          await player.start();
          return;
        default:
          return;
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
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

      <View
        style={{
          ...styles.playerLevelBar,
          height: `${playerLevelBarHeight}%`,
        }}
      />

      <Button
        title="Request Record Audio Permission"
        onPress={requestRecordAudioPermission}
        disabled={recordAudioPermissionGranted}
      />

      <View>
        <Button
          title={
            recorderState !== recorder.State.STARTED
              ? 'Start Recording'
              : 'Stop Recording'
          }
          onPress={toggleRecording}
          disabled={!recordAudioPermissionGranted || !recorderState}
        />
        <Text style={styles.levelText}>Level </Text>
        <Text style={styles.levelText}>{amplitudeLevel.toFixed(3)} </Text>
        <Text style={styles.levelText}>{powerLevel.toFixed(3)} dB</Text>
      </View>

      <View>
        <Button
          title={
            playerState !== player.State.STARTED
              ? 'Start Playing'
              : 'Stop Playing'
          }
          onPress={togglePlaying}
          disabled={!recordAudioPermissionGranted || !playerState}
        />
        <Text style={styles.levelText}>Level</Text>
        <Text style={styles.levelText}>{playerLevel.toFixed(3)}</Text>
      </View>
    </View>
  );
}

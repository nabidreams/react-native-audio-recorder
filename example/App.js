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
  },
  section: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  levelTextContainer: {
    alignSelf: 'stretch',
    padding: 16,
  },
  levelText: {
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  recordingAmplitudeLevelBar: {
    position: 'absolute',
    right: '50%',
    bottom: 0,
    left: 0,

    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  recordingPowerLevelBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: '50%',

    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  playingAmplitudeLevelBar: {
    position: 'absolute',
    right: '50%',
    bottom: 0,
    left: 0,

    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  playingPowerLevelBar: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: '50%',

    backgroundColor: 'rgba(255, 0, 0, 0.5)',
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

  const [recordingAmplitudeLevel, setRecordingAmplitudeLevel] = React.useState(
    recorder.MIN_AMPLITUDE,
  );
  const recordingAmplitudeLevelBarHeight =
    (100 * (recordingAmplitudeLevel - recorder.MIN_AMPLITUDE)) /
    (recorder.MAX_AMPLITUDE - recorder.MIN_AMPLITUDE);

  const [recordingPowerLevel, setRecordingPowerLevel] = React.useState(
    recorder.MIN_POWER,
  );
  const recordingPowerLevelBarHeight =
    (100 * (recordingPowerLevel - recorder.MIN_POWER)) /
    (recorder.MAX_POWER - recorder.MIN_POWER);

  React.useEffect(
    function handleRecordingLevelChange() {
      async function updateLevel() {
        if ((await recorder.getState()) !== recorder.State.STARTED) {
          setRecordingAmplitudeLevel(recorder.MIN_AMPLITUDE);
          setRecordingPowerLevel(recorder.MIN_POWER);
          return;
        }

        setRecordingAmplitudeLevel(await recorder.getPeakAmplitude());
        setRecordingPowerLevel(await recorder.getPeakPower());

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

  const [playingAmplitudeLevel, setPlayerAmplitudeLevel] = React.useState(
    player.MIN_AMPLITUDE,
  );
  const playingAmplitudeLevelBarHeight =
    (100 * (playingAmplitudeLevel - player.MIN_AMPLITUDE)) /
    (player.MAX_AMPLITUDE - player.MIN_AMPLITUDE);

  const [playingPowerLevel, setPlayerPowerLevel] = React.useState(
    player.MIN_AMPLITUDE,
  );
  const playingPowerLevelBarHeight =
    (100 * (playingPowerLevel - player.MIN_POWER)) /
    (player.MAX_POWER - player.MIN_POWER);

  const [max, setMax] = React.useState(player.MIN_AMPLITUDE);

  React.useEffect(() => {
    if (playingAmplitudeLevel > max) {
      setMax(playingAmplitudeLevel);
    }
  }, [playingAmplitudeLevel]);

  React.useEffect(
    function handlePlayingLevelChange() {
      async function updateLevel() {
        if ((await player.getState()) !== player.State.STARTED) {
          setPlayerAmplitudeLevel(player.MIN_AMPLITUDE);
          setPlayerPowerLevel(player.MIN_POWER);
          return;
        }

        setPlayerAmplitudeLevel(await player.getRmsAmplitude());
        setPlayerPowerLevel(await player.getRmsPower());

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
          ...styles.recordingAmplitudeLevelBar,
          height: `${recordingAmplitudeLevelBarHeight}%`,
        }}
      />

      <View
        style={{
          ...styles.recordingPowerLevelBar,
          height: `${recordingPowerLevelBarHeight}%`,
        }}
      />

      <View
        style={{
          ...styles.playingAmplitudeLevelBar,
          height: `${playingAmplitudeLevelBarHeight}%`,
        }}
      />

      <View
        style={{
          ...styles.playingPowerLevelBar,
          height: `${playingPowerLevelBarHeight}%`,
        }}
      />

      <View style={styles.section}>
        <Button
          title={
            recordAudioPermissionGranted
              ? 'Record Audio Permission Granted!'
              : 'Request Record Audio Permission'
          }
          onPress={requestRecordAudioPermission}
          disabled={recordAudioPermissionGranted}
        />
      </View>

      <View style={styles.section}>
        <Button
          title={
            recorderState !== recorder.State.STARTED
              ? 'Start Recording'
              : 'Stop Recording'
          }
          onPress={toggleRecording}
          disabled={!recordAudioPermissionGranted || !recorderState}
        />

        <View style={styles.levelTextContainer}>
          <Text style={styles.levelText}>Peak Level</Text>
          <Text style={styles.levelText}>
            {recordingAmplitudeLevel.toFixed(3)}
            {' (Amplitude)'}
          </Text>
          <Text style={styles.levelText}>
            {recordingPowerLevel.toFixed(3)}
            {'dB   (Power)'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Button
          title={
            playerState !== player.State.STARTED
              ? 'Start Playing'
              : 'Stop Playing'
          }
          onPress={togglePlaying}
          disabled={!recordAudioPermissionGranted || !playerState}
        />

        <View style={styles.levelTextContainer}>
          <Text style={styles.levelText}>RMS Level</Text>
          <Text style={styles.levelText}>
            {playingAmplitudeLevel.toFixed(3)} (Amplitude)
          </Text>
          <Text style={styles.levelText}>
            {playingPowerLevel.toFixed(3)}
            {'dB   (Power)'}
          </Text>
        </View>
      </View>
    </View>
  );
}

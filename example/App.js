import React from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  View,
  Button,
  Text,
  InteractionManager,
} from 'react-native';
import { AudioRecorder, AudioPlayer } from '@nabidreams/react-native-audio';

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
      setRecorderState(await AudioRecorder.getState());
    })();

    const subscription = AudioRecorder.addListener(
      AudioRecorder.EventType.STATE_CHANGE,
      ({ state }) => {
        setRecorderState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    return () => {
      AudioRecorder.stop();
      AudioPlayer.stop();
    };
  }, []);

  const [recordingAmplitudeLevel, setRecordingAmplitudeLevel] = React.useState(
    AudioRecorder.MIN_AMPLITUDE,
  );
  const recordingAmplitudeLevelBarHeight =
    (100 * (recordingAmplitudeLevel - AudioRecorder.MIN_AMPLITUDE)) /
    (AudioRecorder.MAX_AMPLITUDE - AudioRecorder.MIN_AMPLITUDE);

  const [recordingPowerLevel, setRecordingPowerLevel] = React.useState(
    AudioRecorder.MIN_POWER,
  );
  const recordingPowerLevelBarHeight =
    (100 * (recordingPowerLevel - AudioRecorder.MIN_POWER)) /
    (AudioRecorder.MAX_POWER - AudioRecorder.MIN_POWER);

  React.useEffect(
    function handleRecordingLevelChange() {
      async function updateLevel() {
        if ((await AudioRecorder.getState()) !== AudioRecorder.State.STARTED) {
          setRecordingAmplitudeLevel(AudioRecorder.MIN_AMPLITUDE);
          setRecordingPowerLevel(AudioRecorder.MIN_POWER);
          return;
        }

        setRecordingAmplitudeLevel(await AudioRecorder.getPeakAmplitude());
        setRecordingPowerLevel(await AudioRecorder.getPeakPower());

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
    [recorderState],
  );

  const [playerState, setPlayerState] = React.useState();

  React.useEffect(function listenPlayerStateChange() {
    (async () => {
      setPlayerState(await AudioPlayer.getState());
    })();

    const subscription = AudioPlayer.addListener(
      AudioPlayer.EventType.STATE_CHANGE,
      ({ state }) => {
        setPlayerState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  const [playingAmplitudeLevel, setPlayerAmplitudeLevel] = React.useState(
    AudioPlayer.MIN_AMPLITUDE,
  );
  const playingAmplitudeLevelBarHeight =
    (100 * (playingAmplitudeLevel - AudioPlayer.MIN_AMPLITUDE)) /
    (AudioPlayer.MAX_AMPLITUDE - AudioPlayer.MIN_AMPLITUDE);

  const [playingPowerLevel, setPlayerPowerLevel] = React.useState(
    AudioPlayer.MIN_AMPLITUDE,
  );
  const playingPowerLevelBarHeight =
    (100 * (playingPowerLevel - AudioPlayer.MIN_POWER)) /
    (AudioPlayer.MAX_POWER - AudioPlayer.MIN_POWER);

  const [max, setMax] = React.useState(AudioPlayer.MIN_AMPLITUDE);

  React.useEffect(() => {
    if (playingAmplitudeLevel > max) {
      setMax(playingAmplitudeLevel);
    }
  }, [playingAmplitudeLevel]);

  React.useEffect(
    function handlePlayingLevelChange() {
      async function updateLevel() {
        if ((await AudioPlayer.getState()) !== AudioPlayer.State.STARTED) {
          setPlayerAmplitudeLevel(AudioPlayer.MIN_AMPLITUDE);
          setPlayerPowerLevel(AudioPlayer.MIN_POWER);
          return;
        }

        setPlayerAmplitudeLevel(await AudioPlayer.getRmsAmplitude());
        setPlayerPowerLevel(await AudioPlayer.getRmsPower());

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
    [playerState],
  );

  async function toggleRecording() {
    try {
      switch (recorderState) {
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

  async function togglePlaying() {
    try {
      switch (playerState) {
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
            recorderState !== AudioRecorder.State.STARTED
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
            playerState !== AudioPlayer.State.STARTED
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

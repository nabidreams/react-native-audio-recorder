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
  powerText: {
    textAlign: 'right',
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

  const [peakPower, setPeakPower] = React.useState(recorder.MIN_POWER);

  React.useEffect(
    function handleAudioInputChange() {
      async function updatePeakPower() {
        if ((await recorder.getState()) !== recorder.State.STARTED) {
          setPeakPower(recorder.MIN_POWER);
          return;
        }

        setPeakPower(await recorder.getPeakPower());

        requestAnimationFrame(updatePeakPower);
      }

      updatePeakPower();
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
        <Text style={styles.powerText}>{peakPower.toFixed(3)}dB</Text>
      </View>

      <Button
        title={
          playerState !== player.State.STARTED
            ? 'Start Playing'
            : 'Stop Playing'
        }
        onPress={togglePlaying}
        disabled={!recordAudioPermissionGranted || !playerState}
      />
    </View>
  );
}

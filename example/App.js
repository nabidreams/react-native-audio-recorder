import React from 'react';
import { PermissionsAndroid, StyleSheet, View, Button } from 'react-native';
import { Recorder, Player } from '@nabidreams/react-native-audio';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function App() {
  const [
    recordAudioPermissionGranted,
    setRecordAudioPermissionGranted,
  ] = React.useState();

  async function requestRecordAudioPermission() {
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
  }

  async function startRecording() {
    try {
      await Recorder.startRecording();
    } catch (err) {
      console.error(err);
    }
  }

  async function stopRecording() {
    try {
      await Recorder.stopRecording();
    } catch (err) {
      console.error(err);
    }
  }

  async function startPlaying() {
    try {
      await Player.startPlaying();
    } catch (err) {
      console.error(err);
    }
  }

  async function stopPlaying() {
    try {
      await Player.stopPlaying();
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(function requestPermission() {
    requestRecordAudioPermission();
  }, []);

  return (
    <View style={styles.container}>
      {!recordAudioPermissionGranted && (
        <Button
          title="Request Record Audio Permission"
          onPress={requestRecordAudioPermission}
        />
      )}

      <Button
        title="Start Recording"
        onPress={startRecording}
        disabled={!recordAudioPermissionGranted}
      />
      <Button
        title="Stop Recording"
        onPress={stopRecording}
        disabled={!recordAudioPermissionGranted}
      />
      <Button
        title="Start Playing"
        onPress={startPlaying}
        disabled={!recordAudioPermissionGranted}
      />
      <Button
        title="Stop Playing"
        onPress={stopPlaying}
        disabled={!recordAudioPermissionGranted}
      />
    </View>
  );
}

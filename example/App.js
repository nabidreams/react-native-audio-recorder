import React from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import Audio, { Recorder, Player } from '@nabidreams/react-native-audio';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default function App() {
  const [state, setState] = React.useState({
    status: 'starting',
    message: '--',
  });

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

  React.useEffect(function testNativeModule() {
    Audio.sampleMethod('Testing', 123, (message) => {
      setState({
        status: 'native callback received',
        message,
      });
    });
  }, []);

  React.useEffect(function requestPermission() {
    requestRecordAudioPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>☆Audio example☆</Text>
      <Text style={styles.instructions}>STATUS: {state.status}</Text>
      <Text style={styles.welcome}>☆NATIVE CALLBACK MESSAGE☆</Text>
      <Text style={styles.instructions}>{state.message}</Text>

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

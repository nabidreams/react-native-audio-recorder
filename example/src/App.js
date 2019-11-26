import React from 'react';
import { PermissionsAndroid, StyleSheet, View, Button } from 'react-native';
import Recorder from './Recorder';
import Player from './Player';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
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

  return (
    <View style={styles.root}>
      <Button
        title={
          recordAudioPermissionGranted
            ? 'Record Audio Permission Granted!'
            : 'Request Record Audio Permission'
        }
        onPress={requestRecordAudioPermission}
        disabled={recordAudioPermissionGranted}
      />

      <View style={styles.container}>
        <Recorder disabled={!recordAudioPermissionGranted} />
        <Player disabled={!recordAudioPermissionGranted} />
      </View>
    </View>
  );
}

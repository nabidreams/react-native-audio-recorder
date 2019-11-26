import React from 'react';
import { PermissionsAndroid, StyleSheet, View, Button } from 'react-native';
import RecorderExample from './RecorderExample';
import PlayerExample from './PlayerExample';

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
  const [permissionGranted, setPermissionGranted] = React.useState();

  const requestPermission = React.useCallback(async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      setPermissionGranted(result === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={styles.root}>
      <Button
        title={
          permissionGranted
            ? 'Record Audio Permission Granted!'
            : 'Request Record Audio Permission'
        }
        onPress={requestPermission}
        disabled={permissionGranted}
      />

      <View style={styles.container}>
        <RecorderExample disabled={!permissionGranted} />
        <PlayerExample disabled={!permissionGranted} />
      </View>
    </View>
  );
}

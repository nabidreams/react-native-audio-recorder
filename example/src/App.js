import React from 'react';
import { Platform, StyleSheet, View, Button } from 'react-native';

import usePermission from './usePermission';
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
  const [permissionGranted, requestPermission] = usePermission();

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={styles.root}>
      {Platform.OS === 'android' && (
        <Button
          title={
            permissionGranted
              ? 'Record Audio Permission Granted!'
              : 'Request Record Audio Permission'
          }
          onPress={requestPermission}
          disabled={permissionGranted}
        />
      )}

      <View style={styles.container}>
        <RecorderExample disabled={!permissionGranted} />
        <PlayerExample disabled={!permissionGranted} />
      </View>
    </View>
  );
}

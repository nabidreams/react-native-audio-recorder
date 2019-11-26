import React from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export default () => {
  const [permissionGranted, setPermissionGranted] = React.useState();

  const requestPermission = React.useCallback(async () => {
    try {
      if (Platform.OS !== 'android') {
        return;
      }

      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      setPermissionGranted(result === PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return [permissionGranted, requestPermission];
};

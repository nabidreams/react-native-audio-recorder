import React from 'react';
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

function getPermission() {
  switch (Platform.OS) {
    case 'android':
      return PERMISSIONS.ANDROID.RECORD_AUDIO;
    case 'ios':
      return PERMISSIONS.IOS.MICROPHONE;
    default:
      return;
  }
}

export default () => {
  const [permissionGranted, setPermissionGranted] = React.useState();

  const requestPermission = React.useCallback(async () => {
    try {
      const permission = getPermission();

      if (!permission) {
        return;
      }

      const result = await request(permission);

      setPermissionGranted(result === RESULTS.GRANTED);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return [permissionGranted, requestPermission];
};

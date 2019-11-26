import React from 'react';
import { InteractionManager } from 'react-native';
import { Recorder } from '@nabidreams/react-native-audio';

import config from './config';

export default () => {
  const [state, setState] = React.useState();

  React.useEffect(function listenStateChange() {
    (async () => {
      setState(await Recorder.getState());
    })();

    const subscription = Recorder.addListener(
      Recorder.EventType.STATE_CHANGE,
      ({ state }) => {
        setState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  const [amplitudeLevel, setAmplitudeLevel] = React.useState(
    Recorder.MIN_AMPLITUDE,
  );

  const [powerLevel, setPowerLevel] = React.useState(Recorder.MIN_POWER);

  React.useEffect(
    function handleLevelChange() {
      async function updateLevel() {
        if ((await Recorder.getState()) !== Recorder.State.STARTED) {
          setAmplitudeLevel(Recorder.MIN_AMPLITUDE);
          setPowerLevel(Recorder.MIN_POWER);
          return;
        }

        setAmplitudeLevel(await Recorder.getPeakAmplitude());
        setPowerLevel(await Recorder.getPeakPower());

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
    [state],
  );

  async function toggleRecording() {
    try {
      if (state !== Recorder.State.STARTED) {
        await Recorder.start(config.filePath);
      } else {
        await Recorder.stop();
      }
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    return () => {
      Recorder.stop();
    };
  }, []);

  return {
    state,
    amplitudeLevel,
    powerLevel,
    toggleRecording,
  };
};

import { Recorder } from '@nabidreams/react-native-audio';
import React from 'react';
import { InteractionManager } from 'react-native';

export default () => {
  const [state, setState] = React.useState();
  const isStarted = state === Recorder.State.STARTED;

  const start = React.useCallback(
    async (filePath) => {
      if (isStarted) {
        await stop();
      }

      await Recorder.start(filePath);
    },
    [isStarted],
  );

  const stop = React.useCallback(async () => {
    await Recorder.stop();
  }, []);

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

  const [level, setLevel] = React.useState(Recorder.MIN_LEVEL);

  React.useEffect(
    function handleLevelChange() {
      async function updateLevel() {
        if ((await Recorder.getState()) !== Recorder.State.STARTED) {
          setLevel(Recorder.MIN_LEVEL);
          return;
        }

        setLevel(await Recorder.getLevel());

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
    [isStarted],
  );

  React.useEffect(() => {
    return () => {
      Recorder.stop();
    };
  }, []);

  return {
    state,
    isStarted,
    level,
    start,
    stop,
  };
};

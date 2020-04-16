import { Player } from '@nabidreams/react-native-audio';
import React from 'react';
import { InteractionManager } from 'react-native';

export default () => {
  const [state, setState] = React.useState();
  const isStarted = state == Player.State.STARTED;

  const start = React.useCallback(
    async (filePath) => {
      if (isStarted) {
        await stop();
      }

      await Player.start(filePath);
    },
    [isStarted],
  );

  const stop = React.useCallback(async () => {
    await Player.stop();
  }, []);

  React.useEffect(function listenStateChange() {
    (async () => {
      setState(await Player.getState());
    })();

    const subscription = Player.addListener(
      Player.EventType.STATE_CHANGE,
      ({ state }) => {
        setState(state);
      },
    );

    return () => subscription.remove();
  }, []);

  const [level, setLevel] = React.useState(Player.MIN_LEVEL);

  React.useEffect(
    function handleLevelChange() {
      async function updateLevel() {
        if ((await Player.getState()) !== Player.State.STARTED) {
          setLevel(Player.MIN_LEVEL);
          return;
        }

        setLevel(await Player.getLevel());

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
      stop();
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

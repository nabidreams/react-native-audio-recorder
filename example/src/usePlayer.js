import React from 'react';
import { InteractionManager } from 'react-native';
import { Player } from '@nabidreams/react-native-audio';

import config from './config';

export default () => {
  const [state, setState] = React.useState();

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

  const [amplitudeLevel, setAmplitudeLevel] = React.useState(
    Player.MIN_AMPLITUDE,
  );

  const [powerLevel, setPowerLevel] = React.useState(Player.MIN_AMPLITUDE);

  React.useEffect(
    function handleLevelChange() {
      async function updateLevel() {
        if ((await Player.getState()) !== Player.State.STARTED) {
          setAmplitudeLevel(Player.MIN_AMPLITUDE);
          setPowerLevel(Player.MIN_POWER);
          return;
        }

        setAmplitudeLevel(await Player.getRmsAmplitude());
        setPowerLevel(await Player.getRmsPower());

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

  async function togglePlaying() {
    try {
      if (state !== Player.State.STARTED) {
        await Player.start(config.filePath);
      } else {
        await Player.stop();
      }
    } catch (err) {
      console.error(err);
    }
  }

  React.useEffect(() => {
    return () => {
      Player.stop();
    };
  }, []);

  return {
    state,
    amplitudeLevel,
    powerLevel,
    togglePlaying,
  };
};

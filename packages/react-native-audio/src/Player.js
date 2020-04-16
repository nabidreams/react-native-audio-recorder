import { NativeEventEmitter, NativeModules } from 'react-native';

const { Player: NativePlayer } = NativeModules;

function createPlayer() {
  const eventEmitter = new NativeEventEmitter(NativePlayer);

  const { addListener, removeAllListeners, removeSubscription } = eventEmitter;

  return {
    ...NativePlayer,
    addListener: addListener.bind(eventEmitter),
    removeAllListeners: removeAllListeners.bind(eventEmitter),
    removeSubscription: removeSubscription.bind(eventEmitter),
  };
}

const Player = createPlayer();

export default Player;

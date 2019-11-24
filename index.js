import { NativeModules, NativeEventEmitter } from 'react-native';

const { Recorder, Player } = NativeModules;

function createRecorder() {
  const eventEmitter = new NativeEventEmitter(Recorder);

  const { addListener, removeAllListeners, removeSubscription } = eventEmitter;

  return {
    ...Recorder,
    addListener: addListener.bind(eventEmitter),
    removeAllListeners: removeAllListeners.bind(eventEmitter),
    removeSubscription: removeSubscription.bind(eventEmitter),
  };
}

export const recorder = createRecorder();

function createPlayer() {
  const eventEmitter = new NativeEventEmitter(Player);

  const { addListener, removeAllListeners, removeSubscription } = eventEmitter;

  return {
    ...Player,
    addListener: addListener.bind(eventEmitter),
    removeAllListeners: removeAllListeners.bind(eventEmitter),
    removeSubscription: removeSubscription.bind(eventEmitter),
  };
}

export const player = createPlayer();

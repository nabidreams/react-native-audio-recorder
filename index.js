import { NativeModules, NativeEventEmitter } from 'react-native';

const { Recorder: NativeRecorder, Player: NativePlayer } = NativeModules;

function createRecorder() {
  const eventEmitter = new NativeEventEmitter(NativeRecorder);

  const { addListener, removeAllListeners, removeSubscription } = eventEmitter;

  return {
    ...NativeRecorder,
    addListener: addListener.bind(eventEmitter),
    removeAllListeners: removeAllListeners.bind(eventEmitter),
    removeSubscription: removeSubscription.bind(eventEmitter),
  };
}

export const Recorder = createRecorder();

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

export const Player = createPlayer();

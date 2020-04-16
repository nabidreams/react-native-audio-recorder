import { NativeEventEmitter, NativeModules } from 'react-native';

const { Recorder: NativeRecorder } = NativeModules;

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

const Recorder = createRecorder();

export default Recorder;

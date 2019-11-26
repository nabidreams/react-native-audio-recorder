@objc(Recorder)
class RecorderModule: RCTEventEmitter {
  enum EventType: String {
    case stateChange = "recorderStateChange"
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  override func constantsToExport() -> [AnyHashable: Any]? {
    return [
      "State": [
        "STARTED": Recorder.State.started.rawValue,
        "STOPPED": Recorder.State.stopped.rawValue,
      ],
      
      "EventType": [
        "STATE_CHANGE": EventType.stateChange.rawValue
      ],
      
      "MIN_AMPLITUDE": -160,
      "MAX_AMPLITUDE": 0,
      
      "MIN_POWER": -160,
      "MAX_POWER": 0,
    ]
  }
  
  override func supportedEvents() -> [String]! {
    return [
      EventType.stateChange.rawValue
    ]
  }
  
  override init() {
    super.init()

    recorder.stateChangeListener = { state in
      self.sendEvent(withName: EventType.stateChange.rawValue, body: ["state": state.rawValue])
    }
  }
  
  @objc
  func getPeakAmplitude(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    resolve(recorder.averagePower)
  }
  
  @objc
  func getPeakPower(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    resolve(recorder.peakPower)
  }
  
  @objc
  func getState(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    resolve(recorder.state.rawValue)
  }
  
  @objc
  func start(_ filePath: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    do {
      try recorder.start(filePath)
      resolve(nil)
    } catch {
      reject("Error", error.localizedDescription, error)
    }
  }
  
  @objc
  func stop(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    do {
      try recorder.stop()
      resolve(nil)
    } catch {
      reject("Error", error.localizedDescription, error)
    }
  }
  
  private let recorder: Recorder! = Recorder()
}

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
      
      "MIN_LEVEL": Recorder.minPower,
      "MAX_LEVEL": Recorder.maxPower,
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
  func getLevel(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    resolve(recorder.averagePower)
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

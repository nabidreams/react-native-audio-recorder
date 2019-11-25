@objc(Recorder)
class Recorder: RCTEventEmitter {
  enum EventType: String {
    case stateChange = "recorderStateChange"
  }

  override static func requiresMainQueueSetup() -> Bool {
    return false
  }

  override func constantsToExport() -> [AnyHashable: Any]? {
    return [
      "State": [],

      "EventType": [
        "STATE_CHANGE": EventType.stateChange.rawValue
      ],

      "MIN_AMPLITUDE": 0,
      "MAX_AMPLITUDE": 0,
      
      "MIN_POWER": 0,
      "MAX_POWER": 0,
    ]
  }

  override func supportedEvents() -> [String]! {
    return [
      EventType.stateChange.rawValue
    ]
  }
  
  @objc
  func getPeakAmplitude(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve(0) }
  
  @objc
  func getPeakPower(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve(0) }
  
  @objc
  func getState(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve("") }
  
  @objc
  func start(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve(nil) }
  
  @objc
  func stop(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve(nil) }
}

@objc(Player)
class Player: RCTEventEmitter {
  enum EventType: String {
    case stateChange = "playerStateChange"
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

      "MIN_LEVEL": 0,
      "MAX_LEVEL": 0,
    ]
  }
  
  override func supportedEvents() -> [String]! {
    return [
      EventType.stateChange.rawValue
    ]
  }
  
  @objc
  func getLevel(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve(0) }
  
  @objc
  func getState(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve("") }
  
  @objc
  func start(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve(nil) }
  
  @objc
  func stop(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void { resolve(nil) }
}

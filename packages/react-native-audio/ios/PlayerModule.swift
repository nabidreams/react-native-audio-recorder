@objc(Player)
class PlayerModule: RCTEventEmitter {
  enum EventType: String {
    case stateChange = "playerStateChange"
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func constantsToExport() -> [AnyHashable: Any]? {
    return [
      "State": [
        "STARTED": Player.State.started.rawValue,
        "STOPPED": Player.State.stopped.rawValue,
      ],
      
      "EventType": [
        "STATE_CHANGE": EventType.stateChange.rawValue
      ],
      
      "MIN_LEVEL": Player.minPower,
      "MAX_LEVEL": Player.maxPower,
    ]
  }
  
  override func supportedEvents() -> [String]! {
    return [
      EventType.stateChange.rawValue
    ]
  }
  
  override init() {
    super.init()
    
    player.stateChangeListener = { state in
      self.sendEvent(withName: EventType.stateChange.rawValue, body: ["state": state.rawValue])
    }
  }
  
  @objc
  func getLevel(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    resolve(player.averagePower)
  }
  
  @objc
  func getState(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    resolve(player.state.rawValue)
  }
  
  @objc
  func start(_ filePath: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    do {
      try player.start(filePath)
      resolve(nil)
    } catch {
      reject("Error", error.localizedDescription, error)
    }
  }
  
  @objc
  func stop(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
    player.stop()
    resolve(nil)
  }
  
  private let player: Player! = Player()
}

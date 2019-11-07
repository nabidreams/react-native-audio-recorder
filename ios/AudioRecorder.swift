import Foundation

@objc(AudioRecorder)
class AudioRecorder: NSObject {

  @objc(sampleMethod:numberArgument:callback:)
  func sampleMethod(stringArgument: String, numberArgument: NSInteger, callback: RCTResponseSenderBlock) -> Void {
    callback([String(format: "Received numberArgument: %d stringArgument: %@", numberArgument, stringArgument)])
  }
}

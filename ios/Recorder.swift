import AVFoundation

class Recorder: NSObject {
  enum State: String {
    case started = "started"
    case stopped = "stopped"
  }
  
  static let minPower = -160
  static let maxPower = 0
  
  var averagePower: Float {
    recorder?.updateMeters()
    return recorder?.averagePower(forChannel: 0) ?? -160
  }
  
  var peakPower: Float {
    recorder?.updateMeters()
    return recorder?.peakPower(forChannel: 0) ?? -160
  }
  
  var state: State {
    recorder?.isRecording ?? false ? .started : .stopped
  }
  
  var stateChangeListener: ((_ state: State) -> Void)? = nil
  
  func start(_ filePath: String) throws {
    do {
      let session: AVAudioSession! = AVAudioSession.sharedInstance()
      try session.setCategory(.playAndRecord, mode: .default)
      try session.setActive(true)
      
      let settings = [
        AVFormatIDKey: Int(kAudioFormatMPEG4AAC),
        AVSampleRateKey: 44100,
        AVNumberOfChannelsKey: 1,
        AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
      ]
      
      recorder = try AVAudioRecorder(url: URL(fileURLWithPath: filePath), settings: settings)
      recorder?.isMeteringEnabled = true
      recorder?.delegate = self
      recorder?.prepareToRecord()
      recorder?.record()
      
      stateChangeListener?(state)
    } catch {
      try stop()
      throw error
    }
  }
  
  func stop() throws {
    recorder?.stop()
    recorder = nil
    
    let session: AVAudioSession! = AVAudioSession.sharedInstance()
    try session.setActive(false)
    
    stateChangeListener?(state)
  }
  
  private var recorder: AVAudioRecorder?
}

extension Recorder: AVAudioRecorderDelegate {
  func audioRecorderDidFinishRecording(_ recorder: AVAudioRecorder, successfully flag: Bool) {
    if !flag {
      do {
        try stop()
      } catch {
        print(error)
      }
    }
  }
}

import AVFoundation

class Player: NSObject {
  enum State: String {
    case started = "started"
    case stopped = "stopped"
  }
  
  static let minPower = -160
  static let maxPower = 0
  
  var averagePower: Float {
    player?.updateMeters()
    return player?.averagePower(forChannel: 0) ?? -160
  }
  
  var peakPower: Float {
    player?.updateMeters()
    return player?.peakPower(forChannel: 0) ?? -160
  }
  
  var state: State {
    player?.isPlaying ?? false ? .started : .stopped
  }
  
  var stateChangeListener: ((_ state: State) -> Void)? = nil
  
  func start(_ filePath: String) throws {
    do {
      player = try AVAudioPlayer(contentsOf: URL(fileURLWithPath: filePath))
      player?.isMeteringEnabled = true
      player?.delegate = self
      player?.prepareToPlay()
      player?.play()
      
      stateChangeListener?(state)
    } catch {
      stop()
      throw error
    }
  }
  
  func stop() {
    player?.stop()
    player = nil
    
    stateChangeListener?(state)
  }
  
  private var player: AVAudioPlayer? = nil
}

extension Player: AVAudioPlayerDelegate {
  func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
    stop()
  }
}

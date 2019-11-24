package com.nabidreams.lib.audio

import android.media.MediaPlayer
import android.util.Log
import com.facebook.react.bridge.*
import java.io.IOException

private const val LOG_TAG = "Player"

class PlayerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var fileName: String = "${reactContext.externalCacheDir.absolutePath}/sample.3gp"

    private var player: MediaPlayer? = null

    override fun getName(): String {
        return "Player"
    }

    @ReactMethod
    fun startPlaying(promise: Promise) {
        player = MediaPlayer().apply {
            try {
                setDataSource(fileName)
                prepare()
                start()
                promise.resolve(null)
            } catch (e: IOException) {
                Log.e(LOG_TAG, "prepare() failed")
                promise.reject(e)
            }
        }
    }

    @ReactMethod
    fun stopPlaying(promise: Promise) {
        player?.release()
        player = null
        promise.resolve(null)
    }
}

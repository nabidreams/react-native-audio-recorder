package com.nabidreams.lib.audio

import android.media.MediaRecorder
import android.util.Log
import com.facebook.react.bridge.*
import java.io.IOException

private const val LOG_TAG = "Recorder"

class RecorderModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var fileName: String = "${reactContext.externalCacheDir.absolutePath}/sample.3gp"

    private var recorder: MediaRecorder? = null

    override fun getName(): String {
        return "Recorder"
    }

    @ReactMethod
    fun startRecording(promise: Promise) {
        recorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.DEFAULT)
            setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            setOutputFile(fileName)
            setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)

            try {
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
    fun stopRecording(promise: Promise) {
        recorder?.apply {
            stop()
            release()
        }
        recorder = null
        promise.resolve(null)
    }
}

package com.nabidreams.lib.audio

import android.media.MediaRecorder
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException
import kotlin.math.log10
import kotlin.math.max

const val MAX_AMPLITUDE = (1 shl (16 - 1)) - 1 // 16bit
const val MIN_AMPLITUDE = MAX_AMPLITUDE * 0.00000001 // -160dB

fun getPowerFromAmplitude(amplitude: Number): Double {
    return 20 * log10(max(amplitude.toDouble(), MIN_AMPLITUDE) / MAX_AMPLITUDE)
}

class RecorderModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    enum class State(val value: String) {
        STARTED("recorderStarted"),
        STOPPED("recorderStopped")
    }

    enum class EventType(val value: String) {
        STATE_CHANGE("recorderStateChange")
    }

    private var fileName: String = "${reactContext.externalCacheDir.absolutePath}/sample.3gp"

    private var recorder: MediaRecorder? = null

    private var state: State = State.STOPPED
        set(value) {
            field = value
            sendEvent(EventType.STATE_CHANGE, Arguments.makeNativeMap(mapOf("state" to value.value)))
        }

    override fun getName(): String {
        return "Recorder"
    }

    override fun getConstants(): MutableMap<String, Any> {
        val constants = HashMap<String, Any>()

        constants["State"] = State.values().map { it.name to it.value }.toMap()

        constants["EventType"] = EventType.values().map { it.name to it.value }.toMap()

        constants["MIN_POWER"] = getPowerFromAmplitude(MIN_AMPLITUDE)
        constants["MAX_POWER"] = getPowerFromAmplitude(MAX_AMPLITUDE)

        return constants
    }

    private fun sendEvent(eventType: EventType, params: Any?) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventType.value, params)
    }

    @ReactMethod
    fun getState(promise: Promise) {
        promise.resolve((state.value))
    }

    @ReactMethod
    fun getPeakPower(promise: Promise) {
        val peakPower = getPowerFromAmplitude(recorder?.maxAmplitude ?: 0)
        promise.resolve(peakPower)
    }

    fun start() {
        recorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.DEFAULT)
            setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            setOutputFile(fileName)
            setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)

            prepare()
            start()

            state = State.STARTED
        }
    }

    @ReactMethod
    fun start(promise: Promise) {
        try {
            start()
            promise.resolve(null)
        } catch (e: IOException) {
            promise.reject(e)
        }
    }

    fun stop() {
        recorder = recorder?.run {
            stop()
            release()
            null
        }
        state = State.STOPPED
    }

    @ReactMethod
    fun stop(promise: Promise) {
        try {
            stop()
            promise.resolve(null)
        } catch (e: IOException) {
            promise.reject(e)
        }
    }
}

package com.nabidreams.lib.audio

import android.media.MediaRecorder
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException
import kotlin.math.log10
import kotlin.math.max
import kotlin.math.pow

const val BIT_RATE = 16
const val MULTIPLIER = 20
const val MIN_POWER = -160

val MAX_AMPLITUDE = (1 shl (BIT_RATE - 1)) - 1
val MIN_AMPLITUDE = MAX_AMPLITUDE * 10.0.pow(MIN_POWER / MULTIPLIER)

fun getPowerFromAmplitude(amplitude: Number): Double {
    return MULTIPLIER * log10(max(amplitude.toDouble(), MIN_AMPLITUDE) / MAX_AMPLITUDE)
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

        constants["MIN_AMPLITUDE"] = 0
        constants["MAX_AMPLITUDE"] = MAX_AMPLITUDE

        constants["MIN_POWER"] = getPowerFromAmplitude(MIN_AMPLITUDE)
        constants["MAX_POWER"] = getPowerFromAmplitude(MAX_AMPLITUDE)

        return constants
    }

    private fun sendEvent(eventType: EventType, params: Any?) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventType.value, params)
    }

    @ReactMethod
    fun getState(promise: Promise) {
        promise.resolve(state.value)
    }

    @ReactMethod
    fun getPeakAmplitude(promise: Promise) {
        promise.resolve(recorder?.maxAmplitude ?: 0)
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

package com.nabidreams.lib.audio

import android.media.MediaPlayer
import android.media.audiofx.Visualizer
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException
import kotlin.math.log10
import kotlin.math.pow

class PlayerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "Player"
    }

    override fun getConstants(): MutableMap<String, Any> {
        val constants = HashMap<String, Any>()

        constants["State"] = State.values().map { it.name to it.value }.toMap()

        constants["EventType"] = EventType.values().map { it.name to it.value }.toMap()

        constants["MIN_AMPLITUDE"] = MIN_AMPLITUDE
        constants["MAX_AMPLITUDE"] = MAX_AMPLITUDE

        constants["MIN_POWER"] = getPowerFromAmplitude(MIN_AMPLITUDE)
        constants["MAX_POWER"] = getPowerFromAmplitude(MAX_AMPLITUDE)

        return constants
    }

    companion object {
        const val BIT_RATE = 8

        const val MIN_AMPLITUDE = 0
        const val MAX_AMPLITUDE = 1 shl (BIT_RATE - 1)

        private fun getPowerFromAmplitude(amplitude: Number): Double {
            return 20 * log10((amplitude.toDouble() + 1) / (MAX_AMPLITUDE + 1))
        }
    }

    fun getRmsAmplitude(): Double {
        return visualizer?.run {
            val bytes = ByteArray(captureSize)
            getWaveForm(bytes)
            bytes.toUByteArray().map { (it.toDouble() - MAX_AMPLITUDE).pow(2) }.average().pow(0.5)
        } ?: MIN_AMPLITUDE.toDouble()
    }

    @ReactMethod
    fun getRmsAmplitude(promise: Promise) {
        promise.resolve(getRmsAmplitude())
    }

    @ReactMethod
    fun getRmsPower(promise: Promise) {
        val amplitude = getRmsAmplitude()
        val power = getPowerFromAmplitude(amplitude)
        promise.resolve(power)
    }

    enum class State(val value: String) {
        STARTED("playerStarted"),
        STOPPED("playerStopped")
    }

    private var state: State = State.STOPPED
        set(value) {
            field = value
            sendEvent(EventType.STATE_CHANGE, Arguments.makeNativeMap(mapOf("state" to value.value)))
        }

    @ReactMethod
    fun getState(promise: Promise) {
        promise.resolve(state.value)
    }

    enum class EventType(val value: String) {
        STATE_CHANGE("playerStateChange")
    }

    private fun sendEvent(eventType: EventType, params: Any?) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventType.value, params)
    }

    private var fileName: String = "${reactContext.externalCacheDir.absolutePath}/sample.3gp"

    private var player: MediaPlayer? = null
    private var visualizer: Visualizer? = null

    fun start() {
        player = MediaPlayer().apply {
            setDataSource(fileName)
            setOnCompletionListener {
                this@PlayerModule.stop()
            }

            visualizer = Visualizer(audioSessionId).apply {
                captureSize = Visualizer.getCaptureSizeRange()[0]
                enabled = true
            }

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
        visualizer = visualizer?.run {
            release()
            null
        }

        player = player?.run {
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

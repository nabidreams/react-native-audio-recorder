package com.nabidreams.lib.audio

import android.media.MediaPlayer
import android.media.audiofx.Visualizer
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException
import kotlin.math.absoluteValue
import kotlin.math.min
import kotlin.math.pow

class PlayerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "Player"
    }

    override fun getConstants(): MutableMap<String, Any> {
        val constants = HashMap<String, Any>()

        constants["State"] = State.values().map { it.name to it.value }.toMap()

        constants["EventType"] = EventType.values().map { it.name to it.value }.toMap()

        constants["MIN_LEVEL"] = MIN_LEVEL
        constants["MAX_LEVEL"] = MAX_LEVEL

        return constants
    }

    companion object {
        const val BIT_RATE = 8

        const val MIN_LEVEL = 0
        const val MAX_LEVEL = 1 shl (BIT_RATE - 1)
    }

    private var level: Double = MIN_LEVEL.toDouble()

    @ReactMethod
    fun getLevel(promise: Promise) {
        visualizer?.apply {
            val bytes = ByteArray(captureSize)
            getWaveForm(bytes)

            val level = bytes.map { min(it.toInt() + MAX_LEVEL, MAX_LEVEL) }.average()

            promise.resolve(level)
        } ?: promise.resolve(MIN_LEVEL)
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
                captureSize = Visualizer.getCaptureSizeRange()[1]
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

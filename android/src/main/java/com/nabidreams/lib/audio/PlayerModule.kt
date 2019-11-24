package com.nabidreams.lib.audio

import android.media.MediaPlayer
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException

class PlayerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    enum class State(val value: String) {
        STARTED("playerStarted"),
        STOPPED("playerStopped")
    }

    enum class EventType(val value: String) {
        STATE_CHANGE("playerStateChange")
    }

    private var fileName: String = "${reactContext.externalCacheDir.absolutePath}/sample.3gp"

    private var player: MediaPlayer? = null

    private var state: State = State.STOPPED
        set(value) {
            field = value
            sendEvent(EventType.STATE_CHANGE, Arguments.makeNativeMap(mapOf("state" to value.value)))
        }

    override fun getName(): String {
        return "Player"
    }

    override fun getConstants(): MutableMap<String, Any> {
        val constants = HashMap<String, Any>()

        constants["State"] = State.values().map { it.name to it.value }.toMap()

        constants["EventType"] = EventType.values().map { it.name to it.value }.toMap()

        return constants
    }

    private fun sendEvent(eventType: EventType, params: Any?) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventType.value, params)
    }

    @ReactMethod
    fun getState(promise: Promise) {
        promise.resolve((state.value))
    }

    fun start() {
        player = MediaPlayer().apply {
            setDataSource(fileName)
            setOnCompletionListener {
                this@PlayerModule.stop()
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

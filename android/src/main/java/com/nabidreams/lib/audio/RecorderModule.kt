package com.nabidreams.lib.audio

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException

class RecorderModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    enum class EventType(val value: String) {
        STATE_CHANGE("recorderStateChange")
    }

    override fun getName(): String {
        return "Recorder"
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mapOf(
                "State" to Recorder.State.values().map { it.name to it.value }.toMap(),
                "EventType" to EventType.values().map { it.name to it.value }.toMap(),
                "MIN_LEVEL" to Recorder.MIN_POWER,
                "MAX_LEVEL" to Recorder.MAX_POWER
        ).toMutableMap()
    }

    @ReactMethod
    fun getLevel(promise: Promise) {
        promise.resolve(recorder.maxPower)
    }

    @ReactMethod
    fun getState(promise: Promise) {
        promise.resolve(recorder.state.value)
    }

    @ReactMethod
    fun start(filePath: String, promise: Promise) {
        try {
            recorder.start(filePath)
            promise.resolve(null)
        } catch (e: IOException) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        recorder.stop()
        promise.resolve(null)
    }

    private val recorder: Recorder = Recorder().apply {
        stateChangeListener = { state ->
            sendEvent(EventType.STATE_CHANGE.value, Arguments.makeNativeMap(mapOf("state" to state.value)))
        }
    }

    private fun sendEvent(eventName: String, data: Any? = null) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventName, data)
    }
}

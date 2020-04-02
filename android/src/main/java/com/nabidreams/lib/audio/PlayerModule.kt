package com.nabidreams.lib.audio

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.IOException

class PlayerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    enum class EventType(val value: String) {
        STATE_CHANGE("playerStateChange")
    }

    override fun getName(): String {
        return "Player"
    }

    override fun getConstants(): MutableMap<String, Any> {
        return mapOf(
                "State" to Player.State.values().map { it.name to it.value }.toMap(),
                "EventType" to EventType.values().map { it.name to it.value }.toMap(),
                "MIN_LEVEL" to Player.MIN_POWER,
                "MAX_LEVEL" to Player.MAX_POWER
        ).toMutableMap()
    }

    @ReactMethod
    fun getLevel(promise: Promise) {
        promise.resolve(player.rmsPower)
    }

    @ReactMethod
    fun getState(promise: Promise) {
        promise.resolve(player.state.value)
    }

    @ReactMethod
    fun start(filePath: String, promise: Promise) {
        try {
            player.start(filePath)
            promise.resolve(null)
        } catch (e: IOException) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun stop(promise: Promise) {
        player.stop()
        promise.resolve(null)
    }

    private val player: Player = Player().apply {
        stateChangeListener = { state ->
            sendEvent(EventType.STATE_CHANGE.value, Arguments.makeNativeMap(mapOf("state" to state.value)))
        }
    }

    private fun sendEvent(eventName: String, data: Any? = null) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit(eventName, data)
    }
}

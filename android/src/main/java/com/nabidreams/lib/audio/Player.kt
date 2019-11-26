package com.nabidreams.lib.audio

import android.media.MediaPlayer
import android.media.audiofx.Visualizer
import kotlin.math.log10
import kotlin.math.pow

class Player {
    companion object {
        const val BIT_RATE = 8
        const val MIN_AMPLITUDE = 0
        const val MAX_AMPLITUDE = 1 shl (BIT_RATE - 1)
        val MIN_POWER = calculatePowerFromAmplitude(MIN_AMPLITUDE)
        val MAX_POWER = calculatePowerFromAmplitude(MAX_AMPLITUDE)

        private fun calculatePowerFromAmplitude(amplitude: Number): Double {
            return 20 * log10((amplitude.toDouble() + 1) / (MAX_AMPLITUDE + 1))
        }
    }

    enum class State(val value: String) {
        STARTED("started"),
        STOPPED("stopped")
    }

    val rmsAmplitude: Double
        get() = visualizer?.run {
            val bytes = ByteArray(captureSize)
            getWaveForm(bytes)
            bytes.toUByteArray().map { (it.toDouble() - MAX_AMPLITUDE).pow(2) }.average().pow(0.5)
        } ?: MIN_AMPLITUDE.toDouble()

    val rmsPower: Double
        get() = calculatePowerFromAmplitude(rmsAmplitude)

    var state: State = State.STOPPED
        set(value) {
            if (value !== field) {
                field = value
                stateChangeListener?.invoke(value)
            }
        }

    var stateChangeListener: ((state: State) -> Unit)? = null

    fun start(dataSourcePath: String) {
        player = MediaPlayer().apply {
            setDataSource(dataSourcePath)
            setOnCompletionListener {
                this@Player.stop()
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

    private var player: MediaPlayer? = null
    private var visualizer: Visualizer? = null
}

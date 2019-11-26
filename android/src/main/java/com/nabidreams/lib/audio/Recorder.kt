package com.nabidreams.lib.audio

import android.media.MediaRecorder
import kotlin.math.log10

class Recorder {
    companion object {
        const val BIT_RATE = 16
        const val MIN_AMPLITUDE = 0
        const val MAX_AMPLITUDE = 1 shl (BIT_RATE - 1)
        val MIN_POWER = calculatePowerFromAmplitude(MIN_AMPLITUDE)
        val MAX_POWER = calculatePowerFromAmplitude(MAX_AMPLITUDE)

        private fun calculatePowerFromAmplitude(amplitude: Number): Double {
            return 20 * log10((amplitude.toDouble() + 1) / (MAX_AMPLITUDE + 1))
        }
    }

    enum class State(val value: String) {
        STARTED("recorderStarted"),
        STOPPED("recorderStopped")
    }

    private var recorder: MediaRecorder? = null

    val peakAmplitude: Int
        get() = recorder?.maxAmplitude ?: 0

    val peakPower: Double
        get() = calculatePowerFromAmplitude(peakAmplitude)

    var state: State = State.STOPPED
        set(value) {
            if (value !== field) {
                field = value
                stateChangeListener?.invoke(value)
            }
        }

    var stateChangeListener: ((state: State) -> Unit)? = null

    fun start(outputFilePath: String) {
        recorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.DEFAULT)
            setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            setOutputFile(outputFilePath)
            setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)

            prepare()
            start()

            state = State.STARTED
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
}

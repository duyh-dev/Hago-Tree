package com.hagotree.ui.components

import android.util.Log
import com.google.firebase.crashlytics.FirebaseCrashlytics

/**
 * Centralized telemetry helpers so UI can log both to Crashlytics and Logcat.
 */
object Telemetry {
    private const val TAG = "Checkout"

    fun logNonFatal(throwable: Throwable) {
        FirebaseCrashlytics.getInstance().recordException(throwable)
        Log.d(TAG, "Non-fatal error captured", throwable)
    }

    fun logMessage(message: String) {
        Log.d(TAG, message)
    }
}

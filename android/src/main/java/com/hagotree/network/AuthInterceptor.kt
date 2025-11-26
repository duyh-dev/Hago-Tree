package com.hagotree.network

import okhttp3.Interceptor
import okhttp3.Response

/**
 * Appends the bearer token to every authenticated request. The token provider can
 * be backed by shared preferences, DataStore or an in-memory cache depending on
 * the app's requirements.
 */
class AuthInterceptor(
    private val tokenProvider: () -> String?
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = tokenProvider()

        val authenticatedRequest = if (token.isNullOrBlank()) {
            original
        } else {
            original.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        }

        return chain.proceed(authenticatedRequest)
    }
}

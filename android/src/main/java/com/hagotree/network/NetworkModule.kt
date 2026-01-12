package com.hagotree.network

import java.util.concurrent.TimeUnit
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

/**
 * Builds Retrofit and OkHttp instances with production-friendly defaults such as timeouts,
 * HTTP logging, and authentication injection.
 */
object NetworkModule {

    fun provideOkHttpClient(
        authInterceptor: AuthInterceptor,
        networkTimeoutSeconds: Long = 30L,
        loggingLevel: HttpLoggingInterceptor.Level = HttpLoggingInterceptor.Level.BODY
    ): OkHttpClient {
        val logging = HttpLoggingInterceptor().apply { level = loggingLevel }

        return OkHttpClient.Builder()
            .connectTimeout(networkTimeoutSeconds, TimeUnit.SECONDS)
            .readTimeout(networkTimeoutSeconds, TimeUnit.SECONDS)
            .writeTimeout(networkTimeoutSeconds, TimeUnit.SECONDS)
            .addInterceptor(authInterceptor)
            .addInterceptor(logging)
            .build()
    }

    fun provideRetrofit(baseUrl: String, client: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl(baseUrl)
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create())
            .build()
}

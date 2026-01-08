package com.hagotree.data

import com.hagotree.network.CheckoutRequest
import com.hagotree.network.CheckoutResponse
import com.hagotree.network.CheckoutService
import java.io.IOException
import java.util.UUID
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.retryWhen
import okhttp3.internal.http2.StreamResetException
import retrofit2.HttpException

class CheckoutRepository(
    private val service: CheckoutService
) {

    private val completedRequests: MutableMap<String, CheckoutResponse> = mutableMapOf()

    fun checkout(cartId: String, paymentMethodId: String, totalAmount: Double): Flow<Result<CheckoutResponse>> {
        // Idempotency: reuse the same key for identical payload to avoid duplicate charges
        val key = buildIdempotencyKey(cartId, paymentMethodId, totalAmount)

        return flow {
            val cached = completedRequests[key]
            if (cached != null) {
                emit(Result.success(cached))
                return@flow
            }

            val response = service.checkout(
                idempotencyKey = key,
                payload = CheckoutRequest(cartId, paymentMethodId, totalAmount)
            )

            completedRequests[key] = response
            emit(Result.success(response))
        }
            .retryWhen { cause, attempt ->
                when (mapError(cause)) {
                    DomainError.Network, DomainError.Server -> {
                        val delayMillis = (attempt + 1) * 1_000L
                        delay(delayMillis)
                        true
                    }
                    else -> false
                }
            }
            .catchDomainErrors()
    }

    private fun buildIdempotencyKey(cartId: String, paymentMethodId: String, totalAmount: Double): String {
        // Use a deterministic hash when possible so the same checkout payload reuses the key
        val raw = "$cartId-$paymentMethodId-$totalAmount"
        return UUID.nameUUIDFromBytes(raw.toByteArray()).toString()
    }

    private fun mapError(throwable: Throwable): DomainError = when (throwable) {
        is IOException, is StreamResetException -> DomainError.Network
        is HttpException -> when (throwable.code()) {
            401, 403 -> DomainError.Unauthorized
            in 500..599 -> DomainError.Server
            else -> DomainError.Unknown(throwable)
        }
        is DomainError -> throwable
        else -> DomainError.Unknown(throwable)
    }

    private fun Flow<Result<CheckoutResponse>>.catchDomainErrors(): Flow<Result<CheckoutResponse>> =
        flow {
            try {
                collect { emit(it) }
            } catch (throwable: Throwable) {
                emit(Result.failure(mapError(throwable)))
            }
        }
}

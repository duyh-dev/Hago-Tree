package com.hagotree.network

import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST
import retrofit2.http.Query

interface CheckoutService {

    @POST("checkout")
    @Headers("Content-Type: application/json")
    suspend fun checkout(
        @Query("idempotencyKey") idempotencyKey: String,
        @Body payload: CheckoutRequest
    ): CheckoutResponse
}

data class CheckoutRequest(
    val cartId: String,
    val paymentMethodId: String,
    val totalAmount: Double
)

data class CheckoutResponse(
    val receiptId: String,
    val status: String
)

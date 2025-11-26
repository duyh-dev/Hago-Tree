package com.hagotree.data

sealed class DomainError(message: String? = null, cause: Throwable? = null) : Throwable(message, cause) {
    object Network : DomainError("Network unavailable")
    object Unauthorized : DomainError("User not authorized")
    object Server : DomainError("Server error")
    object Cancelled : DomainError("Request cancelled")
    class Unknown(cause: Throwable? = null) : DomainError("Unexpected error", cause)
}

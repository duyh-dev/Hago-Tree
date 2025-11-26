package com.hagotree.ui

sealed interface UiState<out T> {
    object Loading : UiState<Nothing>
    object Empty : UiState<Nothing>
    data class Error(val throwable: Throwable) : UiState<Nothing>
    data class Data<T>(val value: T) : UiState<T>
}

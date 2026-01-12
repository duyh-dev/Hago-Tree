package com.hagotree.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.hagotree.ui.UiState

@Composable
fun <T> CheckoutStateScreen(
    uiState: UiState<T>,
    onRetry: (() -> Unit)? = null,
    renderData: @Composable (T) -> Unit
) {
    when (uiState) {
        UiState.Loading -> LoadingScreen()
        UiState.Empty -> EmptyScreen()
        is UiState.Error -> ErrorScreen(uiState.throwable, onRetry)
        is UiState.Data -> renderData(uiState.value)
    }
}

@Composable
fun LoadingScreen() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        CircularProgressIndicator()
        Spacer(modifier = Modifier.height(16.dp))
        Text(text = "Đang tải...", style = MaterialTheme.typography.bodyLarge)
    }
}

@Composable
fun EmptyScreen() {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Không có dữ liệu", style = MaterialTheme.typography.bodyLarge)
    }
}

@Composable
fun ErrorScreen(error: Throwable, onRetry: (() -> Unit)? = null) {
    Telemetry.logNonFatal(error)

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = error.message ?: "Đã có lỗi xảy ra",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.error
        )
        if (onRetry != null) {
            Spacer(modifier = Modifier.height(16.dp))
            Button(onClick = onRetry) {
                Text(text = "Thử lại")
            }
        }
    }
}

# Android networking + checkout building blocks

Các khối mã Kotlin mẫu này giúp khởi tạo Retrofit/OkHttp với timeout, logging và interceptor auth, repository dùng Flow + retry/backoff và idempotency cho checkout, cùng với màn hình state chuẩn và telemetry Crashlytics/Logcat.

## Thành phần chính
- `network`: `NetworkModule` tạo `OkHttpClient` (timeout, logging, auth) và `Retrofit`; `CheckoutService` định nghĩa API checkout.
- `data`: `CheckoutRepository` dùng Flow, ánh xạ lỗi sang `DomainError`, retry backoff cho lỗi tạm thời, idempotency bằng khóa dựa trên payload.
- `ui`: `UiState` và các composable `Loading/Empty/Error` + `CheckoutStateScreen` để wrap render; `Telemetry` log Crashlytics + Logcat.

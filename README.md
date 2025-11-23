Web có thể ăn thịt bạn, cân nhắc trước khi truy cập

## Ứng dụng di động Hago Tree (Python + Kivy)
Ứng dụng đa nền tảng tái tạo trải nghiệm Hago Tree với dữ liệu offline-first và đồng bộ thời gian thực.

### Cấu trúc
- `mobile_app/main.py`: entrypoint Kivy, quản lý ScreenManager, bootstrap API.
- `mobile_app/app.kv`: layout và style cho các màn hình chính.
- `mobile_app/database.py`: SQLite local-first (sản phẩm, giỏ, hồ sơ).
- `mobile_app/api.py`: REST client gọi backend Hago Tree.
- `mobile_app/westie_adapter.py`: lớp cầu nối tới mã nguồn **westie** (UI + xác thực). Nếu `westie` khả dụng, import tự động và dùng `westie.auth.login_with_credentials`; nếu không, fallback sang API chuẩn.
- `mobile_app/docs/wireframes.md`: wireframe mid-fidelity cho các màn hình chính.

### Chạy thử (local)
```bash
pip install kivy requests
python mobile_app/main.py
```
Ứng dụng sẽ lấy dữ liệu từ biến môi trường `HAGO_API_BASE` (mặc định `https://api.hagotree.example.com`) và cache vào SQLite `hago_tree.db`.

### Tích hợp "westie"
- Đặt mã nguồn/thư viện `westie` vào PYTHONPATH (ví dụ: `mobile_app/westie/` hoặc cài qua pip).
- `westie_adapter.ensure_login` sẽ ưu tiên `westie.auth.login_with_credentials` để đăng nhập an toàn (SSO hoặc MFA tùy westie); nếu không có, sẽ gọi `ApiClient.login`.
- Nếu `westie.widgets.GlassCard/PillButton` tồn tại, có thể sửa `app.kv` để dùng chúng cho hero card/CTA nhằm tái sử dụng style web.

### Đồng bộ & trải nghiệm di động
- Ứng dụng đọc sản phẩm từ SQLite, đồng bộ khi online (bootstrap + on_resume).
- Giỏ hàng được lưu cục bộ (`cart` table) và có endpoint `cart/sync` để gửi thay đổi.
- Mọi màn hình hỗ trợ thao tác chạm lớn, swipe trên carousel, pinch-to-zoom trên ảnh chi tiết và bố cục tuân thủ safe-area iOS/Android.

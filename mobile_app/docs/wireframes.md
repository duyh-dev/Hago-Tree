# Wireframe di động Hago Tree (mid-fidelity)

## 1. Trang chủ
```
+---------------------------------------------------+
|  Hago Tree (logo wordmark)                        |
|  [Ping trạng thái API ✓ 120ms]                    |
|                                                   |
|  [Hero carousel – vuốt ngang]                     |
|  | Ảnh cây hero  | Ảnh cây hero  |                |
|                                                   |
|  CTA: [Khám phá ngay]                             |
|  Dải USP: "Giao nhanh · Bảo hành 7 ngày ·          |
|           Chăm sóc 1:1"                           |
+---------------------------------------------------+
```
- Gesture: swipe ngang để lướt hero; tap vào ảnh để mở chi tiết sản phẩm.

## 2. Danh sách sản phẩm (filter & sort)
```
+---------------------------------------------------+
|  < Back   Danh sách                               |
|  [Tìm kiếm 🔍________________] [Còn hàng ▢] [Giá⇅] |
|                                                   |
|  Card:                                            |
|  [thumb] Bonsai Trúc Nhật     450.000đ            |
|         Stock badge ●         ★4.8  120 đánh giá  |
|  CTA: [Thêm] [Chi tiết]                           |
|  ... list scroll vô hạn ...                       |
+---------------------------------------------------+
```
- Gesture: pull-to-refresh, swipe trái trên card để thêm nhanh vào giỏ.

## 3. Chi tiết sản phẩm
```
+---------------------------------------------------+
| < Back  Bonsai Trúc Nhật                          |
| [Ảnh hero full width, pinch-to-zoom]              |
| Giá: 450.000đ | Còn: 12 | Giao 2h                 |
| Bộ sưu tập ảnh nhỏ dạng carousel                  |
| Tabs: [Giới thiệu][Chăm sóc][Đánh giá]            |
| CTA chính: [Thêm vào giỏ] (sticky bottom bar)     |
| CTA phụ: [Chia sẻ][Yêu thích]                     |
+---------------------------------------------------+
```
- Gesture: pinch-to-zoom trên ảnh; swipe tabs.

## 4. Giỏ hàng
```
+---------------------------------------------------+
|  Giỏ hàng                                         |
|  Item row:                                        |
|  [thumb] Bonsai Trúc Nhật                         |
|  Giá: 450k | Số lượng: [-] 2 [+] | Tổng: 900k    |
|  Badge: "Đồng bộ server ✓" / "Chờ đồng bộ"        |
|                                                   |
|  Tạm tính: 1.200.000đ                            |
|  Voucher: [Nhập mã____]                           |
|  CTA: [Thanh toán Apple/Google Pay]               |
+---------------------------------------------------+
```
- Persistence: lưu trong SQLite, đồng bộ nền với API cart/sync.

## 5. Hồ sơ người dùng
```
+---------------------------------------------------+
|  Hồ sơ                                            |
|  Avatar tròn (Westie widget nếu có)               |
|  Tên, email, điểm thành viên                     |
|  Nút: [Đơn hàng][Địa chỉ][Đăng xuất]              |
|  Thẻ bảo mật: "Đăng nhập an toàn bằng Westie SSO" |
+---------------------------------------------------+
```
- Gesture: tap giữ avatar để đổi ảnh; kéo xuống để cập nhật đơn hàng.

### Ghi chú đa nền tảng
- Safe area + bottom navigation dạng tab hợp chuẩn iOS/Android.
- Typography: San Francisco/Roboto tự động theo nền tảng.
- Hit target tối thiểu 44x44pt; bán kính bo 12pt.
- Ưu tiên thao tác một tay: nút chính đặt gần cạnh dưới.

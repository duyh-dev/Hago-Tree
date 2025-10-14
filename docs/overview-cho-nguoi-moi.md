# HAGO Tree – Hướng dẫn cho người mới

## 1. Bức tranh tổng quan
HAGO Tree là một website thương mại điện tử tĩnh dùng HTML/CSS/JavaScript thuần để giới thiệu và bán các sản phẩm cây cảnh. Mỗi trang HTML tương ứng với một tính năng (trang chủ, danh sách sản phẩm, bài đăng, giỏ hàng, đăng nhập, v.v.), trong khi các file CSS định hình giao diện và các file JavaScript xử lý hành vi phía trình duyệt như tải sản phẩm, quản lý giỏ hàng hay đồng bộ trạng thái đăng nhập. Trang gốc `index.html` ở thư mục chính chỉ dùng để chuyển hướng nhanh người dùng sang phiên bản đầy đủ trong thư mục `HTML/`. 【F:index.html†L1-L21】【F:HTML/index.html†L1-L192】

## 2. Cấu trúc thư mục chính
- `HTML/`: chứa các trang nội dung (trang chủ `index.html`, trang sản phẩm, bài đăng, liên hệ, đăng nhập, tra cứu đơn hàng…). Mỗi trang gắn với các file CSS/JS riêng trong thư mục tương ứng. 【F:HTML/index.html†L1-L192】
- `CSS/`: tập hợp stylesheet để tái sử dụng giữa các trang. Ví dụ `index.css` và `SanPham.css` tạo nên layout đầu trang, banner, lưới sản phẩm trên trang chủ. 【F:HTML/index.html†L6-L125】
- `JS/`: chứa logic phía trình duyệt cho từng chức năng, như trượt banner, nạp sản phẩm từ API, quản lý giỏ hàng, trang chi tiết sản phẩm, tìm kiếm… Các script được gắn cuối mỗi trang HTML. 【F:HTML/index.html†L188-L191】
- `IMG/`: hình ảnh logo, banner, ảnh sản phẩm. Trang chủ sử dụng trực tiếp nhiều ảnh trong thư mục này. 【F:HTML/index.html†L18-L72】
- `EVENT/`: thư mục dành cho các trải nghiệm phụ (ví dụ mini game quảng cáo) được link từ banner trang chủ. 【F:HTML/index.html†L65-L74】

## 3. Luồng hoạt động trang chủ
Trang `HTML/index.html` tạo ra bố cục đầu trang, thanh menu đa thiết bị, banner và nhiều khối sản phẩm theo nhóm thẻ (`caycanhnhantao`, `chaucay`, `combochaucay`, `caycanh`). Một thẻ sản phẩm mẫu (`#sanpham-template`) được ẩn sẵn để JavaScript nhân bản khi dữ liệu được nạp. 【F:HTML/index.html†L15-L139】

File `JS/index.js` chịu trách nhiệm:
- Điều khiển slider banner: bắt sự kiện nút prev/next, auto-play và trạng thái slide hiện tại. 【F:JS/index.js†L2-L35】
- Gán hành vi "Thêm giỏ hàng" cho các nút `.add-cart`, trích xuất thông tin sản phẩm từ DOM và gọi hàm `addToCart`. 【F:JS/index.js†L38-L51】
- Gọi API `https://dssc.hagotree.site/sp/12`, đảo ngược dữ liệu để ưu tiên sản phẩm mới và nhân bản template cho từng thẻ sản phẩm dựa trên trường `tag_product`. Đồng thời thiết lập liên kết tới trang chi tiết và nút giỏ hàng động. 【F:JS/index.js†L53-L92】
- Khi trang tải xong (`DOMContentLoaded`), nếu localStorage lưu thông tin đăng nhập (`user`, `userPassword`), cập nhật hiển thị ở đầu trang để nhận diện người dùng. 【F:JS/index.js†L102-L109】

## 4. Trang sản phẩm và đánh giá
Trang chi tiết sản phẩm (`HTML/SanPham.html`) sử dụng dữ liệu `products` từ `JS/IDSanPham.js` để khởi tạo danh sách, sau đó `JS/SanPham.js` lấy ID từ query string và hiển thị nội dung. Tệp `IDSanPham.js` định nghĩa một object `products` lớn với thông tin mô tả, giá, ảnh cục bộ cho từng sản phẩm – đây là nguồn dữ liệu dự phòng bên cạnh API. 【F:JS/IDSanPham.js†L1-L178】

`JS/SanPham.js` bổ sung nhiều hành vi trên trang chi tiết:
- Hàm `addToCart` chuẩn hóa giá, lưu sản phẩm vào `localStorage` và thông báo khi thêm thành công. 【F:JS/SanPham.js†L26-L43】
- Hàm `displayProduct` render toàn bộ giao diện chi tiết (ảnh chính, thumbnail phụ, giá, mô tả, form đánh giá) dựa trên dữ liệu sản phẩm và cài đặt sự kiện tương tác cho slider ảnh nhỏ, chấm sao và gửi feedback. 【F:JS/SanPham.js†L44-L188】
- Form đánh giá chuyển ảnh upload sang base64 (`convertToBase64`) rồi gửi POST tới endpoint feedback. Nếu người dùng chưa đăng nhập (không có dữ liệu trong localStorage) thì chuyển hướng tới trang đăng nhập. 【F:JS/SanPham.js†L125-L188】【F:JS/SanPham.js†L192-L198】

## 5. Giỏ hàng và tìm kiếm
Logic giỏ hàng nằm ở `JS/Giohang.js`:
- Duy trì mảng `cart` trong localStorage để chia sẻ dữ liệu giữa các trang. 【F:JS/Giohang.js†L1-L2】
- Hàm `updateCartCount` cộng dồn số lượng từng sản phẩm và hiển thị huy hiệu số lượng ở đầu trang nếu có sản phẩm. 【F:JS/Giohang.js†L3-L18】
- Gắn sự kiện Enter trên ô tìm kiếm để chuyển sang trang `search.html` với từ khóa. 【F:JS/Giohang.js†L20-L29】
- Hàm `displayCart` dựng từng dòng sản phẩm trong giỏ, tính tổng tiền, cấp sự kiện tăng/giảm số lượng hoặc xóa sản phẩm. 【F:JS/Giohang.js†L30-L84】
- `changeQuantity` và `removeItem` cập nhật lại localStorage và render sau mỗi thao tác; script khởi chạy bằng `DOMContentLoaded` để đảm bảo DOM sẵn sàng. 【F:JS/Giohang.js†L86-L110】

## 6. Những điều quan trọng cần nắm
1. **Dữ liệu phân tán giữa API và localStorage**: Trang chủ lấy sản phẩm từ API bên ngoài, còn trang chi tiết dựa vào object cục bộ. Điều này hữu ích khi backend chưa hoàn thiện nhưng bạn cần hiểu sự khác biệt nguồn dữ liệu và cách đồng bộ. 【F:JS/index.js†L53-L92】【F:JS/IDSanPham.js†L1-L178】
2. **localStorage là "cơ sở dữ liệu" phía trình duyệt**: Cả trạng thái đăng nhập, giỏ hàng, lịch sử mua đều lưu dưới dạng JSON string trong localStorage, nên phải luôn `JSON.parse`/`JSON.stringify` và kiểm tra kiểu dữ liệu trước khi dùng. 【F:JS/index.js†L102-L109】【F:JS/Giohang.js†L1-L18】
3. **Tổ chức component thủ công**: Vì không dùng framework, code dựa trên thao tác DOM trực tiếp (`querySelector`, `cloneNode`, `addEventListener`). Người mới cần quen với cách truy cập và cập nhật DOM theo từng bước. 【F:JS/index.js†L38-L92】【F:JS/SanPham.js†L44-L188】
4. **Phụ thuộc thư viện CDN**: Giao diện tận dụng Bootstrap và Font Awesome qua CDN, nên cần kết nối internet khi chạy trực tiếp. 【F:HTML/index.html†L7-L13】

## 7. Gợi ý lộ trình học tiếp
- **HTML & CSS căn bản**: hiểu thẻ semantic, flexbox/grid, responsive design để tùy biến các trang. Tham khảo tài liệu MDN hoặc FreeCodeCamp.
- **JavaScript nền tảng**: nắm vững DOM API, event, arrow function, template literal, JSON. Đọc MDN hoặc sách "You Don't Know JS".
- **Làm việc với API**: tìm hiểu `fetch`, async/await, xử lý lỗi mạng và dữ liệu bất đồng bộ. Thử viết mock server bằng `json-server` hoặc Node.js để luyện tập. 【F:JS/index.js†L53-L96】
- **Quản lý trạng thái phía client**: thực hành với `localStorage`, `sessionStorage`, cookies và cân nhắc chuyển sang cơ chế an toàn hơn (JWT + backend). 【F:JS/Giohang.js†L1-L110】【F:JS/SanPham.js†L26-L188】
- **Tổ chức mã tốt hơn**: học về module bundler (Vite, Webpack), framework hiện đại (React/Vue/Svelte) hoặc chuyển sang TypeScript để dự án lớn dễ bảo trì.
- **Cải thiện bảo mật**: bổ sung validation phía client/server, xử lý XSS/CSRF, mã hóa thông tin đăng nhập thay vì lưu plain-text trong localStorage.

## 8. Cách tiếp cận dự án khi mới tham gia
1. Chạy trang bằng Live Server hoặc bất kỳ HTTP server tĩnh nào để tránh lỗi chặn CORS khi dùng `fetch`.
2. Lần lượt mở từng trang HTML và script liên quan, vẽ sơ đồ mối liên kết giữa chúng.
3. Dùng DevTools (tab Network & Application) để xem request tới API và dữ liệu localStorage.
4. Bắt đầu với các nhiệm vụ nhỏ: ví dụ chỉnh sửa giao diện slider, thêm sản phẩm mẫu, hoặc cải thiện thông báo giỏ hàng.
5. Khi đã hiểu luồng dữ liệu, có thể tách logic thành module ES6 để tái sử dụng tốt hơn.

Hy vọng tài liệu này giúp bạn định hướng nhanh chóng khi lần đầu đọc mã HAGO Tree!

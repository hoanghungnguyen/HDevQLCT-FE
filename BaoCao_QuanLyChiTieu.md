# BÁO CÁO TỔNG KẾT DỰ ÁN: QUẢN LÝ CHI TIÊU CÁ NHÂN (PERSONAL FINANCE APP)

## I. TỔNG QUAN DỰ ÁN
Dự án **Quản lý chi tiêu cá nhân** là một ứng dụng Web Full-stack toàn diện giúp người dùng cuối (End-users) ghi chép, theo dõi và lên kế hoạch tiết kiệm tài chính cá nhân một cách trực quan và bảo mật.

Hệ thống được thiết kế theo kiến trúc Client-Server:
- **Backend**: Xây dựng bằng Java Spring Boot, quản trị cơ sở dữ liệu MySQL và bảo mật bằng Spring Security (kết hợp JWT Token).
- **Frontend**: Xây dựng bằng ReactJS (Vite), giao diện người dùng trơn tru mượt mà với Tailwind CSS, tích hợp chế độ Sáng/Tối (Dark Mode) và hệ thống Biểu đồ phân tích dữ liệu trực quan Recharts.

---

## II. CHI TIẾT TRIỂN KHAI BACKEND (JAVA SPRING BOOT)

### 1. Kiến trúc & Công nghệ mũi nhọn
- **Framework Core**: Spring Boot 3.x
- **ORM / Database**: Spring Data JPA (Hibernate) & MySQL.
- **Security**: Spring Security + JWT (JSON Web Token) + BCrypt (Mã hóa mật khẩu một chiều).
- **Công cụ hỗ trợ**: Lombok (Giảm thiểu code boilerplate), Maven/Gradle.

### 2. Sơ đồ thực thể (Entity Relationship & Database Design)
Hệ thống xoay quanh 4 Entity cốt lõi với ràng buộc quan hệ chặt chẽ:
- `User`: Chứa thông tin định danh (Email, Password dạng mã hóa Hash `BCrypt`), quản trị vòng đời tài khoản.
- `Category`: Phân loại danh mục thu/chi (`income` / `expense`). Cấu hình sẵn tự động sinh danh mục mặc định khi người dùng mới Đăng ký thành công.
- `Transaction`: Bảng lõi ghi nhận dòng tiền (Sử dụng `BigDecimal` để đảm bảo độ chính xác tài chính). Liên kết `@ManyToOne` với `User` và `Category`.
- `Goal`: Bảng Mục tiêu tiết kiệm của từng cá nhân. Chứa số liệu `targetAmount` và `currentAmount` để theo dõi tiến độ hoàn thành.

### 3. Logic & API Nổi Bật (RESTful)
- **Hệ thống xác thực (Auth JWT)**: 
  - Token được ký sinh ra khi gọi `/api/auth/login`. Bộ lọc (Filter) `JwtAuthenticationFilter` hoạt động song song để chặn các Request truy cập trái phép.
  - Tự động bóc tách `UserId` ẩn phía trong Token để gán chủ sở hữu cho mọi luồng Data (người dùng này sẽ không xem/sửa/xóa được dữ liệu của tài khoản người dùng khác - _Data Isolation_).
- **JPQL Analytics (Thống kê Backend)**: Thay vì kéo ngàn dòng dữ liệu về RAM để lặp `for-loop`, dự án sử dụng sức mạnh tính toán trực tiếp từ `TransactionRepository` (ví dụ `SUM(CASE WHEN...)`) để gom nhóm và trích xuất dữ liệu tổng quan, biểu đồ theo tháng với tốc độ cao.
- **Goal Check (Logic tính toán)**: Tại `/api/goals/{id}/add-money` được cài cắm Controller rào chắn chặn việc nạp lố tiền so với định mức Mục tiêu đã cài sẵn.

---

## III. CHI TIẾT TRIỂN KHAI FRONTEND (REACT VITE & TAILWIND)

### 1. Kiến trúc & Công nghệ mũi nhọn
- **Framework Core**: ReactJS khởi tạo trên nền Vite siêu tốc.
- **Styling**: Tailwind CSS (Utility-first CSS Framework) kết hợp Context Dark Mode.
- **Routing & Fetching**: React Router DOM (Điều hướng) & Axios (Call API REST).
- **UI Libraries**: Recharts (Vẽ biểu đồ hình khối, Area), Lucide React (Bộ Icon chuẩn mực), React Hot Toast (Thông báo nổi bật).

### 2. Thiết kế Layout & Components (UI/UX)
- **Cơ chế Layout**: Khung thiết kế đóng gói tiêu chuẩn với `Sidebar` (menu bên trái) và `Content` (vùng hiển thị chính bên phải), hỗ trợ cuộn thanh ghi khi danh sách đổ dài (Overflow custom scrollbar).
- **Trang Tổng Quan (Dashboard)**: Góc nhìn toàn cảnh gồm hệ thống màn nhấp nháy Skeleton chờ dữ liệu chạy; Các thẻ tính tổng (Tổng số dư, Tổng Thu/Chi).
- **Trang Biến Động Số Dư (Transactions)**: 
  - Tích hợp Modal bật lên rớt xuống (Pop-up) với các Inputs thiết kế Form nhạy bén cho phép gọi API tạo và chỉnh sửa Giao Dịch, cũng như tạo nhánh Category mới ngay lập tức.
  - Bộ khung Lọc Giao dịch thông minh trỏ trực tiếp tham số `/filter` xuống Backend.
- **Trang Mục Tiêu (Goals)**: Hệ sắp xếp lưới Grid, thanh Progress bar (biểu diễn % thành tích xanh/đỏ sinh động), có tích hợp cờ hiệu "Hoàn thành 🎉" để chúc mừng.
- **Trang Báo Cáo Thống Kê (Statistics)**: Render bộ Recharts Cột biểu diễn chu kì dòng tiền của cả 1 Năm (12 tháng). Phân bổ tỷ lệ % bằng đồ thị vòng khép kín. Mọi biểu đồ hỗ trợ Tooltips và Responsive co giãn theo kích thước màn hình.
- **Security trên React**: Áp dụng Higher-Order Component `<ProtectedRoute>` kết hợp React Context (`AuthContext.jsx`) để kiểm tra `localStorage`, đá văng người dùng về màng Hình Đăng Nhập (`/login`) nếu Token hết hạn/bị xoá.

### 3. Chế độ Tối (Dark Mode) rải rác toàn hệ thống
- Mọi mảng màu sáng (bg-white, text-gray-900, shadow) được thiết lập cầu song song với tiền tố `dark:` (chuyển qua các mã hex sang trọng như `#1E1E2D` và `#2A2A3C`).
- Cờ ghi nhớ (User Preferences): Ứng dụng tích hợp tự động đọc `localStorage` tại khâu Bootstrap rễ (`main.jsx`) nhằm triệt tiêu độ trễ màn hình, giúp việc sang nhượng trang (F5) mượt mà giữ nguyên cấu trúc Đêm. Nút bật/tắt (Sun/Moon switch) được neo cố định ngay phần menu `Sidebar` khu Setting hạ thuỷ.

---

## IV. ĐỊNH HƯỚNG PHÁT TRIỂN (TƯƠNG LAI)
- Xây dựng hệ module bảng thiết lập / thiết kế Giới hạn Ngân Sách Hàng Tháng (Monthly Budget Constraints) hiển thị cảnh báo khi chi tiêu vượt quá 80% hạn mức.
- Quét biên xuất dữ liệu dưới dạng Report Excel / PDF cho người dùng tải về bằng cơ chế xuất File của Backend.
- Hệ thống gửi thư Cronjobs báo cáo thống kê qua mật khẩu trạm `JavaMailSender` tới hộp thư Email hàng tuần.

---
**_Báo cáo được tổng hợp sau chuỗi kiến thiết phiên bản 1.0_**

# Courtify - Hệ Thống Quản Lý Sân Cầu Lông

> Phát triển bởi **Kteam** - Chuyên phần mềm & website tự động hóa chuyên sâu

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [Liên hệ](#liên-hệ)

## 🎯 Giới thiệu

Courtify là giải pháp quản lý sân cầu lông toàn diện với các tính năng:

- 📅 **Lịch đặt sân trực quan** - Xem theo ngày, tuần, danh sách
- 👥 **Quản lý khách hàng (CRM)** - Chương trình thành viên tự động
- 🏢 **Đa chi nhánh** - Quản lý nhiều cơ sở cùng lúc
- 📊 **Báo cáo thời gian thực** - Doanh thu, hiệu suất sân
- 🧾 **Hóa đơn PDF chuyên nghiệp** - Xuất và in hóa đơn
- 📦 **Quản lý kho** - Theo dõi thiết bị cho thuê

## 💻 Yêu cầu hệ thống

### Cho người dùng cuối
- Trình duyệt web hiện đại (Chrome 90+, Firefox 88+, Edge 90+, Safari 14+)
- Kết nối Internet ổn định

### Cho developers (Self-hosted)
- **Node.js** phiên bản 18.0.0 trở lên
- **PNPM** hoặc **NPM** phiên bản 9.0.0 trở lên
- **Git** (đã có sẵn nếu bạn clone từ repo)
- **PostgreSQL** hoặc **SQLite** cho database

## 🚀 Cài đặt

### Bước 1: Giải nén source code

Giải nén file `courtify-source.zip` vào thư mục bất kỳ.

### Bước 2: Cài đặt dependencies

Mở Terminal/Command Prompt, di chuyển vào thư mục vừa giải nén:

```bash
cd courtify-source

# Cài đặt các thư viện cần thiết
npm install
# hoặc nếu dùng pnpm
pnpm install
```

### Bước 3: Cấu hình môi trường

Tạo file `.env` trong thư mục root với nội dung:

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key-change-this
PORT=3000
```

### Bước 4: Khởi tạo database

```bash
# Chạy migration để tạo các bảng
npm run db:migrate

# Thêm dữ liệu mẫu (tuỳ chọn)
npm run db:seed
```

### Bước 5: Khởi động ứng dụng

```bash
# Chạy cả frontend và backend
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

## 🔐 Sử dụng

### Đăng nhập

Sử dụng tài khoản mặc định:
- **Email:** admin@courtify.vn
- **Mật khẩu:** admin123

> ⚠️ **Lưu ý bảo mật:** Hãy đổi mật khẩu ngay sau khi đăng nhập lần đầu!

### Các tính năng chính

1. **Dashboard** - Tổng quan hoạt động
2. **Lịch đặt sân** - Quản lý booking
3. **Khách hàng** - CRM với thành viên Bronze → Platinum
4. **Cơ sở** - Quản lý đa chi nhánh
5. **Kho** - Quản lý thiết bị
6. **Hóa đơn** - Xuất PDF chuyên nghiệp
7. **Báo cáo** - Thống kê doanh thu

## 📞 Liên hệ

| Kênh | Thông tin |
|------|-----------|
| 🌐 **Website** | [kteam.vn](https://kteam.vn) |
| ▶️ **YouTube** | [youtube.com/kteam](https://youtube.com/kteam) |
| 📘 **Facebook** | [facebook.com/howkteam](https://facebook.com/howkteam) |
| 📧 **Email** | plus.kimlong@gmail.com |

---

© 2024-2026 Kteam. All rights reserved.

> 💬 *"Chúng tôi tạo ra những công cụ giúp cuộc sống và công việc của bạn trở nên dễ dàng hơn"*
>
> — **Kteam**

# 📋 Product Requirements Document (PRD)
# Hệ Thống Quản Lý Sân Cầu Lông

> **Version**: 1.0
> **Created**: 2026-02-04
> **Status**: Draft

---

## 1. 🎯 Tổng Quan Sản Phẩm

### 1.1. Mục Tiêu
Xây dựng một **hệ thống web** giúp chủ sân quản lý **nhiều sân cầu lông** một cách hiệu quả, bao gồm:
- Quản lý đặt sân theo thời gian thực
- Quản lý khách hàng và hội viên
- Quản lý doanh thu và thanh toán
- Quản lý dịch vụ và sản phẩm đi kèm
- Báo cáo và thống kê kinh doanh

### 1.2. Đối Tượng Sử Dụng

| Actor | Mô tả |
|-------|-------|
| **Super Admin** | Quản lý toàn bộ hệ thống, tạo/quản lý các cơ sở sân |
| **Owner (Chủ sân)** | Quản lý 1 hoặc nhiều cơ sở sân, xem báo cáo tổng hợp |
| **Staff (Nhân viên)** | Thao tác nghiệp vụ hàng ngày tại 1 cơ sở |
| **Customer (Khách hàng)** | Đặt sân online, xem lịch, thanh toán |
| **Member (Hội viên)** | Như Customer + ưu đãi đặc biệt, tích điểm |

### 1.3. Phạm Vi Dự Án

**✅ Trong phạm vi (In Scope):**
- Quản lý nhiều cơ sở sân (Multi-tenant)
- Quản lý sân và khung giờ
- Đặt sân online theo thời gian thực
- Quản lý khách hàng và hội viên
- Quản lý thanh toán và hóa đơn
- Quản lý dịch vụ/sản phẩm bán kèm
- Báo cáo doanh thu và thống kê
- Responsive Web (Desktop + Mobile)
- Docker deployment

**❌ Ngoài phạm vi (Out of Scope):**
- Mobile App native (iOS/Android)
- Tích hợp cổng thanh toán thực (phase sau)
- Tích hợp Zalo Mini App (phase sau)

---

## 2. 🏢 Nghiệp Vụ Cần Quản Lý

### 2.1. Quản Lý Cơ Sở Sân (Venues)

Hệ thống cho phép quản lý **nhiều cơ sở sân** khác nhau:

| Thông tin | Mô tả |
|-----------|-------|
| Tên cơ sở | VD: "Sân Cầu Lông Phú Nhuận" |
| Địa chỉ | Địa chỉ đầy đủ |
| Số điện thoại | Hotline liên hệ |
| Email | Email liên hệ |
| Giờ mở cửa | VD: 6:00 - 23:00 |
| Ảnh đại diện | Logo/ảnh cơ sở |
| Trạng thái | Hoạt động / Tạm đóng |
| Cài đặt giá | Bảng giá theo khung giờ |

### 2.2. Quản Lý Sân (Courts)

Mỗi cơ sở có nhiều sân:

| Thông tin | Mô tả |
|-----------|-------|
| Mã sân | VD: A1, A2, B1, B2 |
| Tên sân | VD: "Sân 1", "Sân VIP" |
| Loại sân | Sân đơn / Sân đôi / VIP |
| Mặt sân | Thảm / Gỗ / Cao su |
| Trạng thái | Hoạt động / Bảo trì / Đóng cửa |
| Ảnh sân | Hình ảnh thực tế |
| Giá đặc biệt | Override giá mặc định (nếu có) |

### 2.3. Quản Lý Khung Giờ & Giá

Hệ thống hỗ trợ **giá linh hoạt** theo:

| Loại giá | Mô tả |
|----------|-------|
| **Theo khung giờ** | Sáng (6-11h), Trưa (11-14h), Chiều (14-18h), Tối (18-23h) |
| **Theo thứ** | Ngày thường vs Cuối tuần |
| **Theo loại khách** | Khách lẻ vs Hội viên |
| **Giá đặc biệt** | Ngày lễ, sự kiện |

**Ví dụ bảng giá:**

| Khung giờ | Thứ 2-6 | Thứ 7-CN |
|-----------|---------|----------|
| 6:00 - 11:00 | 80,000đ | 100,000đ |
| 11:00 - 14:00 | 60,000đ | 80,000đ |
| 14:00 - 18:00 | 80,000đ | 120,000đ |
| 18:00 - 23:00 | 120,000đ | 150,000đ |

### 2.4. Quản Lý Đặt Sân (Bookings)

**Loại đặt sân:**

| Loại | Mô tả |
|------|-------|
| **Đặt lẻ** | Đặt 1 lần duy nhất |
| **Đặt cố định** | Đặt định kỳ hàng tuần (VD: Thứ 3, 19h-21h) |
| **Đặt nhóm** | Đặt nhiều sân cùng lúc cho giải đấu |

**Trạng thái đặt sân:**

```
[Pending] → [Confirmed] → [In Progress] → [Completed]
                ↓                              ↓
           [Cancelled]                    [No Show]
```

**Thông tin đặt sân:**
- Khách hàng (tên, SĐT)
- Sân được đặt
- Ngày giờ bắt đầu - kết thúc
- Loại đặt (lẻ/cố định)
- Ghi chú
- Trạng thái thanh toán

### 2.5. Quản Lý Khách Hàng

| Thông tin | Mô tả |
|-----------|-------|
| Họ tên | Tên đầy đủ |
| Số điện thoại | SĐT chính (unique) |
| Email | Email liên hệ |
| Giới tính | Nam/Nữ/Khác |
| Ngày sinh | Để gửi ưu đãi sinh nhật |
| Địa chỉ | Địa chỉ (optional) |
| Ghi chú | Ghi chú đặc biệt |
| Lịch sử đặt sân | Số lần đặt, tổng chi tiêu |
| Loại khách | Khách lẻ / Hội viên |

### 2.6. Quản Lý Hội Viên (Membership)

**Các gói hội viên:**

| Gói | Thời hạn | Ưu đãi |
|-----|----------|--------|
| **Bronze** | 1 tháng | Giảm 5% |
| **Silver** | 3 tháng | Giảm 10%, 1h free/tháng |
| **Gold** | 6 tháng | Giảm 15%, 2h free/tháng |
| **Platinum** | 12 tháng | Giảm 20%, 4h free/tháng, ưu tiên đặt |

**Tích điểm:**
- Mỗi 10,000đ = 1 điểm
- 100 điểm = 1h chơi free
- Điểm có hạn sử dụng 6 tháng

### 2.7. Quản Lý Dịch Vụ & Sản Phẩm

**Dịch vụ:**
| Dịch vụ | Đơn vị | Giá |
|---------|--------|-----|
| Thuê vợt | Cây/buổi | 30,000đ |
| Thuê cầu | Quả | 3,000đ |
| Thuê giày | Đôi/buổi | 20,000đ |
| Tủ đồ | Lượt | 10,000đ |
| Huấn luyện | Giờ | 200,000đ |

**Sản phẩm bán lẻ:**
| Sản phẩm | Giá |
|----------|-----|
| Nước suối | 10,000đ |
| Nước tăng lực | 25,000đ |
| Khăn lạnh | 15,000đ |
| Cầu lông (ống 12) | 120,000đ |
| Vợt cầu lông | 500,000đ - 2,000,000đ |

**Quản lý kho:**
- Số lượng tồn kho
- Cảnh báo khi sắp hết
- Nhập/xuất kho
- Kiểm kê

### 2.8. Quản Lý Thanh Toán

**Hình thức thanh toán:**
- Tiền mặt
- Chuyển khoản ngân hàng
- Ví điện tử (MoMo, ZaloPay, VNPay)
- Thẻ hội viên (trừ tiền)

**Hóa đơn bao gồm:**
- Tiền sân (theo giá + thời gian)
- Dịch vụ đi kèm
- Sản phẩm mua thêm
- Giảm giá hội viên
- Điểm tích lũy sử dụng
- VAT (nếu có)

### 2.9. Quản Lý Nhân Viên

| Thông tin | Mô tả |
|-----------|-------|
| Họ tên | Tên nhân viên |
| SĐT | Số điện thoại |
| Email | Email đăng nhập |
| Vai trò | Admin/Manager/Staff |
| Cơ sở làm việc | Được phân công cơ sở nào |
| Lịch làm việc | Ca sáng/chiều/tối |
| Trạng thái | Đang làm / Nghỉ việc |

### 2.10. Báo Cáo & Thống Kê

**Báo cáo doanh thu:**
- Doanh thu theo ngày/tuần/tháng/năm
- Doanh thu theo cơ sở
- Doanh thu theo sân
- Doanh thu theo loại (sân/dịch vụ/sản phẩm)

**Báo cáo đặt sân:**
- Tỉ lệ lấp đầy theo sân
- Khung giờ hot nhất
- Tỉ lệ hủy sân
- Khách hàng mới vs cũ

**Báo cáo khách hàng:**
- Top khách hàng chi tiêu
- Khách hàng mới/tháng
- Tỉ lệ chuyển đổi khách → hội viên
- Điểm tích lũy chưa sử dụng

**Báo cáo kho:**
- Sản phẩm bán chạy
- Sản phẩm sắp hết
- Giá trị tồn kho

---

## 3. 🎨 Yêu Cầu UI/UX

### 3.1. Responsive Design
- **Desktop**: Full-featured dashboard
- **Tablet**: Optimized cho nhân viên quầy
- **Mobile**: Đặt sân nhanh cho khách

### 3.2. Theme
- **Primary Color**: Xanh lá (#22C55E) - Năng động, thể thao
- **Dark Mode**: Có hỗ trợ
- **Font**: Inter/Roboto

### 3.3. Màn Hình Chính

#### Admin Dashboard
- Tổng quan doanh thu hôm nay
- Số sân đang hoạt động
- Đặt sân sắp tới
- Biểu đồ doanh thu 7 ngày

#### Booking Calendar
- View theo ngày/tuần/tháng
- Drag & drop đặt sân
- Color coding theo trạng thái
- Real-time update

#### Customer Portal
- Xem lịch sân trống
- Đặt sân online
- Lịch sử đặt sân
- Điểm tích lũy

### 3.4. UX Principles
- **1-Click Booking**: Đặt sân nhanh nhất có thể
- **Visual Calendar**: Dễ nhìn, dễ thao tác
- **Real-time**: Cập nhật ngay khi có thay đổi
- **Mobile-first**: Tối ưu cho màn hình nhỏ
- **Offline-ready**: Cache cơ bản khi mất mạng

---

## 4. 🔧 Yêu Cầu Kỹ Thuật

### 4.1. Tech Stack Đề Xuất

| Layer | Technology | Lý do |
|-------|------------|-------|
| **Frontend** | React + TypeScript | Component-based, type-safe |
| **UI Library** | Tailwind CSS + shadcn/ui | Modern, responsive |
| **State** | TanStack Query + Zustand | Server state + Client state |
| **Backend** | Node.js + Express | Nhanh, dễ deploy |
| **Database** | PostgreSQL | Robust, relationships |
| **ORM** | Prisma | Type-safe, migrations |
| **Auth** | JWT + Refresh Token | Stateless, secure |
| **Realtime** | Socket.io | Live calendar updates |
| **Docker** | Docker Compose | Easy deployment |

### 4.2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        NGINX (Reverse Proxy)                │
│                      - SSL Termination                       │
│                      - Static Files                          │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │ Frontend │       │ Backend  │       │ Socket.io│
    │  (React) │       │ (Node.js)│       │  Server  │
    │   :3000  │       │   :5000  │       │   :5001  │
    └──────────┘       └──────────┘       └──────────┘
                              │
                              ▼
                       ┌──────────┐
                       │PostgreSQL│
                       │  :5432   │
                       └──────────┘
```

### 4.3. Docker Deployment

```yaml
services:
  - frontend (nginx + react build)
  - backend (node.js)
  - database (postgresql)
  - redis (optional, for caching)
```

### 4.4. Security Requirements
- Password hashing (bcrypt)
- JWT với expiry ngắn + Refresh token
- CORS configuration
- Rate limiting
- SQL injection protection (Prisma)
- XSS protection (React)
- HTTPS only (production)

### 4.5. Performance Requirements
- Page load < 2s
- API response < 200ms
- Support 100 concurrent users
- Database indexed queries

---

## 5. 📊 Thứ Tự Ưu Tiên (MVP)

### Phase 1: Core (MVP) - 2-3 tuần
1. ✅ Authentication (Login/Register)
2. ✅ Quản lý cơ sở sân
3. ✅ Quản lý sân
4. ✅ Calendar đặt sân (CRUD)
5. ✅ Quản lý khách hàng cơ bản
6. ✅ Dashboard cơ bản
7. ✅ Docker deployment

### Phase 2: Enhanced - 2 tuần
1. Quản lý khung giờ & giá linh hoạt
2. Đặt cố định (recurring)
3. Quản lý hóa đơn
4. Báo cáo doanh thu
5. Realtime calendar (Socket.io)

### Phase 3: Full - 2 tuần
1. Quản lý hội viên & tích điểm
2. Quản lý dịch vụ/sản phẩm
3. Quản lý kho
4. Customer portal (đặt sân online)
5. Báo cáo nâng cao

### Phase 4: Polish - 1 tuần
1. Dark mode
2. Notifications
3. Performance optimization
4. Documentation

---

## 6. ✅ Definition of Done

Một feature được coi là hoàn thành khi:
1. ✅ Code đã được implement theo specs
2. ✅ Unit tests passed (nếu có)
3. ✅ UI responsive trên 3 breakpoints
4. ✅ API đã documented
5. ✅ Code reviewed
6. ✅ Deployed và test trên staging

---

## 7. 📎 Appendix

### 7.1. Thuật Ngữ

| Thuật ngữ | Giải thích |
|-----------|------------|
| Venue | Cơ sở sân (VD: "Sân Cầu Lông Phú Nhuận") |
| Court | Sân cầu lông trong 1 venue |
| Booking | Lượt đặt sân |
| Slot | Khung giờ 1 tiếng |
| Member | Khách hàng có gói hội viên |

### 7.2. Tham Khảo
- Alobo.vn - Phần mềm quản lý sân Việt Nam
- PosApp.vn - Quản lý sân + bán hàng
- Mewin.vn - Đặt sân online
- BookLux - International booking system

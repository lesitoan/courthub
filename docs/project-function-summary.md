# Tóm tắt chức năng dự án Courtify

## 1. Tổng quan

**Courtify** là hệ thống web quản lý sân cầu lông, hỗ trợ chủ sân và nhân viên vận hành nhiều cơ sở sân trong cùng một hệ thống.

Mục tiêu chính:

- Quản lý cơ sở sân và sân cầu lông.
- Quản lý lịch đặt sân theo ngày/tuần/danh sách.
- Quản lý khách hàng, hội viên và điểm tích lũy.
- Quản lý hóa đơn, thanh toán, dịch vụ và sản phẩm bán kèm.
- Theo dõi doanh thu, lịch đặt và báo cáo kinh doanh.
- Hỗ trợ triển khai bằng Docker.

---

## 2. Công nghệ sử dụng

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI / shadcn-style components
- TanStack Query
- Zustand
- Axios
- Recharts
- Socket.io client

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcryptjs
- Zod validation
- Socket.io
- xlsx export

### Database

- PostgreSQL
- Prisma schema tại `apps/backend/prisma/schema.prisma`

Các model chính:

- User
- RefreshToken
- Venue
- VenueStaff
- Court
- Customer
- Booking
- PricingRule
- Service
- Product
- Invoice
- InvoiceItem
- MembershipPlan
- SystemConfig

---

## 3. Vai trò người dùng

| Vai trò | Mô tả |
|---|---|
| Super Admin | Quản lý toàn bộ hệ thống |
| Admin / Owner | Quản lý một hoặc nhiều cơ sở sân |
| Manager | Quản lý cơ sở được phân công |
| Staff | Thao tác nghiệp vụ hằng ngày: đặt sân, check-in, thanh toán |
| Customer | Đặt sân, xem lịch sử đặt sân |
| Member | Khách hàng có hội viên, ưu đãi và điểm tích lũy |

Trong code hiện tại, các role chính gồm:

- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`
- `STAFF`

---

## 4. Cấu trúc dự án

```text
source_quan_ly_san_cau_long/
├── apps/
│   ├── backend/      # Backend API Express + Prisma
│   └── frontend/     # Frontend React + Vite
├── docs/             # Tài liệu phân tích, API, UI, data model
├── scripts/          # Script hỗ trợ phát triển
├── docker-compose.yml
├── package.json
└── .env.example
```

---

## 5. Các chức năng chính

## 5.1. Xác thực người dùng

Chức năng xác thực nằm ở backend:

- `apps/backend/src/routes/auth.routes.ts`
- `apps/backend/src/services/auth.service.ts`
- `apps/backend/src/middleware/auth.ts`

Các chức năng gồm:

- Đăng nhập.
- Đăng ký.
- Refresh access token.
- Đăng xuất.
- Đăng xuất tất cả thiết bị.
- Lấy thông tin người dùng hiện tại.
- Đổi mật khẩu.

Frontend dùng Zustand để lưu trạng thái đăng nhập và Axios interceptor để tự gắn Bearer token vào request.

---

## 5.2. Dashboard tổng quan

Trang dashboard nằm tại:

- `apps/frontend/src/pages/DashboardPage.tsx`

Dashboard hiển thị:

- Doanh thu hôm nay/tuần/tháng.
- Số lượt đặt sân.
- Khách hàng hoạt động.
- Số sân trống / sân đang chơi.
- Biểu đồ doanh thu.
- Phân bổ đặt sân theo khung giờ.
- Lịch đặt sân sắp tới.
- Thao tác nhanh: đặt sân, thêm khách, check-in, thanh toán.

Backend report API nằm tại:

- `apps/backend/src/routes/report.routes.ts`
- `apps/backend/src/services/report.service.ts`

---

## 5.3. Quản lý cơ sở sân

Chức năng quản lý cơ sở sân dùng để quản lý các địa điểm/cơ sở kinh doanh.

Backend:

- `apps/backend/src/routes/venue.routes.ts`
- `apps/backend/src/services/venue.service.ts`

Frontend:

- `apps/frontend/src/pages/VenuesPage.tsx`
- `apps/frontend/src/services/venue.service.ts`

Thông tin cơ sở gồm:

- Tên cơ sở.
- Địa chỉ.
- Số điện thoại.
- Email.
- Mô tả.
- Logo.
- Giờ mở cửa / đóng cửa.
- Trạng thái hoạt động.
- Danh sách sân.
- Nhân viên.
- Bảng giá.
- Dịch vụ.
- Sản phẩm.

Chức năng chính:

- Xem danh sách cơ sở.
- Xem chi tiết cơ sở.
- Thống kê cơ sở.
- Tạo cơ sở.
- Cập nhật cơ sở.
- Xóa cơ sở.

---

## 5.4. Quản lý sân

Chức năng quản lý từng sân thuộc một cơ sở.

Backend:

- `apps/backend/src/routes/court.routes.ts`
- `apps/backend/src/services/court.service.ts`

Frontend:

- `apps/frontend/src/pages/CourtsPage.tsx`
- `apps/frontend/src/components/court/`

Thông tin sân gồm:

- Cơ sở sở hữu.
- Tên sân.
- Mô tả.
- Loại mặt sân.
- Sân trong nhà hay ngoài trời.
- Trạng thái: `ACTIVE`, `MAINTENANCE`, `INACTIVE`.
- Thứ tự hiển thị.

Chức năng chính:

- Danh sách sân.
- Thêm sân.
- Cập nhật sân.
- Đổi trạng thái sân.
- Xóa sân.
- Hiển thị tình trạng sân.

---

## 5.5. Lịch đặt sân

Đây là module trung tâm của hệ thống.

Frontend:

- `apps/frontend/src/pages/BookingCalendarPage.tsx`
- `apps/frontend/src/components/booking/`
- `apps/frontend/src/components/calendar/`

Backend:

- `apps/backend/src/routes/booking.routes.ts`
- `apps/backend/src/services/booking.service.ts`

Các chế độ xem lịch:

- Xem theo ngày.
- Xem theo tuần.
- Xem dạng danh sách.
- Mini calendar.
- Panel chi tiết booking.
- Modal tạo booking.
- Modal sửa booking.
- Modal đặt lịch cố định.

Chức năng backend hỗ trợ:

- Lấy dữ liệu calendar.
- Kiểm tra trùng lịch.
- Tính giá.
- Danh sách booking.
- Chi tiết booking.
- Tạo booking.
- Sửa booking.
- Hủy booking.
- Check-in.
- Check-out.

### Luồng đặt sân

1. Nhân viên chọn ngày, cơ sở và sân.
2. Tạo booking mới.
3. Backend kiểm tra sân có tồn tại và đang hoạt động.
4. Backend kiểm tra trùng khung giờ.
5. Backend kiểm tra giờ đặt nằm trong giờ mở cửa.
6. Backend tính tiền theo quy tắc giá.
7. Booking được tạo với trạng thái `CONFIRMED`.
8. Khi khách đến, nhân viên check-in, trạng thái chuyển sang `IN_PROGRESS`.
9. Khi khách chơi xong, nhân viên check-out, trạng thái chuyển sang `COMPLETED`.
10. Nếu booking có khách hàng, hệ thống cập nhật số lần đặt và tổng chi tiêu.

---

## 5.6. Đặt sân định kỳ

Backend:

- `apps/backend/src/routes/recurring-booking.routes.ts`
- `apps/backend/src/services/recurring-booking.service.ts`

Frontend:

- `apps/frontend/src/components/booking/RecurringBookingModal.tsx`
- `apps/frontend/src/services/recurring-booking.service.ts`

Chức năng:

- Tạo nhiều booking theo ngày trong tuần.
- Chọn ngày bắt đầu và ngày kết thúc.
- Chọn nhiều thứ trong tuần.
- Cập nhật giờ cho nhóm booking định kỳ.
- Hủy nhóm booking định kỳ.
- Xem danh sách booking định kỳ sắp tới.

---

## 5.7. Quản lý khách hàng

Backend:

- `apps/backend/src/routes/customer.routes.ts`
- `apps/backend/src/services/customer.service.ts`

Frontend:

- `apps/frontend/src/pages/CustomersPage.tsx`
- `apps/frontend/src/pages/CustomerDetailPage.tsx`
- `apps/frontend/src/components/customer/`
- `apps/frontend/src/services/customer.service.ts`

Thông tin khách hàng gồm:

- Tên khách hàng.
- Số điện thoại.
- Email.
- Ngày sinh.
- Địa chỉ.
- Ghi chú.
- Hạng hội viên.
- Ngày bắt đầu/kết thúc hội viên.
- Tổng số lần đặt.
- Tổng chi tiêu.
- Điểm tích lũy.
- Trạng thái hoạt động.

Chức năng chính:

- Danh sách khách hàng.
- Tìm khách hàng theo số điện thoại.
- Xem chi tiết khách hàng.
- Tạo khách hàng.
- Cập nhật khách hàng.
- Xóa khách hàng.
- Xem top khách hàng.
- Cộng/trừ điểm.
- Gán membership.

---

## 5.8. Hội viên và tích điểm

Dữ liệu hội viên hiện được lưu trong model `Customer` và `MembershipPlan`.

Chức năng hiện có:

- Gán hạng hội viên cho khách hàng.
- Lưu ngày bắt đầu và ngày kết thúc hội viên.
- Cộng/trừ điểm khách hàng.
- Lưu tổng số lần đặt và tổng chi tiêu.

Theo tài liệu PRD, hệ thống định hướng có các hạng:

- Bronze
- Silver
- Gold
- Platinum

Tuy nhiên trong code hiện tại chưa thấy route riêng hoàn chỉnh cho quản lý gói hội viên.

---

## 5.9. Hóa đơn và thanh toán

Backend:

- `apps/backend/src/routes/invoice.routes.ts`
- `apps/backend/src/services/invoice.service.ts`

Frontend:

- `apps/frontend/src/pages/InvoicesPage.tsx`
- `apps/frontend/src/pages/PrintInvoicePage.tsx`
- `apps/frontend/src/components/invoice/`
- `apps/frontend/src/services/invoice.service.ts`

Hóa đơn gồm:

- Mã hóa đơn.
- Khách hàng.
- Tạm tính.
- Giảm giá.
- Tổng tiền.
- Trạng thái thanh toán.
- Phương thức thanh toán.
- Số tiền đã thanh toán.
- Ngày thanh toán.
- Danh sách item.

Item hóa đơn có thể liên kết với:

- Booking.
- Dịch vụ.
- Sản phẩm.

Trạng thái thanh toán:

- `PENDING`
- `PAID`
- `PARTIAL`
- `REFUNDED`

Chức năng chính:

- Danh sách hóa đơn.
- Tổng kết hóa đơn theo ngày.
- Chi tiết hóa đơn.
- Tạo hóa đơn.
- Cập nhật trạng thái thanh toán.
- Đánh dấu đã thanh toán.
- Hủy hóa đơn.
- In hóa đơn.

---

## 5.10. Kho, sản phẩm và dịch vụ

Backend sản phẩm:

- `apps/backend/src/routes/product.routes.ts`
- `apps/backend/src/services/product.service.ts`

Backend dịch vụ:

- `apps/backend/src/routes/service.routes.ts`
- `apps/backend/src/services/service.service.ts`

Frontend:

- `apps/frontend/src/pages/InventoryPage.tsx`
- `apps/frontend/src/components/inventory/`
- `apps/frontend/src/services/inventory.service.ts`

Sản phẩm hỗ trợ:

- Danh sách sản phẩm.
- Tạo sản phẩm.
- Cập nhật sản phẩm.
- Cập nhật tồn kho.
- Xem hàng sắp hết.
- Xóa sản phẩm.

Dịch vụ hỗ trợ:

- Danh sách dịch vụ.
- Tạo dịch vụ.
- Cập nhật dịch vụ.
- Xóa dịch vụ.

Ví dụ sản phẩm:

- Nước suối.
- Nước tăng lực.
- Cầu lông.
- Khăn lạnh.
- Vợt cầu lông.

Ví dụ dịch vụ:

- Thuê vợt.
- Thuê giày.
- Tủ đồ.
- Huấn luyện.

---

## 5.11. Báo cáo và xuất Excel

Backend báo cáo:

- `apps/backend/src/routes/report.routes.ts`
- `apps/backend/src/services/report.service.ts`

Backend export:

- `apps/backend/src/routes/export.routes.ts`

Frontend:

- `apps/frontend/src/pages/ReportsPage.tsx`
- `apps/frontend/src/components/reports/`
- `apps/frontend/src/services/report.service.ts`
- `apps/frontend/src/services/export.service.ts`

Báo cáo hỗ trợ:

- Thống kê dashboard.
- Biểu đồ doanh thu.
- So sánh doanh thu tháng.
- Top khách hàng.
- Thống kê trạng thái booking.
- Booking sắp tới.

Xuất Excel hỗ trợ:

- Hóa đơn.
- Booking.
- Khách hàng.
- Báo cáo doanh thu.

---

## 5.12. Cài đặt hệ thống

Frontend có trang cài đặt:

- `apps/frontend/src/pages/SettingsPage.tsx`
- `apps/frontend/src/components/settings/SettingsForms.tsx`

Database có model `SystemConfig` để lưu cấu hình dạng key/value.

Tuy nhiên, trong backend hiện tại chưa thấy route riêng cho settings/system config.

---

## 5.13. Customer portal / đặt sân public

Frontend có component:

- `apps/frontend/src/components/public/PublicBookingForm.tsx`

Theo PRD, customer portal dùng để:

- Xem lịch sân trống.
- Đặt sân online.
- Xem lịch sử đặt sân.
- Xem điểm tích lũy.

Tuy nhiên trong routing hiện tại chưa thấy route public booking được khai báo rõ trong `apps/frontend/src/App.tsx`.

---

## 6. Routing frontend

Các route chính trong frontend:

| URL | Trang |
|---|---|
| `/login` | Đăng nhập |
| `/forgot-password` | Quên mật khẩu |
| `/` | Dashboard |
| `/calendar` | Lịch đặt sân |
| `/customers` | Danh sách khách hàng |
| `/customers/:id` | Chi tiết khách hàng |
| `/courts` | Quản lý sân |
| `/venues` | Quản lý cơ sở |
| `/invoices` | Hóa đơn |
| `/invoices/:id/print` | In hóa đơn |
| `/inventory` | Kho & dịch vụ |
| `/reports` | Báo cáo |
| `/settings` | Cài đặt |

---

## 7. API backend chính

Backend mount route dưới `/api`.

| Prefix | Module |
|---|---|
| `/auth` | Xác thực |
| `/venues` | Cơ sở sân |
| `/courts` | Sân |
| `/bookings` | Đặt sân |
| `/recurring-bookings` | Đặt sân định kỳ |
| `/customers` | Khách hàng |
| `/invoices` | Hóa đơn |
| `/products` | Sản phẩm |
| `/services` | Dịch vụ |
| `/reports` | Báo cáo |
| `/export` | Xuất Excel |

---

## 8. Luồng nghiệp vụ tổng quát

1. Admin hoặc nhân viên đăng nhập hệ thống.
2. Admin tạo cơ sở sân.
3. Admin/manager tạo danh sách sân trong cơ sở.
4. Thiết lập bảng giá hoặc quy tắc giá theo khung giờ.
5. Nhân viên vào màn hình lịch đặt sân.
6. Nhân viên chọn ngày, sân, khách hàng và giờ chơi.
7. Hệ thống kiểm tra trùng lịch.
8. Hệ thống tính tiền.
9. Booking được tạo.
10. Khi khách đến, nhân viên check-in.
11. Khi khách chơi xong, nhân viên check-out.
12. Nhân viên tạo hóa đơn gồm tiền sân, dịch vụ và sản phẩm.
13. Nhân viên ghi nhận thanh toán.
14. Dữ liệu được cập nhật vào dashboard và báo cáo.
15. Admin/manager có thể xuất Excel để đối soát.

---

## 9. Deploy và môi trường chạy

File `docker-compose.yml` cấu hình các service:

- PostgreSQL
- Redis
- Backend API
- Frontend web

Port mặc định:

| Service | Port |
|---|---|
| PostgreSQL | `5432` |
| Redis | `6379` |
| Backend | `3000` |
| Frontend | `5173` |

Backend và frontend trong Docker đang nằm dưới profile `full`.

---

## 10. Nhận xét trạng thái hiện tại

Các phần đã có code tương đối đầy đủ:

- Authentication.
- Venue management.
- Court management.
- Booking calendar.
- Recurring booking.
- Customer management.
- Invoice management.
- Product/service/inventory.
- Reports.
- Excel export.
- Dashboard.
- Layout responsive.
- Print invoice.
- Notification UI/WebSocket hook.

Một số điểm cần kiểm tra hoặc hoàn thiện thêm:

1. Tài liệu API ghi base URL là `/api/v1`, nhưng backend hiện mount route dưới `/api`.
2. PRD có nói realtime bằng Socket.io, nhưng backend hiện chưa thấy cấu hình Socket.io rõ trong file khởi tạo server.
3. Customer portal đã có component public booking, nhưng chưa thấy route public booking rõ ràng.
4. Membership plan có model, nhưng chưa thấy route riêng để quản lý gói hội viên.
5. Settings có UI và model `SystemConfig`, nhưng chưa thấy route backend riêng.
6. Data model trong tài liệu chi tiết hơn schema Prisma hiện tại; schema thực tế đang là phiên bản giản lược hơn.

---

## 11. Kết luận

Courtify là hệ thống quản lý sân cầu lông dạng dashboard quản trị, phục vụ chủ sân và nhân viên vận hành.

Chức năng cốt lõi gồm:

- Quản lý cơ sở sân.
- Quản lý sân.
- Quản lý lịch đặt sân.
- Check-in / check-out.
- Quản lý khách hàng.
- Quản lý hóa đơn và thanh toán.
- Quản lý kho, sản phẩm, dịch vụ.
- Báo cáo doanh thu và xuất Excel.

Dự án đã có nền tảng khá đầy đủ cho nghiệp vụ quản lý nội bộ. Các phần có thể cần phát triển tiếp là realtime đầy đủ, customer portal, membership nâng cao và settings backend.

# 🎯 COO Product Review & UX Assessment
# Courtify - Hệ Thống Quản Lý Sân Cầu Lông

> **Reviewer**: COO / Product Owner
> **Date**: 2026-02-04
> **Version**: 1.0
> **Status**: Comprehensive Review

---

## 📋 Executive Summary

Tài liệu này đánh giá toàn diện sản phẩm Courtify từ góc nhìn vận hành (COO), bao gồm:
- Trải nghiệm người dùng (UX) từng persona
- User journeys và pain points
- Tính năng còn thiếu hoặc cần cải thiện
- Chi tiết kiểm thử từng module
- Recommendations ưu tiên

---

## 🎭 PHẦN 1: PERSONAS & USER JOURNEYS

### 1.1. Primary Personas

#### 👨‍💼 Admin/Owner (Chủ sân)
**Profile**:
- Tuổi: 35-55
- Tech-savvy: Trung bình
- Mục tiêu: Theo dõi doanh thu, quản lý nhân viên, ra quyết định kinh doanh
- Pain points: Cần báo cáo nhanh, không muốn thao tác phức tạp

**User Journey - Daily Operations**:
```
1. Đăng nhập (8:00 sáng)
   ├── Xem Dashboard tổng quan
   ├── Check thông báo quan trọng
   └── Xem doanh thu hôm qua

2. Kiểm tra hoạt động (10:00)
   ├── Xem lịch đặt sân hôm nay
   ├── Check tình trạng sân
   └── Xem nhân viên đang trực

3. Xem báo cáo (cuối ngày)
   ├── Báo cáo doanh thu
   ├── Tỷ lệ lấp đầy sân
   └── So sánh với tuần trước
```

**Expected Features**:
| Tính năng | Priority | Status | Gap Analysis |
|-----------|----------|--------|--------------|
| Dashboard overview | P0 | ✅ Done | Cần thêm comparison period |
| Revenue tracking | P0 | ✅ Done | Cần real-time update |
| Staff management | P1 | ⚠️ Partial | Chưa có timesheet |
| Multi-venue management | P1 | ⚠️ Partial | Cần venue switching smooth hơn |
| Push notifications | P2 | ❌ Missing | Cần alert quan trọng |
| Role-based dashboard | P1 | ❌ Missing | Mỗi role cần view khác nhau |

---

#### 👨‍💻 Manager (Quản lý ca)
**Profile**:
- Tuổi: 25-40
- Tech-savvy: Khá tốt
- Mục tiêu: Quản lý vận hành hàng ngày, xử lý sự cố
- Pain points: Cần actions nhanh, không chờ đợi

**User Journey - Daily Operations**:
```
1. Bắt đầu ca (6:00 sáng)
   ├── Xem lịch đặt sân trong ca
   ├── Check danh sách khách VIP hôm nay
   └── Kiểm tra tồn kho (nước, cầu)

2. Trong ca làm việc
   ├── Check-in khách đến
   ├── Xử lý đặt sân walk-in
   ├── Giải quyết conflict nếu có
   └── Check-out và thu tiền

3. Kết thúc ca
   ├── Tổng kết doanh thu ca
   ├── Bàn giao lại cho ca sau
   └── Báo cáo sự cố (nếu có)
```

**Expected Features**:
| Tính năng | Priority | Status | Gap Analysis |
|-----------|----------|--------|--------------|
| Quick check-in | P0 | ✅ Done | Cần nút check-in rõ ràng hơn |
| Walk-in booking | P0 | ✅ Done | OK |
| Conflict detection | P0 | ✅ Done | OK |
| Shift handover | P1 | ❌ Missing | Cần notes cho ca sau |
| Inventory alert | P1 | ⚠️ Partial | Có nhưng chưa có alert |
| Customer VIP flag | P1 | ⚠️ Partial | Badge có nhưng chưa highlight |

---

#### 👨‍🔧 Staff (Nhân viên)
**Profile**:
- Tuổi: 18-30
- Tech-savvy: Cơ bản
- Mục tiêu: Hoàn thành công việc nhanh, ít sai sót
- Pain points: Cần UI đơn giản, rõ ràng

**User Journey - Daily Operations**:
```
1. Khi khách đến
   ├── Tìm booking bằng SĐT/tên
   ├── Check-in
   └── Hướng dẫn khách vào sân

2. Khi khách yêu cầu thêm
   ├── Bán nước/cầu
   ├── Cho thuê vợt/giày
   └── Thêm vào hóa đơn

3. Khi khách về
   ├── Check-out
   ├── In hóa đơn
   └── Thu tiền
```

**Expected Features**:
| Tính năng | Priority | Status | Gap Analysis |
|-----------|----------|--------|--------------|
| Quick search customer | P0 | ✅ Done | OK |
| One-click check-in | P0 | ✅ Done | Cần prominently hơn |
| POS integration | P1 | ⚠️ Partial | Có nhưng flow chưa mượt |
| Receipt printing | P0 | ✅ Done | OK |
| Simple UI | P0 | ✅ Done | Đã dark mode đẹp |

---

#### 🏸 Customer (Khách hàng)
**Profile**:
- Tuổi: 20-50
- Tech-savvy: Đa dạng
- Mục tiêu: Đặt sân nhanh, biết giá rõ ràng, có lịch cố định
- Pain points: Không muốn gọi điện, muốn tự xem & đặt

**User Journey - Booking Flow**:
```
1. Tìm sân (Online)
   ├── Mở app/web
   ├── Xem lịch sẵn
   └── Chọn khung giờ

2. Đặt sân
   ├── Nhập thông tin
   ├── Xác nhận giá
   └── Thanh toán (optional)

3. Đến chơi
   ├── Nhận xác nhận
   ├── Check-in tại quầy
   └── Thanh toán & về
```

**Expected Features (Customer Portal)**:
| Tính năng | Priority | Status | Gap Analysis |
|-----------|----------|--------|--------------|
| View available slots | P2 | ❌ Missing | Cần public calendar |
| Self-service booking | P2 | ❌ Missing | Cần customer portal |
| Booking confirmation | P2 | ❌ Missing | Cần SMS/email |
| View booking history | P2 | ❌ Missing | Cần customer account |
| Points/rewards view | P3 | ❌ Missing | Nice to have |

---

## 🔍 PHẦN 2: DETAILED FEATURE REVIEW

### 2.1. Authentication & Authorization

#### ✅ Có sẵn:
- [x] Login với email/password
- [x] JWT tokens (access + refresh)
- [x] Role-based access (ADMIN, MANAGER, STAFF)
- [x] Protected routes
- [x] Logout

#### ⚠️ Cần cải thiện:
- [ ] **Forgot password flow** - Chưa hoạt động
- [ ] **Session timeout warning** - Không có cảnh báo
- [ ] **Login history** - Không track được devices
- [ ] **2FA** - Chưa có (optional)

#### ❌ Còn thiếu:
- [ ] **Customer registration** (cho portal)
- [ ] **Social login** (Google, Facebook)
- [ ] **Device management**

#### 📝 Test Cases:
```
AUTH-TC-01: Login thành công với đúng credentials
AUTH-TC-02: Login thất bại với sai password (hiển thị lỗi rõ ràng)
AUTH-TC-03: Login thất bại với email không tồn tại
AUTH-TC-04: Token hết hạn → redirect về login
AUTH-TC-05: Refresh token hoạt động đúng
AUTH-TC-06: Logout xóa sạch tokens
AUTH-TC-07: Protected route chặn user chưa login
AUTH-TC-08: ADMIN thấy menu Settings, STAFF không thấy
```

---

### 2.2. Dashboard

#### ✅ Có sẵn:
- [x] Today's revenue card
- [x] Today's bookings count
- [x] Active customers count
- [x] Courts available/in-use
- [x] 7-day revenue chart (bar)
- [x] Upcoming bookings list
- [x] Quick actions

#### ⚠️ Cần cải thiện:
- [ ] **Comparison trend** - "vs hôm qua" thay vì "vs tháng trước"
- [ ] **Real-time updates** - Booking mới không tự cập nhật
- [ ] **Click-to-navigate** - Click vào stat card để xem chi tiết
- [ ] **Loading states** - Đã có skeleton, nhưng cần mượt hơn

#### ❌ Còn thiếu:
- [ ] **Notification center** - Bell icon nhưng chưa có dropdown
- [ ] **Today's schedule timeline** - Lịch trình dạng timeline
- [ ] **Alerts panel** - Sân sắp hết chỗ, khách VIP sắp đến
- [ ] **Weather widget** - Quan trọng cho outdoor courts

#### 📝 Test Cases:
```
DASH-TC-01: Dashboard load đúng data sau khi login
DASH-TC-02: Revenue hiển thị đúng format VNĐ
DASH-TC-03: Chart hiển thị đúng 7 ngày gần nhất
DASH-TC-04: Upcoming bookings list hiển thị max 5 items
DASH-TC-05: Click "Xem tất cả" → chuyển sang Calendar
DASH-TC-06: Quick actions navigate đúng trang
DASH-TC-07: Stats update khi có booking mới (manual refresh)
```

---

### 2.3. Booking Calendar

#### ✅ Có sẵn:
- [x] Day view calendar grid
- [x] Time slots 6:00-23:00
- [x] Courts as columns
- [x] Status color coding
- [x] Create booking modal
- [x] Customer search/create
- [x] Check-in/Check-out
- [x] Cancel booking
- [x] Recurring bookings (backend)

#### ⚠️ Cần cải thiện:
- [ ] **Week view** - Chỉ có day view
- [ ] **Mini calendar widget** - Không có datepicker sidebar
- [ ] **Drag to select time** - Click từng slot
- [ ] **Resize booking** - Không kéo dãn được
- [ ] **Booking detail panel** - Modal thay vì slide-in panel
- [ ] **Conflict highlight** - Chưa rõ ràng khi trùng giờ
- [ ] **Court filter** - Không thể filter theo loại sân
- [ ] **Print schedule** - Không in được lịch ngày

#### ❌ Còn thiếu:
- [ ] **Month view** - Overview tháng
- [ ] **Recurring booking UI** - Backend có, FE chưa có
- [ ] **Drag & drop reschedule** - Di chuyển booking
- [ ] **Bulk operations** - Chọn nhiều slots
- [ ] **Waiting list** - Khi full slots

#### 📝 Test Cases:
```
CAL-TC-01: Calendar hiển thị đúng bookings của ngày đã chọn
CAL-TC-02: Click slot trống → mở modal đặt sân
CAL-TC-03: Không cho đặt slot đã có booking
CAL-TC-04: Booking mới hiển thị đúng màu theo status
CAL-TC-05: Navigate prev/next day hoạt động đúng
CAL-TC-06: "Hôm nay" button về đúng ngày hiện tại
CAL-TC-07: Search customer by phone tìm đúng
CAL-TC-08: Tạo customer mới khi không tìm thấy
CAL-TC-09: Check-in thay đổi status sang IN_PROGRESS
CAL-TC-10: Check-out mở hóa đơn thanh toán
CAL-TC-11: Cancel booking cần nhập lý do
CAL-TC-12: Giá tính đúng theo pricing rules
```

---

### 2.4. Customer Management

#### ✅ Có sẵn:
- [x] Customer list với search
- [x] CRUD operations
- [x] Membership badges
- [x] Total bookings/spent display
- [x] Points display
- [x] Pagination

#### ⚠️ Cần cải thiện:
- [ ] **Filter tabs** - Design có tabs (Tất cả, Thành viên, Thường xuyên)
- [ ] **Customer profile page** - Chỉ có modal
- [ ] **Booking history** - Không xem được lịch sử đặt
- [ ] **Advanced search** - Chỉ search tên/phone
- [ ] **Export customers** - Không có export

#### ❌ Còn thiếu:
- [ ] **Customer merge** - Gộp duplicate customers
- [ ] **SMS/Email** - Gửi tin nhắn cho khách
- [ ] **Birthday tracking** - Chúc mừng sinh nhật
- [ ] **Notes/Tags** - Ghi chú về khách
- [ ] **Blacklist** - Danh sách khách cấm

#### 📝 Test Cases:
```
CUS-TC-01: List customers load đúng với pagination
CUS-TC-02: Search by name tìm đúng
CUS-TC-03: Search by phone tìm đúng
CUS-TC-04: Create customer với unique phone
CUS-TC-05: Create với duplicate phone → lỗi
CUS-TC-06: Update customer info thành công
CUS-TC-07: Delete customer (soft delete)
CUS-TC-08: Membership badge hiển thị đúng tier
CUS-TC-09: Total spent tính đúng
```

---

### 2.5. Court Management

#### ✅ Có sẵn:
- [x] Court list grid view
- [x] CRUD operations
- [x] Status badges (Active/Maintenance)
- [x] Court type display

#### ⚠️ Cần cải thiện:
- [ ] **Court images** - Chưa upload được hình
- [ ] **Pricing rules inline** - Phải vào settings
- [ ] **Utilization stats** - Tỷ lệ sử dụng mỗi sân
- [ ] **Hover actions** - Nút edit/delete khi hover

#### ❌ Còn thiếu:
- [ ] **Court features** - Có đèn, quạt, điều hòa
- [ ] **Court availability calendar** - Xem lịch riêng mỗi sân
- [ ] **Maintenance schedule** - Lên lịch bảo trì
- [ ] **Equipment tracking** - Vợt, lưới thuộc sân nào

#### 📝 Test Cases:
```
CRT-TC-01: List courts load đúng cho venue đã chọn
CRT-TC-02: Create court với mã sân unique
CRT-TC-03: Update court info
CRT-TC-04: Toggle status Active ↔ Maintenance
CRT-TC-05: Court maintenance không hiển thị để đặt
CRT-TC-06: Pricing rules áp dụng đúng cho court
```

---

### 2.6. Invoice & Payment

#### ✅ Có sẵn:
- [x] Invoice list với filters
- [x] Status badges (Paid, Pending, etc.)
- [x] Invoice detail modal
- [x] Line items display
- [x] Create invoice from checkout
- [x] Print invoice
- [x] Multiple payment methods

#### ⚠️ Cần cải thiện:
- [ ] **Split view** - Design có list + detail panel
- [ ] **Bulk print** - In nhiều hóa đơn
- [ ] **Refund process** - Có status nhưng không có action
- [ ] **Payment history** - Không xem được lịch sử trả
- [ ] **Invoice search** - Chỉ filter, không search

#### ❌ Còn thiếu:
- [ ] **Invoice email** - Gửi hóa đơn qua email
- [ ] **QR payment** - QR code cho chuyển khoản
- [ ] **Receipt template** - Tùy chỉnh mẫu in
- [ ] **Debt management** - Theo dõi công nợ

#### 📝 Test Cases:
```
INV-TC-01: Invoice list load với filters
INV-TC-02: Filter by payment status hoạt động
INV-TC-03: Filter by date range hoạt động
INV-TC-04: View invoice detail đầy đủ thông tin
INV-TC-05: Print invoice format đúng
INV-TC-06: Process payment cập nhật status
INV-TC-07: Partial payment tracking
```

---

### 2.7. Inventory & Products

#### ✅ Có sẵn:
- [x] Product list
- [x] Service list
- [x] Stock tracking
- [x] CRUD operations

#### ⚠️ Cần cải thiện:
- [ ] **Low stock alert** - Có threshold nhưng không alert
- [ ] **Stock history** - Không xem được lịch sử nhập/xuất
- [ ] **Categories** - Không phân loại sản phẩm
- [ ] **Barcode** - Không có mã vạch

#### ❌ Còn thiếu:
- [ ] **Stock import** - Nhập kho với PO
- [ ] **Supplier management** - Quản lý nhà cung cấp
- [ ] **Expiry tracking** - Theo dõi hạn sử dụng
- [ ] **Stock take** - Kiểm kê tồn kho

#### 📝 Test Cases:
```
INV-TC-01: Product list load correctly
INV-TC-02: Add new product
INV-TC-03: Update stock quantity
INV-TC-04: Sell product → stock decreases
INV-TC-05: Low stock warning displays
```

---

### 2.8. Reports & Analytics

#### ✅ Có sẵn:
- [x] Date range picker
- [x] Revenue summary
- [x] Booking summary
- [x] Revenue chart
- [x] Peak hours chart
- [x] Top customers
- [x] Export to Excel

#### ⚠️ Cần cải thiện:
- [ ] **Chart types** - Cần line chart, pie chart
- [ ] **Comparison period** - So sánh với kỳ trước
- [ ] **Custom date range** - Chỉ có preset ranges
- [ ] **Drill-down** - Click chart để xem chi tiết

#### ❌ Còn thiếu:
- [ ] **Court utilization** - Báo cáo hiệu suất sân
- [ ] **Customer acquisition** - Khách mới vs cũ
- [ ] **Revenue breakdown** - Court vs Service vs Product
- [ ] **Staff performance** - Báo cáo theo nhân viên
- [ ] **Scheduled reports** - Tự động gửi email

#### 📝 Test Cases:
```
RPT-TC-01: Report loads với default date range
RPT-TC-02: Change date range updates all charts
RPT-TC-03: Export Excel downloads correctly
RPT-TC-04: Top customers list accurate
RPT-TC-05: Peak hours data correct
```

---

### 2.9. Settings

#### ✅ Có sẵn:
- [x] Venue info settings
- [x] Pricing rules
- [x] Operating hours (implicit)

#### ⚠️ Cần cải thiện:
- [ ] **Tab navigation** - Design có tabs, hiện có accordion
- [ ] **Pricing UI** - Khó sử dụng, cần date/time picker
- [ ] **Preview changes** - Không xem trước

#### ❌ Còn thiếu:
- [ ] **Staff management** - CRUD staff users
- [ ] **Permissions** - Chi tiết quyền theo role
- [ ] **Integrations** - SMS, Email, Payment gateways
- [ ] **Backup/Export** - Sao lưu dữ liệu
- [ ] **Audit log** - Lịch sử thay đổi

---

## 📱 PHẦN 3: RESPONSIVE & MOBILE UX

### 3.1. Desktop (≥1280px) ✅
- Sidebar + Content layout: ✅ OK
- Data tables: ✅ OK
- Multi-column grids: ✅ OK
- Modal/Panel interactions: ✅ OK

### 3.2. Tablet (768px - 1279px) ⚠️
- Sidebar: ⚠️ Nên collapse thành icons
- Tables: ⚠️ Có horizontal scroll
- Calendar: ⚠️ Khó xem nhiều courts

### 3.3. Mobile (<768px) ❌
- Bottom navigation: ❌ THIẾU
- Stack layouts: ⚠️ Có nhưng chưa tối ưu
- Touch targets: ⚠️ Một số nút nhỏ
- Card-based lists: ⚠️ Tables chưa chuyển thành cards
- FAB for quick action: ❌ THIẾU

---

## 🎨 PHẦN 4: UI/UX POLISH CHECKLIST

### Visual Design
- [ ] **Consistent spacing** - Một số gaps không đều
- [ ] **Icon consistency** - Lucide icons OK
- [ ] **Color contrast** - ✅ WCAG AA compliant
- [ ] **Typography hierarchy** - ✅ OK
- [ ] **Empty states** - ⚠️ Có nhưng cần illustrations
- [ ] **Error states** - ⚠️ Có nhưng cần styling đẹp hơn

### Interactions
- [ ] **Loading states** - ✅ Có skeleton
- [ ] **Success feedback** - ✅ Có toast
- [ ] **Error feedback** - ✅ Có toast
- [ ] **Confirmation dialogs** - ⚠️ Có nhưng không đẹp
- [ ] **Hover states** - ✅ OK
- [ ] **Focus states** - ✅ OK (accessibility)

### Animations
- [ ] **Page transitions** - ❌ Không có
- [ ] **Modal animations** - ⚠️ Basic fade
- [ ] **List animations** - ❌ Không có
- [ ] **Micro-interactions** - ❌ Thiếu nhiều

---

## 🔧 PHẦN 5: TECHNICAL IMPROVEMENTS

### Performance
- [ ] **Code splitting** - Vite warning về bundle size
- [ ] **Lazy loading** - Chưa có cho routes
- [ ] **Image optimization** - Không có images
- [ ] **Caching strategy** - React Query OK

### Accessibility
- [x] **Keyboard navigation** - Basic support
- [x] **Focus management** - OK
- [ ] **Screen reader** - Chưa test
- [x] **Color contrast** - OK

### Error Handling
- [x] **API errors** - Có toast
- [ ] **Network errors** - Không có offline handling
- [ ] **Form validation** - Có nhưng cần improve UX
- [ ] **Error boundaries** - Không có

---

## 📋 PHẦN 6: IMPLEMENTATION PRIORITY

### 🔴 Critical (P0) - Phải làm trước go-live
1. ~~Week view cho Calendar~~ → **IMPLEMENT NOW**
2. ~~Mobile bottom navigation~~ → **IMPLEMENT NOW**
3. ~~Recurring booking UI~~ → **IMPLEMENT NOW**
4. ~~Notification dropdown~~ → **IMPLEMENT NOW**
5. ~~Customer booking history~~ → **IMPLEMENT NOW**

### 🟡 High (P1) - Làm trong sprint tiếp theo
1. Mini calendar widget
2. Right slide panel cho booking detail
3. Customer filter tabs
4. Invoice split view
5. Page transitions/animations

### 🟢 Medium (P2) - Nice to have
1. Customer Portal (public booking)
2. Drag & drop calendar
3. Chart improvements (line, pie)
4. SMS/Email integration
5. Advanced reports

### 🔵 Low (P3) - Future roadmap
1. 2FA authentication
2. Staff scheduling
3. Equipment tracking
4. Supplier management

---

## ✅ PHẦN 7: TEST EXECUTION PLAN

### Phase 1: Authentication Flow
```
[ ] Login với các role (Admin, Manager, Staff)
[ ] Logout và session cleanup
[ ] Protected route access
[ ] Token expiry handling
```

### Phase 2: Core Booking Flow
```
[ ] Xem calendar theo ngày
[ ] Tạo booking mới
[ ] Customer search/create
[ ] Check-in
[ ] Add services/products
[ ] Check-out
[ ] Generate invoice
[ ] Print invoice
```

### Phase 3: Data Management
```
[ ] CRUD customers
[ ] CRUD courts
[ ] CRUD products/services
[ ] Pricing rules
[ ] Inventory management
```

### Phase 4: Reports
```
[ ] Dashboard metrics
[ ] Revenue reports
[ ] Export functionality
```

### Phase 5: Edge Cases
```
[ ] Booking conflict
[ ] Duplicate customer phone
[ ] Empty lists
[ ] Network errors
[ ] Large data sets
```

---

*Document maintained by: COO / Product Team*
*Last updated: 2026-02-04*

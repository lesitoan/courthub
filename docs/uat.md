# ✅ User Acceptance Testing (UAT)
# Hệ Thống Quản Lý Sân Cầu Lông

> **Version**: 1.0
> **Created**: 2026-02-04
> **Total Requirements**: 85 tiêu chí
> **Status**: Draft - Awaiting Implementation

---

## 📋 Hướng Dẫn Sử Dụng

### Ký Hiệu Trạng Thái
| Icon | Trạng thái | Mô tả |
|------|------------|-------|
| ⬜ | NOT TESTED | Chưa test |
| ✅ | PASSED | Đạt yêu cầu |
| ❌ | FAILED | Không đạt |
| ⏸️ | BLOCKED | Bị chặn, chưa test được |
| 🔄 | IN PROGRESS | Đang test |

### Mức Độ Ưu Tiên
| Priority | Mô tả |
|----------|-------|
| **P0** | Critical - Bắt buộc có để go-live |
| **P1** | High - Quan trọng nhưng có workaround |
| **P2** | Medium - Nice to have |
| **P3** | Low - Có thể delay |

---

## 🔐 Module 1: Authentication (8 tiêu chí)

### 1.1. Đăng Nhập

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| AUTH-01 | Người dùng có thể đăng nhập bằng email và mật khẩu hợp lệ | P0 | ⬜ | | |
| AUTH-02 | Hiển thị lỗi rõ ràng khi email/mật khẩu sai | P0 | ⬜ | | |
| AUTH-03 | Redirect về trang login khi token hết hạn | P0 | ⬜ | | |
| AUTH-04 | Tự động refresh token khi gần hết hạn | P1 | ⬜ | | |

**Test Steps (AUTH-01):**
1. Truy cập trang login `/login`
2. Nhập email: `admin@test.com`, password: `password123`
3. Click "Đăng nhập"
4. **Expected**: Redirect về Dashboard, hiển thị tên user

### 1.2. Đăng Ký & Quản Lý Tài Khoản

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| AUTH-05 | Staff có thể đăng ký tài khoản mới (nếu được phép) | P1 | ⬜ | | |
| AUTH-06 | Người dùng có thể đổi mật khẩu | P1 | ⬜ | | |
| AUTH-07 | Người dùng có thể cập nhật thông tin cá nhân | P1 | ⬜ | | |
| AUTH-08 | Người dùng có thể đăng xuất và xóa session | P0 | ⬜ | | |

---

## 🏢 Module 2: Quản Lý Cơ Sở Sân - Venues (8 tiêu chí)

### 2.1. CRUD Venues

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| VEN-01 | Admin có thể xem danh sách tất cả cơ sở sân | P0 | ⬜ | | |
| VEN-02 | Admin có thể tạo cơ sở sân mới với đầy đủ thông tin | P0 | ⬜ | | |
| VEN-03 | Admin có thể cập nhật thông tin cơ sở sân | P0 | ⬜ | | |
| VEN-04 | Admin có thể xóa cơ sở sân (hoặc đánh dấu inactive) | P1 | ⬜ | | |

**Test Steps (VEN-02):**
1. Vào mục "Quản lý cơ sở" → Click "Thêm mới"
2. Nhập: Tên, Địa chỉ, SĐT, Email, Giờ mở cửa (6:00-23:00)
3. Upload logo (optional)
4. Click "Lưu"
5. **Expected**: Hiển thị thông báo thành công, venue xuất hiện trong danh sách

### 2.2. Cài Đặt Venue

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| VEN-05 | Admin có thể cài đặt giờ mở/đóng cửa cho venue | P0 | ⬜ | | |
| VEN-06 | Admin có thể cài đặt độ dài slot (30/60/90/120 phút) | P1 | ⬜ | | |
| VEN-07 | Admin có thể cài đặt thời gian đặt trước tối thiểu/tối đa | P1 | ⬜ | | |
| VEN-08 | Admin có thể cài đặt thời gian cho phép hủy | P1 | ⬜ | | |

---

## 🏸 Module 3: Quản Lý Sân - Courts (7 tiêu chí)

### 3.1. CRUD Courts

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| CRT-01 | Admin có thể xem danh sách sân của 1 venue | P0 | ⬜ | | |
| CRT-02 | Admin có thể tạo sân mới (mã sân, tên, loại, mặt sân) | P0 | ⬜ | | |
| CRT-03 | Admin có thể cập nhật thông tin sân | P0 | ⬜ | | |
| CRT-04 | Admin có thể đánh dấu sân "Bảo trì" | P1 | ⬜ | | |
| CRT-05 | Sân "Bảo trì" không hiển thị để đặt trên calendar | P1 | ⬜ | | |

### 3.2. Quản Lý Giá

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| CRT-06 | Admin có thể tạo quy tắc giá theo khung giờ và ngày trong tuần | P0 | ⬜ | | |
| CRT-07 | Hệ thống tính đúng giá dựa trên quy tắc giá đã cài đặt | P0 | ⬜ | | |

**Test Steps (CRT-07):**
1. Tạo price rule: T2-T6, 18:00-21:00 = 120,000đ/h
2. Tạo booking: Thứ 3, 18:00-20:00, Sân A1
3. **Expected**: Hệ thống tính giá = 2h × 120,000đ = 240,000đ

---

## 📅 Module 4: Đặt Sân - Bookings (15 tiêu chí)

### 4.1. Calendar View

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| BOK-01 | Hiển thị calendar theo ngày với tất cả sân | P0 | ⬜ | | |
| BOK-02 | Hiển thị calendar theo tuần với tất cả sân | P1 | ⬜ | | |
| BOK-03 | Có thể chuyển qua lại giữa các ngày/tuần | P0 | ⬜ | | |
| BOK-04 | Booking hiển thị đúng màu theo trạng thái | P1 | ⬜ | | |
| BOK-05 | Click vào slot trống mở modal đặt sân | P0 | ⬜ | | |

### 4.2. Tạo & Quản Lý Booking

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| BOK-06 | Staff có thể tạo booking mới với thông tin khách | P0 | ⬜ | | |
| BOK-07 | Hệ thống cảnh báo khi đặt trùng giờ với booking khác | P0 | ⬜ | | |
| BOK-08 | Không cho phép đặt sân ngoài giờ hoạt động của venue | P0 | ⬜ | | |
| BOK-09 | Staff có thể cập nhật thông tin booking | P0 | ⬜ | | |
| BOK-10 | Staff có thể hủy booking với lý do | P0 | ⬜ | | |

**Test Steps (BOK-07):**
1. Tạo booking: Sân A1, 18:00-20:00, ngày 10/02/2026
2. Cố tạo booking khác: Sân A1, 19:00-21:00, ngày 10/02/2026
3. **Expected**: Hiển thị lỗi "Khung giờ này đã được đặt"

### 4.3. Check-in/Check-out

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| BOK-11 | Staff có thể check-in khi khách đến | P0 | ⬜ | | |
| BOK-12 | Staff có thể check-out khi khách rời | P0 | ⬜ | | |
| BOK-13 | Trạng thái booking cập nhật đúng sau check-in/out | P0 | ⬜ | | |

### 4.4. Đặt Sân Cố Định (Recurring)

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| BOK-14 | Staff có thể tạo đặt sân cố định hàng tuần | P1 | ⬜ | | |
| BOK-15 | Staff có thể bỏ qua 1 lần đặt trong series cố định | P1 | ⬜ | | |

---

## 👥 Module 5: Quản Lý Khách Hàng (8 tiêu chí)

### 5.1. CRUD Customers

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| CUS-01 | Xem danh sách khách hàng với tìm kiếm, lọc | P0 | ⬜ | | |
| CUS-02 | Tạo khách hàng mới với SĐT là unique | P0 | ⬜ | | |
| CUS-03 | Cập nhật thông tin khách hàng | P0 | ⬜ | | |
| CUS-04 | Tìm kiếm nhanh khách hàng theo SĐT khi đặt sân | P0 | ⬜ | | |

**Test Steps (CUS-04):**
1. Mở modal đặt sân
2. Nhập SĐT "0901234567" vào ô tìm kiếm khách
3. **Expected**: Hiển thị gợi ý khách hàng "Nguyễn Văn A - 0901234567", click để chọn

### 5.2. Thông Tin Khách Hàng

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| CUS-05 | Xem lịch sử đặt sân của khách | P1 | ⬜ | | |
| CUS-06 | Xem tổng chi tiêu của khách | P1 | ⬜ | | |
| CUS-07 | Hiển thị badge hội viên (nếu có) | P1 | ⬜ | | |
| CUS-08 | Xem số điểm tích lũy của khách | P2 | ⬜ | | |

---

## 🏆 Module 6: Hội Viên & Tích Điểm (8 tiêu chí)

### 6.1. Gói Hội Viên

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| MEM-01 | Admin có thể tạo gói hội viên (Bronze/Silver/Gold/Platinum) | P2 | ⬜ | | |
| MEM-02 | Admin có thể cài đặt ưu đãi cho mỗi gói (% giảm, giờ free) | P2 | ⬜ | | |
| MEM-03 | Staff có thể đăng ký gói hội viên cho khách | P2 | ⬜ | | |
| MEM-04 | Hệ thống tự động áp dụng giảm giá hội viên khi đặt sân | P2 | ⬜ | | |

**Test Steps (MEM-04):**
1. Khách A có gói Gold (giảm 15%)
2. Tạo booking cho khách A: 2h × 100,000đ = 200,000đ cơ bản
3. **Expected**: Giá sau giảm = 200,000 × 85% = 170,000đ

### 6.2. Tích Điểm

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| MEM-05 | Khách được tích điểm khi thanh toán (10,000đ = 1 điểm) | P2 | ⬜ | | |
| MEM-06 | Staff có thể sử dụng điểm để giảm giá hóa đơn | P2 | ⬜ | | |
| MEM-07 | Xem lịch sử tích/sử dụng điểm của khách | P2 | ⬜ | | |
| MEM-08 | Điểm có hạn sử dụng (6 tháng) và tự động hết hạn | P3 | ⬜ | | |

---

## 🛒 Module 7: Dịch Vụ & Sản Phẩm (8 tiêu chí)

### 7.1. Dịch Vụ

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| SVC-01 | Admin có thể tạo dịch vụ (thuê vợt, giày, HLV) | P2 | ⬜ | | |
| SVC-02 | Staff có thể thêm dịch vụ vào hóa đơn booking | P2 | ⬜ | | |

### 7.2. Sản Phẩm & Kho

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| SVC-03 | Admin có thể tạo sản phẩm bán lẻ (nước, cầu lông) | P2 | ⬜ | | |
| SVC-04 | Staff có thể nhập kho sản phẩm | P2 | ⬜ | | |
| SVC-05 | Khi bán sản phẩm, số lượng tồn kho tự động giảm | P2 | ⬜ | | |
| SVC-06 | Cảnh báo khi sản phẩm sắp hết (dưới ngưỡng) | P2 | ⬜ | | |
| SVC-07 | Staff có thể thêm sản phẩm vào hóa đơn | P2 | ⬜ | | |
| SVC-08 | Xem lịch sử nhập/xuất kho | P3 | ⬜ | | |

---

## 🧾 Module 8: Hóa Đơn & Thanh Toán (10 tiêu chí)

### 8.1. Tạo Hóa Đơn

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| INV-01 | Tự động tạo hóa đơn khi check-out booking | P1 | ⬜ | | |
| INV-02 | Hóa đơn hiển thị đầy đủ: tiền sân + dịch vụ + sản phẩm | P1 | ⬜ | | |
| INV-03 | Hóa đơn tính đúng giảm giá hội viên | P1 | ⬜ | | |
| INV-04 | Hóa đơn trừ đúng điểm tích lũy (nếu sử dụng) | P2 | ⬜ | | |

### 8.2. Thanh Toán

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| INV-05 | Staff có thể ghi nhận thanh toán tiền mặt | P1 | ⬜ | | |
| INV-06 | Staff có thể ghi nhận thanh toán chuyển khoản | P1 | ⬜ | | |
| INV-07 | Hỗ trợ thanh toán một phần (partial payment) | P2 | ⬜ | | |
| INV-08 | Hiển thị trạng thái thanh toán (Chưa TT / Đã TT / Còn nợ) | P1 | ⬜ | | |

### 8.3. In Hóa Đơn

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| INV-09 | Staff có thể in hóa đơn (print-friendly) | P1 | ⬜ | | |
| INV-10 | Hóa đơn in có đầy đủ thông tin venue, khách, chi tiết | P1 | ⬜ | | |

---

## 📊 Module 9: Báo Cáo & Thống Kê (8 tiêu chí)

### 9.1. Dashboard

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| RPT-01 | Dashboard hiển thị doanh thu hôm nay | P0 | ⬜ | | |
| RPT-02 | Dashboard hiển thị số booking hôm nay | P0 | ⬜ | | |
| RPT-03 | Dashboard hiển thị số sân đang trống/đang chơi | P1 | ⬜ | | |
| RPT-04 | Dashboard hiển thị danh sách booking sắp tới | P0 | ⬜ | | |

### 9.2. Báo Cáo Chi Tiết

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| RPT-05 | Xem báo cáo doanh thu theo ngày/tuần/tháng | P1 | ⬜ | | |
| RPT-06 | Xem báo cáo tỉ lệ lấp đầy sân theo giờ | P1 | ⬜ | | |
| RPT-07 | Xem top khách hàng chi tiêu cao nhất | P2 | ⬜ | | |
| RPT-08 | Xuất báo cáo ra Excel | P2 | ⬜ | | |

---

## 🌐 Module 10: Customer Portal (5 tiêu chí)

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| POR-01 | Khách có thể xem lịch sân trống công khai | P2 | ⬜ | | |
| POR-02 | Khách có thể đăng ký tài khoản | P2 | ⬜ | | |
| POR-03 | Khách có thể đăng nhập xem booking của mình | P2 | ⬜ | | |
| POR-04 | Khách có thể đặt sân online | P2 | ⬜ | | |
| POR-05 | Khách nhận thông báo xác nhận booking (nếu có) | P3 | ⬜ | | |

---

## 🐳 Module 11: Deployment & Infrastructure (6 tiêu chí)

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| DEP-01 | Docker Compose chạy được trên môi trường dev | P0 | ⬜ | | |
| DEP-02 | Docker Compose chạy được trên Linux production | P0 | ⬜ | | |
| DEP-03 | Website truy cập được qua HTTPS | P0 | ⬜ | | |
| DEP-04 | Database được backup định kỳ | P1 | ⬜ | | |
| DEP-05 | Logs được ghi và có thể xem được | P1 | ⬜ | | |
| DEP-06 | Hệ thống tự khởi động lại khi server reboot | P1 | ⬜ | | |

---

## 📱 Module 12: Responsive & UX (4 tiêu chí)

| ID | Tiêu chí nghiệm thu | Priority | Status | Tester | Date |
|----|---------------------|----------|--------|--------|------|
| UX-01 | Giao diện hiển thị đúng trên Desktop (1280px+) | P0 | ⬜ | | |
| UX-02 | Giao diện hiển thị đúng trên Tablet (768px-1279px) | P1 | ⬜ | | |
| UX-03 | Giao diện hiển thị đúng trên Mobile (<768px) | P1 | ⬜ | | |
| UX-04 | Loading states hiển thị khi fetch data | P1 | ⬜ | | |

---

## 📈 Summary by Priority

| Priority | Total | Passed | Failed | Pending |
|----------|-------|--------|--------|---------|
| **P0 (Critical)** | 28 | 0 | 0 | 28 |
| **P1 (High)** | 31 | 0 | 0 | 31 |
| **P2 (Medium)** | 21 | 0 | 0 | 21 |
| **P3 (Low)** | 5 | 0 | 0 | 5 |
| **Total** | **85** | **0** | **0** | **85** |

---

## 📈 Summary by Module

| Module | Total | Passed | % |
|--------|-------|--------|---|
| 1. Authentication | 8 | 0 | 0% |
| 2. Venues | 8 | 0 | 0% |
| 3. Courts | 7 | 0 | 0% |
| 4. Bookings | 15 | 0 | 0% |
| 5. Customers | 8 | 0 | 0% |
| 6. Membership | 8 | 0 | 0% |
| 7. Services & Products | 8 | 0 | 0% |
| 8. Invoices | 10 | 0 | 0% |
| 9. Reports | 8 | 0 | 0% |
| 10. Customer Portal | 5 | 0 | 0% |
| 11. Deployment | 6 | 0 | 0% |
| 12. UX/Responsive | 4 | 0 | 0% |

---

## ✅ Go-Live Criteria

### Minimum Viable Product (MVP)
Để go-live, **phải đạt 100% tiêu chí P0**:

- [ ] AUTH-01, AUTH-02, AUTH-03, AUTH-08 (Authentication)
- [ ] VEN-01, VEN-02, VEN-03, VEN-05 (Venues)
- [ ] CRT-01, CRT-02, CRT-03, CRT-06, CRT-07 (Courts & Pricing)
- [ ] BOK-01, BOK-03, BOK-05, BOK-06, BOK-07, BOK-08, BOK-09, BOK-10, BOK-11, BOK-12, BOK-13 (Bookings)
- [ ] CUS-01, CUS-02, CUS-03, CUS-04 (Customers)
- [ ] RPT-01, RPT-02, RPT-04 (Dashboard)
- [ ] DEP-01, DEP-02, DEP-03 (Deployment)
- [ ] UX-01 (Desktop UI)

### Full Release
Để full release, **phải đạt 100% tiêu chí P0 + P1**.

---

## 📝 Test Session Log

| Session | Date | Tester | Modules Tested | Passed | Failed | Notes |
|---------|------|--------|----------------|--------|--------|-------|
| #1 | TBD | | | | | |

---

## 🐛 Bug Tracking

| Bug ID | UAT ID | Description | Severity | Status | Fixed Date |
|--------|--------|-------------|----------|--------|------------|
| | | | | | |

---

*UAT Document maintained by QA Team*
*Last updated: 2026-02-04*

# TEST CASES EXECUTION CHECKLIST
## Courtify - Quản Lý Sân Cầu Lông

**Sprint:** UAT Sprint 1  
**Tester:** AI Agent  
**Test Date:** 05/02/2026

---

## LEGEND
- ✅ PASS
- ❌ FAIL  
- ⏳ PENDING
- ⏭️ SKIPPED
- 🔄 RETEST

---

## 1. AUTHENTICATION MODULE

| # | TC ID | Test Case | Priority | Status | Bug ID | Notes |
|---|-------|-----------|----------|--------|--------|-------|
| 1 | AUTH-001 | Đăng nhập thành công | Critical | ✅ | - | Tested 05/02/2026 |
| 2 | AUTH-002 | Đăng nhập thất bại - sai password | Critical | ✅ | - | Error toast hiển thị |
| 3 | AUTH-003 | Đăng nhập thất bại - email không tồn tại | High | ✅ | - | Error message OK |
| 4 | AUTH-004 | Validation email format | Medium | ✅ | - | Validation works |
| 5 | AUTH-005 | Validation password length | Medium | ✅ | - | Min length check OK |
| 6 | AUTH-006 | Đăng xuất | High | ✅ | - | Redirects to login |
| 7 | AUTH-007 | Nhớ đăng nhập | Low | ⏳ | | |
| 8 | AUTH-008 | Quên mật khẩu | Medium | ⏳ | | Feature not implemented |

**Module Pass Rate:** 6 / 8 = 75%

---

## 2. DASHBOARD MODULE

| # | TC ID | Test Case | Priority | Status | Bug ID | Notes |
|---|-------|-----------|----------|--------|--------|-------|
| 1 | DASH-001 | Hiển thị Dashboard | Critical | ✅ | - | Charts, stats OK |
| 2 | DASH-002 | Filter theo ngày (Hôm nay) | High | ✅ | - | Tab works |
| 3 | DASH-003 | Filter theo tuần (Tuần này) | High | ✅ | - | Tab works |
| 4 | DASH-004 | Filter theo tháng (Tháng này) | High | ✅ | - | Tab works |
| 5 | DASH-005 | Donut chart tooltip | Medium | ✅ | - | Hover shows data |
| 6 | DASH-006 | Bar chart tooltip | Medium | ✅ | - | Hover shows data |
| 7 | DASH-007 | Click Stats Card | Medium | ✅ | - | Navigates to related page |
| 8 | DASH-008 | Click Upcoming Booking | Medium | ✅ | - | Opens booking detail |
| 9 | DASH-009 | Quick Actions | High | ✅ | - | All 4 actions work |

**Module Pass Rate:** 9 / 9 = 100%

---

## 3. CALENDAR MODULE

| # | TC ID | Test Case | Priority | Status | Bug ID | Notes |
|---|-------|-----------|----------|--------|--------|-------|
| 1 | CAL-001 | Hiển thị lịch theo ngày | Critical | ✅ | - | Grid displays courts |
| 2 | CAL-002 | Hiển thị lịch theo tuần | High | ✅ | - | 7 columns display |
| 3 | CAL-003 | Hiển thị danh sách | High | ✅ | - | List view works |
| 4 | CAL-004 | Chọn ngày từ Mini Calendar | High | ✅ | - | Date updates correctly |
| 5 | CAL-005 | Navigate ngày trước/sau | Medium | ✅ | - | Arrows work |
| 6 | CAL-006 | Tạo booking mới - Click slot | Critical | ✅ | - | Modal opens |
| 7 | CAL-007 | Xem chi tiết booking | High | ⏳ | | |
| 8 | CAL-008 | Drag & Drop booking | Medium | ⏳ | | |
| 9 | CAL-009 | Filter theo cơ sở | High | ✅ | - | Venue dropdown works |
| 10 | CAL-010 | Booking overlap warning | Critical | ⏳ | | |

**Module Pass Rate:** 7 / 10 = 70%

---

## 4. CUSTOMERS MODULE

| # | TC ID | Test Case | Priority | Status | Bug ID | Notes |
|---|-------|-----------|----------|--------|--------|-------|
| 1 | CUS-001 | Hiển thị danh sách khách hàng | Critical | ✅ | - | List displays with tiers |
| 2 | CUS-002 | Tìm kiếm khách hàng | High | ✅ | - | Search works |
| 3 | CUS-003 | Filter theo hạng thành viên | Medium | ⏳ | | |
| 4 | CUS-004 | Thêm khách hàng mới | Critical | ✅ | - | Modal works |
| 5 | CUS-005 | Validation số điện thoại | High | ⏳ | | |
| 6 | CUS-006 | Duplicate phone check | High | ⏳ | | |
| 7 | CUS-007 | Xem chi tiết khách hàng | High | ⏳ | | |
| 8 | CUS-008 | Sửa thông tin khách hàng | High | ⏳ | | |
| 9 | CUS-009 | Xóa khách hàng | Medium | ⏳ | | |
| 10 | CUS-010 | Xem lịch sử đặt sân | High | ⏳ | | |
| 11 | CUS-011 | Pagination | Medium | ✅ | - | Page navigation works |

**Module Pass Rate:** 4 / 11 = 36%

---

## 5. INVOICES MODULE

| # | TC ID | Test Case | Priority | Status | Bug ID | Notes |
|---|-------|-----------|----------|--------|--------|-------|
| 1 | INV-001 | Hiển thị danh sách hóa đơn | Critical | ✅ | - | List displays |
| 2 | INV-002 | Filter theo trạng thái | High | ✅ | - | Dropdown works |
| 3 | INV-003 | Filter theo ngày (Hôm nay) | High | ✅ | - | Tab works |
| 4 | INV-004 | Filter theo tuần | High | ✅ | - | Tab works |
| 5 | INV-005 | Filter theo tháng | High | ✅ | - | Tab works |
| 6 | INV-006 | Filter theo quý | High | ✅ | - | Tab works |
| 7 | INV-007 | Filter theo năm | High | ✅ | - | Tab works |
| 8 | INV-008 | Tìm kiếm theo mã HĐ | Medium | ✅ | - | Search filters correctly |
| 9 | INV-009 | Xem chi tiết hóa đơn | High | ✅ | - | Detail modal opens |
| 10 | INV-010 | Thanh toán hóa đơn | Critical | ⏭️ | - | No pending invoices |
| 11 | INV-011 | Hủy hóa đơn | Medium | ⏳ | | |
| 12 | INV-012 | In hóa đơn | Medium | ✅ | - | Print view opens |
| 13 | INV-013 | Xuất báo cáo CSV | High | ✅ | - | Export success toast |
| 14 | INV-014 | Stats cards cập nhật | High | ✅ | - | Shows correct data |

**Module Pass Rate:** 12 / 14 = 86%

---

## 6. SETTINGS MODULE

| # | TC ID | Test Case | Priority | Status | Bug ID | Notes |
|---|-------|-----------|----------|--------|--------|-------|
| 1 | SET-001 | Hiển thị trang cài đặt | Critical | ✅ | - | Page loads |
| 2 | SET-002 | Tab Thông tin cơ sở | High | ✅ | - | Tab works |
| 3 | SET-003 | Thêm cơ sở mới | Critical | ✅ | - | Modal works |
| 4 | SET-004 | Sửa thông tin cơ sở | High | ⏳ | | |
| 5 | SET-005 | Xóa cơ sở | Medium | ⏳ | | |
| 6 | SET-006 | Tab Giờ hoạt động | High | ✅ | - | Shows 06:00-23:00 |
| 7 | SET-007 | Cập nhật giờ hoạt động | High | ✅ | - | Edit capability verified |
| 8 | SET-008 | Tab Bảng giá | High | ✅ | - | Tab displays |
| 9 | SET-009 | Thêm khung giá | High | ⏳ | | |
| 10 | SET-010 | Tab Thông báo | Medium | ✅ | - | Tab displays |
| 11 | SET-011 | Contact Info Management | Medium | ✅ | - | Phone, email, address OK |
| 12 | SET-012 | Tab Bảo mật | Medium | ✅ | - | Tab displays |
| 13 | SET-013 | Đổi mật khẩu | High | ⏳ | | |
| 14 | SET-014 | Vietnamese diacritics | Critical | ✅ | - | ✅ Tiếng Việt có dấu |

**Module Pass Rate:** 10 / 14 = 71%

---

## 7. RESPONSIVE / MOBILE TESTING

| # | TC ID | Test Case | Viewport | Status | Bug ID | Notes |
|---|-------|-----------|----------|--------|--------|-------|
| 1 | RESP-001 | Chrome Desktop | 1920x1080 | ✅ | - | OK |
| 2 | RESP-002 | Tablet View | 768x1024 | ✅ | - | Layout adapts |
| 3 | RESP-003 | Mobile Dashboard | 375x800 | ✅ | - | Bottom nav visible |
| 4 | RESP-004 | Mobile Calendar | 375x800 | ✅ | - | Horizontal scroll |
| 5 | RESP-005 | Mobile Customers | 375x800 | ✅ | - | Cards stack properly |
| 6 | RESP-006 | Mobile Invoices | 375x800 | ✅ | - | Cards stack properly |
| 7 | RESP-007 | Mobile Navigation | 375x800 | ✅ | - | All nav buttons work |

**Module Pass Rate:** 7 / 7 = 100%

---

## 8. LOCALIZATION / VIETNAMESE

| # | Page | Vietnamese Diacritics | Status | Notes |
|---|------|----------------------|--------|-------|
| 1 | Login Page | ✅ Có dấu đầy đủ | ✅ | Đăng nhập, Mật khẩu... |
| 2 | Dashboard | ✅ Có dấu đầy đủ | ✅ | Tổng quan, Doanh thu... |
| 3 | Calendar | ✅ Có dấu đầy đủ | ✅ | Lịch Đặt Sân, Ngày, Tuần... |
| 4 | Customers | ✅ Có dấu đầy đủ | ✅ | Khách Hàng, Thêm khách hàng... |
| 5 | Invoices | ✅ Có dấu đầy đủ | ✅ | Hóa đơn, Đã thanh toán... |
| 6 | Settings | ✅ Có dấu đầy đủ | ✅ | Thông tin cơ sở, Bảng giá... |
| 7 | Courts | ✅ Có dấu đầy đủ | ✅ | Quản lý sân, Sân A1... |
| 8 | Mobile Views | ✅ Có dấu đầy đủ | ✅ | Trang chủ, Lịch, Khách... |

---

## SUMMARY

| Module | Total | Pass | Fail | Skip | Pending | Pass Rate |
|--------|-------|------|------|------|---------|-----------|
| Authentication | 8 | 6 | 0 | 0 | 2 | 75% |
| Dashboard | 9 | 9 | 0 | 0 | 0 | 100% |
| Calendar | 10 | 7 | 0 | 0 | 3 | 70% |
| Customers | 11 | 4 | 0 | 0 | 7 | 36% |
| Invoices | 14 | 12 | 0 | 1 | 1 | 86% |
| Settings | 14 | 10 | 0 | 0 | 4 | 71% |
| Responsive | 7 | 7 | 0 | 0 | 0 | 100% |
| Localization | 8 | 8 | 0 | 0 | 0 | 100% |
| **TOTAL** | **81** | **63** | **0** | **1** | **17** | **78%** |

---

## BUG SUMMARY

| Bug ID | Title | Severity | Priority | Module | Status |
|--------|-------|----------|----------|--------|--------|
| - | No bugs found | - | - | - | - |

---

## SIGN-OFF

| Role | Name | Signature | Date |
|------|------|-----------|------|
| QA Tester | AI Agent | ✅ | 05/02/2026 |
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |

---

*Last Updated: 05/02/2026 - UAT Round 3 Complete*
*Pass Rate: 78% (63/81 tests passed, 0 failed, 1 skipped, 17 pending)*

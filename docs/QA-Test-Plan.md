# KẾ HOẠCH KIỂM THỬ CHẤT LƯỢNG PHẦN MỀM
## Hệ Thống Quản Lý Sân Cầu Lông - Courtify

---

**Phiên bản:** 1.0.0  
**Ngày tạo:** 05/02/2026  
**Người thực hiện:** QA Team  
**Trạng thái:** Active

---

## 1. GIỚI THIỆU

### 1.1 Mục đích
Tài liệu này mô tả kế hoạch kiểm thử toàn diện cho hệ thống Courtify - Quản lý sân cầu lông, bao gồm các phương pháp, phạm vi, tài nguyên và lịch trình kiểm thử.

### 1.2 Phạm vi kiểm thử
- **Frontend:** React + TypeScript + Vite
- **Backend:** Node.js + Express + Prisma
- **Database:** PostgreSQL
- **Platforms:** Web Desktop, Mobile Web (Responsive)

### 1.3 Tài liệu tham chiếu
- Product Requirements Document (PRD)
- UI/UX Design Specifications
- API Documentation
- UAT Checklist

---

## 2. CHIẾN LƯỢC KIỂM THỬ

### 2.1 Các loại kiểm thử

| Loại kiểm thử | Mô tả | Công cụ |
|---------------|-------|---------|
| Unit Testing | Kiểm thử đơn vị cho functions/components | Vitest, React Testing Library |
| Integration Testing | Kiểm thử tích hợp API | Vitest, Supertest |
| E2E Testing | Kiểm thử end-to-end toàn bộ flow | Playwright |
| UI/UX Testing | Kiểm thử giao diện người dùng | Manual + Playwright |
| Performance Testing | Kiểm thử hiệu năng | Lighthouse, k6 |
| Security Testing | Kiểm thử bảo mật | OWASP ZAP |
| Accessibility Testing | Kiểm thử khả năng truy cập | axe-core |
| Cross-browser Testing | Kiểm thử đa trình duyệt | BrowserStack |

### 2.2 Môi trường kiểm thử

| Môi trường | URL | Mục đích |
|------------|-----|----------|
| Development | http://localhost:5176 | Phát triển & Unit test |
| Staging | https://staging.courtify.vn | UAT & Integration test |
| Production | https://courtify.vn | Smoke test sau deploy |

---

## 3. TEST CASES CHI TIẾT

### 3.1 Module: Xác thực (Authentication)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| AUTH-001 | Đăng nhập thành công | User đã có tài khoản | 1. Mở trang login<br>2. Nhập email hợp lệ<br>3. Nhập password hợp lệ<br>4. Click "Đăng nhập" | Chuyển đến Dashboard, hiển thị toast thành công | Critical |
| AUTH-002 | Đăng nhập thất bại - sai password | User đã có tài khoản | 1. Mở trang login<br>2. Nhập email hợp lệ<br>3. Nhập password sai<br>4. Click "Đăng nhập" | Hiển thị toast lỗi "Sai mật khẩu" | Critical |
| AUTH-003 | Đăng nhập thất bại - email không tồn tại | N/A | 1. Mở trang login<br>2. Nhập email không tồn tại<br>3. Nhập password bất kỳ<br>4. Click "Đăng nhập" | Hiển thị toast lỗi "Tài khoản không tồn tại" | High |
| AUTH-004 | Validation email format | N/A | 1. Nhập email sai format (thiếu @)<br>2. Submit form | Hiển thị lỗi validation "Email không hợp lệ" | Medium |
| AUTH-005 | Validation password length | N/A | 1. Nhập password < 6 ký tự<br>2. Submit form | Hiển thị lỗi "Mật khẩu phải có ít nhất 6 ký tự" | Medium |
| AUTH-006 | Đăng xuất | User đã đăng nhập | 1. Click nút "Đăng xuất"<br>2. Confirm | Chuyển về trang login, xóa session | High |
| AUTH-007 | Nhớ đăng nhập | User đã có tài khoản | 1. Check "Ghi nhớ đăng nhập"<br>2. Đăng nhập<br>3. Đóng browser, mở lại | Vẫn còn trạng thái đăng nhập | Low |
| AUTH-008 | Quên mật khẩu | User đã có tài khoản | 1. Click "Quên mật khẩu"<br>2. Nhập email<br>3. Submit | Gửi email reset password | Medium |

### 3.2 Module: Dashboard

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| DASH-001 | Hiển thị Dashboard | User đã đăng nhập | 1. Navigate đến "/" | Hiển thị đầy đủ: Stats cards, Charts, Upcoming bookings | Critical |
| DASH-002 | Filter theo ngày | DASH-001 | 1. Click tab "Hôm nay" | Data cập nhật theo ngày hiện tại | High |
| DASH-003 | Filter theo tuần | DASH-001 | 1. Click tab "Tuần này" | Data cập nhật theo 7 ngày qua | High |
| DASH-004 | Filter theo tháng | DASH-001 | 1. Click tab "Tháng này" | Data cập nhật theo 30 ngày qua | High |
| DASH-005 | Donut chart tooltip | DASH-001 | 1. Hover lên donut chart | Hiển thị tooltip với số liệu chi tiết | Medium |
| DASH-006 | Bar chart tooltip | DASH-001 | 1. Hover lên bar chart | Hiển thị tooltip doanh thu theo giờ | Medium |
| DASH-007 | Click Stats Card | DASH-001 | 1. Click vào card "Doanh thu" | Navigate đến trang Reports | Medium |
| DASH-008 | Click Upcoming Booking | DASH-001 | 1. Click vào một booking trong danh sách | Navigate đến chi tiết booking | Medium |
| DASH-009 | Quick Actions | DASH-001 | 1. Click các nút quick actions (Đặt sân mới, Thêm khách hàng...) | Modal hoặc navigation tương ứng | High |

### 3.3 Module: Lịch Đặt Sân (Calendar)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| CAL-001 | Hiển thị lịch theo ngày | User đã đăng nhập | 1. Navigate đến "/calendar"<br>2. Click tab "Ngày" | Hiển thị grid sân theo giờ | Critical |
| CAL-002 | Hiển thị lịch theo tuần | CAL-001 | 1. Click tab "Tuần" | Hiển thị 7 ngày, mỗi ngày hiển thị slots | High |
| CAL-003 | Hiển thị danh sách | CAL-001 | 1. Click tab "Danh sách" | Hiển thị bookings dạng list | High |
| CAL-004 | Chọn ngày từ Mini Calendar | CAL-001 | 1. Click ngày trên mini calendar | Main calendar cập nhật theo ngày được chọn | High |
| CAL-005 | Navigate ngày trước/sau | CAL-001 | 1. Click nút mũi tên trái/phải | Calendar chuyển sang ngày trước/sau | Medium |
| CAL-006 | Tạo booking mới - Click slot | CAL-001 | 1. Click vào slot trống<br>2. Điền thông tin<br>3. Submit | Booking được tạo, hiển thị trên calendar | Critical |
| CAL-007 | Xem chi tiết booking | CAL-001 có booking | 1. Click vào booking trên calendar | Modal chi tiết booking hiển thị | High |
| CAL-008 | Drag & Drop booking | CAL-001 có booking | 1. Drag booking đến slot khác | Booking được di chuyển, confirm dialog | Medium |
| CAL-009 | Filter theo cơ sở | CAL-001, nhiều venues | 1. Chọn venue từ dropdown | Calendar chỉ hiện sân của venue được chọn | High |
| CAL-010 | Booking overlap warning | CAL-001 có booking | 1. Tạo booking trùng thời gian và sân | Hiển thị warning hoặc block | Critical |

### 3.4 Module: Khách Hàng (Customers)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| CUS-001 | Hiển thị danh sách khách hàng | User đã đăng nhập | 1. Navigate đến "/customers" | Hiển thị list khách hàng với info cơ bản | Critical |
| CUS-002 | Tìm kiếm khách hàng | CUS-001 | 1. Nhập tên/SĐT vào ô search<br>2. Enter | Hiển thị kết quả match | High |
| CUS-003 | Filter theo hạng thành viên | CUS-001 | 1. Chọn filter "Vàng"/"Bạc"/"Đồng" | Chỉ hiện khách hàng theo hạng | Medium |
| CUS-004 | Thêm khách hàng mới | CUS-001 | 1. Click "Thêm khách hàng"<br>2. Điền form<br>3. Submit | Khách hàng được tạo, hiện trong list | Critical |
| CUS-005 | Validation số điện thoại | CUS-004 đang mở | 1. Nhập SĐT sai format | Hiển thị lỗi validation | High |
| CUS-006 | Duplicate phone check | CUS-001 | 1. Thêm khách hàng với SĐT đã tồn tại | Hiển thị cảnh báo/lỗi duplicate | High |
| CUS-007 | Xem chi tiết khách hàng | CUS-001 | 1. Click vào một khách hàng | Navigate đến trang chi tiết | High |
| CUS-008 | Sửa thông tin khách hàng | CUS-007 | 1. Click "Sửa"<br>2. Thay đổi thông tin<br>3. Submit | Thông tin được cập nhật | High |
| CUS-009 | Xóa khách hàng | CUS-007 | 1. Click "Xóa"<br>2. Confirm | Khách hàng bị xóa (soft delete) | Medium |
| CUS-010 | Xem lịch sử đặt sân | CUS-007 | 1. Scroll đến phần "Lịch sử đặt sân" | Hiển thị list bookings của khách | High |
| CUS-011 | Pagination | CUS-001 có >10 KH | 1. Click next page | Chuyển sang trang tiếp theo | Medium |

### 3.5 Module: Hóa Đơn (Invoices)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| INV-001 | Hiển thị danh sách hóa đơn | User đã đăng nhập | 1. Navigate đến "/invoices" | Hiển thị list hóa đơn | Critical |
| INV-002 | Filter theo trạng thái | INV-001 | 1. Chọn filter "Đã thanh toán" | Chỉ hiện hóa đơn đã thanh toán | High |
| INV-003 | Filter theo ngày | INV-001 | 1. Click tab "Hôm nay" | Chỉ hiện hóa đơn hôm nay | High |
| INV-004 | Filter theo tuần | INV-001 | 1. Click tab "Tuần" | Chỉ hiện hóa đơn 7 ngày qua | High |
| INV-005 | Filter theo tháng | INV-001 | 1. Click tab "Tháng" | Chỉ hiện hóa đơn 30 ngày qua | High |
| INV-006 | Filter theo quý | INV-001 | 1. Click tab "Quý" | Chỉ hiện hóa đơn 3 tháng qua | High |
| INV-007 | Filter theo năm | INV-001 | 1. Click tab "Năm" | Chỉ hiện hóa đơn 1 năm qua | High |
| INV-008 | Tìm kiếm theo mã HĐ | INV-001 | 1. Nhập mã hóa đơn vào search | Hiển thị hóa đơn match | Medium |
| INV-009 | Xem chi tiết hóa đơn | INV-001 | 1. Click vào một hóa đơn | Modal chi tiết hiển thị | High |
| INV-010 | Thanh toán hóa đơn | INV-009, status=PENDING | 1. Click "Thanh toán" | Trạng thái chuyển sang PAID | Critical |
| INV-011 | Hủy hóa đơn | INV-009, status=PENDING | 1. Click "Hủy"<br>2. Confirm | Hóa đơn bị hủy | Medium |
| INV-012 | In hóa đơn | INV-009 | 1. Click "In" | Mở print preview | Medium |
| INV-013 | Xuất báo cáo CSV | INV-001 | 1. Click "Xuất báo cáo"<br>2. Chọn CSV | File CSV được download | High |
| INV-014 | Stats cards cập nhật | INV-001 | N/A | Tổng hóa đơn, Doanh thu hiển thị đúng | High |

### 3.6 Module: Cài Đặt (Settings)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| SET-001 | Hiển thị trang cài đặt | User đã đăng nhập | 1. Navigate đến "/settings" | Hiển thị sidebar tabs, content area | Critical |
| SET-002 | Tab Thông tin cơ sở | SET-001 | 1. Click tab "Thông tin cơ sở" | Hiển thị list venues | High |
| SET-003 | Thêm cơ sở mới | SET-002 | 1. Click "Thêm cơ sở"<br>2. Điền form<br>3. Submit | Venue mới được tạo | Critical |
| SET-004 | Sửa thông tin cơ sở | SET-002 có venue | 1. Click "Sửa"<br>2. Thay đổi thông tin<br>3. Submit | Thông tin được cập nhật | High |
| SET-005 | Xóa cơ sở | SET-002 có venue | 1. Click "Xóa"<br>2. Confirm | Venue bị xóa | Medium |
| SET-006 | Tab Giờ hoạt động | SET-001 | 1. Click tab "Giờ hoạt động" | Hiển thị form config giờ 7 ngày | High |
| SET-007 | Cập nhật giờ hoạt động | SET-006 | 1. Thay đổi giờ mở/đóng<br>2. Click "Lưu" | Giờ hoạt động được cập nhật | High |
| SET-008 | Tab Bảng giá | SET-001 | 1. Click tab "Bảng giá" | Hiển thị list pricing rules | High |
| SET-009 | Thêm khung giá | SET-008 | 1. Click "Thêm khung giá"<br>2. Điền form<br>3. Submit | Pricing rule mới được tạo | High |
| SET-010 | Tab Thông báo | SET-001 | 1. Click tab "Thông báo" | Hiển thị notification settings | Medium |
| SET-011 | Toggle notification | SET-010 | 1. Toggle on/off một setting | Setting được lưu | Medium |
| SET-012 | Tab Bảo mật | SET-001 | 1. Click tab "Bảo mật" | Hiển thị form đổi mật khẩu | Medium |
| SET-013 | Đổi mật khẩu | SET-012 | 1. Nhập mật khẩu cũ<br>2. Nhập mật khẩu mới 2 lần<br>3. Submit | Mật khẩu được đổi | High |
| SET-014 | Vietnamese diacritics | SET-001 | 1. Kiểm tra tất cả text | Tiếng Việt có dấu đầy đủ | Critical |

### 3.7 Module: Kho & Dịch Vụ (Inventory)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| INV-001 | Hiển thị danh sách sản phẩm | User đã đăng nhập | 1. Navigate đến "/inventory" | Hiển thị list products/services | Critical |
| INV-002 | Thêm sản phẩm mới | INV-001 | 1. Click "Thêm"<br>2. Điền form<br>3. Submit | Product được tạo | High |
| INV-003 | Cập nhật số lượng tồn | INV-001 có product | 1. Thay đổi quantity<br>2. Submit | Số lượng được cập nhật | High |
| INV-004 | Cảnh báo hết hàng | Product có qty < threshold | N/A | Hiển thị badge/alert "Sắp hết hàng" | Medium |
| INV-005 | Filter theo category | INV-001 | 1. Chọn category filter | Chỉ hiện products trong category | Medium |

### 3.8 Module: Báo Cáo (Reports)

| TC ID | Test Case | Precondition | Steps | Expected Result | Priority |
|-------|-----------|--------------|-------|-----------------|----------|
| REP-001 | Hiển thị trang báo cáo | User đã đăng nhập | 1. Navigate đến "/reports" | Hiển thị báo cáo tổng quan | Critical |
| REP-002 | Báo cáo doanh thu | REP-001 | 1. Chọn tab "Doanh thu" | Hiển thị chart + table doanh thu | High |
| REP-003 | Filter date range | REP-001 | 1. Chọn khoảng ngày<br>2. Apply | Data cập nhật theo range | High |
| REP-004 | Export PDF | REP-001 | 1. Click "Xuất PDF" | File PDF được download | Medium |
| REP-005 | Export Excel | REP-001 | 1. Click "Xuất Excel" | File Excel được download | Medium |

---

## 4. KIỂM THỬ PHI CHỨC NĂNG

### 4.1 Performance Testing

| TC ID | Test Case | Metric | Target | Tool |
|-------|-----------|--------|--------|------|
| PERF-001 | Page Load Time - Dashboard | First Contentful Paint | < 1.5s | Lighthouse |
| PERF-002 | Page Load Time - Calendar | Largest Contentful Paint | < 2.5s | Lighthouse |
| PERF-003 | API Response Time | Average response | < 200ms | k6 |
| PERF-004 | Concurrent Users | Load test | 100 concurrent users | k6 |
| PERF-005 | Memory Usage | Frontend memory | < 50MB | Chrome DevTools |

### 4.2 Security Testing

| TC ID | Test Case | Method | Expected Result |
|-------|-----------|--------|-----------------|
| SEC-001 | SQL Injection | Inject SQL vào input fields | Không thực thi, sanitized |
| SEC-002 | XSS Attack | Inject script vào input | Script không execute |
| SEC-003 | CSRF Protection | Cross-site request | Request bị block |
| SEC-004 | JWT Expiration | Sử dụng token hết hạn | 401 Unauthorized |
| SEC-005 | Password Hashing | Check database | Password được hash (bcrypt) |
| SEC-006 | HTTPS | All connections | TLS 1.2+ |

### 4.3 Accessibility Testing

| TC ID | Test Case | WCAG Level | Tool |
|-------|-----------|------------|------|
| A11Y-001 | Keyboard Navigation | AA | Manual |
| A11Y-002 | Color Contrast | AA | axe-core |
| A11Y-003 | Screen Reader | AA | NVDA/VoiceOver |
| A11Y-004 | Focus Indicators | AA | Manual |
| A11Y-005 | ARIA Labels | AA | axe-core |

### 4.4 Responsive/Cross-browser Testing

| TC ID | Environment | Viewport | Status |
|-------|-------------|----------|--------|
| RESP-001 | Chrome Desktop | 1920x1080 | Required |
| RESP-002 | Firefox Desktop | 1920x1080 | Required |
| RESP-003 | Safari Desktop | 1920x1080 | Required |
| RESP-004 | Edge Desktop | 1920x1080 | Required |
| RESP-005 | Chrome Mobile | 375x667 (iPhone SE) | Required |
| RESP-006 | Safari Mobile | 390x844 (iPhone 14) | Required |
| RESP-007 | Chrome Tablet | 768x1024 (iPad) | Required |

---

## 5. TIÊU CHÍ CHẤP NHẬN

### 5.1 Entry Criteria (Điều kiện bắt đầu)
- [ ] Build thành công, không có compilation errors
- [ ] Môi trường test đã sẵn sàng
- [ ] Test data đã được chuẩn bị
- [ ] All blockers từ sprint trước đã resolved

### 5.2 Exit Criteria (Điều kiện hoàn thành)
- [ ] 100% Critical test cases PASS
- [ ] ≥ 95% High priority test cases PASS
- [ ] ≥ 90% Medium priority test cases PASS
- [ ] 0 Critical/Blocker bugs open
- [ ] ≤ 3 High bugs open (có workaround)
- [ ] Performance metrics đạt target
- [ ] UAT sign-off từ stakeholders

### 5.3 Suspension Criteria (Điều kiện tạm dừng)
- > 50% test cases FAIL liên tiếp
- Critical functionality không hoạt động
- Environment không ổn định
- Blocker bug chưa được fix

---

## 6. BUG SEVERITY & PRIORITY

### 6.1 Severity Levels

| Level | Định nghĩa | Ví dụ |
|-------|------------|-------|
| **Critical** | Hệ thống crash, data loss, security breach | App không khởi động được |
| **High** | Major function không hoạt động, no workaround | Không thể tạo booking |
| **Medium** | Function bị lỗi nhưng có workaround | Filter không hoạt động nhưng có thể search manual |
| **Low** | Minor issue, cosmetic | Typo, alignment issue |

### 6.2 Priority Levels

| Level | Định nghĩa | SLA |
|-------|------------|-----|
| **P1** | Cần fix ngay | 4 giờ |
| **P2** | Fix trong sprint hiện tại | 2 ngày |
| **P3** | Fix trong sprint tiếp theo | 1-2 tuần |
| **P4** | Nice to have | Backlog |

---

## 7. LỊCH TRÌNH KIỂM THỬ

### Sprint Testing Timeline (2 tuần)

```
Week 1:
├── Day 1-2: Test Planning & Environment Setup
├── Day 3-4: Unit Testing
├── Day 5-6: Integration Testing
└── Day 7: Bug Fixing Round 1

Week 2:
├── Day 8-9: E2E Testing
├── Day 10: Regression Testing
├── Day 11: Performance & Security Testing
├── Day 12: UAT
├── Day 13: Bug Fixing Round 2
└── Day 14: Final Verification & Sign-off
```

---

## 8. NGUỒN LỰC

### 8.1 Team
| Vai trò | Người | Trách nhiệm |
|---------|-------|-------------|
| QA Lead | TBD | Test planning, coordination |
| QA Engineer | TBD | Test execution, bug reporting |
| Automation Engineer | TBD | E2E test scripts |
| Developer | Dev Team | Bug fixing, unit tests |

### 8.2 Tools
- **Test Management:** Notion / Jira
- **Bug Tracking:** Jira / GitHub Issues
- **Unit Testing:** Vitest
- **E2E Testing:** Playwright
- **API Testing:** Postman / Supertest
- **Performance:** Lighthouse, k6
- **Security:** OWASP ZAP
- **CI/CD:** GitHub Actions

---

## 9. DELIVERABLES

- [ ] Test Plan Document (this document)
- [ ] Test Cases Spreadsheet
- [ ] Test Execution Report
- [ ] Bug Report Summary
- [ ] UAT Sign-off Document
- [ ] Performance Test Report
- [ ] Security Scan Report

---

## 10. RISKS & MITIGATION

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Thiếu test data | High | Medium | Tạo seed data script |
| Environment không ổn định | High | Low | Docker containerization |
| Deadline gấp | Medium | High | Prioritize critical test cases |
| Resource thiếu | Medium | Medium | Cross-training team members |
| Requirement thay đổi | Low | Medium | Agile approach, frequent sync |

---

## 11. APPROVAL

| Stakeholder | Vai trò | Signature | Date |
|-------------|---------|-----------|------|
| | QA Lead | | |
| | Dev Lead | | |
| | Product Owner | | |
| | Project Manager | | |

---

*Document Version History:*
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 05/02/2026 | QA Team | Initial version |

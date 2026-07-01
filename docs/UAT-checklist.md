# 🧪 UAT CHECKLIST - Quản Lý Sân Cầu Lông

**Version**: 1.0  
**Date**: 2026-02-04  
**Test URL**: http://localhost:5176

---

## 📋 Test Instructions

1. Mở terminal trong folder `apps/frontend`
2. Chạy `npm run dev`
3. Mở browser đến URL hiển thị (ví dụ: http://localhost:5176)
4. Theo các test case bên dưới

---

## ✅ Test Case Checklist

### 🔐 TC-001: Authentication - Login Page
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Truy cập http://localhost:5176 | Trang Login hiển thị | ⬜ |
| 2 | Kiểm tra logo và tên ứng dụng | "Courtify" với emoji 🏸 | ⬜ |
| 3 | Kiểm tra input Email | Có placeholder, có icon | ⬜ |
| 4 | Kiểm tra input Password | Có placeholder, có icon, có toggle show/hide | ⬜ |
| 5 | Kiểm tra checkbox "Ghi nhớ đăng nhập" | Hiển thị đúng | ⬜ |
| 6 | Click link "Quên mật khẩu?" | Chuyển sang /forgot-password | ⬜ |
| 7 | Click nút "Đăng nhập" | Button có hiệu ứng hover | ⬜ |
| 8 | Kiểm tra responsive (mobile view) | Layout phù hợp | ⬜ |

---

### 🔑 TC-002: Forgot Password Flow
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Từ Login, click "Quên mật khẩu?" | Trang ForgotPassword hiển thị | ⬜ |
| 2 | Kiểm tra Step 1: Email Input | Input email với icon | ⬜ |
| 3 | Nhập email và click "Gửi mã xác nhận" | Chuyển sang Step 2 (mô phỏng) | ⬜ |
| 4 | Kiểm tra Step 2: OTP Input | 6 ô input số riêng biệt | ⬜ |
| 5 | Kiểm tra Step 3: New Password | 2 input: password mới và xác nhận | ⬜ |
| 6 | Click "Quay lại đăng nhập" | Chuyển về /login | ⬜ |

---

### 📊 TC-003: Dashboard
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Đăng nhập thành công | Dashboard hiển thị | ⬜ |
| 2 | Kiểm tra Header | Logo, search bar, notifications, user menu | ⬜ |
| 3 | Kiểm tra Sidebar | Navigation menu với icons | ⬜ |
| 4 | Kiểm tra Stats Cards | Có các card như Revenue, Bookings | ⬜ |
| 5 | Hover vào stat card | Hiệu ứng hover visible | ⬜ |
| 6 | Click notification bell | Dropdown thông báo hiển thị | ⬜ |
| 7 | Press Ctrl+K | Command Palette mở ra | ⬜ |

---

### 📅 TC-004: Booking Calendar
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Navigate đến Booking Calendar | Trang calendar hiển thị | ⬜ |
| 2 | Kiểm tra View Toggle | Day/Week/List buttons | ⬜ |
| 3 | Click "Week" view | Chuyển sang week view | ⬜ |
| 4 | Click "List" view | Chuyển sang list view | ⬜ |
| 5 | Kiểm tra Mini Calendar | Tháng hiện tại, có prev/next buttons | ⬜ |
| 6 | Click ngày khác trên Mini Calendar | Date được chọn, calendar cập nhật | ⬜ |
| 7 | Hover vào booking slot | One-Click Check-in button hiện | ⬜ |
| 8 | Click vào booking | Booking Detail Panel mở | ⬜ |

---

### 👥 TC-005: Customer Management
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Navigate đến Customers | Danh sách khách hàng hiển thị | ⬜ |
| 2 | Kiểm tra Filter Tabs | All/Members/Frequent/New | ⬜ |
| 3 | Click "Members" tab | Chỉ hiện thành viên | ⬜ |
| 4 | Click vào 1 customer | Customer Detail Page | ⬜ |
| 5 | Kiểm tra Booking History | Danh sách lịch sử đặt sân | ⬜ |
| 6 | Kiểm tra thống kê | Total bookings, spending | ⬜ |

---

### 🧾 TC-006: Invoice Management
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Navigate đến Invoices | Danh sách hóa đơn hiển thị | ⬜ |
| 2 | Kiểm tra Filter Tabs | All/Pending/Paid/Cancelled/Refunded | ⬜ |
| 3 | Click "Pending" tab | Chỉ hiện hóa đơn chờ thanh toán | ⬜ |
| 4 | Click vào 1 invoice | Invoice Detail Panel mở ra từ phải | ⬜ |
| 5 | Kiểm tra invoice items | Danh sách items với giá | ⬜ |
| 6 | Kiểm tra totals | Subtotal, Tax, Total | ⬜ |
| 7 | Click Print button | Print dialog mở (hoặc PDF) | ⬜ |

---

### 📦 TC-007: Inventory Management
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Navigate đến Inventory | Danh sách sản phẩm | ⬜ |
| 2 | Kiểm tra Low Stock Alert | Badge đỏ cho items hết hàng | ⬜ |
| 3 | Kiểm tra Alert Banner | "X items low stock" nếu có | ⬜ |
| 4 | Click Scan Barcode (nếu có) | Barcode Scanner UI mở | ⬜ |
| 5 | Test Manual Input | Input nhận barcode text | ⬜ |

---

### 📈 TC-008: Reports & Charts
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Navigate đến Reports | Trang reports hiển thị | ⬜ |
| 2 | Kiểm tra Charts | Line/Bar/Pie charts render | ⬜ |
| 3 | Hover vào data point | Tooltip hiển thị | ⬜ |
| 4 | Click Export button | Export Modal mở | ⬜ |
| 5 | Chọn format Excel | Download file | ⬜ |
| 6 | Chọn format PDF | Download file | ⬜ |
| 7 | Chọn format CSV | Download file | ⬜ |

---

### ⚙️ TC-009: Settings
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Navigate đến Settings | Settings page hiển thị | ⬜ |
| 2 | Kiểm tra Venue Settings Tab | Inputs cho tên, địa chỉ, phone | ⬜ |
| 3 | Kiểm tra Hours Settings Tab | Operating hours config | ⬜ |
| 4 | Kiểm tra Pricing Settings Tab | Giá thường + giá cao điểm | ⬜ |
| 5 | Kiểm tra Notifications Tab | Toggle switches cho alerts | ⬜ |
| 6 | Thay đổi settings | Save button active | ⬜ |

---

### 🏸 TC-010: Court Status
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Kiểm tra Court Status Grid | Grid các sân với status | ⬜ |
| 2 | Xanh = Available | Sân trống | ⬜ |
| 3 | Đỏ = Occupied | Sân đang sử dụng | ⬜ |
| 4 | Vàng = Maintenance | Sân bảo trì | ⬜ |
| 5 | Click vào sân | Chi tiết sân hiển thị | ⬜ |

---

### 📱 TC-011: Mobile Responsive
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Resize browser < 768px | Mobile layout | ⬜ |
| 2 | Kiểm tra Bottom Nav | Navigation icons ở bottom | ⬜ |
| 3 | Kiểm tra Quick Actions FAB | Nút (+) ở góc phải dưới | ⬜ |
| 4 | Click FAB | Menu expand ra | ⬜ |
| 5 | Kiểm tra sidebar | Collapse thành hamburger menu | ⬜ |

---

### 🌐 TC-012: i18n (Multi-language)
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Mặc định là Tiếng Việt | UI tiếng Việt | ⬜ |
| 2 | Click Language Switcher | Dropdown VN/EN | ⬜ |
| 3 | Chọn English | UI chuyển sang English | ⬜ |
| 4 | Refresh page | Ngôn ngữ được nhớ (localStorage) | ⬜ |
| 5 | Kiểm tra Currency format | 100.000 ₫ (VN) vs ₫100,000 (EN) | ⬜ |

---

### ⌨️ TC-013: Keyboard Shortcuts
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Press Ctrl+K | Command Palette mở | ⬜ |
| 2 | Gõ "booking" | Lọc kết quả liên quan booking | ⬜ |
| 3 | Press Arrow Down/Up | Navigate giữa results | ⬜ |
| 4 | Press Enter | Thực hiện action được chọn | ⬜ |
| 5 | Press Escape | Đóng Command Palette | ⬜ |

---

### 🎨 TC-014: Visual Design Quality
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Kiểm tra Color Scheme | Màu sắc đồng nhất, premium feel | ⬜ |
| 2 | Kiểm tra Typography | Font Inter, đọc rõ ràng | ⬜ |
| 3 | Kiểm tra Spacing | Padding/margin hợp lý | ⬜ |
| 4 | Kiểm tra Shadows | Box shadows mềm mại | ⬜ |
| 5 | Kiểm tra Hover Effects | Smooth transitions | ⬜ |
| 6 | Kiểm tra Icons | Lucide icons consistent | ⬜ |
| 7 | Kiểm tra Empty States | EmptyState component khi không có data | ⬜ |

---

### 🔔 TC-015: Real-time Features (Mock)
| # | Test Step | Expected Result | Status |
|---|-----------|-----------------|--------|
| 1 | Kiểm tra Live Stats Bar | Pulse animations | ⬜ |
| 2 | Kiểm tra WebSocket Status | Indicator hiển thị trạng thái | ⬜ |
| 3 | Notifications dropdown | Real-time badge count | ⬜ |

---

## 📊 Test Summary

| Category | Total Tests | Passed | Failed | Blocked |
|----------|-------------|--------|--------|---------|
| Authentication | 14 | ⬜ | ⬜ | ⬜ |
| Dashboard | 7 | ⬜ | ⬜ | ⬜ |
| Booking Calendar | 8 | ⬜ | ⬜ | ⬜ |
| Customer Management | 6 | ⬜ | ⬜ | ⬜ |
| Invoice Management | 7 | ⬜ | ⬜ | ⬜ |
| Inventory | 5 | ⬜ | ⬜ | ⬜ |
| Reports & Charts | 7 | ⬜ | ⬜ | ⬜ |
| Settings | 6 | ⬜ | ⬜ | ⬜ |
| Court Status | 5 | ⬜ | ⬜ | ⬜ |
| Mobile Responsive | 5 | ⬜ | ⬜ | ⬜ |
| i18n | 5 | ⬜ | ⬜ | ⬜ |
| Keyboard Shortcuts | 5 | ⬜ | ⬜ | ⬜ |
| Visual Design | 7 | ⬜ | ⬜ | ⬜ |
| Real-time Features | 3 | ⬜ | ⬜ | ⬜ |
| **TOTAL** | **90** | ⬜ | ⬜ | ⬜ |

---

## 🐛 Bug Report Template

### BUG-XXX: [Title]
- **Severity**: Critical / High / Medium / Low
- **Steps to Reproduce**:
  1. ...
  2. ...
- **Expected Result**: ...
- **Actual Result**: ...
- **Screenshot**: (attach if available)
- **Browser/Device**: ...

---

## 📝 Notes
- Tất cả test cases sử dụng mock data
- WebSocket features hiện tại là simulated
- Real backend integration pending

---

*Tester: _______________*  
*Date: _______________*  
*Sign-off: _______________*

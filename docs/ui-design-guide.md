# 🎨 UI Design Guide
# Hệ Thống Quản Lý Sân Cầu Lông

> **Version**: 1.0
> **Created**: 2026-02-04
> **Design System**: Dark Mode + Sport Green
> **Framework**: React + Tailwind CSS + shadcn/ui

---

## 📋 Mục Lục

1. [Design Philosophy](#1-design-philosophy)
2. [Design System](#2-design-system)
3. [Screen Mockups](#3-screen-mockups)
4. [Component Library](#4-component-library)
5. [Responsive Guidelines](#5-responsive-guidelines)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Accessibility](#7-accessibility)

---

## 1. 🎯 Design Philosophy

### 1.1. Core Principles

| Principle | Description |
|-----------|-------------|
| **Clarity** | Thông tin rõ ràng, dễ đọc, không gây nhầm lẫn |
| **Efficiency** | Tối ưu workflow, giảm clicks, hành động nhanh |
| **Consistency** | Sử dụng components nhất quán toàn hệ thống |
| **Delight** | Animations mượt, feedback tức thì, trải nghiệm premium |

### 1.2. Design References

Lấy cảm hứng từ các sản phẩm:
- **Linear** - Clean, minimal, keyboard-first
- **Stripe Dashboard** - Professional data visualization
- **Cal.com** - Booking calendar excellence
- **Vercel** - Dark mode done right

### 1.3. Target Users

| User | Needs | Priority |
|------|-------|----------|
| **Owner/Admin** | Xem tổng quan, báo cáo, cài đặt | Desktop-first |
| **Staff** | Đặt sân nhanh, check-in/out, thu tiền | Touch-friendly |
| **Customer** | Xem lịch, đặt sân online | Mobile-first |

---

## 2. 🎨 Design System

### 2.1. Color Palette

#### Primary Colors (Sport Green)
```css
:root {
  /* Primary - Sport Green */
  --primary-50: #f0fdf4;
  --primary-100: #dcfce7;
  --primary-200: #bbf7d0;
  --primary-300: #86efac;
  --primary-400: #4ade80;
  --primary-500: #22c55e;  /* Main brand color */
  --primary-600: #16a34a;
  --primary-700: #15803d;
  --primary-800: #166534;
  --primary-900: #14532d;
}
```

#### Neutral Colors (Dark Mode)
```css
:root {
  /* Background */
  --bg-primary: #0a0a0a;      /* Main background */
  --bg-secondary: #171717;    /* Cards, panels */
  --bg-tertiary: #262626;     /* Elevated elements */
  --bg-hover: #2a2a2a;        /* Hover states */
  
  /* Text */
  --text-primary: #fafafa;    /* Primary text */
  --text-secondary: #a3a3a3;  /* Secondary text */
  --text-muted: #737373;      /* Muted, placeholders */
  
  /* Border */
  --border-default: #262626;
  --border-focus: #22c55e;
}
```

#### Semantic Colors
```css
:root {
  /* Status */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
  
  /* Booking Status */
  --booking-confirmed: #3b82f6;    /* Blue */
  --booking-in-progress: #22c55e;  /* Green */
  --booking-pending: #f59e0b;      /* Yellow */
  --booking-completed: #6b7280;    /* Gray */
  --booking-cancelled: #ef4444;    /* Red */
}
```

### 2.2. Typography

```css
:root {
  /* Font Family */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

#### Typography Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| H1 | 36px | Bold | text-primary |
| H2 | 24px | Semibold | text-primary |
| H3 | 20px | Semibold | text-primary |
| H4 | 18px | Medium | text-primary |
| Body | 14px | Normal | text-secondary |
| Caption | 12px | Normal | text-muted |
| Label | 14px | Medium | text-primary |

### 2.3. Spacing

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

### 2.4. Border Radius

```css
:root {
  --radius-sm: 0.25rem;   /* 4px - small elements */
  --radius-md: 0.5rem;    /* 8px - buttons, inputs */
  --radius-lg: 0.75rem;   /* 12px - cards */
  --radius-xl: 1rem;      /* 16px - modals */
  --radius-2xl: 1.5rem;   /* 24px - large cards */
  --radius-full: 9999px;  /* Pills, avatars */
}
```

### 2.5. Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  
  /* Glow effect for primary elements */
  --shadow-glow: 0 0 20px rgba(34, 197, 94, 0.3);
}
```

### 2.6. Animation

```css
:root {
  /* Durations */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  
  /* Easings */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## 3. 📱 Screen Mockups

### 3.1. Dashboard (Trang chủ)

**File**: `design/01_dashboard.png`

![Dashboard](design/01_dashboard.png)

**Mô tả**:
- Sidebar navigation bên trái với icons và labels
- Header với search, venue selector, notifications, user menu
- 4 stat cards: Doanh thu, Đặt sân, Khách mới, Sân trống
- Biểu đồ doanh thu 7 ngày (line chart)
- Danh sách lịch đặt sân sắp tới

**Key Components**:
- `StatsCard` - Hiển thị KPI với trend indicator
- `RevenueChart` - Line chart với Recharts
- `UpcomingBookingsList` - List với booking cards

---

### 3.2. Booking Calendar (Lịch đặt sân)

**File**: `design/02_calendar.png`

![Calendar](design/02_calendar.png)

**Mô tả**:
- Date navigation với Today, arrows, view switcher
- Mini calendar widget ở sidebar
- Main calendar grid: rows = time slots, columns = courts
- Booking blocks với màu theo status
- Click empty slot → Open booking modal

**Key Components**:
- `CalendarHeader` - Date nav, view switcher
- `CalendarGrid` - Time/court matrix
- `BookingBlock` - Colored booking indicator
- `MiniCalendar` - Date picker widget

**Color Coding**:
| Status | Color | Hex |
|--------|-------|-----|
| Confirmed | Blue | #3b82f6 |
| In Progress | Green | #22c55e |
| Pending | Yellow | #f59e0b |
| Completed | Gray | #6b7280 |

---

### 3.3. Customer Management (Khách hàng)

**File**: `design/03_customers.png`

![Customers](design/03_customers.png)

**Mô tả**:
- Page header với search và Add Customer button
- Filter tabs: Tất cả, Thành viên, Thường xuyên
- Data table với sortable columns
- Membership badges (Đồng, Bạc, Vàng)
- Action dropdown (Sửa, Xem, Xóa)
- Pagination

**Key Components**:
- `DataTable` - Sortable, filterable table
- `CustomerRow` - Avatar + name + info
- `MembershipBadge` - Bronze/Silver/Gold/Platinum
- `ActionMenu` - Dropdown với actions

---

### 3.4. Court Management (Quản lý sân)

**File**: `design/04_courts.png`

![Courts](design/04_courts.png)

**Mô tả**:
- Card grid layout (3 columns)
- Court card với image, name, status, price
- Status badges (Hoạt động, Bảo trì)
- Hover reveal Edit/Delete actions
- Right sidebar: Venue info & quick settings

**Key Components**:
- `CourtCard` - Image + info + actions
- `StatusBadge` - Active/Maintenance indicator
- `VenueInfoPanel` - Sidebar with venue details

---

### 3.5. Invoice Management (Hóa đơn)

**File**: `design/05_invoices.png`

![Invoices](design/05_invoices.png)

**Mô tả**:
- Split view: List (left) + Detail (right)
- Invoice list với filters và search
- Detail panel: Header, line items, totals
- Payment status badges
- Print button

**Key Components**:
- `InvoiceList` - Filterable list view
- `InvoiceDetail` - Full invoice display
- `LineItemsTable` - Court, service, product items
- `PaymentStatus` - Paid/Pending/Partial badges

---

### 3.6. Reports (Báo cáo)

**File**: `design/06_reports.png`

![Reports](design/06_reports.png)

**Mô tả**:
- Date range picker (7 ngày, 30 ngày, tùy chỉnh)
- 4 KPI cards với growth indicators
- Large revenue trend chart
- 3-column bottom: Pie chart, Bar chart, Top customers table
- Export to Excel button

**Key Components**:
- `DateRangePicker` - Preset + custom ranges
- `KPICard` - Value + trend + icon
- `AreaChart` - Revenue over time
- `PieChart` - Revenue breakdown
- `BarChart` - Bookings by hour

---

### 3.7. Login Page (Đăng nhập)

**File**: `design/07_login.png`

![Login](design/07_login.png)

**Mô tả**:
- Split layout: Hero image (left) + Form (right)
- Logo với shuttlecock icon
- Form: Email, Password, Remember me
- Primary CTA button
- Link to Register

**Key Components**:
- `LoginForm` - Auth form with validation
- `PasswordInput` - Show/hide toggle
- `AuthLayout` - Split hero + form layout

---

### 3.8. Mobile Responsive (Di động)

**File**: `design/08_mobile.png`

![Mobile](design/08_mobile.png)

**Mô tả**:
- Bottom navigation (4 tabs)
- Date selector horizontal scroll
- Single court view per day
- Large touch targets
- Floating action button

**Key Components**:
- `BottomNav` - Mobile navigation
- `MobileCalendar` - Touch-optimized calendar
- `FAB` - Floating add button

---

### 3.9. Booking Detail Panel (Chi tiết đặt sân)

**File**: `design/09_booking_detail.png`

![Booking Detail](design/09_booking_detail.png)

**Mô tả**:
- Slide-in panel từ phải
- Customer info section với avatar
- Booking details: Time, court, price
- Payment breakdown
- Action buttons: Check-in, Sửa, Hủy
- Status timeline

**Key Components**:
- `SlidePanel` - Right slide-in container
- `CustomerSection` - Avatar + name + phone
- `PriceBreakdown` - Line items + total
- `StatusTimeline` - Booking history

---

### 3.10. Venue Settings (Cài đặt sân)

**File**: `design/10_venue_settings.png`

![Venue Settings](design/10_venue_settings.png)

**Mô tả**:
- Venue header với logo
- Tabs: Thông tin, Sân bãi, Bảng giá, Nhân sự
- Form fields cho thông tin cơ bản
- Operating hours table
- Staff list với role badges

**Key Components**:
- `VenueHeader` - Logo + name
- `TabNavigation` - Horizontal tabs
- `HoursTable` - Day/time matrix
- `StaffList` - User cards with roles

---

## 4. 🧩 Component Library

### 4.1. Buttons

```tsx
// Primary Button
<Button variant="primary" size="md">
  Đặt sân
</Button>

// Secondary Button
<Button variant="secondary" size="md">
  Hủy bỏ
</Button>

// Destructive Button
<Button variant="destructive" size="md">
  Xóa
</Button>

// Ghost Button
<Button variant="ghost" size="sm">
  Xem thêm
</Button>

// Icon Button
<Button variant="ghost" size="icon">
  <Plus />
</Button>
```

**Button Sizes**:
| Size | Height | Padding | Font |
|------|--------|---------|------|
| sm | 32px | 12px 16px | 13px |
| md | 40px | 16px 20px | 14px |
| lg | 48px | 20px 24px | 16px |

### 4.2. Inputs

```tsx
// Text Input
<Input 
  label="Số điện thoại"
  placeholder="0901234567"
  icon={<Phone />}
/>

// Search Input
<SearchInput 
  placeholder="Tìm kiếm khách hàng..."
  onSearch={handleSearch}
/>

// Select
<Select 
  label="Chọn sân"
  options={courts}
  value={selectedCourt}
  onChange={setSelectedCourt}
/>

// Date Picker
<DatePicker 
  label="Ngày đặt"
  value={date}
  onChange={setDate}
/>

// Time Picker
<TimePicker 
  label="Giờ bắt đầu"
  value={startTime}
  onChange={setStartTime}
  min="06:00"
  max="23:00"
/>
```

### 4.3. Cards

```tsx
// Stats Card
<StatsCard
  title="Doanh thu hôm nay"
  value="7,500,000"
  unit="VNĐ"
  trend="+12.5%"
  trendDirection="up"
  icon={<DollarSign />}
/>

// Booking Card
<BookingCard
  customer="Nguyễn Văn A"
  court="Sân A1"
  time="18:00 - 20:00"
  status="confirmed"
  onClick={handleClick}
/>

// Court Card
<CourtCard
  name="Sân A1"
  type="VIP"
  status="active"
  priceRange="200k - 350k"
  image="/courts/a1.jpg"
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### 4.4. Tables

```tsx
<DataTable
  columns={[
    { key: 'name', header: 'Họ và tên', sortable: true },
    { key: 'phone', header: 'Số điện thoại' },
    { key: 'membership', header: 'Gói thành viên', render: MembershipBadge },
    { key: 'totalBookings', header: 'Tổng đặt sân', sortable: true },
    { key: 'totalSpent', header: 'Tổng chi tiêu', sortable: true, format: 'currency' },
    { key: 'actions', header: '', render: ActionMenu },
  ]}
  data={customers}
  pagination
  pageSize={20}
/>
```

### 4.5. Badges

```tsx
// Status Badge
<Badge variant="success">Hoạt động</Badge>
<Badge variant="warning">Chờ xác nhận</Badge>
<Badge variant="error">Đã hủy</Badge>

// Membership Badge
<MembershipBadge type="gold">Vàng</MembershipBadge>

// Payment Badge
<PaymentBadge status="paid">Đã thanh toán</PaymentBadge>
<PaymentBadge status="pending">Chờ thanh toán</PaymentBadge>
<PaymentBadge status="partial">Còn nợ</PaymentBadge>
```

### 4.6. Modals

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Đặt sân mới"
  size="md"
>
  <BookingForm onSubmit={handleSubmit} />
</Modal>

// Confirmation Modal
<ConfirmModal
  isOpen={showConfirm}
  title="Xác nhận hủy đặt sân?"
  message="Bạn có chắc muốn hủy đặt sân này?"
  confirmText="Hủy đặt sân"
  cancelText="Quay lại"
  variant="destructive"
  onConfirm={handleCancel}
  onCancel={() => setShowConfirm(false)}
/>
```

### 4.7. Navigation

```tsx
// Sidebar
<Sidebar>
  <SidebarLogo />
  <SidebarNav>
    <NavItem icon={<Home />} label="Dashboard" href="/" />
    <NavItem icon={<Calendar />} label="Lịch đặt sân" href="/calendar" />
    <NavItem icon={<Users />} label="Khách hàng" href="/customers" />
    <NavItem icon={<Grid />} label="Quản lý sân" href="/courts" />
    <NavItem icon={<FileText />} label="Hóa đơn" href="/invoices" />
    <NavItem icon={<BarChart />} label="Báo cáo" href="/reports" />
  </SidebarNav>
  <SidebarFooter>
    <NavItem icon={<Settings />} label="Cài đặt" href="/settings" />
  </SidebarFooter>
</Sidebar>

// Header
<Header>
  <SearchInput placeholder="Tìm kiếm..." />
  <VenueSelector venues={venues} value={currentVenue} onChange={setVenue} />
  <NotificationBell count={3} />
  <UserMenu user={currentUser} />
</Header>
```

---

## 5. 📐 Responsive Guidelines

### 5.1. Breakpoints

| Name | Width | Target |
|------|-------|--------|
| `xs` | < 640px | Mobile |
| `sm` | 640px - 767px | Large mobile |
| `md` | 768px - 1023px | Tablet |
| `lg` | 1024px - 1279px | Small desktop |
| `xl` | 1280px - 1535px | Desktop |
| `2xl` | ≥ 1536px | Large desktop |

### 5.2. Layout Changes

#### Mobile (< 768px)
- Sidebar → Bottom navigation
- Multi-column → Single column
- Data tables → Card lists
- Split views → Stacked/tabs
- Calendar grid → Day list view

#### Tablet (768px - 1023px)
- Collapsible sidebar (icons only)
- 2-column layouts where appropriate
- Calendar shows 3-4 courts

#### Desktop (≥ 1024px)
- Full sidebar with labels
- Multi-column layouts
- Side panels for details
- Full calendar grid

### 5.3. Touch Targets

| Element | Min Size |
|---------|----------|
| Buttons | 44px × 44px |
| List items | 48px height |
| Icons (tappable) | 40px × 40px |
| Input fields | 48px height |

---

## 6. 🔄 Interaction Patterns

### 6.1. Booking Flow

```
1. Calendar View
   ↓ Click empty slot
2. Booking Modal Opens
   ↓ Search/select customer
   ↓ Confirm time & court
   ↓ View price calculation
   ↓ Add notes (optional)
   ↓ Click "Đặt sân"
3. Success Toast
   ↓ Calendar updates
4. Booking appears on calendar
```

### 6.2. Check-in Flow

```
1. Click booking on calendar
   ↓
2. Detail panel slides in
   ↓
3. Click "Check-in"
   ↓
4. Status updates to "In Progress"
   ↓ (After session ends)
5. Click "Check-out"
   ↓
6. Invoice modal opens
   ↓ Add services/products (optional)
   ↓ Process payment
7. Complete
```

### 6.3. Feedback & Loading States

| State | Visual |
|-------|--------|
| Loading | Skeleton placeholder |
| Empty | Illustration + message |
| Error | Red alert + retry button |
| Success | Green toast notification |
| Saving | Button spinner + disabled |

### 6.4. Animations

| Trigger | Animation | Duration |
|---------|-----------|----------|
| Page transition | Fade in | 200ms |
| Modal open | Scale up + fade | 200ms |
| Modal close | Scale down + fade | 150ms |
| Panel slide | Slide from right | 300ms |
| Toast appear | Slide up + fade | 200ms |
| Hover card | Subtle scale (1.02) | 150ms |
| Button click | Scale down (0.98) | 100ms |

---

## 7. ♿ Accessibility

### 7.1. Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate between focusable elements |
| `Enter` | Activate buttons, submit forms |
| `Escape` | Close modals, cancel actions |
| `Arrow keys` | Navigate within components |
| `Space` | Toggle checkboxes, open dropdowns |

### 7.2. Screen Reader

- All images have `alt` text
- Form inputs have associated `<label>`
- Buttons have descriptive text
- Status changes announced with `aria-live`
- Modal focus trapped within

### 7.3. Color Contrast

| Text Type | Contrast Ratio |
|-----------|----------------|
| Body text | ≥ 4.5:1 |
| Large text | ≥ 3:1 |
| UI components | ≥ 3:1 |

### 7.4. Focus States

All interactive elements must have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

---

## 📁 File Structure

```
docs/
├── design/
│   │
│   │── 📱 SCREEN MOCKUPS (10 files)
│   ├── 01_dashboard.png        # Dashboard overview
│   ├── 02_calendar.png         # Booking calendar
│   ├── 03_customers.png        # Customer management
│   ├── 04_courts.png           # Court management
│   ├── 05_invoices.png         # Invoice management
│   ├── 06_reports.png          # Reports & analytics
│   ├── 07_login.png            # Login page
│   ├── 08_mobile.png           # Mobile responsive
│   ├── 09_booking_detail.png   # Booking detail panel
│   ├── 10_venue_settings.png   # Venue settings
│   │
│   │── 🧩 COMPONENT LIBRARY (13 files)
│   ├── c01_buttons.png         # Button variants & states
│   ├── c02_inputs.png          # Form inputs & controls
│   ├── c03_cards_badges.png    # Cards & badge variants
│   ├── c04_datetime.png        # Date/time pickers
│   ├── c05_tables.png          # Data tables & pagination
│   ├── c06_modals.png          # Modals & dialogs
│   ├── c07_navigation.png      # Sidebar, header, tabs
│   ├── c08_feedback.png        # Loading, empty, error states
│   ├── c09_avatars_icons.png   # Avatars & icon library
│   ├── c10_charts.png          # Charts & data viz
│   ├── c11_calendar.png        # Calendar components
│   ├── c12_typography.png      # Typography scale
│   └── c13_colors.png          # Color palette
│
└── ui-design-guide.md
```

---

## 8. 🎨 Component Visual Reference

### 8.1. Buttons (`c01_buttons.png`)

![Buttons](design/c01_buttons.png)

Hiển thị tất cả button variants:
- **Primary**: Green background, white text
- **Secondary**: Outline style
- **Destructive**: Red for dangerous actions
- **Ghost**: Transparent background
- **Icon buttons**: Various sizes
- States: Default, Hover, Active, Disabled

---

### 8.2. Form Inputs (`c02_inputs.png`)

![Inputs](design/c02_inputs.png)

Các form controls:
- Text inputs với các states
- Search input với icon
- Textarea với character count
- Select/dropdown với options
- Checkbox, Radio, Toggle switch

---

### 8.3. Cards & Badges (`c03_cards_badges.png`)

![Cards & Badges](design/c03_cards_badges.png)

**Cards**:
- Basic card
- Stats card với trend
- Booking card
- Court card

**Badges**:
- Status: Success, Warning, Error, Info
- Membership: Bronze, Silver, Gold, Platinum
- Payment: Paid, Pending, Partial

---

### 8.4. Date & Time Pickers (`c04_datetime.png`)

![DateTime](design/c04_datetime.png)

- Date picker với calendar popup
- Date range picker
- Time picker với clock
- Combined date + time
- Mini calendar widget

---

### 8.5. Data Tables (`c05_tables.png`)

![Tables](design/c05_tables.png)

- Basic table layout
- Sortable columns
- Row states (hover, selected)
- Action buttons column
- Pagination component
- Empty state

---

### 8.6. Modals & Dialogs (`c06_modals.png`)

![Modals](design/c06_modals.png)

- Basic modal với header/footer
- Alert/Confirm dialog
- Form modal với validation
- Full-screen modal
- Toast notifications (4 variants)

---

### 8.7. Navigation (`c07_navigation.png`)

![Navigation](design/c07_navigation.png)

- Sidebar (expanded & collapsed)
- Header bar với actions
- Horizontal tabs
- Breadcrumbs
- Mobile bottom navigation

---

### 8.8. Feedback & Loading States (`c08_feedback.png`)

![Feedback](design/c08_feedback.png)

- Loading spinners (sizes)
- Skeleton loaders
- Progress bars (linear, circular)
- Empty states
- Error states với retry
- Success states
- Tooltips (4 directions)

---

### 8.9. Avatars & Icons (`c09_avatars_icons.png`)

![Avatars & Icons](design/c09_avatars_icons.png)

**Avatars**:
- Sizes: XS to XL (24px-64px)
- With image, initials
- Status indicators (online/offline/busy)
- Avatar groups

**Icons**:
- 20+ common UI icons (Lucide style)
- Icon button states

---

### 8.10. Charts & Data Viz (`c10_charts.png`)

![Charts](design/c10_charts.png)

- Line/Area charts
- Bar charts (vertical/horizontal)
- Pie/Donut charts
- Stats cards với KPIs
- Sparklines

---

### 8.11. Calendar Components (`c11_calendar.png`)

![Calendar](design/c11_calendar.png)

- Calendar header navigation
- Time slot column
- Booking block variations (5 statuses)
- Court column headers
- Empty slot states

---

### 8.12. Typography System (`c12_typography.png`)

![Typography](design/c12_typography.png)

- Heading scale: H1-H4
- Body text sizes
- Caption & Label
- Link, Muted, Error text styles
- Font: Inter

---

### 8.13. Color Palette (`c13_colors.png`)

![Colors](design/c13_colors.png)

- Primary colors (Sport Green scale)
- Background colors
- Text colors
- Semantic colors (Success, Warning, Error, Info)
- Border colors

---

## ✅ Design Checklist

- [x] Color palette defined (c13_colors.png)
- [x] Typography scale defined (c12_typography.png)
- [x] Spacing system defined
- [x] Border radius & shadows defined
- [x] Animation timing defined
- [x] **10 screen mockups** created
- [x] **13 component mockups** created
- [x] Button variants documented (c01_buttons.png)
- [x] Form inputs documented (c02_inputs.png)
- [x] Cards & badges documented (c03_cards_badges.png)
- [x] Date/time pickers documented (c04_datetime.png)
- [x] Data tables documented (c05_tables.png)
- [x] Modals & dialogs documented (c06_modals.png)
- [x] Navigation components documented (c07_navigation.png)
- [x] Feedback states documented (c08_feedback.png)
- [x] Avatars & icons documented (c09_avatars_icons.png)
- [x] Charts documented (c10_charts.png)
- [x] Calendar components documented (c11_calendar.png)
- [x] Responsive breakpoints defined
- [x] Interaction patterns documented
- [x] Accessibility guidelines included

**Total: 23 mockup files ready for development**

---

*UI Design Guide maintained by Design Team*
*Last updated: 2026-02-04*


# 📊 Data Model & Database Schema
# Hệ Thống Quản Lý Sân Cầu Lông

> **Version**: 1.0
> **Database**: PostgreSQL
> **ORM**: Prisma

---

## 1. 📐 Entity Relationship Diagram (ERD)

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CORE ENTITIES                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌─────────────┐     1:N     ┌─────────────┐     1:N     ┌─────────────┐                 │
│  │    User     │────────────>│   Venue     │────────────>│   Court     │                 │
│  │  (System)   │             │  (Cơ sở)    │             │   (Sân)     │                 │
│  └─────────────┘             └─────────────┘             └─────────────┘                 │
│        │                           │                           │                          │
│        │N                          │1                          │1                         │
│        │                           │                           │                          │
│        ▼                           ▼                           ▼                          │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐                 │
│  │ StaffAssign │             │ PriceRule   │             │  Booking    │                 │
│  │ment        │             │  (Giá)      │             │ (Đặt sân)   │                 │
│  └─────────────┘             └─────────────┘             └─────────────┘                 │
│                                                                │                          │
│                                                                │1                         │
│                                                                │                          │
│  ┌─────────────┐             ┌─────────────┐             ┌─────────────┐                 │
│  │  Customer   │<────────────│   Invoice   │<────────────│InvoiceItem  │                 │
│  │ (Khách)     │     N:1     │  (Hóa đơn)  │     1:N     │             │                 │
│  └─────────────┘             └─────────────┘             └─────────────┘                 │
│        │                                                                                  │
│        │1                                                                                 │
│        ▼                                                                                  │
│  ┌─────────────┐                                                                         │
│  │ Membership  │                                                                         │
│  │ (Hội viên)  │                                                                         │
│  └─────────────┘                                                                         │
│                                                                                           │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                 SECONDARY ENTITIES                                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                           │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐             │
│  │  Product    │     │  Service    │     │  Inventory  │     │PointHistory │             │
│  │ (Sản phẩm)  │     │ (Dịch vụ)   │     │   (Kho)     │     │ (Tích điểm) │             │
│  └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘             │
│                                                                                           │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 📋 Chi Tiết Bảng Dữ Liệu

### 2.1. User (Người dùng hệ thống)

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(20),
    avatar_url      VARCHAR(500),
    role            VARCHAR(20) NOT NULL DEFAULT 'staff',
    -- role: 'super_admin' | 'owner' | 'manager' | 'staff'
    is_active       BOOLEAN DEFAULT true,
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Roles:**
| Role | Quyền hạn |
|------|-----------|
| `super_admin` | Full access toàn hệ thống |
| `owner` | Quản lý các venue được sở hữu |
| `manager` | Quản lý 1 venue được phân công |
| `staff` | Thao tác cơ bản tại 1 venue |

---

### 2.2. Venue (Cơ sở sân)

```sql
CREATE TABLE venues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id        UUID REFERENCES users(id),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(100) UNIQUE,
    description     TEXT,
    address         VARCHAR(500),
    district        VARCHAR(100),
    city            VARCHAR(100) DEFAULT 'Hồ Chí Minh',
    phone           VARCHAR(20),
    email           VARCHAR(255),
    logo_url        VARCHAR(500),
    cover_image_url VARCHAR(500),
    
    -- Giờ hoạt động
    open_time       TIME DEFAULT '06:00',
    close_time      TIME DEFAULT '23:00',
    
    -- Cài đặt
    slot_duration   INT DEFAULT 60, -- Phút/slot (30, 60, 90, 120)
    min_advance_booking INT DEFAULT 0, -- Đặt trước tối thiểu (giờ)
    max_advance_booking INT DEFAULT 168, -- Đặt trước tối đa (giờ = 7 ngày)
    cancellation_hours INT DEFAULT 2, -- Hủy trước bao nhiêu giờ
    
    status          VARCHAR(20) DEFAULT 'active',
    -- status: 'active' | 'inactive' | 'maintenance'
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venues_owner ON venues(owner_id);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_venues_status ON venues(status);
```

---

### 2.3. Court (Sân)

```sql
CREATE TABLE courts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(20), -- A1, A2, B1...
    description     TEXT,
    court_type      VARCHAR(50) DEFAULT 'standard',
    -- court_type: 'standard' | 'vip' | 'training'
    surface_type    VARCHAR(50) DEFAULT 'synthetic',
    -- surface_type: 'synthetic' | 'wood' | 'rubber' | 'concrete'
    image_url       VARCHAR(500),
    sort_order      INT DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'active',
    -- status: 'active' | 'maintenance' | 'inactive'
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(venue_id, code)
);

CREATE INDEX idx_courts_venue ON courts(venue_id);
CREATE INDEX idx_courts_status ON courts(status);
```

---

### 2.4. PriceRule (Quy tắc giá)

```sql
CREATE TABLE price_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id) ON DELETE CASCADE,
    court_id        UUID REFERENCES courts(id) ON DELETE CASCADE, -- NULL = áp dụng toàn venue
    name            VARCHAR(100),
    
    -- Điều kiện áp dụng
    day_of_week     INT[], -- [1,2,3,4,5] = T2-T6, [6,0] = T7-CN
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    start_date      DATE, -- NULL = không giới hạn
    end_date        DATE, -- NULL = không giới hạn
    
    -- Giá
    price_per_slot  DECIMAL(10,0) NOT NULL, -- VND
    member_price    DECIMAL(10,0), -- Giá cho hội viên
    
    -- Ưu tiên (số lớn = ưu tiên cao)
    priority        INT DEFAULT 0,
    
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_price_rules_venue ON price_rules(venue_id);
CREATE INDEX idx_price_rules_court ON price_rules(court_id);
CREATE INDEX idx_price_rules_active ON price_rules(is_active);
```

**Ví dụ data:**
```json
[
  {"name": "Giờ sáng T2-T6", "day_of_week": [1,2,3,4,5], "start_time": "06:00", "end_time": "11:00", "price_per_slot": 80000},
  {"name": "Giờ tối T2-T6", "day_of_week": [1,2,3,4,5], "start_time": "18:00", "end_time": "23:00", "price_per_slot": 120000},
  {"name": "Cuối tuần", "day_of_week": [0,6], "start_time": "06:00", "end_time": "23:00", "price_per_slot": 150000}
]
```

---

### 2.5. Customer (Khách hàng)

```sql
CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(20) UNIQUE NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255),
    gender          VARCHAR(10), -- 'male' | 'female' | 'other'
    date_of_birth   DATE,
    address         TEXT,
    avatar_url      VARCHAR(500),
    
    -- Thống kê
    total_bookings  INT DEFAULT 0,
    total_spent     DECIMAL(12,0) DEFAULT 0,
    points_balance  INT DEFAULT 0,
    
    -- Đăng nhập (optional cho khách đặt online)
    password_hash   VARCHAR(255),
    is_verified     BOOLEAN DEFAULT false,
    
    notes           TEXT,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
```

---

### 2.6. MembershipPlan (Gói hội viên)

```sql
CREATE TABLE membership_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(20) UNIQUE, -- 'bronze', 'silver', 'gold', 'platinum'
    description     TEXT,
    
    duration_months INT NOT NULL, -- Thời hạn (tháng)
    price           DECIMAL(10,0) NOT NULL, -- Giá gói
    
    -- Ưu đãi
    discount_percent DECIMAL(5,2) DEFAULT 0, -- % giảm giá sân
    free_hours      INT DEFAULT 0, -- Số giờ free/tháng
    point_multiplier DECIMAL(3,2) DEFAULT 1.0, -- Hệ số tích điểm
    priority_booking BOOLEAN DEFAULT false, -- Ưu tiên đặt sân
    
    is_active       BOOLEAN DEFAULT true,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_membership_plans_venue ON membership_plans(venue_id);
```

---

### 2.7. CustomerMembership (Hội viên của khách)

```sql
CREATE TABLE customer_memberships (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID REFERENCES customers(id) ON DELETE CASCADE,
    plan_id         UUID REFERENCES membership_plans(id),
    venue_id        UUID REFERENCES venues(id),
    
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    
    -- Sử dụng trong kỳ
    free_hours_used INT DEFAULT 0,
    
    status          VARCHAR(20) DEFAULT 'active',
    -- status: 'active' | 'expired' | 'cancelled'
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customer_memberships_customer ON customer_memberships(customer_id);
CREATE INDEX idx_customer_memberships_venue ON customer_memberships(venue_id);
CREATE INDEX idx_customer_memberships_status ON customer_memberships(status);
```

---

### 2.8. Booking (Đặt sân)

```sql
CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id),
    court_id        UUID REFERENCES courts(id) ON DELETE CASCADE,
    customer_id     UUID REFERENCES customers(id),
    created_by      UUID REFERENCES users(id), -- Staff tạo
    
    -- Thời gian
    booking_date    DATE NOT NULL,
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    
    -- Loại đặt
    booking_type    VARCHAR(20) DEFAULT 'single',
    -- booking_type: 'single' | 'recurring' | 'group'
    recurring_id    UUID, -- Link to recurring series
    
    -- Thông tin khách (khi không có customer_id)
    customer_name   VARCHAR(100),
    customer_phone  VARCHAR(20),
    
    -- Giá & thanh toán
    base_price      DECIMAL(10,0) NOT NULL,
    discount_amount DECIMAL(10,0) DEFAULT 0,
    final_price     DECIMAL(10,0) NOT NULL,
    
    payment_status  VARCHAR(20) DEFAULT 'unpaid',
    -- payment_status: 'unpaid' | 'partial' | 'paid'
    payment_method  VARCHAR(20),
    -- payment_method: 'cash' | 'bank_transfer' | 'momo' | 'vnpay' | 'card'
    paid_amount     DECIMAL(10,0) DEFAULT 0,
    
    -- Trạng thái
    status          VARCHAR(20) DEFAULT 'pending',
    -- status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
    
    notes           TEXT,
    cancelled_at    TIMESTAMP,
    cancelled_by    UUID REFERENCES users(id),
    cancel_reason   TEXT,
    
    check_in_at     TIMESTAMP,
    check_out_at    TIMESTAMP,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes cho query calendar
CREATE INDEX idx_bookings_court_date ON bookings(court_id, booking_date);
CREATE INDEX idx_bookings_venue_date ON bookings(venue_id, booking_date);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date_range ON bookings(booking_date, start_time, end_time);

-- Constraint: Không cho phép đặt chồng
-- (sẽ xử lý ở application layer để linh hoạt hơn)
```

---

### 2.9. RecurringBooking (Đặt cố định)

```sql
CREATE TABLE recurring_bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id),
    court_id        UUID REFERENCES courts(id),
    customer_id     UUID REFERENCES customers(id),
    created_by      UUID REFERENCES users(id),
    
    -- Pattern
    day_of_week     INT NOT NULL, -- 0-6 (CN-T7)
    start_time      TIME NOT NULL,
    end_time        TIME NOT NULL,
    
    -- Thời hạn
    start_date      DATE NOT NULL,
    end_date        DATE, -- NULL = vô thời hạn
    
    -- Giá thỏa thuận
    agreed_price    DECIMAL(10,0),
    
    status          VARCHAR(20) DEFAULT 'active',
    -- status: 'active' | 'paused' | 'cancelled'
    
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recurring_bookings_venue ON recurring_bookings(venue_id);
CREATE INDEX idx_recurring_bookings_court ON recurring_bookings(court_id);
CREATE INDEX idx_recurring_bookings_customer ON recurring_bookings(customer_id);
```

---

### 2.10. Service (Dịch vụ)

```sql
CREATE TABLE services (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    unit            VARCHAR(50), -- 'lượt', 'giờ', 'buổi'
    price           DECIMAL(10,0) NOT NULL,
    image_url       VARCHAR(500),
    is_active       BOOLEAN DEFAULT true,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_venue ON services(venue_id);
```

---

### 2.11. Product (Sản phẩm bán lẻ)

```sql
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id) ON DELETE CASCADE,
    sku             VARCHAR(50),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    category        VARCHAR(50), -- 'beverage', 'equipment', 'accessory'
    price           DECIMAL(10,0) NOT NULL,
    cost_price      DECIMAL(10,0), -- Giá vốn
    image_url       VARCHAR(500),
    
    -- Quản lý kho
    track_inventory BOOLEAN DEFAULT true,
    stock_quantity  INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    
    is_active       BOOLEAN DEFAULT true,
    sort_order      INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_venue ON products(venue_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
```

---

### 2.12. Invoice (Hóa đơn)

```sql
CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id),
    booking_id      UUID REFERENCES bookings(id),
    customer_id     UUID REFERENCES customers(id),
    created_by      UUID REFERENCES users(id),
    
    invoice_number  VARCHAR(50) UNIQUE,
    
    -- Tổng tiền
    subtotal        DECIMAL(12,0) NOT NULL,
    discount_amount DECIMAL(12,0) DEFAULT 0,
    tax_amount      DECIMAL(12,0) DEFAULT 0,
    total           DECIMAL(12,0) NOT NULL,
    
    -- Thanh toán
    paid_amount     DECIMAL(12,0) DEFAULT 0,
    payment_method  VARCHAR(20),
    payment_status  VARCHAR(20) DEFAULT 'unpaid',
    
    -- Điểm tích lũy
    points_earned   INT DEFAULT 0,
    points_used     INT DEFAULT 0,
    
    notes           TEXT,
    status          VARCHAR(20) DEFAULT 'draft',
    -- status: 'draft' | 'pending' | 'paid' | 'refunded' | 'cancelled'
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_venue ON invoices(venue_id);
CREATE INDEX idx_invoices_booking ON invoices(booking_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
```

---

### 2.13. InvoiceItem (Chi tiết hóa đơn)

```sql
CREATE TABLE invoice_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id      UUID REFERENCES invoices(id) ON DELETE CASCADE,
    
    item_type       VARCHAR(20) NOT NULL,
    -- item_type: 'court' | 'service' | 'product'
    item_id         UUID, -- Reference to court/service/product
    
    description     VARCHAR(255) NOT NULL,
    quantity        DECIMAL(10,2) NOT NULL,
    unit_price      DECIMAL(10,0) NOT NULL,
    discount        DECIMAL(10,0) DEFAULT 0,
    total           DECIMAL(10,0) NOT NULL,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
```

---

### 2.14. PointHistory (Lịch sử tích điểm)

```sql
CREATE TABLE point_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id     UUID REFERENCES customers(id) ON DELETE CASCADE,
    venue_id        UUID REFERENCES venues(id),
    invoice_id      UUID REFERENCES invoices(id),
    
    points          INT NOT NULL, -- + tích, - sử dụng
    balance_after   INT NOT NULL,
    type            VARCHAR(20) NOT NULL,
    -- type: 'earn' | 'redeem' | 'expire' | 'adjust'
    description     VARCHAR(255),
    
    expires_at      DATE, -- Ngày hết hạn điểm
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_point_history_customer ON point_history(customer_id);
CREATE INDEX idx_point_history_expires ON point_history(expires_at);
```

---

### 2.15. InventoryTransaction (Nhập xuất kho)

```sql
CREATE TABLE inventory_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id        UUID REFERENCES venues(id),
    product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
    created_by      UUID REFERENCES users(id),
    invoice_id      UUID REFERENCES invoices(id), -- Nếu là bán hàng
    
    type            VARCHAR(20) NOT NULL,
    -- type: 'in' | 'out' | 'adjust' | 'sale'
    quantity        INT NOT NULL, -- + nhập, - xuất
    quantity_before INT NOT NULL,
    quantity_after  INT NOT NULL,
    
    unit_cost       DECIMAL(10,0), -- Giá nhập (cho type='in')
    notes           TEXT,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_trans_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_trans_venue ON inventory_transactions(venue_id);
```

---

### 2.16. StaffAssignment (Phân công nhân viên)

```sql
CREATE TABLE staff_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_id        UUID REFERENCES venues(id) ON DELETE CASCADE,
    role            VARCHAR(20) DEFAULT 'staff',
    -- role: 'manager' | 'staff'
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, venue_id)
);

CREATE INDEX idx_staff_assignments_user ON staff_assignments(user_id);
CREATE INDEX idx_staff_assignments_venue ON staff_assignments(venue_id);
```

---

### 2.17. AuditLog (Nhật ký hệ thống)

```sql
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    venue_id        UUID,
    
    action          VARCHAR(50) NOT NULL,
    -- action: 'create' | 'update' | 'delete' | 'login' | 'logout' | etc.
    entity_type     VARCHAR(50),
    entity_id       UUID,
    
    old_values      JSONB,
    new_values      JSONB,
    
    ip_address      VARCHAR(50),
    user_agent      TEXT,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_venue ON audit_logs(venue_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

---

## 3. 🔗 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  fullName      String    @map("full_name")
  phone         String?
  avatarUrl     String?   @map("avatar_url")
  role          String    @default("staff")
  isActive      Boolean   @default(true) @map("is_active")
  lastLoginAt   DateTime? @map("last_login_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  ownedVenues       Venue[]            @relation("VenueOwner")
  staffAssignments  StaffAssignment[]
  createdBookings   Booking[]          @relation("BookingCreator")
  cancelledBookings Booking[]          @relation("BookingCanceller")
  createdInvoices   Invoice[]
  auditLogs         AuditLog[]

  @@map("users")
}

model Venue {
  id              String    @id @default(uuid())
  ownerId         String    @map("owner_id")
  name            String
  slug            String?   @unique
  description     String?
  address         String?
  district        String?
  city            String    @default("Hồ Chí Minh")
  phone           String?
  email           String?
  logoUrl         String?   @map("logo_url")
  coverImageUrl   String?   @map("cover_image_url")
  openTime        String    @default("06:00") @map("open_time")
  closeTime       String    @default("23:00") @map("close_time")
  slotDuration    Int       @default(60) @map("slot_duration")
  minAdvanceBooking Int     @default(0) @map("min_advance_booking")
  maxAdvanceBooking Int     @default(168) @map("max_advance_booking")
  cancellationHours Int     @default(2) @map("cancellation_hours")
  status          String    @default("active")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relations
  owner           User                @relation("VenueOwner", fields: [ownerId], references: [id])
  courts          Court[]
  priceRules      PriceRule[]
  bookings        Booking[]
  recurringBookings RecurringBooking[]
  services        Service[]
  products        Product[]
  membershipPlans MembershipPlan[]
  customerMemberships CustomerMembership[]
  invoices        Invoice[]
  staffAssignments StaffAssignment[]
  inventoryTransactions InventoryTransaction[]

  @@map("venues")
}

model Court {
  id          String    @id @default(uuid())
  venueId     String    @map("venue_id")
  name        String
  code        String?
  description String?
  courtType   String    @default("standard") @map("court_type")
  surfaceType String    @default("synthetic") @map("surface_type")
  imageUrl    String?   @map("image_url")
  sortOrder   Int       @default(0) @map("sort_order")
  status      String    @default("active")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  // Relations
  venue       Venue       @relation(fields: [venueId], references: [id], onDelete: Cascade)
  priceRules  PriceRule[]
  bookings    Booking[]
  recurringBookings RecurringBooking[]

  @@unique([venueId, code])
  @@map("courts")
}

model PriceRule {
  id           String    @id @default(uuid())
  venueId      String    @map("venue_id")
  courtId      String?   @map("court_id")
  name         String?
  dayOfWeek    Int[]     @map("day_of_week")
  startTime    String    @map("start_time")
  endTime      String    @map("end_time")
  startDate    DateTime? @map("start_date") @db.Date
  endDate      DateTime? @map("end_date") @db.Date
  pricePerSlot Decimal   @map("price_per_slot") @db.Decimal(10, 0)
  memberPrice  Decimal?  @map("member_price") @db.Decimal(10, 0)
  priority     Int       @default(0)
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // Relations
  venue        Venue     @relation(fields: [venueId], references: [id], onDelete: Cascade)
  court        Court?    @relation(fields: [courtId], references: [id], onDelete: Cascade)

  @@map("price_rules")
}

model Customer {
  id            String    @id @default(uuid())
  phone         String    @unique
  fullName      String    @map("full_name")
  email         String?
  gender        String?
  dateOfBirth   DateTime? @map("date_of_birth") @db.Date
  address       String?
  avatarUrl     String?   @map("avatar_url")
  totalBookings Int       @default(0) @map("total_bookings")
  totalSpent    Decimal   @default(0) @map("total_spent") @db.Decimal(12, 0)
  pointsBalance Int       @default(0) @map("points_balance")
  passwordHash  String?   @map("password_hash")
  isVerified    Boolean   @default(false) @map("is_verified")
  notes         String?
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  bookings       Booking[]
  recurringBookings RecurringBooking[]
  memberships    CustomerMembership[]
  invoices       Invoice[]
  pointHistory   PointHistory[]

  @@map("customers")
}

model MembershipPlan {
  id              String    @id @default(uuid())
  venueId         String    @map("venue_id")
  name            String
  code            String?   @unique
  description     String?
  durationMonths  Int       @map("duration_months")
  price           Decimal   @db.Decimal(10, 0)
  discountPercent Decimal   @default(0) @map("discount_percent") @db.Decimal(5, 2)
  freeHours       Int       @default(0) @map("free_hours")
  pointMultiplier Decimal   @default(1.0) @map("point_multiplier") @db.Decimal(3, 2)
  priorityBooking Boolean   @default(false) @map("priority_booking")
  isActive        Boolean   @default(true) @map("is_active")
  sortOrder       Int       @default(0) @map("sort_order")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relations
  venue           Venue     @relation(fields: [venueId], references: [id], onDelete: Cascade)
  customerMemberships CustomerMembership[]

  @@map("membership_plans")
}

model CustomerMembership {
  id            String    @id @default(uuid())
  customerId    String    @map("customer_id")
  planId        String    @map("plan_id")
  venueId       String    @map("venue_id")
  startDate     DateTime  @map("start_date") @db.Date
  endDate       DateTime  @map("end_date") @db.Date
  freeHoursUsed Int       @default(0) @map("free_hours_used")
  status        String    @default("active")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  customer      Customer        @relation(fields: [customerId], references: [id], onDelete: Cascade)
  plan          MembershipPlan  @relation(fields: [planId], references: [id])
  venue         Venue           @relation(fields: [venueId], references: [id])

  @@map("customer_memberships")
}

model Booking {
  id            String    @id @default(uuid())
  venueId       String    @map("venue_id")
  courtId       String    @map("court_id")
  customerId    String?   @map("customer_id")
  createdById   String?   @map("created_by")
  bookingDate   DateTime  @map("booking_date") @db.Date
  startTime     String    @map("start_time")
  endTime       String    @map("end_time")
  bookingType   String    @default("single") @map("booking_type")
  recurringId   String?   @map("recurring_id")
  customerName  String?   @map("customer_name")
  customerPhone String?   @map("customer_phone")
  basePrice     Decimal   @map("base_price") @db.Decimal(10, 0)
  discountAmount Decimal  @default(0) @map("discount_amount") @db.Decimal(10, 0)
  finalPrice    Decimal   @map("final_price") @db.Decimal(10, 0)
  paymentStatus String    @default("unpaid") @map("payment_status")
  paymentMethod String?   @map("payment_method")
  paidAmount    Decimal   @default(0) @map("paid_amount") @db.Decimal(10, 0)
  status        String    @default("pending")
  notes         String?
  cancelledAt   DateTime? @map("cancelled_at")
  cancelledById String?   @map("cancelled_by")
  cancelReason  String?   @map("cancel_reason")
  checkInAt     DateTime? @map("check_in_at")
  checkOutAt    DateTime? @map("check_out_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  venue         Venue     @relation(fields: [venueId], references: [id])
  court         Court     @relation(fields: [courtId], references: [id], onDelete: Cascade)
  customer      Customer? @relation(fields: [customerId], references: [id])
  createdBy     User?     @relation("BookingCreator", fields: [createdById], references: [id])
  cancelledBy   User?     @relation("BookingCanceller", fields: [cancelledById], references: [id])
  invoice       Invoice?

  @@index([courtId, bookingDate])
  @@index([venueId, bookingDate])
  @@map("bookings")
}

model RecurringBooking {
  id          String    @id @default(uuid())
  venueId     String    @map("venue_id")
  courtId     String    @map("court_id")
  customerId  String?   @map("customer_id")
  createdById String?   @map("created_by")
  dayOfWeek   Int       @map("day_of_week")
  startTime   String    @map("start_time")
  endTime     String    @map("end_time")
  startDate   DateTime  @map("start_date") @db.Date
  endDate     DateTime? @map("end_date") @db.Date
  agreedPrice Decimal?  @map("agreed_price") @db.Decimal(10, 0)
  status      String    @default("active")
  notes       String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  // Relations
  venue       Venue     @relation(fields: [venueId], references: [id])
  court       Court     @relation(fields: [courtId], references: [id])
  customer    Customer? @relation(fields: [customerId], references: [id])

  @@map("recurring_bookings")
}

model Service {
  id          String    @id @default(uuid())
  venueId     String    @map("venue_id")
  name        String
  description String?
  unit        String?
  price       Decimal   @db.Decimal(10, 0)
  imageUrl    String?   @map("image_url")
  isActive    Boolean   @default(true) @map("is_active")
  sortOrder   Int       @default(0) @map("sort_order")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  // Relations
  venue       Venue     @relation(fields: [venueId], references: [id], onDelete: Cascade)

  @@map("services")
}

model Product {
  id                String    @id @default(uuid())
  venueId           String    @map("venue_id")
  sku               String?
  name              String
  description       String?
  category          String?
  price             Decimal   @db.Decimal(10, 0)
  costPrice         Decimal?  @map("cost_price") @db.Decimal(10, 0)
  imageUrl          String?   @map("image_url")
  trackInventory    Boolean   @default(true) @map("track_inventory")
  stockQuantity     Int       @default(0) @map("stock_quantity")
  lowStockThreshold Int       @default(5) @map("low_stock_threshold")
  isActive          Boolean   @default(true) @map("is_active")
  sortOrder         Int       @default(0) @map("sort_order")
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  // Relations
  venue             Venue     @relation(fields: [venueId], references: [id], onDelete: Cascade)
  inventoryTransactions InventoryTransaction[]

  @@map("products")
}

model Invoice {
  id              String    @id @default(uuid())
  venueId         String    @map("venue_id")
  bookingId       String?   @unique @map("booking_id")
  customerId      String?   @map("customer_id")
  createdById     String?   @map("created_by")
  invoiceNumber   String?   @unique @map("invoice_number")
  subtotal        Decimal   @db.Decimal(12, 0)
  discountAmount  Decimal   @default(0) @map("discount_amount") @db.Decimal(12, 0)
  taxAmount       Decimal   @default(0) @map("tax_amount") @db.Decimal(12, 0)
  total           Decimal   @db.Decimal(12, 0)
  paidAmount      Decimal   @default(0) @map("paid_amount") @db.Decimal(12, 0)
  paymentMethod   String?   @map("payment_method")
  paymentStatus   String    @default("unpaid") @map("payment_status")
  pointsEarned    Int       @default(0) @map("points_earned")
  pointsUsed      Int       @default(0) @map("points_used")
  notes           String?
  status          String    @default("draft")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relations
  venue           Venue     @relation(fields: [venueId], references: [id])
  booking         Booking?  @relation(fields: [bookingId], references: [id])
  customer        Customer? @relation(fields: [customerId], references: [id])
  createdBy       User?     @relation(fields: [createdById], references: [id])
  items           InvoiceItem[]
  pointHistory    PointHistory[]

  @@map("invoices")
}

model InvoiceItem {
  id          String    @id @default(uuid())
  invoiceId   String    @map("invoice_id")
  itemType    String    @map("item_type")
  itemId      String?   @map("item_id")
  description String
  quantity    Decimal   @db.Decimal(10, 2)
  unitPrice   Decimal   @map("unit_price") @db.Decimal(10, 0)
  discount    Decimal   @default(0) @db.Decimal(10, 0)
  total       Decimal   @db.Decimal(10, 0)
  createdAt   DateTime  @default(now()) @map("created_at")

  // Relations
  invoice     Invoice   @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@map("invoice_items")
}

model PointHistory {
  id            String    @id @default(uuid())
  customerId    String    @map("customer_id")
  venueId       String?   @map("venue_id")
  invoiceId     String?   @map("invoice_id")
  points        Int
  balanceAfter  Int       @map("balance_after")
  type          String
  description   String?
  expiresAt     DateTime? @map("expires_at") @db.Date
  createdAt     DateTime  @default(now()) @map("created_at")

  // Relations
  customer      Customer  @relation(fields: [customerId], references: [id], onDelete: Cascade)
  invoice       Invoice?  @relation(fields: [invoiceId], references: [id])

  @@map("point_history")
}

model InventoryTransaction {
  id              String    @id @default(uuid())
  venueId         String    @map("venue_id")
  productId       String    @map("product_id")
  createdById     String?   @map("created_by")
  invoiceId       String?   @map("invoice_id")
  type            String
  quantity        Int
  quantityBefore  Int       @map("quantity_before")
  quantityAfter   Int       @map("quantity_after")
  unitCost        Decimal?  @map("unit_cost") @db.Decimal(10, 0)
  notes           String?
  createdAt       DateTime  @default(now()) @map("created_at")

  // Relations
  venue           Venue     @relation(fields: [venueId], references: [id])
  product         Product   @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("inventory_transactions")
}

model StaffAssignment {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  venueId   String    @map("venue_id")
  role      String    @default("staff")
  isActive  Boolean   @default(true) @map("is_active")
  createdAt DateTime  @default(now()) @map("created_at")

  // Relations
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  venue     Venue     @relation(fields: [venueId], references: [id], onDelete: Cascade)

  @@unique([userId, venueId])
  @@map("staff_assignments")
}

model AuditLog {
  id          String    @id @default(uuid())
  userId      String?   @map("user_id")
  venueId     String?   @map("venue_id")
  action      String
  entityType  String?   @map("entity_type")
  entityId    String?   @map("entity_id")
  oldValues   Json?     @map("old_values")
  newValues   Json?     @map("new_values")
  ipAddress   String?   @map("ip_address")
  userAgent   String?   @map("user_agent")
  createdAt   DateTime  @default(now()) @map("created_at")

  // Relations
  user        User?     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}
```

---

## 4. 🔑 Indexes & Performance

### Critical Indexes đã tạo:

| Table | Index | Purpose |
|-------|-------|---------|
| `bookings` | `(court_id, booking_date)` | Query calendar theo sân |
| `bookings` | `(venue_id, booking_date)` | Query calendar theo cơ sở |
| `bookings` | `(booking_date, start_time, end_time)` | Check conflict |
| `customers` | `(phone)` | Tìm khách theo SĐT |
| `price_rules` | `(venue_id, is_active)` | Lấy giá nhanh |
| `invoices` | `(venue_id, created_at)` | Báo cáo doanh thu |

---

## 5. 📈 Sample Data

Xem file `seed.sql` để có data mẫu cho development.

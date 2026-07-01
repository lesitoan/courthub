# 🔌 API Specifications
# Hệ Thống Quản Lý Sân Cầu Lông

> **Version**: 1.0
> **Base URL**: `/api/v1`
> **Authentication**: Bearer JWT Token

---

## 1. 🔐 Authentication

### 1.1. Login

```http
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "fullName": "Nguyễn Văn A",
      "role": "owner",
      "avatarUrl": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email hoặc mật khẩu không đúng"
  }
}
```

### 1.2. Register

```http
POST /api/v1/auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn B",
  "phone": "0901234567"
}
```

### 1.3. Refresh Token

```http
POST /api/v1/auth/refresh
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.4. Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer {accessToken}
```

### 1.5. Change Password

```http
PUT /api/v1/auth/password
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 2. 👤 Users

### 2.1. Get Current User

```http
GET /api/v1/users/me
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0901234567",
    "role": "owner",
    "avatarUrl": null,
    "isActive": true,
    "venues": [
      {
        "id": "venue-uuid",
        "name": "Sân Cầu Lông Phú Nhuận",
        "role": "owner"
      }
    ],
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

### 2.2. Update Profile

```http
PUT /api/v1/users/me
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "fullName": "Nguyễn Văn A Updated",
  "phone": "0909876543",
  "avatarUrl": "https://..."
}
```

### 2.3. List Staff (Admin)

```http
GET /api/v1/users?role=staff&venueId={venueId}
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| role | string | Filter by role |
| venueId | uuid | Filter by venue |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

---

## 3. 🏢 Venues

### 3.1. List Venues

```http
GET /api/v1/venues
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | active, inactive, maintenance |
| search | string | Search by name |
| page | number | Page number |
| limit | number | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Sân Cầu Lông Phú Nhuận",
        "slug": "san-cau-long-phu-nhuan",
        "address": "123 Nguyễn Văn Trỗi, P.12, Phú Nhuận",
        "phone": "0901234567",
        "logoUrl": null,
        "openTime": "06:00",
        "closeTime": "23:00",
        "status": "active",
        "courtCount": 8,
        "todayBookings": 15
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 3.2. Get Venue Details

```http
GET /api/v1/venues/{venueId}
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Sân Cầu Lông Phú Nhuận",
    "slug": "san-cau-long-phu-nhuan",
    "description": "Sân cầu lông chất lượng cao...",
    "address": "123 Nguyễn Văn Trỗi, P.12, Phú Nhuận",
    "district": "Phú Nhuận",
    "city": "Hồ Chí Minh",
    "phone": "0901234567",
    "email": "contact@sancaulong.com",
    "logoUrl": null,
    "coverImageUrl": null,
    "openTime": "06:00",
    "closeTime": "23:00",
    "slotDuration": 60,
    "minAdvanceBooking": 0,
    "maxAdvanceBooking": 168,
    "cancellationHours": 2,
    "status": "active",
    "courts": [
      {
        "id": "court-uuid",
        "name": "Sân A1",
        "code": "A1",
        "courtType": "standard",
        "status": "active"
      }
    ],
    "priceRules": [
      {
        "id": "rule-uuid",
        "name": "Giờ sáng T2-T6",
        "dayOfWeek": [1,2,3,4,5],
        "startTime": "06:00",
        "endTime": "11:00",
        "pricePerSlot": 80000
      }
    ],
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

### 3.3. Create Venue

```http
POST /api/v1/venues
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Sân Cầu Lông Quận 7",
  "address": "456 Nguyễn Thị Thập, Q.7",
  "district": "Quận 7",
  "phone": "0907654321",
  "openTime": "06:00",
  "closeTime": "22:00",
  "slotDuration": 60
}
```

### 3.4. Update Venue

```http
PUT /api/v1/venues/{venueId}
Authorization: Bearer {accessToken}
```

### 3.5. Delete Venue

```http
DELETE /api/v1/venues/{venueId}
Authorization: Bearer {accessToken}
```

---

## 4. 🏸 Courts

### 4.1. List Courts by Venue

```http
GET /api/v1/venues/{venueId}/courts
Authorization: Bearer {accessToken}
```

### 4.2. Get Court Details

```http
GET /api/v1/courts/{courtId}
Authorization: Bearer {accessToken}
```

### 4.3. Create Court

```http
POST /api/v1/venues/{venueId}/courts
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Sân A1",
  "code": "A1",
  "courtType": "standard",
  "surfaceType": "synthetic",
  "sortOrder": 1
}
```

### 4.4. Update Court

```http
PUT /api/v1/courts/{courtId}
Authorization: Bearer {accessToken}
```

### 4.5. Delete Court

```http
DELETE /api/v1/courts/{courtId}
Authorization: Bearer {accessToken}
```

---

## 5. 💰 Price Rules

### 5.1. List Price Rules

```http
GET /api/v1/venues/{venueId}/price-rules
Authorization: Bearer {accessToken}
```

### 5.2. Create Price Rule

```http
POST /api/v1/venues/{venueId}/price-rules
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Giờ cao điểm tối",
  "courtId": null,
  "dayOfWeek": [1,2,3,4,5],
  "startTime": "18:00",
  "endTime": "21:00",
  "pricePerSlot": 120000,
  "memberPrice": 100000,
  "priority": 10
}
```

### 5.3. Calculate Price

```http
POST /api/v1/venues/{venueId}/calculate-price
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "courtId": "court-uuid",
  "date": "2026-02-04",
  "startTime": "18:00",
  "endTime": "20:00",
  "customerId": "customer-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "slots": [
      {"startTime": "18:00", "endTime": "19:00", "price": 120000},
      {"startTime": "19:00", "endTime": "20:00", "price": 120000}
    ],
    "basePrice": 240000,
    "memberDiscount": 24000,
    "finalPrice": 216000
  }
}
```

---

## 6. 📅 Bookings

### 6.1. Get Calendar Data

```http
GET /api/v1/venues/{venueId}/calendar
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| date | string | Date (YYYY-MM-DD) |
| startDate | string | Start date for range |
| endDate | string | End date for range |
| courtId | uuid | Filter by court |

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-02-04",
    "courts": [
      {
        "id": "court-uuid",
        "name": "Sân A1",
        "code": "A1"
      }
    ],
    "bookings": [
      {
        "id": "booking-uuid",
        "courtId": "court-uuid",
        "startTime": "07:00",
        "endTime": "09:00",
        "customerName": "Nguyễn Văn A",
        "customerPhone": "0901234567",
        "status": "confirmed",
        "paymentStatus": "paid",
        "bookingType": "single"
      },
      {
        "id": "booking-uuid-2",
        "courtId": "court-uuid",
        "startTime": "18:00",
        "endTime": "20:00",
        "customerName": "Cố định - Team ABC",
        "status": "confirmed",
        "bookingType": "recurring"
      }
    ],
    "blockedSlots": [
      {
        "courtId": "court-uuid",
        "startTime": "12:00",
        "endTime": "13:00",
        "reason": "Nghỉ trưa"
      }
    ]
  }
}
```

### 6.2. List Bookings

```http
GET /api/v1/venues/{venueId}/bookings
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| date | string | Filter by date |
| startDate | string | Start date range |
| endDate | string | End date range |
| courtId | uuid | Filter by court |
| customerId | uuid | Filter by customer |
| status | string | pending, confirmed, completed, cancelled |
| paymentStatus | string | unpaid, partial, paid |
| page | number | Page number |
| limit | number | Items per page |

### 6.3. Get Booking Details

```http
GET /api/v1/bookings/{bookingId}
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "booking-uuid",
    "venue": {
      "id": "venue-uuid",
      "name": "Sân Cầu Lông Phú Nhuận"
    },
    "court": {
      "id": "court-uuid",
      "name": "Sân A1",
      "code": "A1"
    },
    "customer": {
      "id": "customer-uuid",
      "fullName": "Nguyễn Văn A",
      "phone": "0901234567",
      "membershipType": "gold"
    },
    "bookingDate": "2026-02-04",
    "startTime": "18:00",
    "endTime": "20:00",
    "bookingType": "single",
    "basePrice": 240000,
    "discountAmount": 24000,
    "finalPrice": 216000,
    "paymentStatus": "paid",
    "paymentMethod": "cash",
    "paidAmount": 216000,
    "status": "confirmed",
    "notes": null,
    "createdBy": {
      "id": "user-uuid",
      "fullName": "Staff A"
    },
    "createdAt": "2026-02-04T10:00:00Z",
    "checkInAt": null,
    "checkOutAt": null
  }
}
```

### 6.4. Create Booking

```http
POST /api/v1/venues/{venueId}/bookings
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "courtId": "court-uuid",
  "customerId": "customer-uuid",
  "bookingDate": "2026-02-04",
  "startTime": "18:00",
  "endTime": "20:00",
  "notes": "Ghi chú đặt sân"
}
```

**Or with customer info (new customer):**
```json
{
  "courtId": "court-uuid",
  "customerName": "Khách mới",
  "customerPhone": "0909999999",
  "bookingDate": "2026-02-04",
  "startTime": "18:00",
  "endTime": "20:00"
}
```

### 6.5. Update Booking

```http
PUT /api/v1/bookings/{bookingId}
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "courtId": "court-uuid",
  "startTime": "19:00",
  "endTime": "21:00",
  "notes": "Updated notes"
}
```

### 6.6. Update Booking Status

```http
PATCH /api/v1/bookings/{bookingId}/status
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "status": "cancelled",
  "reason": "Khách hủy"
}
```

### 6.7. Check-in Booking

```http
POST /api/v1/bookings/{bookingId}/check-in
Authorization: Bearer {accessToken}
```

### 6.8. Check-out Booking

```http
POST /api/v1/bookings/{bookingId}/check-out
Authorization: Bearer {accessToken}
```

### 6.9. Cancel Booking

```http
DELETE /api/v1/bookings/{bookingId}
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "reason": "Khách hàng yêu cầu hủy"
}
```

### 6.10. Check Availability

```http
POST /api/v1/venues/{venueId}/check-availability
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "courtId": "court-uuid",
  "date": "2026-02-04",
  "startTime": "18:00",
  "endTime": "20:00"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": true,
    "conflicts": []
  }
}
```

**Or if not available:**
```json
{
  "success": true,
  "data": {
    "available": false,
    "conflicts": [
      {
        "id": "booking-uuid",
        "startTime": "18:00",
        "endTime": "19:00",
        "customerName": "Đã có người đặt"
      }
    ]
  }
}
```

---

## 7. 🔄 Recurring Bookings

### 7.1. List Recurring Bookings

```http
GET /api/v1/venues/{venueId}/recurring-bookings
Authorization: Bearer {accessToken}
```

### 7.2. Create Recurring Booking

```http
POST /api/v1/venues/{venueId}/recurring-bookings
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "courtId": "court-uuid",
  "customerId": "customer-uuid",
  "dayOfWeek": 2,
  "startTime": "19:00",
  "endTime": "21:00",
  "startDate": "2026-02-01",
  "endDate": "2026-06-30",
  "agreedPrice": 100000,
  "notes": "Team cầu lông ABC - Cố định thứ 3"
}
```

### 7.3. Update Recurring Booking

```http
PUT /api/v1/recurring-bookings/{recurringId}
Authorization: Bearer {accessToken}
```

### 7.4. Cancel Recurring Booking

```http
DELETE /api/v1/recurring-bookings/{recurringId}
Authorization: Bearer {accessToken}
```

### 7.5. Skip Occurrence

```http
POST /api/v1/recurring-bookings/{recurringId}/skip
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "date": "2026-02-11",
  "reason": "Nghỉ lễ"
}
```

---

## 8. 👥 Customers

### 8.1. List Customers

```http
GET /api/v1/customers
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| search | string | Search by name, phone |
| membershipType | string | bronze, silver, gold, platinum |
| venueId | uuid | Filter by venue visited |
| sortBy | string | totalBookings, totalSpent, createdAt |
| sortOrder | string | asc, desc |
| page | number | Page number |
| limit | number | Items per page |

### 8.2. Get Customer Details

```http
GET /api/v1/customers/{customerId}
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "customer-uuid",
    "phone": "0901234567",
    "fullName": "Nguyễn Văn A",
    "email": "a@email.com",
    "gender": "male",
    "dateOfBirth": "1990-01-15",
    "address": null,
    "avatarUrl": null,
    "totalBookings": 25,
    "totalSpent": 4500000,
    "pointsBalance": 450,
    "membership": {
      "id": "membership-uuid",
      "planName": "Gold",
      "startDate": "2026-01-01",
      "endDate": "2026-06-30",
      "discountPercent": 15,
      "freeHoursRemaining": 2
    },
    "recentBookings": [
      {
        "id": "booking-uuid",
        "date": "2026-02-04",
        "venueName": "Sân Cầu Lông Phú Nhuận",
        "courtName": "Sân A1",
        "startTime": "18:00",
        "endTime": "20:00"
      }
    ],
    "notes": null,
    "createdAt": "2025-06-01T00:00:00Z"
  }
}
```

### 8.3. Search Customer by Phone

```http
GET /api/v1/customers/search?phone=0901234567
Authorization: Bearer {accessToken}
```

### 8.4. Create Customer

```http
POST /api/v1/customers
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "phone": "0909999999",
  "fullName": "Khách hàng mới",
  "email": "new@email.com",
  "gender": "male",
  "dateOfBirth": "1995-05-20",
  "notes": "Ghi chú"
}
```

### 8.5. Update Customer

```http
PUT /api/v1/customers/{customerId}
Authorization: Bearer {accessToken}
```

### 8.6. Get Customer Booking History

```http
GET /api/v1/customers/{customerId}/bookings
Authorization: Bearer {accessToken}
```

### 8.7. Get Customer Point History

```http
GET /api/v1/customers/{customerId}/points
Authorization: Bearer {accessToken}
```

---

## 9. 🏆 Memberships

### 9.1. List Membership Plans

```http
GET /api/v1/venues/{venueId}/membership-plans
Authorization: Bearer {accessToken}
```

### 9.2. Create Membership Plan

```http
POST /api/v1/venues/{venueId}/membership-plans
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Gold",
  "code": "gold",
  "durationMonths": 6,
  "price": 2000000,
  "discountPercent": 15,
  "freeHours": 2,
  "pointMultiplier": 1.5,
  "priorityBooking": true
}
```

### 9.3. Assign Membership to Customer

```http
POST /api/v1/customers/{customerId}/memberships
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "planId": "plan-uuid",
  "venueId": "venue-uuid",
  "startDate": "2026-02-01"
}
```

### 9.4. Cancel Membership

```http
DELETE /api/v1/customer-memberships/{membershipId}
Authorization: Bearer {accessToken}
```

---

## 10. 🛒 Services & Products

### 10.1. List Services

```http
GET /api/v1/venues/{venueId}/services
Authorization: Bearer {accessToken}
```

### 10.2. Create Service

```http
POST /api/v1/venues/{venueId}/services
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "name": "Thuê vợt cầu lông",
  "description": "Vợt Yonex chất lượng",
  "unit": "cây/buổi",
  "price": 30000
}
```

### 10.3. List Products

```http
GET /api/v1/venues/{venueId}/products
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| category | string | beverage, equipment, accessory |
| lowStock | boolean | Filter low stock items |

### 10.4. Create Product

```http
POST /api/v1/venues/{venueId}/products
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "sku": "WATER-001",
  "name": "Nước suối Aquafina",
  "category": "beverage",
  "price": 10000,
  "costPrice": 5000,
  "trackInventory": true,
  "stockQuantity": 100,
  "lowStockThreshold": 20
}
```

### 10.5. Update Stock

```http
POST /api/v1/products/{productId}/stock
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "type": "in",
  "quantity": 50,
  "unitCost": 5000,
  "notes": "Nhập hàng tháng 2"
}
```

---

## 11. 🧾 Invoices

### 11.1. List Invoices

```http
GET /api/v1/venues/{venueId}/invoices
Authorization: Bearer {accessToken}
```

### 11.2. Get Invoice Details

```http
GET /api/v1/invoices/{invoiceId}
Authorization: Bearer {accessToken}
```

### 11.3. Create Invoice

```http
POST /api/v1/venues/{venueId}/invoices
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "bookingId": "booking-uuid",
  "customerId": "customer-uuid",
  "items": [
    {
      "itemType": "court",
      "itemId": "court-uuid",
      "description": "Sân A1: 18:00-20:00",
      "quantity": 2,
      "unitPrice": 120000
    },
    {
      "itemType": "service",
      "itemId": "service-uuid",
      "description": "Thuê vợt",
      "quantity": 2,
      "unitPrice": 30000
    },
    {
      "itemType": "product",
      "itemId": "product-uuid",
      "description": "Nước suối",
      "quantity": 4,
      "unitPrice": 10000
    }
  ],
  "discountAmount": 30000,
  "pointsUsed": 50,
  "notes": "Khách VIP"
}
```

### 11.4. Process Payment

```http
POST /api/v1/invoices/{invoiceId}/payment
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "amount": 300000,
  "paymentMethod": "cash"
}
```

### 11.5. Refund Invoice

```http
POST /api/v1/invoices/{invoiceId}/refund
Authorization: Bearer {accessToken}
```

---

## 12. 📊 Reports

### 12.1. Revenue Report

```http
GET /api/v1/reports/revenue
Authorization: Bearer {accessToken}
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| venueId | uuid | Filter by venue |
| startDate | string | Start date |
| endDate | string | End date |
| groupBy | string | day, week, month |

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 45000000,
      "courtRevenue": 35000000,
      "serviceRevenue": 5000000,
      "productRevenue": 5000000,
      "growth": 12.5
    },
    "breakdown": [
      {"date": "2026-02-01", "revenue": 1500000},
      {"date": "2026-02-02", "revenue": 1800000},
      {"date": "2026-02-03", "revenue": 2200000}
    ]
  }
}
```

### 12.2. Booking Report

```http
GET /api/v1/reports/bookings
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBookings": 250,
      "confirmedBookings": 230,
      "cancelledBookings": 15,
      "noShowBookings": 5,
      "occupancyRate": 75.5
    },
    "peakHours": [
      {"hour": "18:00", "bookings": 45},
      {"hour": "19:00", "bookings": 52},
      {"hour": "20:00", "bookings": 48}
    ],
    "byDayOfWeek": [
      {"day": "Monday", "bookings": 30},
      {"day": "Tuesday", "bookings": 35}
    ]
  }
}
```

### 12.3. Customer Report

```http
GET /api/v1/reports/customers
Authorization: Bearer {accessToken}
```

### 12.4. Inventory Report

```http
GET /api/v1/reports/inventory
Authorization: Bearer {accessToken}
```

---

## 13. 🔔 Real-time Events (Socket.io)

### 13.1. Connection

```javascript
const socket = io('wss://api.example.com', {
  auth: {
    token: 'Bearer ' + accessToken
  },
  query: {
    venueId: 'venue-uuid'
  }
});
```

### 13.2. Events

**Server → Client:**

| Event | Payload | Description |
|-------|---------|-------------|
| `booking:created` | Booking object | New booking created |
| `booking:updated` | Booking object | Booking updated |
| `booking:cancelled` | { bookingId, reason } | Booking cancelled |
| `booking:checkedIn` | { bookingId, time } | Customer checked in |
| `booking:checkedOut` | { bookingId, time } | Customer checked out |

**Client → Server:**

| Event | Payload | Description |
|-------|---------|-------------|
| `join:venue` | { venueId } | Join venue room |
| `leave:venue` | { venueId } | Leave venue room |

---

## 14. 📋 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email/password sai |
| `TOKEN_EXPIRED` | 401 | Token hết hạn |
| `UNAUTHORIZED` | 403 | Không có quyền |
| `NOT_FOUND` | 404 | Không tìm thấy |
| `VALIDATION_ERROR` | 400 | Dữ liệu không hợp lệ |
| `BOOKING_CONFLICT` | 409 | Trùng lịch đặt |
| `COURT_UNAVAILABLE` | 409 | Sân không khả dụng |
| `INSUFFICIENT_POINTS` | 400 | Không đủ điểm |
| `MEMBERSHIP_EXPIRED` | 400 | Hội viên hết hạn |
| `SERVER_ERROR` | 500 | Lỗi server |

---

## 15. 📝 Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-02-04T14:43:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "meta": {
    "timestamp": "2026-02-04T14:43:00Z"
  }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

*API Documentation maintained by Backend Team*
*Last updated: 2026-02-04*

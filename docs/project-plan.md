# 📋 Project Plan
# Hệ Thống Quản Lý Sân Cầu Lông

> **Version**: 1.0
> **Created**: 2026-02-04
> **Estimated Duration**: 6-8 tuần

---

## 1. 🎯 Project Overview

### 1.1. Mục Tiêu
Xây dựng hệ thống web quản lý nhiều sân cầu lông với các tính năng:
- Quản lý đặt sân theo thời gian thực
- Quản lý khách hàng và hội viên
- Quản lý doanh thu và thanh toán
- Báo cáo thống kê
- Deploy bằng Docker lên Linux

### 1.2. Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **UI Components** | Tailwind CSS + shadcn/ui |
| **State Management** | TanStack Query + Zustand |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT + Refresh Token |
| **Realtime** | Socket.io |
| **Deploy** | Docker + Docker Compose |

---

## 2. 📅 Development Phases

### Phase 0: Foundation (3 ngày)

```
Ngày 1-3: Setup cơ bản
├── Day 1: Project Structure
│   ├── Create mono-repo structure
│   ├── Setup backend (Express + TypeScript)
│   ├── Setup frontend (Vite + React + TypeScript)
│   └── Setup Docker Compose
├── Day 2: Database & Auth
│   ├── Prisma schema
│   ├── Database migrations
│   ├── JWT authentication
│   └── User CRUD
└── Day 3: Core UI
    ├── Tailwind + shadcn/ui setup
    ├── Design system (colors, typography)
    ├── Layout components (Sidebar, Header)
    └── Base pages (Login, Dashboard shell)
```

### Phase 1: Core MVP (2 tuần)

```
Week 1: Venue & Court Management
├── Day 1-2: Venue CRUD
│   ├── API endpoints
│   ├── Admin UI pages
│   └── Form validation
├── Day 3-4: Court CRUD
│   ├── API endpoints
│   ├── Court list/detail pages
│   └── Price rules management
└── Day 5: Dashboard
    ├── Stats cards
    ├── Quick actions
    └── Recent bookings

Week 2: Booking System
├── Day 1-2: Booking Calendar
│   ├── Calendar component (day/week view)
│   ├── Booking API endpoints
│   └── Check availability logic
├── Day 3-4: Booking CRUD
│   ├── Create booking modal
│   ├── Edit/cancel booking
│   ├── Status management
│   └── Conflict detection
└── Day 5: Customer Basic
    ├── Customer CRUD API
    ├── Customer search
    └── Link booking to customer
```

### Phase 2: Enhanced Features (2 tuần)

```
Week 3: Advanced Booking & Pricing
├── Day 1-2: Dynamic Pricing
│   ├── Price rule engine
│   ├── Peak/off-peak pricing
│   └── Member pricing
├── Day 3-4: Recurring Bookings
│   ├── Recurring booking API
│   ├── Auto-generate bookings
│   └── Skip/modify occurrences
└── Day 5: Realtime Updates
    ├── Socket.io integration
    └── Live calendar updates

Week 4: Payment & Invoicing
├── Day 1-2: Invoice System
│   ├── Invoice CRUD API
│   ├── Invoice generation
│   └── Print invoice
├── Day 3-4: Payment Processing
│   ├── Payment recording
│   ├── Partial payments
│   └── Refunds
└── Day 5: Reports
    ├── Revenue reports
    ├── Booking reports
    └── Export to Excel
```

### Phase 3: Full Features (2 tuần)

```
Week 5: Membership & Points
├── Day 1-2: Membership Plans
│   ├── Plan CRUD
│   ├── Assign to customer
│   └── Discount calculation
├── Day 3-4: Points System
│   ├── Earn points
│   ├── Redeem points
│   └── Point history
└── Day 5: Services & Products
    ├── Service CRUD
    ├── Product CRUD
    └── Inventory management

Week 6: Customer Portal & Polish
├── Day 1-2: Customer Portal
│   ├── Public booking page
│   ├── Customer login
│   └── Booking history
├── Day 3-4: Notifications
│   ├── Email notifications
│   ├── In-app notifications
│   └── Booking reminders
└── Day 5: Polish
    ├── Dark mode
    ├── Mobile responsive
    └── Performance optimization
```

### Phase 4: Deployment (3 ngày)

```
Day 1: Docker Production
├── Dockerfile optimization
├── Docker Compose production
└── Environment variables

Day 2: Server Setup
├── Linux server setup
├── SSL/HTTPS (Let's Encrypt)
├── Nginx reverse proxy
└── Database backup

Day 3: Testing & Go-live
├── End-to-end testing
├── Performance testing
├── Documentation
└── Go-live
```

---

## 3. 📁 Project Structure

```
court-booking-system/
├── 📁 docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── 📁 backend/
│   ├── 📁 prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   └── env.ts
│   │   ├── 📁 middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   └── rateLimiter.middleware.ts
│   │   ├── 📁 modules/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.dto.ts
│   │   │   ├── 📁 users/
│   │   │   ├── 📁 venues/
│   │   │   ├── 📁 courts/
│   │   │   ├── 📁 bookings/
│   │   │   ├── 📁 customers/
│   │   │   ├── 📁 invoices/
│   │   │   └── 📁 reports/
│   │   ├── 📁 shared/
│   │   │   ├── utils/
│   │   │   ├── types/
│   │   │   └── constants/
│   │   ├── 📁 socket/
│   │   │   └── booking.socket.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 frontend/
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   ├── 📁 components/
│   │   │   ├── 📁 ui/            # shadcn/ui components
│   │   │   ├── 📁 layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── AdminLayout.tsx
│   │   │   ├── 📁 booking/
│   │   │   │   ├── BookingCalendar.tsx
│   │   │   │   ├── BookingModal.tsx
│   │   │   │   └── BookingCard.tsx
│   │   │   ├── 📁 customer/
│   │   │   └── 📁 common/
│   │   ├── 📁 pages/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── 📁 dashboard/
│   │   │   │   └── Dashboard.tsx
│   │   │   ├── 📁 venues/
│   │   │   │   ├── VenueList.tsx
│   │   │   │   └── VenueDetail.tsx
│   │   │   ├── 📁 courts/
│   │   │   ├── 📁 bookings/
│   │   │   ├── 📁 customers/
│   │   │   ├── 📁 invoices/
│   │   │   ├── 📁 reports/
│   │   │   └── 📁 settings/
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   │   └── useBookings.ts
│   │   ├── 📁 services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── venue.service.ts
│   │   │   └── booking.service.ts
│   │   ├── 📁 stores/
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   ├── 📁 lib/
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   ├── 📁 types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── 📁 docs/
│   ├── prd.md
│   ├── data-model.md
│   ├── ui-specs.md
│   ├── api-specs.md
│   └── project-plan.md
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 4. 🔧 Docker Configuration

### 4.1. Development (docker-compose.yml)

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend.dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:5000/api/v1
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile.backend.dev
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/court_booking
      - JWT_SECRET=your-secret-key
      - JWT_EXPIRES_IN=1h
      - REFRESH_TOKEN_EXPIRES_IN=7d
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=court_booking

volumes:
  postgres_data:
```

### 4.2. Production (docker-compose.prod.yml)

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - frontend_build:/usr/share/nginx/html
    depends_on:
      - frontend
      - backend

  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend.prod
    volumes:
      - frontend_build:/app/dist
    environment:
      - VITE_API_URL=/api/v1

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile.backend.prod
    expose:
      - "5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    restart: unless-stopped

volumes:
  postgres_data:
  frontend_build:
```

---

## 5. 🚀 Deployment Guide

### 5.1. Prerequisites

- Linux Server (Ubuntu 22.04 recommended)
- Docker & Docker Compose installed
- Domain name (optional, for HTTPS)

### 5.2. Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/your-org/court-booking-system.git
cd court-booking-system

# 2. Create .env file
cp .env.example .env
nano .env  # Edit with production values

# 3. Build and start
docker-compose -f docker/docker-compose.prod.yml up -d --build

# 4. Run migrations
docker-compose exec backend npx prisma migrate deploy

# 5. Seed initial data (optional)
docker-compose exec backend npx prisma db seed

# 6. View logs
docker-compose logs -f
```

### 5.3. SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to nginx folder
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./nginx/ssl/
```

---

## 6. ✅ Definition of Done

### Feature Checklist

- [ ] API endpoint implemented & tested
- [ ] Frontend page/component complete
- [ ] Form validation working
- [ ] Error handling implemented
- [ ] Loading states shown
- [ ] Responsive on mobile
- [ ] API documented

### Phase Completion Criteria

| Phase | Criteria |
|-------|----------|
| Phase 0 | Project runs locally with Docker |
| Phase 1 | Can create venue, court, and book |
| Phase 2 | Recurring booking & invoicing works |
| Phase 3 | Membership & customer portal live |
| Phase 4 | Deployed to production server |

---

## 7. 📊 Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Calendar complexity | High | Use proven library (FullCalendar) |
| Real-time sync issues | Medium | Optimistic UI + conflict detection |
| Performance with many bookings | Medium | Pagination + proper indexes |
| Mobile UX | Medium | Mobile-first design approach |
| Docker deployment issues | Low | Test on staging first |

---

## 8. 👥 Team Allocation (if applicable)

| Role | Responsibilities |
|------|------------------|
| **Full-stack Dev** | Backend + Frontend |
| **UI/UX** | Design system, Figma (if separate) |
| **DevOps** | Docker, CI/CD, Server |

For solo developer: Follow phase-by-phase, completing each before moving on.

---

## 9. 📚 Resources & References

### Libraries

| Purpose | Library |
|---------|---------|
| Calendar | FullCalendar or react-big-calendar |
| Date handling | date-fns |
| Forms | react-hook-form + zod |
| Data fetching | TanStack Query |
| Icons | Lucide React |
| Charts | Recharts |
| PDF/Print | react-to-print |
| Export | xlsx (SheetJS) |

### Documentation Links

- [React docs](https://react.dev)
- [Prisma docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query)
- [Socket.io](https://socket.io/docs)
- [Docker Compose](https://docs.docker.com/compose)

---

*Project Plan maintained by Tech Lead*
*Last updated: 2026-02-04*

# 📋 Task Queue
# Hệ Thống Quản Lý Sân Cầu Lông

> **Last Updated**: 2026-02-04T16:15:00+07:00
> **Current Phase**: Phase 1 - Core MVP
> **Active Task**: P1-05 Venue CRUD API

---

## 📊 Progress Overview

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 0: Foundation | ✅ Complete | 12/12 |
| Phase 1: Core MVP | 🔄 In Progress | 0/15 |
| Phase 2: Enhanced | ⏳ Waiting | 0/12 |
| Phase 3: Full Features | ⏳ Waiting | 0/10 |
| Phase 4: Deployment | ⏳ Waiting | 0/5 |

**Total Progress**: 12/54 tasks (22%)

---

## ✅ Phase 0: Foundation (COMPLETED)

### Day 1: Project Structure

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P0-01 | Khởi tạo mono-repo structure | ✅ DONE | P0 | apps/backend, apps/frontend, packages/shared |
| P0-02 | Setup Backend (Express + TypeScript) | ✅ DONE | P0 | Express, TypeScript, tsx watch |
| P0-03 | Setup Frontend (Vite + React + TypeScript) | ✅ DONE | P0 | Vite 5, React 18, TypeScript 5 |
| P0-04 | Setup Docker Compose (dev) | ✅ DONE | P0 | PostgreSQL, Redis configured |

### Day 2: Database & Auth

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P0-05 | Tạo Prisma schema đầy đủ | ✅ DONE | P0 | 17 tables implemented |
| P0-06 | Create seed data script | ✅ DONE | P0 | Admin, venues, courts, customers |
| P0-07 | Implement JWT Authentication | ✅ DONE | P0 | Login, register, refresh, logout |
| P0-08 | Auth middleware & routes | ✅ DONE | P0 | Protect routes, role-based access |

### Day 3: Core UI

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P0-09 | Setup Tailwind + Design System | ✅ DONE | P0 | Custom colors, animations |
| P0-10 | Tạo Layout components | ✅ DONE | P0 | AppLayout with Sidebar, Header |
| P0-11 | Login page UI | ✅ DONE | P0 | Form validation, demo accounts |
| P0-12 | Dashboard shell UI | ✅ DONE | P0 | Stats, bookings, quick actions |

---

## 🟡 Phase 1: Core MVP (2 weeks)

### Week 1: Venue & Court Management

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P1-05 | Venue CRUD API | TODO | P0 | Create, Read, Update, Delete |
| P1-06 | Venue List page | TODO | P0 | Table + search + pagination |
| P1-07 | Venue Detail page | TODO | P0 | View + edit form |
| P1-08 | Court CRUD API | TODO | P0 | Thuộc venue |
| P1-09 | Court management UI | TODO | P0 | List, add, edit, delete |
| P1-10 | Price Rules CRUD | TODO | P1 | Quản lý giá theo khung giờ |
| P1-11 | Dashboard với Stats | TODO | P1 | Revenue, bookings, courts |

### Week 2: Booking System

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P1-12 | Booking Calendar component | TODO | P0 | Day/Week view |
| P1-13 | Booking CRUD API | TODO | P0 | Create, update, cancel |
| P1-14 | Check availability logic | TODO | P0 | Conflict detection |
| P1-15 | Booking modal UI | TODO | P0 | Create/edit booking |
| P1-16 | Customer CRUD API | TODO | P0 | Basic customer management |
| P1-17 | Customer search UI | TODO | P0 | Search by phone, quick add |
| P1-18 | Link booking to customer | TODO | P0 | Associate booking with customer |
| P1-19 | Booking status management | TODO | P0 | Check-in, check-out, cancel |

---

## 🟢 Phase 2: Enhanced Features (2 weeks)

### Week 3: Advanced Booking & Pricing

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P2-01 | Price calculation engine | TODO | P1 | Apply rules, member pricing |
| P2-02 | Recurring Booking API | TODO | P1 | Create, skip, cancel series |
| P2-03 | Recurring Booking UI | TODO | P1 | Manage recurring patterns |
| P2-04 | Socket.io integration | TODO | P1 | Real-time calendar updates |
| P2-05 | Booking conflicts resolution | TODO | P1 | Handle edge cases |

### Week 4: Payment & Invoicing

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P2-06 | Invoice CRUD API | TODO | P1 | Create, view, print |
| P2-07 | Invoice generation UI | TODO | P1 | From booking |
| P2-08 | Payment recording | TODO | P1 | Cash, transfer, partial |
| P2-09 | Invoice print/PDF | TODO | P2 | Print-friendly layout |
| P2-10 | Revenue report API | TODO | P1 | By day/week/month |
| P2-11 | Booking report API | TODO | P1 | Occupancy, peak hours |
| P2-12 | Report dashboard UI | TODO | P1 | Charts, tables, export |

---

## 🔵 Phase 3: Full Features (2 weeks)

### Week 5: Membership & Points

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P3-01 | Membership Plan CRUD | TODO | P2 | Bronze, Silver, Gold, Platinum |
| P3-02 | Assign membership to customer | TODO | P2 | Start date, expiry |
| P3-03 | Membership discount calculation | TODO | P2 | Apply in booking |
| P3-04 | Points earn/redeem API | TODO | P2 | Point history |
| P3-05 | Service CRUD API | TODO | P2 | Thuê vợt, giày... |
| P3-06 | Product CRUD API | TODO | P2 | Nước, cầu... |
| P3-07 | Inventory management | TODO | P2 | Stock in/out |

### Week 6: Customer Portal & Polish

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P3-08 | Customer portal public page | TODO | P2 | View availability, book |
| P3-09 | Customer login/register | TODO | P2 | Separate from admin |
| P3-10 | Customer booking history | TODO | P2 | My bookings page |

---

## ⚫ Phase 4: Deployment (3 days)

| ID | Task | Status | Priority | Notes |
|----|------|--------|----------|-------|
| P4-01 | Docker production config | TODO | P0 | Dockerfile optimization |
| P4-02 | Nginx + SSL setup | TODO | P0 | Let's Encrypt |
| P4-03 | Linux server deployment | TODO | P0 | Ubuntu VPS |
| P4-04 | Database backup setup | TODO | P1 | Cron job |
| P4-05 | Go-live checklist | TODO | P0 | Final testing |

---

## 🎯 Current Sprint

**Sprint Goal**: Setup project foundation

**Tasks in Progress**: None

**Blockers**: None

---

## 📝 Task Status Legend

| Status | Meaning |
|--------|---------|
| TODO | Chưa bắt đầu |
| IN_PROGRESS | Đang làm |
| BLOCKED | Bị chặn, cần hỗ trợ |
| DONE | Hoàn thành |
| SKIPPED | Bỏ qua (có lý do) |

---

## 📌 Notes

### Dependencies
- P1-12 (Calendar) depends on P1-08 (Court CRUD)
- P1-15 (Booking modal) depends on P1-16 (Customer CRUD)
- P2-01 (Price engine) depends on P1-10 (Price Rules)
- P3-03 (Membership discount) depends on P3-01 (Membership Plan)

### Technical Decisions
- Sử dụng FullCalendar hoặc react-big-calendar cho calendar component
- Socket.io cho real-time updates
- Prisma cho database ORM
- TanStack Query cho data fetching

---

*Last synced: 2026-02-04T14:45:00+07:00*

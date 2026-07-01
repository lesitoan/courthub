# 🎯 Project Context
# Hệ Thống Quản Lý Sân Cầu Lông

> **Last Updated**: 2026-02-04T14:45:00+07:00
> **Phase**: Planning Complete → Ready to Implement

---

## 📋 Project Summary

**Tên dự án**: Hệ Thống Quản Lý Sân Cầu Lông

**Mục tiêu**: Xây dựng hệ thống web giúp chủ sân quản lý nhiều sân cầu lông, bao gồm đặt sân, khách hàng, thanh toán, và báo cáo. Hỗ trợ deploy bằng Docker lên Linux.

**Tech Stack**:
- Frontend: React 18 + TypeScript + Vite + Tailwind + shadcn/ui
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + Prisma ORM
- Realtime: Socket.io
- Deploy: Docker + Docker Compose

---

## 📊 Current Status

| Metric | Value |
|--------|-------|
| **Phase** | Phase 0 - Foundation |
| **Progress** | 0/50 tasks (0%) |
| **Active Task** | None - Awaiting approval |
| **Blockers** | None |

---

## 📁 Documentation

| Document | Purpose | Status |
|----------|---------|--------|
| [prd.md](docs/prd.md) | Product Requirements | ✅ Complete |
| [data-model.md](docs/data-model.md) | Database Schema | ✅ Complete |
| [ui-specs.md](docs/ui-specs.md) | UI/UX Specifications | ✅ Complete |
| [api-specs.md](docs/api-specs.md) | API Documentation | ✅ Complete |
| [project-plan.md](docs/project-plan.md) | Timeline & Structure | ✅ Complete |
| [uat.md](docs/uat.md) | User Acceptance Testing | ✅ Complete |
| [ui-design-guide.md](docs/ui-design-guide.md) | **UI Design + Mockups** | ✅ Complete |
| [task-queue.md](task-queue.md) | Task Management | ✅ Complete |

### 🎨 UI Mockups (10 screens)
Xem thư mục `docs/design/` với các mockup:
- Dashboard, Calendar, Customers, Courts
- Invoices, Reports, Login, Mobile
- Booking Detail, Venue Settings

---

## 🎯 Core Features (MVP)

### ✅ Planned
1. **Authentication**: Login, Register, JWT
2. **Venue Management**: Quản lý nhiều cơ sở sân
3. **Court Management**: Quản lý sân, giá theo khung giờ
4. **Booking System**: Đặt sân với calendar UI
5. **Customer Management**: Quản lý khách hàng
6. **Dashboard**: Thống kê doanh thu, đặt sân

### 📋 Enhanced (Phase 2-3)
- Đặt sân cố định (recurring)
- Hóa đơn và thanh toán
- Hội viên và tích điểm
- Dịch vụ/sản phẩm bán kèm
- Báo cáo nâng cao
- Customer portal

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                       NGINX (80/443)                       │
├────────────────────────────────────────────────────────────┤
│   Frontend (React)    │    Backend (Express)    │ Socket │
│        :3000          │         :5000           │ :5001  │
├────────────────────────────────────────────────────────────┤
│                     PostgreSQL :5432                       │
└────────────────────────────────────────────────────────────┘
```

---

## 📅 Timeline

| Phase | Duration | Target |
|-------|----------|--------|
| Phase 0: Foundation | 3 days | Project structure, auth |
| Phase 1: Core MVP | 2 weeks | Venue, Court, Booking |
| Phase 2: Enhanced | 2 weeks | Recurring, Invoice, Reports |
| Phase 3: Full | 2 weeks | Membership, Portal |
| Phase 4: Deploy | 3 days | Docker, Server setup |

**Estimated Total**: 6-8 weeks

---

## 🔄 Recent Changes

| Date | Change |
|------|--------|
| 2026-02-04 | ✅ Created PRD document |
| 2026-02-04 | ✅ Created Data Model (17 tables) |
| 2026-02-04 | ✅ Created UI/UX Specifications |
| 2026-02-04 | ✅ Created API Specifications |
| 2026-02-04 | ✅ Created Project Plan |
| 2026-02-04 | ✅ Created Task Queue (50 tasks) |

---

## 📝 Decisions Log

| Decision | Rationale | Date |
|----------|-----------|------|
| PostgreSQL over MySQL | Better JSON support, relationships | 2026-02-04 |
| Prisma ORM | Type-safe, migrations, great DX | 2026-02-04 |
| shadcn/ui | Customizable, modern, copy-paste | 2026-02-04 |
| Mono-repo | Simpler deployment, shared types | 2026-02-04 |
| Socket.io | Easy realtime, fallback support | 2026-02-04 |

---

## 🚀 Next Steps

1. **Approve Plan**: Review tài liệu, confirm approach
2. **Start Phase 0**: Setup project structure
3. **Implement Auth**: JWT authentication
4. **Build Core UI**: Layout, design system

---

## 💬 Notes for AI

- Khi restart session: Đọc file này để nắm context
- Xem `task-queue.md` để biết task tiếp theo
- Đọc docs trong `/docs/` khi cần chi tiết
- Follow workflow trong `workflow.md`

---

*Context file for Stateful Single-Agent Workflow*

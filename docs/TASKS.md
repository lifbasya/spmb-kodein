# Development Tasks

## Phase 1 - Setup

- Install:
  - tailwindcss
  - prisma
  - next-auth
  - zustand
  - zod
  - react-hook-form

---

## Phase 2 - Database

- Create models:
  - User
  - Applicant
  - Application
  - Document

- Add enums:
  - Role
  - ApplicationStatus
  - DocumentType

- Run migration
- Seed admin user

---

## Phase 3 - Auth

- Setup NextAuth
- Register API
- Login page
- Middleware protection

---

## Phase 4 - Application

- Create application API
- Update application
- Submit application

- Validation:
  - required fields
  - status check

---

## Phase 5 - Documents

- Upload API
- File validation
- Store metadata

---

## Phase 6 - Admin

- Applicant list API
- Detail API
- Verify API
- Decision API

---

## Phase 7 - Dashboard

- Stats API

---

## Phase 8 - UI

### Pages:
- Landing
- Register
- Login
- Dashboard
- Application
- Documents
- Status
- Admin

---

## Phase 9 - Business Rules

- Prevent invalid status transition
- Require documents before submit
- Lock after accepted

---

## Phase 10 - Testing

- Test full flow:
  - register → apply → upload → submit → verify → decide

---

## Phase 11 - Deployment

- Setup Vercel
- Setup PostgreSQL
- ENV config
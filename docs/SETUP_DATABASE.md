# Database Setup Guide

## Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 18+ installed

## Setup Steps

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spmb_kodein;

# Exit psql
\q
```

### 2. Configure Environment

Update `.env.local`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/spmb_kodein"
```

Replace `password` with your PostgreSQL password.

### 3. Run Migrations

```bash
npm run prisma:migrate
```

This will apply the initial migration and create all tables.

### 4. Seed Database (Optional)

```bash
npm run prisma:seed
```

This will create an admin user:
- Email: `admin@kodein.com`
- Password: `Admin123!`

⚠️ Change this password after first login!

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

## Database Schema

### Tables

- **User** - User accounts (STUDENT, ADMIN roles)
- **Applicant** - Student applicant information
- **Application** - Student application form (Draft → Submitted → Verified → Accepted/Rejected)
- **Document** - Uploaded documents (Family Card, Birth Certificate, Report Card, Photo)

### Relationships

```
User (1) ──── (1) Applicant
Applicant (1) ──── (1) Application
Application (1) ──── (M) Document
```

## Useful Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio (GUI)
npx prisma studio
```

## Status Transitions

Application follows strict status flow:

```
DRAFT 
  ↓
SUBMITTED 
  ↓
PENDING_VERIFICATION 
  ↓
VERIFIED 
  ├→ ACCEPTED
  └→ REJECTED
```

Invalid transitions are prevented at the API layer.

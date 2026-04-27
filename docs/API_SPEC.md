# API Specification (MVP)

## Base URL
/api

---

## Auth

### POST /api/auth/register
Request:
{
  "email": "string",
  "password": "string"
}

---

### POST /api/auth/login
Handled by NextAuth

---

## Application

### GET /api/application
Get current user application

---

### POST /api/application
Create or update application

---

### POST /api/application/submit
Submit application
→ status: DRAFT → SUBMITTED

---

## Documents

### POST /api/documents
Upload document

Request:
{
  "type": "FAMILY_CARD",
  "file": "file"
}

---

### GET /api/documents
Get all documents

---

## Admin

### GET /api/admin/applicants
Get all applicants

---

### GET /api/admin/applicants/:id
Get applicant detail

---

### PUT /api/admin/verify
→ status: SUBMITTED → VERIFIED

---

### PUT /api/admin/decision
→ status: VERIFIED → ACCEPTED / REJECTED

---

## Dashboard

### GET /api/dashboard

Response:
{
  "totalApplicants": 100,
  "pending": 20,
  "verified": 50,
  "accepted": 30
}
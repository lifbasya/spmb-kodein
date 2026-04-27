# 📄 SYSTEM_DESIGN.md — SPMB / PPDB System (MVP)

## 1. 🏗️ Architecture

This system uses a **fullstack Next.js architecture**:

* **Frontend**: React (Next.js App Router)
* **Backend**: API Routes (Next.js)
* **Database**: PostgreSQL (via Prisma ORM)
* **Authentication**: NextAuth (Auth.js)

---

## 2. 🔄 High-Level Flow

Client → API Route → Validation → Business Logic → Prisma → Database → Response → Client

---

## 3. 🧱 System Layers

### 3.1 UI Layer

* Built using React components
* Handles user interaction and form input
* Pages:

  * Landing Page
  * Registration
  * Dashboard
  * Application Form
  * Document Upload
  * Status Page

---

### 3.2 API Layer (`/app/api`)

Responsibilities:

* Handle HTTP requests
* Validate input (Zod)
* Authenticate & authorize users
* Execute business logic
* Interact with database via Prisma
* Return standardized response

---

### 3.3 Database Layer

* Managed using Prisma ORM
* PostgreSQL database
* Stores:

  * Users
  * Applicants
  * Applications
  * Documents
  * Status

---

## 4. 🧩 Key Modules

* **Auth Module**
* **Applicant Module**
* **Application Module**
* **Document Module**
* **Verification Module**

---

## 5. 🔄 Application Status Flow (Core Logic)

```text
Draft → Submitted → Pending Verification → Verified → Accepted / Rejected
```

### Description:

* **Draft**: User has not completed form
* **Submitted**: Form submitted by user
* **Pending Verification**: Waiting for admin review
* **Verified**: Data validated by admin
* **Accepted / Rejected**: Final decision

---

## 6. 🔐 Authentication & Authorization

* Using **NextAuth**
* Session-based authentication

### Roles:

* **Student**
* **Admin**

### Access Control:

* Protected routes using middleware
* Admin routes require role validation

---

## 7. 📂 File Storage (Document Handling)

### Storage Options:

* Local storage (MVP)
* Cloud storage (future: S3 / Supabase Storage)

### Stored Data:

* File path / URL
* File type
* File size
* Uploaded timestamp

### Validation:

* Allowed formats: JPG, PNG, PDF
* Max size: 2MB

---

## 8. 🧠 Business Logic

### Student:

* Register & login
* Fill application form
* Upload documents
* Submit application
* Track status

### Admin:

* View applicants
* Verify documents
* Approve / reject application
* Assign final status

---

## 9. 📡 API Design (High-Level)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Application

* `GET /api/application`
* `POST /api/application`
* `PUT /api/application`

### Documents

* `POST /api/documents`
* `GET /api/documents`

### Admin

* `GET /api/admin/applicants`
* `GET /api/admin/applicants/:id`
* `PUT /api/admin/verify`
* `PUT /api/admin/decision`

---

## 10. 📦 Database Design (High-Level)

Core Tables:

* `users`
* `applicants`
* `applications`
* `documents`

Relationships:

* One user → one applicant
* One applicant → one application
* One application → many documents

---

## 11. 🔄 State Management

* **Zustand** → UI state only
* Server state fetched via API (no over-engineering)

---

## 12. ⚠️ Error Handling

Standard API response:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

### HTTP Status Codes:

* 200 → Success
* 400 → Validation error
* 401 → Unauthorized
* 403 → Forbidden
* 500 → Server error

---

## 13. 📊 Logging (MVP)

* Console logging for:

  * Errors
  * File upload issues
  * Authentication failures

---

## 14. 🔒 Security

* Route protection via middleware
* Session validation on every API request
* Input validation (Zod)
* File validation (type & size)

---

## 15. 🚀 Deployment

* **Frontend & Backend**: Vercel
* **Database**: PostgreSQL (Supabase / Railway / Neon)

---

## 16. ⚡ Performance (MVP)

* Server-side rendering where needed
* Lazy load non-critical components
* Optimize image & file size

---

## 17. 📈 Scalability (Future Consideration)

* Move file storage to cloud (S3)
* Introduce queue for heavy tasks
* Separate backend service (if needed)
* Add caching layer (Redis)

---

## 18. 🧭 MVP Principles

* Keep system simple
* Avoid premature optimization
* Focus on:

  * Data collection
  * Verification flow
  * Stability

---

## 19. 🔥 Strategic Insight

In SPMB systems:

👉 The most critical part is NOT UI
👉 NOT even API

➡️ It is **Application Status Flow**

Because:

* It drives business logic
* It affects database design
* It defines user experience

---

## 20. 📌 Next Step

Recommended next step:

👉 **ERD (Database Design - Detailed)**

Because this will define:

* Tables
* Relations
* Constraints
* Prisma schema
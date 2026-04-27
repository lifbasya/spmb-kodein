# 📄 PRD.md — SPMB / PPDB System (MVP)

## 1. 🎯 Background

The current student admission process is still manual:

* Paper-based forms
* Physical document submission
* Manual verification
* Offline testing without centralized system

Impact:

* Inefficient process
* Risk of data loss
* Difficult to monitor and recap data

Solution:
Build a **web-based SPMB system (MVP)** that includes:

* Landing page (marketing)
* Online registration system
* Admin dashboard

---

## 2. 🎯 Product Goals

* Digitize student admission process
* Simplify registration for students and parents
* Centralize all applicant data
* Speed up verification process

---

## 3. 👥 Target Users

### 1. Students / Parents

* Access school information
* Register online
* Upload documents
* Track application status

### 2. School Admin

* Manage applicants data
* Verify documents
* Determine admission results

---

## 4. 📦 Scope (MVP)

### ✅ IN SCOPE

* Landing page
* Registration & login
* Application form
* Document upload
* Student dashboard
* Admin dashboard
* Data verification
* Application status tracking
* Data export

### ❌ OUT OF SCOPE (Next Phase)

* Online test (CBT)
* Online payment
* WhatsApp automation
* AI-based screening
* Multi-school (multi-tenant)

---

## 5. 🌐 Landing Page (Marketing Layer)

### 5.1 Purpose

* Attract prospective students and parents
* Provide school information
* Drive conversion to registration

---

### 5.2 Page Structure

#### 1. Hero Section

* School name
* Tagline
* CTA buttons:

  * Register Now
  * Login

---

#### 2. School Advantages

* 3–5 key strengths

---

#### 3. Programs / Majors

* List of available programs (if applicable)

---

#### 4. Registration Flow

1. Create account
2. Fill application form
3. Upload documents
4. Verification
5. Announcement

---

#### 5. Admission Schedule

* Opening date
* Deadline
* Announcement date

---

#### 6. Gallery

* School activities photos

---

#### 7. Contact & Location

* Address
* WhatsApp contact
* Map

---

#### 8. Final CTA Section

* “Register Now” button

---

### 5.3 Features

* Mobile responsive
* CTA links to:

  * `/register`
  * `/login`

---

## 6. 🔐 Authentication

### Roles:

* Student
* Admin

### Features:

* Register (email + password)
* Login
* Logout

---

## 7. 📝 Application Form

### Data Collected:

* Full name
* National Student ID (NISN)
* Place & date of birth
* Gender
* Address
* Previous school
* Parent information
* Phone number

### Features:

* Save as draft
* Final submission

---

## 8. 📂 Document Upload

### Required Documents:

* Family Card
* Birth Certificate
* Report Card / Diploma
* Photo

### Constraints:

* Format: JPG / PDF
* Max size: ~2MB

---

## 9. 📊 Student Dashboard

Displays:

* Status:

  * Draft
  * Pending verification
  * Accepted
  * Rejected
* Application completeness progress

---

## 10. 🧑‍💻 Admin Dashboard

### Features:

* Applicant list
* Search & filter
* View applicant details
* Document preview
* Verification:

  * Approve / Reject
* Final decision:

  * Accepted / Rejected

---

## 11. 📥 Data Export

* Format: Excel (.xlsx)
* Includes:

  * Student data
  * Status
  * Documents

---

## 12. 🔄 User Flow

### Student:

1. Open landing page
2. Click register
3. Create account
4. Fill application form
5. Upload documents
6. Submit
7. Check status

---

### Admin:

1. Login
2. View applicants
3. Verify data
4. Decide results

---

## 13. 🧱 Technical Requirements (High-Level)

### Backend:

* REST API
* JWT Authentication
* File upload handling

---

### Database (Core Tables):

* users
* students
* documents
* registrations

---

### Frontend:

* Responsive UI
* Step-by-step form

---

### Storage:

* Local or cloud storage (optional)

---

## 14. 📏 Success Metrics

* ≥ 80% of registrations completed online
* ≥ 50% faster verification process
* No data loss

---

## 15. ⚠️ Risks & Mitigation

| Risk           | Mitigation           |
| -------------- | -------------------- |
| Users confused | Simple UI + guidance |
| Upload failure | File validation      |
| Admin overload | Search & filtering   |

---

## 16. 🚀 Roadmap (Next Phase)

* Online test (CBT)
* WhatsApp notifications
* Payment gateway
* Automated ranking
* Multi-school support

---

## 17. 💡 MVP Principles

* Focus on core functionality
* Avoid over-engineering
* Prioritize:

  * Data collection
  * Verification
  * User simplicity

---

## 18. 🧭 Strategic Notes

* Landing page = marketing tool, not just information
* UX must be simple (parents are key users)
* System should be stable, not overly complex
# 📄 UI_COMPONENT_GUIDE.md — SPMB / PPDB System (MVP)

## 1. 🎯 Purpose

This document defines reusable UI components to ensure:

* Consistent design
* Faster development
* Better user experience

---

## 2. 🎨 Design Principles (MVP)

* Simple and clean (parent-friendly)
* Clear hierarchy (important info first)
* Minimal colors (avoid visual noise)
* Focus on CTA (Call-To-Action)
* Mobile-first design

---

## 3. 🎨 Design Tokens (Basic)

### Colors

* Primary: `#2563EB` (Blue)
* Success: `#16A34A` (Green)
* Danger: `#DC2626` (Red)
* Warning: `#F59E0B` (Yellow)
* Gray:

  * Light: `#F3F4F6`
  * Medium: `#9CA3AF`
  * Dark: `#374151`

---

### Typography

* Font: Sans-serif (Inter / system font)
* Heading:

  * H1: 24–32px
  * H2: 20–24px
* Body: 14–16px

---

### Spacing

* 4px scale (4 / 8 / 12 / 16 / 24 / 32)

---

## 4. 🧱 Core Components

---

### 4.1 Button

#### Variants:

* Primary
* Secondary
* Danger
* Outline

#### States:

* Default
* Hover
* Disabled
* Loading

#### Usage:

* Primary → main action (Submit, Register)
* Secondary → alternative action
* Danger → destructive action

---

### 4.2 Input Field

#### Types:

* Text
* Email
* Password
* Number

#### Features:

* Label
* Placeholder
* Validation message
* Error state

---

### 4.3 Select Dropdown

* Used for:

  * Gender
  * School origin
* Features:

  * Searchable (optional)
  * Validation state

---

### 4.4 File Upload

#### Features:

* Drag & drop (optional MVP)
* File preview
* File validation:

  * Type
  * Size

#### UI States:

* Empty
* Uploading
* Success
* Error

---

### 4.5 Card

Used for:

* Dashboard info
* Applicant preview

#### Structure:

* Title
* Content
* Optional action

---

### 4.6 Table

Used in:

* Admin dashboard (applicant list)

#### Features:

* Pagination
* Search
* Sorting (optional MVP)
* Row click

---

### 4.7 Badge (Status Indicator)

#### Variants:

* Draft (gray)
* Pending (yellow)
* Verified (blue)
* Accepted (green)
* Rejected (red)

---

### 4.8 Modal

Used for:

* Confirmation (Approve / Reject)
* Important alerts

---

### 4.9 Alert / Notification

#### Types:

* Success
* Error
* Warning
* Info

---

### 4.10 Progress Bar

Used in:

* Application completion

---

### 4.11 Stepper (IMPORTANT)

Used in:

* Multi-step application form

#### Steps:

1. Personal Data
2. Address
3. School
4. Parents

---

## 5. 📱 Page-Level Components

---

### 5.1 Navbar

#### Public:

* Logo
* Register
* Login

#### Authenticated:

* Dashboard
* Logout

---

### 5.2 Sidebar (Admin)

* Dashboard
* Applicants

---

### 5.3 Footer

* School info
* Contact
* Copyright

---

## 6. 🧑‍🎓 Student UI Components

* Application Form Layout
* Document Upload Section
* Status Card
* Progress Tracker

---

## 7. 🧑‍💻 Admin UI Components

* Applicant Table
* Applicant Detail Panel
* Verification Action Buttons
* Status Filter

---

## 8. 🔄 State Handling (UI Behavior)

### Loading State

* Show spinner / skeleton

### Empty State

* “No data available”

### Error State

* Clear error message

---

## 9. ⚠️ Validation Rules (UI Level)

* Required fields must be marked
* Show inline error messages
* Disable submit if invalid

---

## 10. 🎯 UX Guidelines

* Always show feedback after action
* Keep forms short per step
* Avoid too many fields in one view
* Use clear labels (parent-friendly language)

---

## 11. 🚀 MVP Component Priority

### Must Have:

* Button
* Input
* Form
* File Upload
* Table
* Badge
* Stepper

### Nice to Have:

* Modal
* Alert
* Progress bar

---

## 12. 💡 Developer Notes

* Make components reusable
* Keep props simple
* Avoid over-abstraction in MVP
* Use consistent naming

---

## 13. 🧭 Suggested Tech (Optional)

* TailwindCSS (fast styling)
* Component structure:

  * `/components/ui`
  * `/components/form`
  * `/components/admin`

---

## 14. 🔥 Strategic Insight

Most school systems fail not because of backend…

👉 but because UI is:

* confusing
* too complex
* not parent-friendly

So your advantage:
➡️ Keep it **simple, clear, guided**
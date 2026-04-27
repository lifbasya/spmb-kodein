# 📄 PROJECT_STRUCTURE.md — SPMB / PPDB System (MVP)

## 1. 🎯 Purpose

Define a clear and scalable project structure for:

* Maintainability
* Readability
* Team collaboration
* AI-assisted development

---

## 2. 🧱 Root Structure

```bash
/app
/components
/lib
/prisma
/store
/types
/hooks
/styles
/public
```

---

## 3. 📁 App Directory (Next.js App Router)

```bash
/app
  /(public)
    page.tsx              # Landing page
    /login
    /register

  /(student)
    /dashboard
    /application
    /documents
    /status

  /(admin)
    /admin
      /applicants
      /applicants/[id]

  /api
    /auth
    /application
    /documents
    /admin

  layout.tsx
  globals.css
```

---

## 4. 🧩 Components Structure

```bash
/components
  /ui            # reusable base components
    button.tsx
    input.tsx
    modal.tsx
    badge.tsx
    table.tsx

  /form          # form-specific components
    form-field.tsx
    file-upload.tsx
    stepper.tsx

  /student       # student-specific UI
    application-form.tsx
    status-card.tsx

  /admin         # admin-specific UI
    applicant-table.tsx
    applicant-detail.tsx
```

---

## 5. 🧠 Lib (Core Logic)

```bash
/lib
  /prisma.ts        # Prisma client
  /auth.ts          # NextAuth config
  /validators       # Zod schemas
    auth.schema.ts
    application.schema.ts
    document.schema.ts

  /services         # business logic layer
    application.service.ts
    document.service.ts
    admin.service.ts

  /utils
    format.ts
    helpers.ts
```

---

## 6. 🗄️ Prisma

```bash
/prisma
  schema.prisma
  seed.ts
```

---

## 7. 🧾 Types

```bash
/types
  user.ts
  application.ts
  document.ts
```

---

## 8. 🗃️ State Management

```bash
/store
  auth.store.ts
  ui.store.ts
```

---

## 9. 🪝 Hooks

```bash
/hooks
  useAuth.ts
  useApplication.ts
```

---

## 10. 🎨 Styles

```bash
/styles
  globals.css
```

---

## 11. 🌍 Public Assets

```bash
/public
  /images
  /icons
```

---

# 12. 🔐 API Route Structure

```bash
/app/api
  /auth
    route.ts

  /application
    route.ts
    /submit
      route.ts

  /documents
    route.ts

  /admin
    /applicants
      route.ts
    /applicants/[id]
      route.ts
    /verify
      route.ts
    /decision
      route.ts
```

---

# 13. 🧭 Naming Conventions

### Files

* kebab-case → `file-upload.tsx`
* camelCase → functions
* PascalCase → components

---

### Components

* `Button.tsx`
* `ApplicationForm.tsx`

---

### Services

* `application.service.ts`
* `admin.service.ts`

---

# 14. 🧱 Architecture Rules

### 1. Separation of Concerns

* UI → components
* Logic → services
* Validation → Zod
* DB → Prisma

---

### 2. Data Flow

UI → API → Service → Prisma → DB

---

### 3. DO NOT

❌ Put business logic in components
❌ Access database directly from UI
❌ Mix validation with UI

---

# 15. 🔄 Example Flow

### Submit Application

```bash
Form (component)
   ↓
API Route (/api/application/submit)
   ↓
Service (application.service.ts)
   ↓
Prisma (DB)
```

---

# 16. ⚠️ MVP Constraints

* Keep folder flat (avoid deep nesting)
* Avoid over-abstraction
* Build only what is needed

---

# 17. 🚀 Scalability Path

When system grows:

* Move services → separate backend
* Add `/modules` structure
* Introduce caching (Redis)
* Add background jobs
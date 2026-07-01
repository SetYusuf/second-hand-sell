# ARCHITECTURE DOCUMENTATION
## RUPP Secondhand Marketplace - Next.js Application

**Last Updated:** 2026-06-30  
**Framework:** Next.js 16.1.0 (App Router)  
**Runtime:** Node.js + TypeScript  
**Database:** MongoDB Atlas via Mongoose

---

## 1. Overview

This project is a marketplace application for buying and selling second-hand items such as phones, computers, books, electronics, and services. The UI is built with Next.js App Router and the backend uses route handlers under the app/api folder with MongoDB for persistence.

The current application structure mixes:
- auth pages and dashboards under route groups such as (auth), (dashboard), and (marketplace)
- legacy or duplicate UI folders such as app/user-intetface for older screens
- a shared data layer in lib for authentication, database access, and Mongoose models

---

## 2. Tech Stack

### Frontend
- Next.js 16.1.0
- React 19
- TypeScript
- CSS modules / global CSS / component-level styles
- Tailwind CSS via @tailwindcss/postcss and tailwindcss

### Backend
- Next.js Route Handlers
- JWT-based authentication
- Mongoose ODM for MongoDB
- MongoDB native driver helpers for direct collection access

### Data Layer
- MongoDB Atlas connection through lib/db.ts
- Shared model definitions in lib/models.ts
- Collections used by the app include users, products, chats, notifications, and images

---

## 3. Project Structure

```text
app/
  api/
    auth/
      login/
      me/
      register/
      forgot-password/
      reset-password/
    products/
    stats/
    uploads/
  (auth)/
    login/
    register/
    forgot-password/
  (dashboard)/
    admin/
    owner/
  (marketplace)/
    home/
    profile/
    sell/
    favorites/
    notifications/
    chat/
    [id]/
  user-intetface/
    ...legacy UI pages...
  globals.css
  layout.tsx
  page.tsx

components/
config/
data/
image/
lib/
  auth.ts
  db.ts
  models.ts
  validation.ts
  models/
mongo/
public/
  uploads/
```

---

## 4. Application Flow

### 4.1 Authentication Flow
1. A user signs in via the login page.
2. The API route at app/api/auth/login/route.ts validates credentials.
3. A JWT is generated with lib/auth.ts and returned to the client.
4. The token is stored in an httpOnly cookie named authToken.
5. Protected routes use the token for user identity and role checks.

### 4.2 Product Listing and Posting
1. The marketplace home page fetches products from app/api/products/route.ts.
2. The API supports search and category filters.
3. Authenticated users can create listings through POST /api/products.
4. Product data is stored in MongoDB using the Product Mongoose model.

### 4.3 Dashboard Experience
- Admin and owner dashboards are separated under route groups.
- Stats endpoints provide aggregated information for admin and owner views.
- Dashboard pages consume API data from app/api/stats and app/api/stats/owner.

---

## 5. Core Modules

### 5.1 app/layout.tsx
- Root layout for the whole app.
- Wraps global providers and global styles.

### 5.2 app/page.tsx
- Entry page for the application.
- Serves as a landing or redirect point depending on future routing decisions.

### 5.3 app/api/auth/*
- Handles login, registration, profile lookup, password reset workflows, and token-based authentication.

### 5.4 app/api/products/*
- Handles listing, creation, fetching by ID, and user-specific product management.

### 5.5 app/api/stats/*
- Provides statistics for admin and owner dashboards.

### 5.6 app/api/uploads/route.ts
- Accepts file uploads and stores them into public/uploads.

---

## 6. Data Layer

### 6.1 Database Connection
The main database connection logic is in lib/db.ts.

Responsibilities:
- load MongoDB environment variables from .env.local
- establish a cached Mongoose connection
- expose helpers such as connectDB and getDB

### 6.2 Models
The main Mongoose models are defined in lib/models.ts.

Current model families include:
- Product
- User
- Image
- Chat
- Notification

### 6.3 Collections
The application currently uses these MongoDB collections conceptually:
- users
- products
- images
- chats
- notifications

---

## 7. Authentication and Security

### JWT
The auth utilities in lib/auth.ts provide:
- signToken
- verifyToken
- getTokenFromRequest
- reset token helpers

### Token Storage
- JWTs are returned to the client and stored as an httpOnly cookie.
- Authenticated API routes verify incoming tokens before permitting access.

### Environment Variables
Expected values include:
- MONGODB_URL
- MONGODB_DB
- JWT_SECRET
- NEXT_PUBLIC_BASE_URL
- NODE_ENV

---

## 8. Frontend Organization

### Route Groups
- (auth): login, register, forgot password
- (dashboard): admin and owner dashboard sections
- (marketplace): buyer-facing marketplace pages

### Shared UI State
Global or shared client state is managed through context providers under app/contexts:
- ThemeContext.tsx
- LanguageContext.tsx

### Legacy/duplicate pages
The app/user-intetface folder contains older UI pages and should be reviewed for consolidation with the newer route-grouped marketplace structure.

---

## 9. Current Notes and Operational Considerations

- The project is using Next.js 16 with Turbopack.
- Tailwind resolution issues were caused by an incorrect inferred root when multiple lockfiles were present in parent folders.
- The project root is now explicitly configured in next.config.ts to avoid that resolution issue.
- The repository contains both package-lock.json and pnpm-lock.yaml; this may continue to cause workspace-root warnings unless one lockfile is removed or the config is kept explicit.

---

## 10. Recommended Next Improvements

1. Consolidate duplicated UI folders and standardize on one route structure.
2. Replace legacy pages under app/user-intetface with the newer route-grouped pages where possible.
3. Add API validation schemas and stronger route-level permissions.
4. Standardize error handling and response shapes across all API routes.
5. Add automated tests for auth, product creation, and stats endpoints.

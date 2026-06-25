# ARCHITECTURE DOCUMENTATION
## RUPP Secondhand Marketplace - Next.js Application

**Generated:** 2026-06-25  
**Last Updated:** 2026-06-25  
**Project Version:** 0.2.0  
**Framework:** Next.js 16.1.0 (App Router)

---

## 1. COMPLETE FILE TREE

```
second-hand-sell/
├── .gitignore
├── ARCHITECTURE.md
├── detailed-db-check.js
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── test-db.js
├── tsconfig.json
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── me/
│   │   │   │   └── route.ts
│   │   │   └── register/
│   │   │       └── route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── user/
│   │   │       └── route.ts
│   │   ├── stats/
│   │   │   ├── route.ts
│   │   │   └── owner/
│   │   │       └── route.ts
│   │   └── upload/
│   │       └── route.ts
│   ├── contexts/
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── dashboardadmin/
│   │   ├── layout.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── book/
│   │   │   └── page.tsx
│   │   ├── computer/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── owner/
│   │   │   └── page.tsx
│   │   ├── phone/
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   └── page.tsx
│   │   ├── service/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── user/
│   │       └── page.tsx
│   ├── dashboardowner/
│   │   ├── layout.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── book/
│   │   │   └── page.tsx
│   │   ├── computer/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── phone/
│   │   │   └── page.tsx
│   │   ├── product/
│   │   │   └── page.tsx
│   │   ├── service/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── demo/
│   │   (empty directory)
│   ├── forgot-password/
│   │   ├── page.tsx
│   │   └── forgot.css
│   ├── login/
│   │   ├── page.tsx
│   │   └── login.css
│   ├── register/
│   │   ├── page.tsx
│   │   └── register.css
│   └── user-intetface/
│       ├── buy-detail/
│       │   ├── bdetail.css
│       │   └── page.tsx
│       ├── chat/
│       │   ├── chat.css
│       │   └── page.tsx
│       ├── favorites/
│       │   └── page.tsx
│       ├── home/
│       │   ├── ChatDropdownEnhanced.tsx
│       │   ├── NotificationDropdownEnhanced.tsx
│       │   ├── home.css
│       │   ├── page.tsx
│       │   ├── script.ts
│       │   └── style.css
│       ├── inside-chat/
│       │   ├── ichat.css
│       │   └── page.tsx
│       ├── notification/
│       │   ├── notification.css
│       │   └── page.tsx
│       ├── post-book/
│       │   ├── page.tsx
│       │   └── pbook.css
│       ├── post-computer/
│       │   ├── page.tsx
│       │   └── pcomputer.css
│       ├── post-electronics/
│       │   ├── page.tsx
│       │   └── pelectronics.css
│       ├── post-phone/
│       │   ├── page.tsx
│       │   └── pphone.css
│       ├── post-service/
│       │   ├── page.tsx
│       │   └── pservice.css
│       └── profile/
│           ├── page.tsx
│           └── profile.css
├── components/
│   (empty directory)
├── config/
│   └── database.ts
├── data/
│   (empty directory)
├── image/
│   └── README/
│       (empty directory)
├── lib/
│   ├── auth.ts
│   ├── middleware.ts
│   ├── mongodb-atlas.ts
│   ├── mongodb-simple.ts
│   ├── mongodb.ts
│   ├── mongoose.ts
│   ├── test-mongoose.ts
│   └── models/
│       └── Post.ts
├── mongo/
│   └── mongo.env
└── public/
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    ├── window.svg
    ├── home/
    │   (image assets)
    ├── notification-image/
    │   (avatar images)
    └── uploads/
        (user uploaded images)
```

---

## 2. CONFIGURATION FILES

### 2.1 package.json
**Path:** `package.json`

**Purpose:** Project manifest and dependency management

**Scripts:**
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| @types/bcryptjs | ^2.4.6 | TypeScript types for bcrypt |
| @types/jsonwebtoken | ^9.x | TypeScript types for JWT |
| bcryptjs | ^3.0.3 | Password hashing |
| jsonwebtoken | ^9.x | JWT token generation and verification |
| lucide-react | ^0.564.0 | Icon library |
| mongodb | ^3.7.4 | MongoDB native driver |
| mongoose | ^9.2.1 | MongoDB ODM |
| next | 16.1.0 | Next.js framework |
| react | 19.2.3 | React library |
| react-dom | 19.2.3 | React DOM rendering |

**DevDependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| @tailwindcss/postcss | ^4 | Tailwind CSS PostCSS plugin |
| @types/mongodb | ^3.6.20 | TypeScript types for MongoDB |
| @types/node | ^20 | TypeScript types for Node.js |
| @types/react | ^19 | TypeScript types for React |
| @types/react-dom | ^19 | TypeScript types for React DOM |
| eslint | ^9 | Linting |
| eslint-config-next | 16.1.0 | ESLint config for Next.js |
| tailwindcss | ^4 | Utility-first CSS framework |
| typescript | ^5 | TypeScript compiler |

### 2.2 tsconfig.json
**Path:** `tsconfig.json`

**Purpose:** TypeScript configuration

**Key Settings:**
- `target`: ES2017
- `lib`: [dom, dom.iterable, esnext]
- `strict`: true
- `jsx`: react-jsx
- `moduleResolution`: bundler
- `paths`: { "@/*": ["./*"] } - Path alias for imports

### 2.3 next.config.ts
**Path:** `next.config.ts`

**Purpose:** Next.js configuration

**Content:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### 2.4 postcss.config.mjs
**Path:** `postcss.config.mjs`

**Purpose:** PostCSS configuration for Tailwind CSS

### 2.5 eslint.config.mjs
**Path:** `eslint.config.mjs`

**Purpose:** ESLint configuration for code linting

### 2.6 .gitignore
**Path:** `.gitignore`

**Ignored Patterns:**
- `/node_modules` - Dependencies
- `/.pnp`, `.pnp.*` - Yarn PnP
- `.yarn/*` (with exceptions)
- `/coverage` - Test coverage
- `/.next/` - Next.js build output
- `/out/` - Static export output
- `/build` - Production build
- `.DS_Store` - macOS files
- `*.pem` - Certificate files
- `npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`, `.pnpm-debug.log*` - Debug logs
- `.env*` - Environment files
- `.vercel` - Vercel deployment
- `*.tsbuildinfo` - TypeScript build info
- `next-env.d.ts` - Next.js type declarations

---

## 3. AUTHENTICATION & AUTHORIZATION

### 3.1 lib/auth.ts
**Path:** `lib/auth.ts`

**Purpose:** JWT-based authentication utilities for token generation and verification

**JWT Secret:**
- Environment variable: `JWT_SECRET`
- Fallback: `'your-secret-key-change-this'` (should be changed in production)

**Interface: JWTPayload**
```typescript
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}
```

**Functions:**

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `signToken` | `payload: JWTPayload` | `string` | Generates JWT with 7-day expiration |
| `verifyToken` | `token: string` | `JWTPayload \| null` | Verifies and decodes JWT, returns null if invalid |
| `getTokenFromRequest` | `req: Request` | `string \| null` | Extracts Bearer token from Authorization header |

**Code:**
```typescript
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}
```

### 3.2 lib/middleware.ts
**Path:** `lib/middleware.ts`

**Purpose:** Middleware helper for protecting API routes with authentication

**Function: withAuth**
```typescript
export async function withAuth(
  req: Request,
  handler: (req: Request, user: JWTPayload) => Promise<NextResponse>
): Promise<NextResponse>
```

**Description:** Higher-order function that wraps API route handlers to enforce authentication. Extracts and verifies JWT token, then calls the handler with the authenticated user payload.

**Returns 401 if:**
- No token provided
- Token is invalid or expired

**Code:**
```typescript
import { NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from './auth'
import type { JWTPayload } from './auth'

export async function withAuth(
  req: Request,
  handler: (req: Request, user: JWTPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  const token = getTokenFromRequest(req)
  
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 401 }
    )
  }

  const user = verifyToken(token)
  
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  return handler(req, user)
}
```

---

## 4. DATABASE CONNECTION LIBRARIES

### 4.1 lib/mongoose.ts
**Path:** `lib/mongoose.ts`

**Purpose:** Mongoose connection with caching for Next.js

**Environment Variables:**
- `MONGODB_URL` - MongoDB connection string (fallback: hardcoded Atlas URL)
- `MONGODB_DB` - Database name (fallback: "dashboard_ex")

**Exports:**
- `connectDB()` - Async function that returns cached MongoDB connection

**Key Features:**
- Connection caching via `global.mongoose` to prevent multiple connections during hot-reload
- Uses Mongoose v9 for ODM

**Code:**
```typescript
import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://set_yusuf_29:415GoRcS0lO5gbEL@cluster0.hktblwm.mongodb.net/?appName=Cluster0";
const MONGODB_DB = process.env.MONGODB_DB || "dashboard_ex";

let cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
      dbName: MONGODB_DB,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### 4.2 lib/mongodb.ts
**Path:** `lib/mongodb.ts`

**Purpose:** Native MongoDB driver connection with dev/prod mode handling

**Environment Variables:**
- `MONGODB_URL` - Connection string (fallback: `mongodb://localhost:27017/`)
- `MONGODB_DB` - Database name (fallback: `dashboard_ex`)

**Exports:**
- `default` - `clientPromise` - Promise resolving to MongoClient
- `getDatabase()` - Returns Db instance
- `connectToDatabase()` - Returns { client, db }

**Key Features:**
- Development mode uses global variable for HMR compatibility
- Production mode creates new connection per request

### 4.3 lib/mongodb-atlas.ts
**Path:** `lib/mongodb-atlas.ts`

**Purpose:** MongoDB Atlas connection that loads config from mongo.env file

**Environment Variables (from mongo/mongo.env or process.env):**
- `MONGODB_URL` - Atlas connection string
- `MONGODB_DB` - Database name

**Exports:**
- `getDatabase()` - Returns Db instance
- `closeConnection()` - Closes MongoDB connection

**Key Features:**
- Loads environment variables from `mongo/mongo.env` file
- Single client connection (no complex caching)

### 4.4 lib/mongodb-simple.ts
**Path:** `lib/mongodb-simple.ts`

**Purpose:** Simplified MongoDB connection utility

**Environment Variables:**
- `MONGODB_URL` - Connection string (fallback: `mongodb://localhost:27017/`)
- `MONGODB_DB` - Database name (fallback: `dashboard_ex`)

**Exports:**
- `getDatabase()` - Returns Db instance
- `closeConnection()` - Closes connection
- `testConnection()` - Returns boolean for connection health

### 4.5 config/database.ts
**Path:** `config/database.ts`

**Purpose:** Database configuration constants

**Exports:**
```typescript
export const DATABASE_CONFIG = {
  URL: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  NAME: process.env.MONGODB_DB || 'secondhand_sell',
  OPTIONS: {
    // Connection options placeholder
  }
};
```

---

## 5. DATA MODELS

### 5.1 lib/models/Post.ts
**Path:** `lib/models/Post.ts`

**Purpose:** Mongoose schema and model for marketplace posts

**Interface: IPost**
```typescript
export interface IPost extends Document {
  title: string;
  type: string;
  brand: string;
  specs: string;
  condition: string;
  price: number;
  description: string;
  location: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  imageUrl: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Schema Fields:**
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | String | Yes | - | Post title |
| type | String | Yes | - | Category type (Book, Phone, Computer, Electronics, Service) |
| brand | String | Yes | - | Brand/Author/Manufacturer |
| specs | String | No | - | Specifications/details |
| condition | String | Yes | - | Item condition |
| price | Number | Yes | - | Price in USD |
| description | String | No | - | Full description |
| location | String | Yes | - | Seller location |
| contactName | String | Yes | - | Seller name |
| contactPhone | String | Yes | - | Seller phone |
| contactEmail | String | Yes | - | Seller email |
| imageUrl | String | No | '' | Image path |
| userId | String | Yes | - | Poster's user ID |
| createdAt | Date | Auto | - | Timestamp (auto) |
| updatedAt | Date | Auto | - | Timestamp (auto) |

**Model Name:** `Post`

**Prevents Re-compilation:** Uses `mongoose.models.Post || mongoose.model('Post', PostSchema)`

---

## 6. API ROUTES

### 6.1 GET/POST /api/posts
**Path:** `app/api/posts/route.ts`

**HTTP Methods:** GET, POST

#### GET /api/posts
**Description:** Retrieve all posts with optional search filtering

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search term for title (case-insensitive regex) |

**Database Operations:**
- Collection: `posts` (via Mongoose Post model)
- Query: `Post.find(query).sort({ createdAt: -1 })`
- If search provided: `{ title: { $regex: search, $options: 'i' } }`
- Otherwise: `{}` (all posts)

**Response (Success - 200):**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "string",
      "title": "string",
      "type": "string",
      "brand": "string",
      "specs": "string",
      "condition": "string",
      "price": number,
      "description": "string",
      "location": "string",
      "contactName": "string",
      "contactPhone": "string",
      "contactEmail": "string",
      "imageUrl": "string",
      "userId": "string",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ]
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Server error"
}
```

**Imports:**
- `NextRequest, NextResponse` from `next/server`
- `connectDB` from `@/lib/mongoose`
- `Post` from `@/lib/models/Post`

#### POST /api/posts
**Description:** Create a new post

**Request Body:**
```json
{
  "title": "string (required)",
  "type": "string (required)",
  "brand": "string (required)",
  "specs": "string (optional)",
  "condition": "string (required)",
  "price": number (required),
  "description": "string (optional)",
  "location": "string (required)",
  "contactName": "string (required)",
  "contactPhone": "string (required)",
  "contactEmail": "string (required)",
  "imageUrl": "string (optional)",
  "userId": "string (required)"
}
```

**Validation:**
- Required fields: title, type, brand, condition, price, location, contactName, contactPhone, contactEmail, userId
- Returns 400 if any required field is missing

**Database Operations:**
- Collection: `posts` (via Mongoose Post model)
- Operation: `Post.create(body)`

**Response (Success - 201):**
```json
{
  "success": true,
  "post": { /* created post object */ }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "{field} is required"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Server error"
}
```

### 6.2 GET/DELETE /api/posts/[id]
**Path:** `app/api/posts/[id]/route.ts`

**HTTP Methods:** GET, DELETE

#### GET /api/posts/:id
**Description:** Retrieve a single post by ID

**Route Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId |

**Database Operations:**
- Collection: `posts` (via Mongoose Post model)
- Query: `Post.findById(id)`

**Response (Success - 200):**
```json
{
  "success": true,
  "post": { /* post object */ }
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "error": "Not found"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Server error"
}
```

#### DELETE /api/posts/:id
**Description:** Delete a post by ID

**Route Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId |

**Database Operations:**
- Collection: `posts` (via Mongoose Post model)
- Operation: `Post.findByIdAndDelete(id)`

**Response (Success - 200):**
```json
{
  "success": true
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Server error"
}
```

**Imports:**
- `NextRequest, NextResponse` from `next/server`
- `connectDB` from `@/lib/mongoose`
- `Post` from `@/lib/models/Post`

### 6.3 GET/DELETE /api/posts/user
**Path:** `app/api/posts/user/route.ts`

**HTTP Methods:** GET, DELETE

**Authentication:** Required (JWT token in Authorization header)

#### GET /api/posts/user
**Description:** Retrieve all posts belonging to the authenticated user

**Database Operations:**
- Collection: `posts` (via Mongoose Post model)
- Query: `Post.find({ userId: user.userId }).sort({ createdAt: -1 })`

**Response (Success - 200):**
```json
{
  "success": true,
  "posts": [
    { /* post object */ }
  ]
}
```

**Response (Unauthorized - 401):**
```json
{
  "success": false,
  "error": "Login required" | "Invalid or expired token"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Server error"
}
```

#### DELETE /api/posts/user?postId=xxx
**Description:** Delete a post belonging to the authenticated user

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| postId | string | Yes | MongoDB ObjectId of the post to delete |

**Authorization:**
- Users can only delete their own posts
- Admins can delete any post

**Database Operations:**
- Collection: `posts` (via Mongoose Post model)
- Operation: `Post.findByIdAndDelete(postId)`

**Response (Success - 200):**
```json
{
  "success": true
}
```

**Response (Bad Request - 400):**
```json
{
  "success": false,
  "error": "Post ID required"
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "error": "Post not found"
}
```

**Response (Forbidden - 403):**
```json
{
  "success": false,
  "error": "Not allowed"
}
```

**Imports:**
- `NextRequest, NextResponse` from `next/server`
- `connectDB` from `@/lib/mongoose`
- `Post` from `@/lib/models/Post`
- `verifyToken, getTokenFromRequest` from `@/lib/auth`

### 6.4 POST /api/auth/login
**Path:** `app/api/auth/login/route.ts`

**HTTP Method:** POST

**Description:** Authenticate user and return user data

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Database Operations:**
- Collection: `users` (native MongoDB, not Mongoose)
- Query: `users.findOne({ email: body.email })`
- Password verification: `bcrypt.compare(body.password, user.password)`

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "ObjectId",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

**Response (Unauthorized - 401):**
```json
{
  "error": "Invalid email or password"
}
```

**Response (Error - 500):**
```json
{
  "error": "Server error"
}
```

**Imports:**
- `getDatabase` from `@/lib/mongodb`
- `bcrypt` from `bcryptjs`

### 6.5 POST /api/auth/register
**Path:** `app/api/auth/register/route.ts`

**HTTP Method:** POST

**Description:** Register a new user

**Request Body:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Database Operations:**
- Collection: `users` (native MongoDB, not Mongoose)
- Check existing: `users.findOne({ email: body.email })`
- Password hashing: `bcrypt.hash(body.password, 10)`
- Insert: `users.insertOne({ name, email, password: hashedPassword, role: "user", createdAt: new Date() })`

**User Document Structure:**
```json
{
  "name": "string",
  "email": "string",
  "password": "hashed string",
  "role": "user",
  "createdAt": "Date"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "id": "ObjectId"
}
```

**Response (Conflict - 400):**
```json
{
  "error": "User already exists"
}
```

**Response (Error - 500):**
```json
{
  "error": "Server error"
}
```

**Imports:**
- `getDatabase` from `@/lib/mongodb`
- `bcrypt` from `bcryptjs`

### 6.6 GET/PUT /api/auth/me
**Path:** `app/api/auth/me/route.ts`

**HTTP Methods:** GET, PUT

**Authentication:** Required (JWT token in Authorization header)

#### GET /api/auth/me
**Description:** Get current authenticated user's profile

**Database Operations:**
- Collection: `users` (native MongoDB)
- Query: `users.findOne({ _id: new ObjectId(user.userId) }, { projection: { password: 0 } })`

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "avatar": "string",
    "createdAt": "Date"
  }
}
```

**Response (Unauthorized - 401):**
```json
{
  "success": false,
  "error": "Login required" | "Invalid or expired token"
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

#### PUT /api/auth/me
**Description:** Update current user's profile

**Request Body:**
```json
{
  "name": "string (optional)",
  "avatar": "string (optional)"
}
```

**Database Operations:**
- Collection: `users` (native MongoDB)
- Operation: `users.updateOne({ _id: new ObjectId(user.userId) }, { $set: updateFields })`

**Response (Success - 200):**
```json
{
  "success": true
}
```

**Imports:**
- `NextRequest, NextResponse` from `next/server`
- `getDatabase` from `@/lib/mongodb`
- `verifyToken, getTokenFromRequest` from `@/lib/auth`
- `ObjectId` from `mongodb`

### 6.7 GET /api/stats
**Path:** `app/api/stats/route.ts`

**HTTP Method:** GET

**Authentication:** Required (Admin only)

**Description:** Get platform-wide statistics for admin dashboard

**Database Operations:**
- Count users by role
- Count posts by type
- Calculate average price
- Get recent posts

**Response (Success - 200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": number,
    "totalOwners": number,
    "totalAdmins": number,
    "totalPosts": number,
    "totalBooks": number,
    "totalPhones": number,
    "totalComputers": number,
    "totalElectronics": number,
    "totalServices": number,
    "avgPrice": number,
    "recentPosts": [
      {
        "_id": "string",
        "title": "string",
        "type": "string",
        "price": number,
        "contactName": "string",
        "createdAt": "Date"
      }
    ]
  }
}
```

**Response (Unauthorized - 401):**
```json
{
  "success": false,
  "error": "Login required" | "Invalid or expired token"
}
```

**Response (Forbidden - 403):**
```json
{
  "success": false,
  "error": "Admin only"
}
```

**Imports:**
- `NextRequest, NextResponse` from `next/server`
- `getDatabase` from `@/lib/mongodb`
- `verifyToken, getTokenFromRequest` from `@/lib/auth`

### 6.8 GET /api/stats/owner
**Path:** `app/api/stats/owner/route.ts`

**HTTP Method:** GET

**Authentication:** Required (Owner or Admin only)

**Description:** Get statistics for the authenticated owner's posts

**Database Operations:**
- Count user's posts by type
- Calculate user's average price
- Get user's recent posts

**Response (Success - 200):**
```json
{
  "success": true,
  "stats": {
    "myPosts": number,
    "myBooks": number,
    "myPhones": number,
    "myComputers": number,
    "myElectronics": number,
    "myServices": number,
    "myAvgPrice": number,
    "recentPosts": [
      {
        "_id": "string",
        "title": "string",
        "type": "string",
        "price": number,
        "condition": "string",
        "createdAt": "Date"
      }
    ]
  }
}
```

**Response (Unauthorized - 401):**
```json
{
  "success": false,
  "error": "Login required" | "Invalid or expired token"
}
```

**Response (Forbidden - 403):**
```json
{
  "success": false,
  "error": "Owner only"
}
```

**Imports:**
- `NextRequest, NextResponse` from `next/server`
- `getDatabase` from `@/lib/mongodb`
- `verifyToken, getTokenFromRequest` from `@/lib/auth`

### 6.9 POST /api/upload
**Path:** `app/api/upload/route.ts`

**HTTP Method:** POST

**Description:** Upload image files to server

**Request Body:** FormData with key `image` containing a File

**Validation:**
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Maximum file size: 10MB
- Returns 400 if validation fails

**File Processing:**
1. Extract file from FormData
2. Validate type and size
3. Convert to Buffer
4. Generate unique filename: `${Date.now()}-${randomString}.${extension}`
5. Save to `public/uploads/` directory
6. Create directory if it doesn't exist

**Database Operations:** None (file system only)

**Response (Success - 200):**
```json
{
  "success": true,
  "url": "/uploads/{filename}"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "No file" | "Invalid file type" | "File too large"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Upload failed"
}
```

**Imports:**
- `NextRequest, NextResponse` from `next/server`
- `writeFile, mkdir` from `fs/promises`
- `path` from `path`

---

## 7. FRONTEND PAGES

### 7.1 app/page.tsx (Home/Root)
**Path:** `app/page.tsx`

**Purpose:** Default Next.js home page (mostly placeholder)

**Type:** Server Component (async)

**Functions:**
- `getHealth()` - Fetches health status from `http://localhost:4000/api/health`

**State:** None (server component)

**Fetch Calls:**
- `GET http://localhost:4000/api/health` (with `cache: "no-store"`)

**Components Rendered:**
- Next.js logo image
- Welcome text
- Links to Templates and Learning center
- Backend status indicator
- Deploy Now and Documentation buttons

**Imports:**
- `Image` from `next/image`

### 7.2 app/layout.tsx (Root Layout)
**Path:** `app/layout.tsx`

**Purpose:** Root layout wrapping all pages

**Type:** Server Component

**Providers:**
- `ThemeProvider` - Manages light/dark theme
- `LanguageProvider` - Manages English/Khmer language

**External Resources:**
- Google Fonts: Geist, Geist_Mono
- Font Awesome CSS: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`

**Metadata:**
- title: "Create Next App"
- description: "Generated by create next app"

**Imports:**
- `ThemeProvider` from `./contexts/ThemeContext`
- `LanguageProvider` from `./contexts/LanguageContext`
- CSS imports: `./globals.css`, `./user-intetface/notification/notification.css`

### 7.3 app/login/page.tsx
**Path:** `app/login/page.tsx`

**Purpose:** User login page

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| email | string | '' | User email input |
| password | string | '' | Password input |
| loading | boolean | false | Loading state during login |
| error | string | '' | Error message display |

**Functions:**
- `handleSubmit(e: React.FormEvent)` - Form submission handler

**Fetch Calls:**
- `POST /api/auth/login` - Authenticate user

**localStorage Keys Used:**
- `userEmail` - User's email address
- `userName` - User's display name
- `userId` - User's unique ID
- `userRole` - User's role (admin, owner, user)

**Redirects Based on Role:**
- `admin` → `/dashboardadmin`
- `owner` → `/dashboardowner`
- `user` (default) → `/user-intetface/home`

**Components Rendered:**
- Login form with email and password inputs
- Error message display
- Forgot password link (to `/forgot-password`)
- Register link (to `/register`)

**Imports:**
- `useState` from `react`
- `Link` from `next/link`
- `useRouter` from `next/navigation`
- CSS: `./login.css`

### 7.4 app/register/page.tsx
**Path:** `app/register/page.tsx`

**Purpose:** User registration page

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| id | string | '' | User ID input |
| name | string | '' | Full name input |
| email | string | '' | Email input |
| password | string | '' | Password input |
| confirmPassword | string | '' | Password confirmation |
| loading | boolean | false | Loading state |
| error | string | '' | Error message |

**Functions:**
- `handleSubmit(e: React.FormEvent)` - Form submission with password matching validation

**Fetch Calls:**
- `POST /api/auth/register` - Create new user

**localStorage Keys Used:**
- `userEmail` - Set after successful registration

**Validation:**
- Password must match confirmPassword
- Returns error if passwords don't match

**Components Rendered:**
- Registration form with fields: User ID, Full Name, Email, Password, Confirm Password
- Error message display
- Login link (to `/login`)

**Imports:**
- `useState` from `react`
- `Link` from `next/link`
- `useRouter` from `next/navigation`
- CSS: `./register.css`

### 7.5 app/forgot-password/page.tsx
**Path:** `app/forgot-password/page.tsx`

**Purpose:** Password reset request page (placeholder - backend not implemented)

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| email | string | '' | Email input |

**Functions:**
- `handleSubmit(e: React.FormEvent)` - Logs email and shows alert (no actual backend call)

**TODO/Comments:**
- `alert('Reset link sent (backend later)')` - Backend functionality not yet implemented

**Components Rendered:**
- Form with email input
- Send Reset Link button
- Back to Login link

**Imports:**
- `useState` from `react`
- `Link` from `next/link`
- CSS: `./forgot.css`

### 7.6 app/user-intetface/home/page.tsx
**Path:** `app/user-intetface/home/page.tsx`

**Purpose:** Main marketplace home page with product listings

**Type:** Client Component (`'use client'`) wrapped in Suspense

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| searchQuery | string | '' | Search input value |
| langDropdown | boolean | false | Language dropdown visibility |
| currentLang | string | 'eng' | Current language (eng/cam) |
| favorites | Set<string> | new Set() | Favorited product IDs |
| currentSlide | number | 0 | Carousel slide index |
| showPostCategories | boolean | false | Post category modal visibility |
| isMobileMenuOpen | boolean | false | Mobile menu visibility |
| showChatModal | boolean | false | Chat modal visibility |
| showNotificationModal | boolean | false | Notification modal visibility |
| hasNewChatMessage | boolean | true | Chat notification badge state |
| hasNewNotification | boolean | true | Notification badge state |
| customAvatar | string | '' | User's custom avatar URL |
| cart | CartItem[] | [] | Shopping cart items |
| showCartModal | boolean | false | Cart modal visibility |
| userLetter | string | 'U' | First letter of username for avatar |
| products | Product[] | [] | Fetched posts from API |
| loading | boolean | true | Loading state for products |

**Interfaces:**
```typescript
interface CartItem {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  condition: string;
  location: string;
  brand: string;
  type: string;
  specs?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationItem {
  id: number;
  name: string;
  text: string;
  time: string;
  avatar: string;
  type: 'like' | 'friend_request' | 'friend_accepted' | 'post';
  read?: boolean;
}

interface ChatItem {
  id: number;
  name: string;
  preview: string;
  time: string;
  avatar: string;
  unread?: boolean;
}
```

**useEffect Hooks:**
1. Load custom avatar from localStorage on mount
2. Load cart from localStorage on mount
3. Listen for email storage changes to update profile
4. Poll for email changes every 1 second
5. Load favorite products from localStorage on mount
6. Fetch posts from API when searchQuery changes
7. Handle click-outside for language dropdown

**Fetch Calls:**
- `GET /api/posts` - Fetch all posts
- `GET /api/posts?search={searchQuery}` - Fetch filtered posts

**localStorage Keys Used:**
- `customAvatar` - User's custom profile image
- `userEmail` - User's email for profile display
- `cart` - Shopping cart items (JSON stringified)
- `favoriteProducts` - Favorited products (JSON stringified)
- `language` - User's language preference

**Functions:**
- `handleProductClick(product)` - Navigate to buy-detail page
- `handleSearch(e)` - Handle search form submission
- `handleClearSearch()` - Clear search input
- `toggleLangDropdown()` - Toggle language selector
- `toggleMobileMenu()` - Toggle mobile menu
- `goToChat()` - Navigate to chat page
- `goToSpecificChat(chat)` - Navigate to specific chat
- `goToNotifications()` - Navigate to notifications page
- `switchLanguage(lang)` - Switch between eng/cam
- `toggleFavorite(productId)` - Toggle favorite status
- `addToCart(product)` - Add product to cart
- `removeFromCart(productId)` - Remove product from cart
- `getCartItemCount()` - Get number of items in cart
- `getCartTotal()` - Calculate cart total price
- `nextSlide()` / `prevSlide()` - Carousel navigation

**Components Rendered:**
- Desktop Navigation Bar
- Mobile Navigation with hamburger menu
- Category Section (Book, Computer, Phone, Electronics, Service)
- Welcome Banner Carousel
- Product Listing Grid
- Post Categories Modal
- Chat Modal
- Cart Modal
- Notification Dropdown (enhanced component)

**Imports:**
- `Suspense, useState, useEffect, useMemo` from `react`
- `Link` from `next/link`
- `Image` from `next/image`
- `useRouter, useSearchParams` from `next/navigation`
- `NotificationDropdownEnhanced` from `./NotificationDropdownEnhanced`
- `ChatDropdownEnhanced` from `./ChatDropdownEnhanced`
- `useTheme` from `../../contexts/ThemeContext`
- CSS: `./home.css`

### 7.7 app/user-intetface/buy-detail/page.tsx
**Path:** `app/user-intetface/buy-detail/page.tsx`

**Purpose:** Product detail page for viewing and purchasing items

**Type:** Client Component wrapped in Suspense

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| product | Product \| null | null | Fetched product data |
| loading | boolean | true | Loading state |

**Interface:**
```typescript
interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  condition: string;
  location: string;
  brand: string;
  type: string;
  specs?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

**useEffect Hooks:**
- Fetch product data when productId changes

**Fetch Calls:**
- `GET /api/posts/{productId}` - Fetch product details

**Query Parameters (from URL):**
- `id` - Product ID
- `title` - Fallback title (if not fetched from API)
- `desc` - Fallback description
- `price` - Fallback price
- `image` - Fallback image URL

**Components Rendered:**
- Back button header
- Image gallery with main image and thumbnails
- Product info section (title, meta, price)
- Details section (description, condition, brand, specs, location)
- Map placeholder
- Contact info section
- Seller profile section
- Sidebar with seller card and ad space

**Fallback Data:** If API fetch fails, uses URL query parameters as fallback

**Imports:**
- `Suspense, useState, useEffect` from `react`
- `Image` from `next/image`
- `useRouter, useSearchParams` from `next/navigation`
- CSS: `./bdetail.css`

### 7.8 app/user-intetface/post-book/page.tsx
**Path:** `app/user-intetface/post-book/page.tsx`

**Purpose:** Form page for posting book listings

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| formData | object | {...} | Form field values |
| photo | File \| null | null | Selected image file |
| preview | string \| null | null | Image preview URL |
| submitting | boolean | false | Submission loading state |

**formData Structure:**
```typescript
{
  title: string;
  author: string;
  category: string;
  condition: string;
  price: string;
  description: string;
  location: string;
  name: string;
  phone: string;
  email: string;
}
```

**Functions:**
- `handleChange(e)` - Handle form input changes
- `handlePhotoChange(e)` - Handle image file selection
- `handleSubmit(e)` - Submit form to API

**Fetch Calls:**
- `POST /api/posts` - Create new book post

**Request Body Mapping:**
```typescript
{
  title: formData.title,
  type: 'Book',
  brand: formData.author,
  specs: formData.category,
  condition: formData.condition || 'Good',
  price: parseFloat(formData.price),
  description: formData.description,
  location: formData.location,
  contactName: formData.name,
  contactPhone: formData.phone,
  contactEmail: formData.email,
  userId: 'anonymous',
  imageUrl: ''
}
```

**Components Rendered:**
- Header with book icon and "Post Book" title
- Photo upload section
- Book Details section (title, author, category, condition, price, description, location)
- Contact Detail section (name, phone, email)
- Submit button

**Imports:**
- `useState` from `react`
- `Image` from `next/image`
- CSS: `./pbook.css`

### 7.9 app/user-intetface/post-phone/page.tsx
**Path:** `app/user-intetface/post-phone/page.tsx`

**Purpose:** Form page for posting phone listings

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| formData | object | {...} | Form field values |
| photo | File \| null | null | Selected image file |
| preview | string \| null | null | Image preview URL |
| submitting | boolean | false | Submission loading state |

**formData Structure:**
```typescript
{
  title: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  price: string;
  description: string;
  location: string;
  name: string;
  phone: string;
  email: string;
}
```

**Functions:**
- `handleChange(e)` - Handle form input changes
- `handlePhotoChange(e)` - Handle image file selection
- `handleSubmit(e)` - Submit form to API

**Fetch Calls:**
- `POST /api/posts` - Create new phone post

**Request Body Mapping:**
```typescript
{
  title: formData.title,
  type: 'Phone',
  brand: formData.brand,
  specs: `${formData.model}, ${formData.storage}`,
  condition: formData.condition,
  price: parseFloat(formData.price),
  description: formData.description,
  location: formData.location,
  contactName: formData.name,
  contactPhone: formData.phone,
  contactEmail: formData.email,
  userId: 'anonymous',
  imageUrl: ''
}
```

**Brand Options:** Apple, Samsung, Google, Xiaomi, Oppo, Vivo, Other

**Imports:**
- `useState` from `react`
- `Image` from `next/image`
- CSS: `./pphone.css`

### 7.10 app/user-intetface/post-electronics/page.tsx
**Path:** `app/user-intetface/post-electronics/page.tsx`

**Purpose:** Form page for posting electronics listings

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| formData | object | {...} | Form field values |
| photo | File \| null | null | Selected image file |
| preview | string \| null | null | Image preview URL |
| submitting | boolean | false | Submission loading state |

**formData Structure:**
```typescript
{
  title: string;
  category: string;
  brand: string;
  condition: string;
  price: string;
  description: string;
  location: string;
  name: string;
  phone: string;
  email: string;
}
```

**Functions:**
- `handleChange(e)` - Handle form input changes
- `handlePhotoChange(e)` - Handle image file selection
- `handleSubmit(e)` - Submit form to API

**Fetch Calls:**
- `POST /api/posts` - Create new electronics post

**Request Body Mapping:**
```typescript
{
  title: formData.title,
  type: 'Electronics',
  brand: formData.brand,
  specs: formData.category,
  condition: formData.condition,
  price: parseFloat(formData.price),
  description: formData.description,
  location: formData.location,
  contactName: formData.name,
  contactPhone: formData.phone,
  contactEmail: formData.email,
  userId: 'anonymous',
  imageUrl: ''
}
```

**Category Options:** Audio, Camera, Gaming, Wearables, Home Appliances, Other

**Imports:**
- `useState` from `react`
- `Image` from `next/image`
- CSS: `./pelectronics.css`

### 7.11 app/user-intetface/post-computer/page.tsx
**Path:** `app/user-intetface/post-computer/page.tsx`

**Purpose:** Form page for posting computer listings with image upload

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| formData | ComputerData | {...} | Form field values |
| loading | boolean | false | Submission loading state |
| error | string | '' | Error message |

**Interface:**
```typescript
interface ComputerData {
  title: string;
  type: string;
  brand: string;
  specs: string;
  condition: string;
  price: string;
  description: string;
  location: string;
  name: string;
  phone: string;
  email: string;
  photo?: File | null;
  photoPreview?: string;
  photoError?: string;
}
```

**Functions:**
- `handleInputChange(e)` - Handle text input changes
- `handleSelectChange(e)` - Handle select dropdown changes
- `handlePhotoChange(e)` - Handle image file selection with validation
- `removePhoto()` - Clear selected photo
- `handleSubmit(e)` - Submit form with image upload then post creation

**Photo Validation:**
- Maximum size: 10MB
- Allowed types: image/jpeg, image/png, image/webp, image/gif

**Fetch Calls:**
1. `POST /api/upload` - Upload image (if photo provided)
2. `POST /api/posts` - Create new computer post

**Submission Flow:**
1. Validate required fields
2. Upload image to `/api/upload` (if photo exists)
3. Get imageUrl from upload response
4. Get userId from localStorage (key: 'user') or use 'anonymous'
5. Create post with all data including imageUrl
6. Redirect to `/user-intetface/home` on success

**Type Options:** laptop, desktop, monitor, accessories, parts

**Imports:**
- `useState` from `react`
- `Image` from `next/image`
- `useRouter` from `next/navigation`
- CSS: `./pcomputer.css`

### 7.12 app/user-intetface/post-service/page.tsx
**Path:** `app/user-intetface/post-service/page.tsx`

**Purpose:** Form page for posting service listings

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| formData | object | {...} | Form field values |
| photo | File \| null | null | Selected image file |
| preview | string \| null | null | Image preview URL |
| submitting | boolean | false | Submission loading state |

**formData Structure:**
```typescript
{
  title: string;
  category: string;
  availability: string;
  price: string;
  description: string;
  location: string;
  name: string;
  phone: string;
  email: string;
}
```

**Functions:**
- `handleChange(e)` - Handle form input changes
- `handlePhotoChange(e)` - Handle image file selection
- `handleSubmit(e)` - Submit form to API

**Fetch Calls:**
- `POST /api/posts` - Create new service post

**Request Body Mapping:**
```typescript
{
  title: formData.title,
  type: 'Service',
  brand: formData.category,
  specs: formData.availability,
  condition: 'N/A',
  price: parseFloat(formData.price),
  description: formData.description,
  location: formData.location,
  contactName: formData.name,
  contactPhone: formData.phone,
  contactEmail: formData.email,
  userId: 'anonymous',
  imageUrl: ''
}
```

**Category Options:** Repair, Cleaning, Tutoring, Transportation, Other

**Imports:**
- `useState` from `react`
- `Image` from `next/image`
- CSS: `./pservice.css`

### 7.13 app/user-intetface/profile/page.tsx
**Path:** `app/user-intetface/profile/page.tsx`

**Purpose:** User profile management page

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| isEditing | boolean | false | Edit mode toggle |
| profile | UserProfile | {...} | User profile data |
| editName | string | '' | Editable name field |
| selectedAvatar | string | '' | Selected avatar option |
| customImage | string | '' | Custom uploaded avatar |

**Interface:**
```typescript
interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  customAvatar?: string;
}
```

**useEffect Hooks:**
1. Load profile data from localStorage on mount
2. Listen for email storage changes to update profile
3. Poll for email changes every 1 second

**localStorage Keys Used:**
- `userEmail` - User's email address
- `customAvatar` - User's custom avatar image (base64 or URL)

**Functions:**
- `handleEditProfile()` - Enter edit mode
- `handleSaveProfile()` - Save profile changes
- `handleCancelEdit()` - Cancel editing
- `handleAvatarSelect(avatar)` - Select preset avatar
- `handleImageUpload(event)` - Handle custom image upload
- `handleLogout()` - Clear session and redirect to login
- `simulateEmailChange()` - Test email change functionality
- `handleLightMode()` / `handleDarkMode()` - Theme switching

**Avatar Options:**
- default, avatar-1, avatar-2, avatar-3, avatar-4, avatar-5, avatar-6, avatar-7, avatar-8
- Custom image upload option

**Components Rendered:**
- Profile header with back and logout buttons
- Avatar section with edit capability
- Profile info display/edit form
- Avatar selection grid
- Account information card (mock data)
- Theme/Appearance settings card

**Imports:**
- `useState, useEffect` from `react`
- `useRouter` from `next/navigation`
- `Image` from `next/image`
- `useTheme` from `../../contexts/ThemeContext`
- CSS: `./profile.css`

### 7.14 app/user-intetface/favorites/page.tsx
**Path:** `app/user-intetface/favorites/page.tsx`

**Purpose:** Display user's favorited products

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| favorites | FavoriteProduct[] | [] | List of favorite products |

**Interface:**
```typescript
interface FavoriteProduct {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
}
```

**useEffect Hooks:**
- Load favorites from localStorage on mount

**localStorage Keys Used:**
- `favoriteProducts` - JSON stringified array of favorite products

**Functions:**
- `handleProductClick(product)` - Navigate to product detail page with query params

**Components Rendered:**
- Top navigation bar with logo and home link
- Product list grid (if favorites exist)
- Empty state message with link to home (if no favorites)

**Imports:**
- `useEffect, useState` from `react`
- `Link` from `next/link`
- `Image` from `next/image`
- `useRouter` from `next/navigation`
- CSS: `../home/home.css`

### 7.15 app/user-intetface/chat/page.tsx
**Path:** `app/user-intetface/chat/page.tsx`

**Purpose:** Chat list page showing all conversations

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| searchQuery | string | '' | Chat search input |
| likedChats | Set<number> | new Set([0, 3]) | IDs of liked/favorited chats |

**Interface:**
```typescript
interface ChatItem {
  id: number;
  name: string;
  preview: string;
  time: string;
  avatar: string;
}
```

**Mock Data:** 15 hardcoded chat items

**Functions:**
- `handleSearch(e)` - Handle search form submission
- `handleClearSearch()` - Clear search input
- `toggleLike(id)` - Toggle like/favorite status on chat

**Memoized:**
- `filtered` - Filtered chats based on search query (searches name and preview)

**Navigation:**
- Click chat item → `/user-intetface/inside-chat?name=...&avatar=...&msg=...`

**Components Rendered:**
- Top navigation bar
- Search box
- Chat list with avatar, name, preview, time, and like button

**Imports:**
- `useMemo, useState` from `react`
- `Link` from `next/link`
- `Image` from `next/image`
- `useRouter` from `next/navigation`
- CSS: `./chat.css`

### 7.16 app/user-intetface/inside-chat/page.tsx
**Path:** `app/user-intetface/inside-chat/page.tsx`

**Purpose:** Individual chat conversation view

**Type:** Client Component wrapped in Suspense

**Query Parameters (from URL):**
- `name` - Chat partner's name (default: 'Lina')
- `avatar` - Chat partner's avatar URL (default: '/notification-image/lina.png')
- `msg` - Initial message to display (default: 'Hey bro, what are you doing? 😄')

**Components Rendered:**
- Header with back button, avatar, and user name
- Chat body with message display
- Footer with attachment icons, message input, and like button

**Note:** This is a static/mock implementation - no actual messaging functionality

**Imports:**
- `Image` from `next/image`
- `useRouter, useSearchParams` from `next/navigation`
- `Suspense` from `react`
- CSS: `./ichat.css`

### 7.17 app/user-intetface/notification/page.tsx
**Path:** `app/user-intetface/notification/page.tsx`

**Purpose:** Notifications list page

**Type:** Client Component (`'use client'`)

**State Variables:**
| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| searchQuery | string | '' | Notification search input |
| likedNotifications | Set<number> | new Set([0, 3, 4]) | IDs of liked notifications |

**Interface:**
```typescript
interface NotificationItem {
  id: number;
  name: string;
  text: string;
  time: string;
  avatar: string;
  type: 'like' | 'friend_request' | 'friend_accepted' | 'post' | string;
}
```

**Mock Data:** 10 hardcoded notifications

**Notification Types:**
- `like` - Someone liked your post
- `friend_request` - Friend request received
- `friend_accepted` - Friend request accepted
- `post` - Someone added new post

**Functions:**
- `handleSearch(e)` - Handle search form submission
- `handleClearSearch()` - Clear search input
- `toggleLike(id)` - Toggle like status on notification
- `handleConfirmFriend(id)` - Confirm friend request (logs to console)
- `handleDeleteFriend(id)` - Delete friend request (logs to console)

**Memoized:**
- `filtered` - Filtered notifications based on search query

**Components Rendered:**
- Top navigation bar
- Search box
- Notification list with avatar, name, text, time, and action buttons
- Friend request buttons (Confirm/Delete) for friend_request type

**Imports:**
- `useMemo, useState` from `react`
- `Link` from `next/link`
- `Image` from `next/image`
- CSS: None (uses inline styles and navbar styles)

---

## 8. DASHBOARD PAGES

### 8.1 app/dashboardadmin/layout.tsx
**Path:** `app/dashboardadmin/layout.tsx`

**Purpose:** Layout wrapper for admin dashboard pages

**Type:** Client Component (`'use client'`)

**Navigation Items:**
| Path | Label | Icon |
|------|-------|------|
| /dashboardadmin | Dashboard | Home |
| /dashboardadmin/admin | Admin | Users/Group |
| /dashboardadmin/user | User | User Profile |
| /dashboardadmin/owner | Owner | User Circle |
| /dashboardadmin/notifications | Notifications | Bell |
| /dashboardadmin/phone | Phone | Smartphone |
| /dashboardadmin/computer | Computer | Monitor |
| /dashboardadmin/book | Book | Book |
| /dashboardadmin/service | Service | Tools/Wrench |
| /dashboardadmin/product | Product | Box |
| /dashboardadmin/settings | Settings | Gear |

**Features:**
- Sidebar navigation with active state highlighting
- Mobile hamburger menu button
- Search input in header
- User avatar in header (from ui-avatars.com)
- Logout button in sidebar footer
- Version display: v2.1.0

**Imports:**
- `usePathname` from `next/navigation`
- CSS: `./layout.css`

### 8.2 app/dashboardadmin/page.tsx
**Path:** `app/dashboardadmin/page.tsx`

**Purpose:** Admin dashboard main overview page

**Type:** Server Component

**Statistics Displayed:**
| Stat | Value | Icon Color |
|------|-------|------------|
| Total Users | 1,248 | Blue |
| Total Owners | 76 | Green |
| Total Products | 342 | Purple |
| Total Services | 58 | Orange |
| Total Books | 129 | Indigo |
| Total Phones | 76 | Teal |
| Total Computers | 45 | Red |
| Notifications | 19 | Blue |

**Charts:**
1. **Revenue Trend Chart**
   - Shows monthly revenue over time
   - Trend indicator: +15.2%
   - SVG area chart with yellow/gold color

2. **Category Totals Chart**
   - Bar chart showing last 7 items by category
   - Categories: Users, Owners, Products, Services, Books, Phones, Computers, Notif.

**Performance Summary:**
- Avg. Monthly Growth: +2.8%
- Fulfillment Rate: 92%

### 8.3 app/dashboardowner/layout.tsx
**Path:** `app/dashboardowner/layout.tsx`

**Purpose:** Layout wrapper for owner dashboard pages

**Type:** Client Component (`'use client'`)

**Navigation Items:**
| Path | Label |
|------|-------|
| /dashboardowner | Dashboard |
| /dashboardowner/notifications | Notifications |
| /dashboardowner/phone | Phone |
| /dashboardowner/computer | Computer |
| /dashboardowner/book | Book |
| /dashboardowner/service | Service |
| /dashboardowner/product | Product |
| /dashboardowner/settings | Settings |

**Differences from Admin Layout:**
- No Admin, User, Owner management links
- Owner avatar from ui-avatars.com with "Owner User" name
- Footer shows "Owner Panel" instead of "Admin Panel"

### 8.4 app/dashboardowner/page.tsx
**Path:** `app/dashboardowner/page.tsx`

**Purpose:** Owner dashboard main overview page

**Type:** Server Component

**Statistics Displayed (My Items):**
| Stat | Value |
|------|-------|
| My Products | 342 |
| My Services | 58 |
| My Books | 129 |
| My Phones | 76 |
| My Computers | 45 |
| Notifications | 19 |

**Charts:** Same as admin dashboard (Revenue Trend, Category Totals)

**Recent Posts Table:**
| Item Name | Category | Price | Date | Status |
|-----------|----------|-------|------|--------|
| iPhone 14 Pro | Phone | $999 | 2023-10-25 | Active |
| MacBook Pro 16" | Computer | $2100 | 2023-10-24 | Active |
| House Cleaning | Service | $30/hr | 2023-10-23 | Inactive |
| The Great Gatsby | Book | $15 | 2023-10-22 | Active |

---

## 9. CONTEXT PROVIDERS

### 9.1 app/contexts/ThemeContext.tsx
**Path:** `app/contexts/ThemeContext.tsx`

**Purpose:** Global theme (light/dark mode) state management

**Type:** Client Component (`'use client'`)

**Theme Type:** `'light' | 'dark'`

**Context Value:**
```typescript
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}
```

**State:**
- `theme` - Current theme ('light' or 'dark')

**useEffect Hooks:**
1. Initialize theme from localStorage or system preference on mount
2. Apply theme to document.documentElement and persist to localStorage on change

**localStorage Keys Used:**
- `theme` - User's theme preference

**Functions:**
- `toggleTheme()` - Switch between light and dark
- `setTheme(newTheme)` - Set specific theme

**DOM Manipulation:**
- Sets `data-theme` attribute on `<html>` element
- Sets `style.colorScheme` on document root

**Exports:**
- `ThemeProvider` - Provider component
- `useTheme()` - Hook to access theme context

### 9.2 app/contexts/LanguageContext.tsx
**Path:** `app/contexts/LanguageContext.tsx`

**Purpose:** Global language (English/Khmer) state management with translations

**Type:** Client Component (`'use client'`)

**Language Type:** `'eng' | 'cam'`

**Context Value:**
```typescript
interface LanguageContextType {
  currentLang: Language;
  switchLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
```

**State:**
- `currentLang` - Current language ('eng' or 'cam')

**useEffect Hooks:**
1. Initialize language from localStorage on mount
2. Persist language to localStorage on change

**localStorage Keys Used:**
- `language` - User's language preference

**Translation Dictionary:**
Contains translations for computer posting page fields including:
- post_computer, photo, add_photo, computer_details
- title_placeholder, type, laptop, desktop, monitor, accessories, parts
- brand_placeholder, specs_placeholder, condition_placeholder
- price, description_placeholder, location, contact_details
- name_placeholder, phone_placeholder, email_placeholder
- post_computer_btn

**Functions:**
- `switchLanguage(lang)` - Switch to specified language
- `t(key)` - Get translation for key (returns key if not found)

**Exports:**
- `LanguageProvider` - Provider component
- `useLanguage()` - Hook to access language context

---

## 10. ENVIRONMENT VARIABLES

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB` | Database name | `dashboard_ex` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-change-this` |

### Environment Variable Sources (Priority Order)

1. **`.env.local`** - Local development (not committed to git)
2. **`mongo/mongo.env`** - Alternative config file for MongoDB settings
3. **`process.env`** - System environment variables
4. **Hardcoded fallbacks** - Built into connection libraries

### Fallback Values in Code

| Library | MONGODB_URL Fallback | MONGODB_DB Fallback |
|---------|---------------------|---------------------|
| lib/mongoose.ts | `mongodb+srv://set_yusuf_29:415GoRcS0lO5gbEL@cluster0.hktblwm.mongodb.net/?appName=Cluster0` | `dashboard_ex` |
| lib/mongodb.ts | `mongodb://localhost:27017/` | `dashboard_ex` |
| lib/mongodb-simple.ts | `mongodb://localhost:27017/` | `dashboard_ex` |
| lib/mongodb-atlas.ts | `mongodb://localhost:27017/` | `dashboard_ex` |
| config/database.ts | `mongodb://localhost:27017` | `secondhand_sell` |

### mongo/mongo.env File Content

```
MONGODB_URL=mongodb+srv://set_yusuf_29:415GoRcS0lO5gbEL@cluster0.hktblwm.mongodb.net/?appName=Cluster0
MONGODB_DB=dashboard_ex
```

---

## 11. DATABASE SCHEMA

### Collections

#### 11.1 users Collection
**Used by:** `/api/auth/login`, `/api/auth/register`, `/api/auth/me`

**Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | Unique identifier |
| name | String | Yes | User's full name |
| email | String | Yes | User's email (unique) |
| password | String | Yes | Bcrypt hashed password |
| role | String | Yes | User role: "user", "admin", "owner" |
| avatar | String | No | User's avatar URL (optional) |
| createdAt | Date | Auto | Account creation date |

**Indexes:**
- Default `_id` index
- Recommended: Unique index on `email` field

**Default Role:** New registrations get `role: "user"`

#### 11.2 posts Collection
**Used by:** `/api/posts`, `/api/posts/[id]`, `/api/posts/user`

**Fields (via Mongoose Post Model):**
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| _id | ObjectId | Auto | - | Unique identifier |
| title | String | Yes | - | Post title |
| type | String | Yes | - | Category: Book, Phone, Computer, Electronics, Service |
| brand | String | Yes | - | Brand/Author/Manufacturer |
| specs | String | No | - | Specifications |
| condition | String | Yes | - | Item condition |
| price | Number | Yes | - | Price in USD |
| description | String | No | - | Full description |
| location | String | Yes | - | Seller location |
| contactName | String | Yes | - | Seller name |
| contactPhone | String | Yes | - | Seller phone |
| contactEmail | String | Yes | - | Seller email |
| imageUrl | String | No | '' | Image path |
| userId | String | Yes | - | Poster's user ID |
| createdAt | Date | Auto | - | Creation timestamp |
| updatedAt | Date | Auto | - | Last update timestamp |

**Indexes:**
- Default `_id` index
- Mongoose automatically creates indexes for schema
- Recommended: Index on `type` for category filtering
- Recommended: Index on `userId` for user's posts
- Recommended: Text index on `title` for search

---

## 12. LOCALSTORAGE KEYS

### Client-Side Storage

| Key | Type | Purpose | Set By |
|-----|------|---------|--------|
| `userEmail` | string | User's email address | Login, Register, Profile |
| `userName` | string | User's display name | Login |
| `userId` | string | User's unique ID | Login |
| `userRole` | string | User's role (admin/owner/user) | Login |
| `theme` | 'light' \| 'dark' | Theme preference | ThemeContext |
| `language` | 'eng' \| 'cam' | Language preference | LanguageContext |
| `customAvatar` | string (base64/URL) | Custom profile avatar | Profile page |
| `cart` | JSON string | Shopping cart items | Home page |
| `favoriteProducts` | JSON string | Favorited products | Home page |
| `user` | JSON string | User data object | Post Computer page |

### Cart Item Structure
```typescript
{
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
}
```

### Favorite Product Structure
```typescript
{
  id: number | string;
  title: string;
  description: string;
  price: string | number;
  image: string;
}
```

---

## 13. KNOWN BUGS AND TODOs

### 13.1 Forgot Password - Not Implemented
**File:** `app/forgot-password/page.tsx`

**Issue:** The password reset functionality is not connected to a backend API.

**Code:**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log({ email })
  alert('Reset link sent (backend later)')
}
```

**TODO:** Implement backend API endpoint for password reset email

### 13.2 User ID Hardcoded in Post Forms
**Files:** 
- `app/user-intetface/post-book/page.tsx`
- `app/user-intetface/post-phone/page.tsx`
- `app/user-intetface/post-electronics/page.tsx`
- `app/user-intetface/post-service/page.tsx`

**Issue:** These forms use `'anonymous'` as the userId instead of getting the actual logged-in user's ID.

**Code:**
```typescript
userId: 'anonymous', // Default user ID for now
```

**TODO:** Replace with actual user ID from authentication system (use JWT token)

### 13.3 User Data Parsing in Post Computer
**File:** `app/user-intetface/post-computer/page.tsx`

**Issue:** Attempts to parse user data from localStorage with key 'user', but this key is not consistently set by the login flow.

**Code:**
```typescript
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user._id || user.id || 'anonymous';
```

**TODO:** Ensure login sets `localStorage.setItem('user', JSON.stringify(userData))` or use the existing `userId` key

### 13.4 Chat and Notification Data is Mock/Hardcoded
**Files:**
- `app/user-intetface/chat/page.tsx`
- `app/user-intetface/notification/page.tsx`
- `app/user-intetface/home/page.tsx`

**Issue:** Chat messages and notifications are hardcoded mock data, not fetched from a database.

**TODO:** Create database collections and API endpoints for:
- Messages/Conversations
- Notifications
- Friend requests

### 13.5 Inside Chat - No Messaging Functionality
**File:** `app/user-intetface/inside-chat/page.tsx`

**Issue:** The chat page only displays a static initial message. No ability to send messages or fetch conversation history.

**TODO:** Implement:
- Real-time messaging (WebSocket or polling)
- Message history from database
- Send message functionality

### 13.6 Dashboard Pages - Static Data
**Files:** All dashboard pages in `app/dashboardadmin/` and `app/dashboardowner/`

**Issue:** Statistics and charts display hardcoded values, not real database data.

**TODO:** Use the new `/api/stats` and `/api/stats/owner` endpoints to fetch real statistics from database

### 13.7 No PUT/PATCH Endpoint for Posts
**Issue:** The API only supports GET and DELETE for individual posts. No update functionality.

**TODO:** Add `PUT /api/posts/[id]` or `PATCH /api/posts/[id]` endpoint

### 13.8 No User Management API
**Issue:** Admin dashboard has navigation for user management but no API endpoints exist.

**TODO:** Create API endpoints for:
- GET /api/users - List all users
- GET /api/users/[id] - Get user details
- PUT /api/users/[id] - Update user
- DELETE /api/users/[id] - Delete user
- PUT /api/users/[id]/role - Change user role

### 13.9 Image Upload Not Integrated in All Post Forms
**Files:** 
- `app/user-intetface/post-book/page.tsx`
- `app/user-intetface/post-phone/page.tsx`
- `app/user-intetface/post-electronics/page.tsx`
- `app/user-intetface/post-service/page.tsx`

**Issue:** These forms have photo upload UI but don't actually upload images to the server. Only `post-computer` page implements the full upload flow.

**TODO:** Implement image upload in all post forms similar to `post-computer`

### 13.10 No Cart Checkout Functionality
**File:** `app/user-intetface/home/page.tsx`

**Issue:** Cart modal shows "Proceed to Checkout" button but it doesn't do anything.

**TODO:** Implement checkout flow with payment integration

### 13.11 No Favorites API
**Issue:** Favorites are stored only in localStorage, not synced with backend.

**TODO:** Create API endpoints for favorites management:
- GET /api/favorites - Get user's favorites
- POST /api/favorites - Add to favorites
- DELETE /api/favorites/[id] - Remove from favorites

---

## 14. PUBLIC ASSETS

### Image Assets Location: `public/`

**Home Page Images:**
- `/home/lg.png` - Logo
- `/home/book.png` - Book category icon
- `/home/computer.png` - Computer category icon
- `/home/phone.png` - Phone category icon
- `/home/electronics.png` - Electronics category icon
- `/home/ser.png` - Service category icon
- `/home/bann2.png`, `/home/bann3.png` - Banner carousel images
- `/home/eng.png` - English flag icon
- `/home/cam.png` - Khmer flag icon

**Notification/Avatar Images:**
- `/notification-image/lina.png`
- `/notification-image/bopa.png`
- `/notification-image/leakna.png`
- `/notification-image/somnang.png`

**Framework Icons:**
- `/next.svg` - Next.js logo
- `/vercel.svg` - Vercel logo
- `/file.svg`, `/globe.svg`, `/window.svg` - Decorative SVGs

**User Uploads:**
- `/uploads/` - Directory for user-uploaded images (created automatically)

---

## 15. CSS FILES

### Global Styles
- `app/globals.css` - Global application styles (Tailwind CSS base)

### Page-Specific Styles
| Page | CSS File |
|------|----------|
| Login | `app/login/login.css` |
| Register | `app/register/register.css` |
| Forgot Password | `app/forgot-password/forgot.css` |
| Home | `app/user-intetface/home/home.css`, `app/user-intetface/home/style.css` |
| Buy Detail | `app/user-intetface/buy-detail/bdetail.css` |
| Chat | `app/user-intetface/chat/chat.css` |
| Inside Chat | `app/user-intetface/inside-chat/ichat.css` |
| Notification | `app/user-intetface/notification/notification.css` |
| Post Book | `app/user-intetface/post-book/pbook.css` |
| Post Phone | `app/user-intetface/post-phone/pphone.css` |
| Post Electronics | `app/user-intetface/post-electronics/pelectronics.css` |
| Post Computer | `app/user-intetface/post-computer/pcomputer.css` |
| Post Service | `app/user-intetface/post-service/pservice.css` |
| Profile | `app/user-intetface/profile/profile.css` |
| Admin Layout | `app/dashboardadmin/layout.css` |
| Owner Layout | `app/dashboardowner/layout.css` |

---

## 16. EXTERNAL DEPENDENCIES

### CDN Resources
- **Font Awesome:** `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`
- **Google Fonts:** Geist, Geist_Mono (loaded via Next.js)

### npm Packages
See section 2.1 for complete dependency list.

---

## 17. API SUMMARY TABLE

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/auth/register` | Register new user | No | - |
| POST | `/api/auth/login` | User login | No | - |
| GET | `/api/auth/me` | Get current user profile | Yes | - |
| PUT | `/api/auth/me` | Update current user profile | Yes | - |
| GET | `/api/posts` | Get all posts (with optional search) | No | - |
| POST | `/api/posts` | Create new post | No | - |
| GET | `/api/posts/:id` | Get single post | No | - |
| DELETE | `/api/posts/:id` | Delete post | No | - |
| GET | `/api/posts/user` | Get user's posts | Yes | - |
| DELETE | `/api/posts/user?postId=xxx` | Delete user's post | Yes | Owner/Admin |
| GET | `/api/stats` | Get platform statistics | Yes | Admin |
| GET | `/api/stats/owner` | Get owner's statistics | Yes | Owner/Admin |
| POST | `/api/upload` | Upload image file | No | - |

---

## 18. ROUTING STRUCTURE

### Public Routes
- `/` - Home (default Next.js page)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset request

### User Interface Routes
- `/user-intetface/home` - Main marketplace
- `/user-intetface/buy-detail` - Product detail
- `/user-intetface/post-book` - Post book listing
- `/user-intetface/post-phone` - Post phone listing
- `/user-intetface/post-electronics` - Post electronics listing
- `/user-intetface/post-computer` - Post computer listing
- `/user-intetface/post-service` - Post service listing
- `/user-intetface/profile` - User profile
- `/user-intetface/favorites` - Saved favorites
- `/user-intetface/chat` - Chat list
- `/user-intetface/inside-chat` - Individual chat
- `/user-intetface/notification` - Notifications

### Admin Dashboard Routes
- `/dashboardadmin` - Admin overview
- `/dashboardadmin/admin` - Admin management
- `/dashboardadmin/user` - User management
- `/dashboardadmin/owner` - Owner management
- `/dashboardadmin/notifications` - Notifications
- `/dashboardadmin/phone` - Phone listings
- `/dashboardadmin/computer` - Computer listings
- `/dashboardadmin/book` - Book listings
- `/dashboardadmin/service` - Service listings
- `/dashboardadmin/product` - Product listings
- `/dashboardadmin/settings` - Settings

### Owner Dashboard Routes
- `/dashboardowner` - Owner overview
- `/dashboardowner/notifications` - Notifications
- `/dashboardowner/phone` - Phone listings
- `/dashboardowner/computer` - Computer listings
- `/dashboardowner/book` - Book listings
- `/dashboardowner/service` - Service listings
- `/dashboardowner/product` - Product listings
- `/dashboardowner/settings` - Settings

---

*End of Architecture Documentation*
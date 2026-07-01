# Second Hand Marketplace - Complete Website Structure

## Overview
**Name:** RUPP SecondHand Marketplace  
**Purpose:** A platform for buying and selling second-hand products within a community  
**Tech Stack:** Next.js 16, React, TypeScript, MongoDB, Mongoose, JWT Authentication  
**Base URL:** `http://localhost:7001`

---

## Table of Contents
1. [Authentication Pages](#authentication-pages)
2. [User Interface Pages](#user-interface-pages)
3. [Marketplace Pages](#marketplace-pages)
4. [Dashboard Pages](#dashboard-pages)
5. [API Endpoints](#api-endpoints)
6. [Database Models](#database-models)
7. [Navigation Flow](#navigation-flow)

---

## Authentication Pages

### 1. Login Page (`/login`)
**File:** `app/(auth)/login/page.tsx`  
**Purpose:** User authentication entry point

**Elements:**
- **Logo/Brand Icon** (top center) - SVG user icon with "Welcome Back" heading
- **Email Input Field** - Label: "Email Address", Placeholder: "Enter your email", Type: email
- **Password Input Field** - Label: "Password", Placeholder: "Enter your password", Type: password with show/hide toggle
- **Show Password Button** - Eye icon toggle to reveal/hide password
- **Remember Me Checkbox** - Checkbox input with label
- **Forgot Password Link** - Navigates to `/forgot-password`
- **Sign In Button** - Primary action button, submits form
- **Divider** - "or continue with" text
- **Google Login Button** - "Continue with Google" (future implementation)
- **Register Link** - "Don't have an account? Sign up" → navigates to `/register`
- **Footer** - "© 2024 Second Hand Marketplace. All rights reserved."

**Functionality:**
- Validates email and password
- Calls `POST /api/auth/login`
- On success:
  - Saves token, user data to localStorage
  - Redirects based on role:
    - `admin` → `/dashboardadmin`
    - `owner` → `/dashboardowner`
    - `user` → `/user-intetface/home`
- On error: displays error message

**State Management:**
- `email` - string
- `password` - string
- `loading` - boolean
- `error` - string
- `showPassword` - boolean

---

### 2. Register Page (`/register`)
**File:** `app/(auth)/register/page.tsx`  
**Purpose:** New user registration

**Elements:**
- **Name Input** - Full name field
- **Email Input** - Email address field
- **Password Input** - Password with show/hide toggle
- **Confirm Password Input** - Password confirmation
- **Register Button** - Submits registration form
- **Login Link** - "Already have an account? Sign in" → navigates to `/login`

**Functionality:**
- Validates all fields
- Calls `POST /api/auth/register`
- On success: redirects to `/login`
- On error: displays error message

---

### 3. Forgot Password Page (`/forgot-password`)
**File:** `app/(auth)/forgot-password/page.tsx`  
**Purpose:** Password reset request

**Elements:**
- **Email Input** - Registered email address
- **Send Reset Link Button** - Triggers password reset email
- **Back to Login Link** - Returns to `/login`

**Functionality:**
- Calls `POST /api/auth/forgot-password`
- Sends reset email if user exists
- Shows success message regardless (security best practice)

---

## User Interface Pages

### 4. Home Page (`/user-intetface/home`)
**File:** `app/(marketplace)/home/page.tsx`  
**Purpose:** Main marketplace browsing page

**Top Navigation Bar (Fixed):**
- **Logo** (`/home/lg.png`) - Brand logo, 240x80px
- **Language Selector** - Toggle between English/Khmer
  - English flag icon (`/home/eng.png`)
  - Khmer flag icon (`/home/cam.png`)
  - Dropdown with both options
- **Home Button** - House icon, navigates to home
- **Favorites Button** - Heart icon, navigates to favorites
- **Search Bar** - Search input with:
  - Text input field
  - Clear button (×) - appears when text entered
  - Search button (magnifying glass icon)
- **POST Button** - Opens category selection modal
- **Chat Button** - Messages icon with notification dot
- **Notification Button** - Bell icon with notification badge
- **Cart Button** - Shopping cart icon with item count badge
- **Profile Button** - Shows user avatar or letter initial

**Main Content:**
- **Category Filters** - Horizontal scrollable category buttons
- **Product Grid** - Responsive grid of product cards
  - Each card shows: image, title, price, location, seller info
  - Click navigates to buy-detail page

**Post Categories Modal:**
- **Book** - Icon + text, navigates to `/user-intetface/post-book`
- **Computer** - Icon + text, navigates to `/user-intetface/post-computer`
- **Phone** - Icon + text, navigates to `/user-intetface/post-phone`
- **Electronics** - Icon + text, navigates to `/user-intetface/post-electronics`
- **Service** - Icon + text, navigates to `/user-intetface/post-service`

**State:**
- `searchQuery` - string
- `langDropdown` - boolean
- `currentLang` - 'eng' | 'cam'
- `showPostCategories` - boolean
- `cart` - array of cart items
- `hasNewChatMessage` - boolean
- `hasNewNotification` - boolean

---

### 5. Buy Detail Page (`/user-intetface/buy-detail?id=...&category=...`)
**File:** `app/(marketplace)/[id]/page.tsx`  
**Purpose:** Detailed product view with seller information

**Top Navigation Bar:**
- **Back Button** - Arrow left icon, calls `router.back()`
- **Logo** - Brand logo
- **Language Selector** - English/Khmer toggle
- **Home Button** - House icon
- **Favorites Button** - Heart icon
- **Search Bar** - Search input
- **POST Button** - Opens post categories modal
- **Chat Button** - Messages icon
- **Notification Button** - Bell icon
- **Cart Button** - Cart icon with count
- **Profile Button** - User avatar/letter

**Left Column (70% width) - Product Content:**

1. **Image Gallery**
   - **Main Image** - Large product image (420px height, 12px border-radius)
   - **Thumbnail Row** - Horizontal row of thumbnails (only shown if > 1 image)
     - Each thumbnail is clickable
     - Active thumbnail has blue outline (`#2563eb`)
     - Hover effect: opacity 0.85
   - **More Overlay** - Shows "+5" if more than 3 images

2. **Product Info Card**
   - **Title** - 24px bold, product name
   - **Price** - 28px bold red (`#dc2626`), formatted as `$1500`
   - **Meta Info Row:**
     - Type tag (indigo pill badge)
     - Location
     - AD ID (last 8 chars of product ID)

3. **Description Card**
   - **Title** - "Description" (18px semibold)
   - **Description Text** - 15px, line-height 1.6
   - **Divider Line** - 1px solid border
   - **Specs Grid** - 2-column grid:
     - Condition
     - Brand
     - Specs
     - Location
   - Each spec has uppercase label (12px gray) and value (14px)

4. **Contact Information Card**
   - **Title** - "Contact Information"
   - **Contact Items:**
     - Name (👤 icon)
     - Phone (📱 icon)
     - Email (📧 icon)

**Right Sidebar (30% width) - Sticky:**

1. **Seller Card** (White card, 12px radius, shadow)
   - **Avatar** - 70x70px circular image or letter placeholder
   - **Seller Name** - 16px bold
   - **Username** - 13px gray, format: "@username"
   - **Member Since** - 12px gray, format: "Member since Month Year"
   - **Listing Count** - 13px, format: "X listings"
   - **View Profile Button** - Blue (`#2563eb`), full width
   - **Chat Button** - Green (`#16a34a`), full width

2. **More From Seller Card** (White card, 12px radius, shadow)
   - **Title** - "More from [SellerName]"
   - **Product List** (max 5 items):
     - Each item: 70x70px thumbnail + title (2-line clamp) + green price
     - Hover: light gray background
     - Divider between items
     - Click navigates to that product's buy-detail
   - **See All Button** - Outlined button, navigates to seller profile
   - **Empty State** - "No other listings from this seller"
   - **Loading State** - Spinner

**Post Categories Modal:**
- Same as home page modal

**State:**
- `product` - Product object
- `loading` - boolean
- `selectedImage` - number (index)
- `seller` - SellerInfo object
- `moreProducts` - array of SellerProduct
- `loadingMore` - boolean
- Navbar state (same as home)

**URL Params:**
- `id` - Product ID
- `category` - Product category (optional)
- `title` - Product title (fallback)
- `price` - Product price (fallback)
- `image` - Product image URL (fallback)
- `desc` - Product description (fallback)

---

### 6. Seller Profile Page (`/user-intetface/seller-profile/:sellerID`)
**File:** `app/user-intetface/seller-profile/[sellerID]/page.tsx`  
**Purpose:** Public seller profile with all their listings

**Header:**
- **Back Button** - "← Back" button
- **Title** - "Seller Profile"

**Top Section - Seller Identity Card:**
- **Large Profile Picture** - 120x120px circular image
- **Full Name** - Bold, large text
- **Username** - "@username" format
- **Member Since** - Date formatted as "Month Year"
- **Location** - City/country if available
- **Total Listings** - Count of active products
- **Chat Button** - Opens chat with seller
- **Add Friend Button** - Send friend request

**Bottom Section - Seller's Listings:**
- **Title** - "What [SellerName] is Selling"
- **Product Grid** - Responsive grid (3 cols desktop, 2 tablet, 1 mobile)
  - Each card: image, title, price, category, date posted
  - Click navigates to buy-detail page
- **Empty State** - "This seller has no active listings"
- **Loading State** - Spinner

**State:**
- `seller` - SellerInfo object
- `products` - array of SellerProduct
- `loading` - boolean
- `loadingProducts` - boolean
- `error` - string

**API Calls:**
- `GET /api/users/:sellerID` - Fetch seller info
- `GET /api/products/seller/:sellerID` - Fetch seller's products

---

### 7. Favorites Page (`/user-intetface/favorites`)
**File:** `app/(marketplace)/favorites/page.tsx`  
**Purpose:** View saved/favorited products

**Elements:**
- **Navigation Bar** - Same as home page
- **Favorites Grid** - Grid of favorited product cards
- **Empty State** - "No favorites yet" message

**Functionality:**
- Displays products user has favorited
- Remove from favorites option
- Click navigates to buy-detail

---

### 8. Profile Page (`/user-intetface/profile`)
**File:** `app/(marketplace)/profile/page.tsx`  
**Purpose:** User's own profile management

**Elements:**
- **Navigation Bar** - Same as home page
- **Profile Picture** - Current avatar with edit option
- **User Info Form:**
  - Name (editable)
  - Email (read-only)
  - Phone (editable)
  - Location (editable)
  - Bio (editable)
- **Save Button** - Updates profile
- **Change Password Section** - Update password form

**Functionality:**
- View and edit profile information
- Upload profile picture
- Change password

---

### 9. Chat Page (`/user-intetface/chat`)
**File:** `app/(marketplace)/chat/page.tsx`  
**Purpose:** List of all conversations

**Elements:**
- **Navigation Bar** - Same as home page
- **Conversation List** - List of chat threads
  - Each item: avatar, name, last message preview, timestamp
  - Unread message indicator
- **Search Bar** - Search conversations

**Functionality:**
- View all chat conversations
- Search conversations
- Click opens specific chat

---

### 10. Inside Chat Page (`/user-intetface/inside-chat?name=...&avatar=...&msg=...`)
**File:** `app/(marketplace)/inside-chat/page.tsx`  
**Purpose:** Active chat conversation with a user

**Elements:**
- **Navigation Bar** - Same as home page
- **Chat Header** - Recipient avatar, name, online status
- **Message List** - Scrollable message history
  - Sent messages (right aligned, green)
  - Received messages (left aligned, gray)
  - Timestamps
  - Read receipts
- **Message Input** - Text input with send button
- **Send Button** - Paper plane icon

**URL Params:**
- `name` - Recipient name
- `avatar` - Recipient avatar URL
- `msg` - Pre-filled message (optional)

**Functionality:**
- Real-time messaging
- Send text messages
- View message history
- Auto-scroll to latest message

---

### 11. Notifications Page (`/user-intetface/notification`)
**File:** `app/(marketplace)/notification/page.tsx`  
**Purpose:** View all notifications

**Elements:**
- **Navigation Bar** - Same as home page
- **Notification List** - List of notifications
  - Each item: icon, message, timestamp
  - Unread indicator
  - Click to navigate to related content

**Notification Types:**
- New message
- New follower
- Product sold
- Price drop alert
- System notification

---

### 12. Post Product Pages
**Purpose:** Create new product listings in specific categories

#### a. Post Book (`/user-intetface/post-book`)
**File:** `app/(marketplace)/sell/book/page.tsx`

#### b. Post Computer (`/user-intetface/post-computer`)
**File:** `app/(marketplace)/sell/computer/page.tsx`

#### c. Post Phone (`/user-intetface/post-phone`)
**File:** `app/(marketplace)/sell/phone/page.tsx`

#### d. Post Electronics (`/user-intetface/post-electronics`)
**File:** `app/(marketplace)/sell/electronics/page.tsx`

#### e. Post Service (`/user-intetface/post-service`)
**File:** `app/(marketplace)/sell/service/page.tsx`

**Common Elements:**
- **Navigation Bar** - Same as home page
- **Category Title** - "Post [Category]"
- **Form Fields:**
  - Title (text input)
  - Description (textarea)
  - Price (number input)
  - Condition (dropdown: New, Like New, Good, Fair, Poor)
  - Brand (text input)
  - Location (text input)
  - Contact Name (text input)
  - Contact Phone (text input)
  - Contact Email (email input)
  - Image Upload (file input, multiple)
- **Preview Section** - Shows uploaded images
- **Post Button** - Submits form
- **Cancel Button** - Returns to home

**Functionality:**
- Upload product images
- Fill product details
- Submit to `POST /api/products`
- Redirect to home on success

---

## Marketplace Pages

### 13. Product Detail Page (`/[id]`)
**File:** `app/(marketplace)/[id]/page.tsx`  
**Purpose:** Detailed view of a single product (legacy route)

**Note:** This is the old marketplace route. The main buy-detail is now at `/user-intetface/buy-detail`

---

## Dashboard Pages

### 14. Admin Dashboard (`/dashboardadmin`)
**File:** `app/dashboardadmin/page.tsx` → exports from `app/(dashboard)/admin/page`  
**Purpose:** Administrative control panel

**Access:** Only users with `role: 'admin'`

**Elements:**
- **Sidebar Navigation:**
  - Dashboard overview
  - User management
  - Product management
  - Category management
  - Reports/Analytics
  - Settings
- **Stats Cards:**
  - Total users
  - Total products
  - Total sales
  - Active listings
- **Recent Activity** - Table of recent actions
- **Charts** - Visual analytics (future)

**Functionality:**
- Manage all users (view, edit, delete, ban)
- Manage all products (approve, reject, delete)
- View system statistics
- Configure platform settings

---

### 15. Owner Dashboard (`/dashboardowner`)
**File:** `app/dashboardowner/page.tsx` → exports from `app/(dashboard)/owner/page`  
**Purpose:** Product owner management panel

**Access:** Only users with `role: 'owner'`

**Elements:**
- **Sidebar Navigation:**
  - My products
  - Add new product
  - Orders
  - Messages
  - Analytics
  - Settings
- **My Products List** - Table of owner's products
  - Edit/Delete actions
- **Add Product Button** - Quick add new product
- **Stats Cards:**
  - Total listings
  - Total views
  - Total inquiries
  - Active sales

**Functionality:**
- Manage own products
- View product performance
- Respond to inquiries
- Track sales

---

## API Endpoints

### Authentication APIs

#### `POST /api/auth/register`
**Purpose:** Register new user  
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user"
  },
  "token": "jwt_token"
}
```

#### `POST /api/auth/login`
**Purpose:** Authenticate user  
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "user|owner|admin",
    "avatar": "string"
  },
  "token": "jwt_token"
}
```
**Cookie:** `authToken` (httpOnly, 7 days expiry)

#### `GET /api/auth/me`
**Purpose:** Get current authenticated user  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string",
    "avatar": "string"
  }
}
```

#### `POST /api/auth/forgot-password`
**Purpose:** Request password reset  
**Request Body:**
```json
{
  "email": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Reset email sent"
}
```

#### `POST /api/auth/reset-password`
**Purpose:** Reset password with token  
**Request Body:**
```json
{
  "token": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### Product APIs

#### `GET /api/products`
**Purpose:** Get all products (with filters)  
**Query Params:**
- `category` - Filter by category
- `search` - Search in title/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `location` - Filter by location

**Response:**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "price": 1500,
      "imageUrl": "string",
      "condition": "string",
      "location": "string",
      "brand": "string",
      "type": "string",
      "specs": "string",
      "contactName": "string",
      "contactPhone": "string",
      "contactEmail": "string",
      "userId": "string",
      "seller": {
        "name": "string",
        "username": "string",
        "profileImage": "string",
        "memberSince": "date"
      },
      "createdAt": "date",
      "updatedAt": "date"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

#### `GET /api/products/:id`
**Purpose:** Get single product by ID  
**Response:**
```json
{
  "success": true,
  "post": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "price": 1500,
    "imageUrl": "string",
    "condition": "string",
    "location": "string",
    "brand": "string",
    "type": "string",
    "specs": "string",
    "contactName": "string",
    "contactPhone": "string",
    "contactEmail": "string",
    "userId": "string",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

#### `POST /api/products`
**Purpose:** Create new product listing  
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "price": 1500,
  "imageUrl": "string",
  "condition": "string",
  "location": "string",
  "brand": "string",
  "type": "string",
  "specs": "string",
  "contactName": "string",
  "contactPhone": "string",
  "contactEmail": "string"
}
```
**Response:**
```json
{
  "success": true,
  "post": { /* product object */ }
}
```

#### `PUT /api/products/:id`
**Purpose:** Update product  
**Headers:** `Authorization: Bearer <token>`  
**Request Body:** Same as POST (all fields optional)  
**Response:**
```json
{
  "success": true,
  "post": { /* updated product */ }
}
```

#### `DELETE /api/products/:id`
**Purpose:** Delete product  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "message": "Product deleted"
}
```

#### `GET /api/products/seller/:sellerID`
**Purpose:** Get all products by a seller  
**Query Params:**
- `exclude` - Exclude specific product ID (for "more from seller")
- `limit` - Max results (default: 5)

**Response:**
```json
{
  "success": true,
  "posts": [ /* array of products */ ]
}
```

#### `GET /api/products/user`
**Purpose:** Get current user's products  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "posts": [ /* array of products */ ]
}
```

---

### User APIs

#### `GET /api/users/:userID`
**Purpose:** Get public user profile  
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "name": "string",
    "username": "string",
    "email": "string",
    "avatar": "string",
    "location": "string",
    "bio": "string",
    "memberSince": "date",
    "listingCount": 10
  }
}
```

#### `PUT /api/users/:id`
**Purpose:** Update user profile  
**Headers:** `Authorization: Bearer <token>`  
**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "location": "string",
  "bio": "string",
  "avatar": "string"
}
```
**Response:**
```json
{
  "success": true,
  "user": { /* updated user */ }
}
```

---

### Stats APIs

#### `GET /api/stats`
**Purpose:** Get platform statistics (admin)  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1000,
    "totalProducts": 5000,
    "totalCategories": 5,
    "activeUsers": 500,
    "recentRegistrations": 50,
    "recentProducts": 200
  }
}
```

#### `GET /api/stats/owner`
**Purpose:** Get owner's statistics  
**Headers:** `Authorization: Bearer <token>`  
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalProducts": 25,
    "totalViews": 1500,
    "totalInquiries": 45,
    "activeListings": 20
  }
}
```

---

## Database Models

### User Model
**Collection:** `users`  
**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required, min: 3 chars),
  email: String (required, unique, lowercase),
  password: String (required, min: 6 chars, select: false),
  role: String (enum: ['user', 'owner', 'admin'], default: 'user'),
  avatar: String (default: null),
  phone: String (default: null),
  location: String (default: null),
  bio: String (default: null),
  isEmailVerified: Boolean (default: false),
  resetPasswordToken: String (default: null, select: false),
  resetPasswordExpires: Date (default: null, select: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Methods:**
- `comparePassword(candidatePassword)` - Compare password with hash

**Pre-save Hooks:**
- Hash password before saving (if modified)

---

### Product Model
**Collection:** `products`  
**Schema:**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  price: Number (required),
  imageUrl: String (required),
  condition: String (required),
  location: String (required),
  brand: String,
  type: String (required),
  specs: String,
  contactName: String (required),
  contactPhone: String (required),
  contactEmail: String (required),
  userId: ObjectId (required, ref: 'User'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId` - For fetching user's products
- `type` - For category filtering
- `createdAt` - For sorting

---

## Navigation Flow

### Guest User (Not Logged In)
```
/login
  ↓ (success)
/user-intetface/home (browse products)
  ↓ (click product)
/user-intetface/buy-detail?id=... (view details)
  ↓ (click View Profile)
/user-intetface/seller-profile/:sellerID (view seller)
```

### Regular User (role: 'user')
```
/login
  ↓ (success with role='user')
/user-intetface/home
  ├─ /user-intetface/favorites
  ├─ /user-intetface/profile
  ├─ /user-intetface/chat
  ├─ /user-intetface/notification
  ├─ /user-intetface/buy-detail?id=...
  ├─ /user-intetface/seller-profile/:sellerID
  ├─ /user-intetface/post-book
  ├─ /user-intetface/post-computer
  ├─ /user-intetface/post-phone
  ├─ /user-intetface/post-electronics
  └─ /user-intetface/post-service
```

### Owner User (role: 'owner')
```
/login
  ↓ (success with role='owner')
/dashboardowner
  ├─ My Products
  ├─ Add Product
  ├─ Orders
  ├─ Messages
  ├─ Analytics
  └─ Settings
```

### Admin User (role: 'admin')
```
/login
  ↓ (success with role='admin')
/dashboardadmin
  ├─ Dashboard Overview
  ├─ User Management
  ├─ Product Management
  ├─ Category Management
  ├─ Reports/Analytics
  └─ Settings
```

---

## Component Hierarchy

### Shared Components
- **Navbar** - Top navigation bar (used across all pages)
- **ProductCard** - Individual product display card
- **Footer** - Page footer (if applicable)
- **Modal** - Generic modal wrapper
- **Spinner** - Loading indicator
- **Button** - Reusable button component

### Page-Specific Components
- **ImageGallery** - Product image gallery with thumbnails
- **SellerCard** - Seller information card
- **MoreFromSeller** - "More from this seller" product list
- **ProductGrid** - Responsive product grid layout
- **ChatInterface** - Real-time chat component
- **NotificationList** - Notification list component

---

## State Management

### Global State (Context/Redux)
- **Auth State:**
  - `user` - Current user object
  - `token` - JWT token
  - `isAuthenticated` - boolean
  - `role` - User role

- **Cart State:**
  - `cartItems` - Array of cart items
  - `cartCount` - Total items count

- **Notification State:**
  - `notifications` - Array of notifications
  - `unreadCount` - Number of unread notifications

- **Chat State:**
  - `conversations` - Array of conversations
  - `activeChat` - Current active chat
  - `messages` - Message history

### Local State (useState)
- Form inputs
- Loading states
- Error messages
- UI toggles (modals, dropdowns)
- Pagination

---

## Styling System

### Design Tokens
**Colors:**
- Primary Blue: `#2563eb`
- Chat Green: `#16a34a`
- Price Red: `#dc2626`
- Text Primary: `#111827`
- Text Secondary: `#6b7280`
- Background: `#f9fafb`
- Card Background: `#ffffff`
- Border: `#e5e7eb`

**Typography:**
- Title: 24px, bold
- Section Title: 18px, semibold
- Body: 15px, regular
- Meta: 13px, regular
- Small: 12px, regular

**Spacing:**
- 4px, 8px, 12px, 16px, 24px, 32px

**Border Radius:**
- Cards: 12px
- Buttons: 8px
- Images: 12px
- Avatar: 50% (circle)

**Shadows:**
- Card: `0 4px 12px rgba(0,0,0,0.06)`
- Hover: `0 6px 18px rgba(0,0,0,0.1)`

---

## Responsive Breakpoints

- **Mobile:** < 768px
  - Single column layout
  - Full-width cards
  - Stacked navigation
  - Hamburger menu (if needed)

- **Tablet:** 768px - 1023px
  - Two-column layout (60/40 split)
  - Reduced spacing
  - Smaller images

- **Desktop:** ≥ 1024px
  - Two-column layout (70/30 split)
  - Full spacing
  - Large images
  - Sticky sidebar

---

## Authentication & Authorization

### JWT Token Structure
```javascript
{
  userId: "string",
  email: "string",
  role: "user|owner|admin",
  name: "string",
  iat: timestamp,
  exp: timestamp
}
```

### Role-Based Access Control
- **Guest:** Can browse products, view details, login/register
- **User:** Can browse, chat, post products, manage favorites
- **Owner:** Can manage own products, view analytics
- **Admin:** Full platform access, user management, product moderation

### Protected Routes
- `/dashboardadmin` - Admin only
- `/dashboardowner` - Owner only
- `/user-intetface/profile` - Authenticated users
- `/user-intetface/chat` - Authenticated users
- `/user-intetface/post-*` - Authenticated users

---

## File Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── forgot-password/
│       └── page.tsx
├── (marketplace)/
│   ├── home/
│   │   └── page.tsx
│   ├── [id]/
│   │   └── page.tsx (legacy product detail)
│   ├── favorites/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
├── user-intetface/
│   ├── buy-detail/
│   │   └── page.tsx
│   ├── seller-profile/
│   │   └── [sellerID]/
│   │       └── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   ├── inside-chat/
│   │   └── page.tsx
│   ├── notification/
│   │   └── page.tsx
│   ├── home/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── favorites/
│   │   └── page.tsx
│   ├── post-book/
│   │   └── page.tsx
│   ├── post-computer/
│   │   └── page.tsx
│   ├── post-phone/
│   │   └── page.tsx
│   ├── post-electronics/
│   │   └── page.tsx
│   └── post-service/
│       └── page.tsx
├── dashboardadmin/
│   └── page.tsx
├── dashboardowner/
│   └── page.tsx
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   ├── register/
│   │   │   └── route.ts
│   │   ├── forgot-password/
│   │   │   └── route.ts
│   │   ├── reset-password/
│   │   │   └── route.ts
│   │   └── me/
│   │       └── route.ts
│   ├── products/
│   │   ├── route.ts
│   │   ├── [id]/
│   │   │   └── route.ts
│   │   ├── seller/
│   │   │   └── [sellerID]/
│   │   │       └── route.ts
│   │   └── user/
│   │       └── route.ts
│   ├── users/
│   │   └── [userID]/
│   │       └── route.ts
│   ├── stats/
│   │   ├── route.ts
│   │   └── owner/
│   │       └── route.ts
│   └── uploads/
│       └── route.ts
├── layout.tsx
└── page.tsx

components/
├── SellerCard.tsx
├── SellerCard.css
├── SellerProductGrid.tsx
└── SellerProductGrid.css

lib/
├── db.ts
├── auth.ts
├── models.ts
├── validation.ts
└── models/
    └── User.ts

seed-admin.js
```

---

## Key Features Summary

1. **User Authentication** - Register, login, forgot password, JWT tokens
2. **Product Browsing** - Search, filter, category view
3. **Product Details** - Image gallery, description, seller info
4. **Seller Profiles** - Public profiles with all listings
5. **Favorites** - Save favorite products
6. **Chat System** - Real-time messaging between buyers/sellers
7. **Notifications** - Alerts for messages, follows, sales
8. **Product Posting** - 5 categories with image upload
9. **Admin Dashboard** - User management, product moderation, analytics
10. **Owner Dashboard** - Product management, sales tracking
11. **Responsive Design** - Mobile, tablet, desktop optimized
12. **Multi-language** - English and Khmer support

---

## Admin Credentials (For Testing)

**Email:** `setyusuf12@gmail.com`  
**Password:** `#Yu12345`  
**Role:** `admin`  
**Redirect:** `/dashboardadmin`

---

## Notes for AI Implementation

1. **All pages use `'use client'` directive** - This is a client-side rendered Next.js app
2. **CSS Modules** - Each page has its own CSS file (e.g., `page.tsx` + `page.css`)
3. **API Calls** - All API calls use native `fetch()` with `localhost:7001` base
4. **State Management** - Uses React `useState` and `useEffect` hooks
5. **Routing** - Uses Next.js App Router with `useRouter` and `useSearchParams`
6. **Images** - Uses Next.js `Image` component with `next/image`
7. **Icons** - Uses Font Awesome 6.1.1 (`fa fa-*` classes)
8. **Authentication** - JWT stored in httpOnly cookie + localStorage
9. **Database** - MongoDB with Mongoose ODM
10. **File Uploads** - Stored in `/public/uploads/` directory

---

## Future Enhancements

1. **Payment Integration** - Stripe/PayPal for secure transactions
2. **Real-time Chat** - WebSocket implementation for instant messaging
3. **Advanced Search** - Elasticsearch for better search results
4. **Product Reviews** - Rating and review system
5. **Map Integration** - Google Maps for location display
6. **Push Notifications** - Browser push notifications
7. **Mobile App** - React Native or Flutter app
8. **AI Recommendations** - Machine learning for product recommendations
9. **Multi-vendor Support** - Multiple sellers per product
10. **Auction System** - Bidding functionality for products

---

**Document Version:** 1.0  
**Last Updated:** 2025  
**Maintained By:** Development Team
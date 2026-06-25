# RUPP Secondhand Marketplace

A full-stack Next.js application for buying and selling second-hand items. This project includes both frontend (React/Next.js UI) and backend (API routes with MongoDB) capabilities.

## Tech Stack

- **Framework:** Next.js 16.1.0 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB (Atlas or local)
- **ODM:** Mongoose v9
- **Authentication:** bcryptjs for password hashing
- **Icons:** Lucide React

## Prerequisites

- Node.js 18+ (or use `pnpm`/`yarn`/`bun`)
- MongoDB instance (local or MongoDB Atlas)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/SetYusuf/second-hand-sell.git
cd second-hand-sell
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory (or copy from `.env`):

```bash
cp .env .env.local
```

Edit `.env.local` with your MongoDB connection details:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=your_database_name
```

**MongoDB Connection Options:**
- **MongoDB Atlas:** `mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0`
- **Local MongoDB:** `mongodb://localhost:27017`
- **MongoDB with auth:** `mongodb://username:password@host:port/`

## Running the Application

### Development Mode

Start the development server (includes both frontend and backend API):

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **API Routes:** `http://localhost:3000/api/*`

### Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
second-hand-sell/
├── app/
│   ├── api/              # Backend API routes
│   │   ├── auth/         # Authentication endpoints
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── posts/        # Posts CRUD endpoints
│   │   └── upload/       # File upload endpoint
│   ├── dashboardadmin/   # Admin dashboard
│   ├── dashboardowner/   # Owner dashboard
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── user-intetface/   # User interface
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable React components
├── config/
│   └── database.ts       # Database configuration
├── lib/
│   ├── mongodb.ts        # MongoDB connection utilities
│   ├── mongoose.ts       # Mongoose connection
│   └── models/           # Mongoose models
├── public/               # Static assets
└── .env.local            # Environment variables (create this)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a new post |
| PUT | `/api/posts/[id]` | Update a post |
| DELETE | `/api/posts/[id]` | Delete a post |
| POST | `/api/upload` | Upload files |

## Database Setup

The application uses MongoDB. You can use either:

1. **MongoDB Atlas (Recommended for production):**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string and update `MONGODB_URL` in `.env.local`

2. **Local MongoDB:**
   - Install MongoDB locally
   - Start the MongoDB service
   - Use `MONGODB_URL=mongodb://localhost:27017`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
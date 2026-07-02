import mongoose from 'mongoose';

// ============ FORCE LOAD ENVIRONMENT VARIABLES ============
const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB || 'second_hand_sell';

console.log('========== ENVIRONMENT CHECK ==========');
console.log('MONGODB_URL defined:', !!MONGODB_URL);
console.log('MONGODB_DB defined:', !!MONGODB_DB);
console.log('MONGODB_DB value:', MONGODB_DB);
console.log('NODE_ENV:', process.env.NODE_ENV);

if (MONGODB_URL) {
  console.log('MONGODB_URL (first 60 chars):', MONGODB_URL.substring(0, 60) + '...');
}
console.log('========================================');

// Validate on startup
if (!MONGODB_URL) {
  console.error('');
  console.error('❌ CRITICAL ERROR: MONGODB_URL is undefined');
  console.error('');
  console.error('This means .env.local is not being loaded properly.');
  console.error('');
  console.error('FIX:');
  console.error('1. Verify .env.local exists in the project root');
  console.error('2. Add MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname');
  console.error('3. Add MONGODB_DB=your_database_name');
  console.error('4. Clear .next folder: Remove-Item .next -Recurse -Force');
  console.error('5. Restart: npm run dev');
  console.error('');
  
  throw new Error('MONGODB_URL not loaded from .env.local');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: CachedConnection | undefined;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('ℹ️ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log(`📊 Database: ${MONGODB_DB}`);

    cached.promise = mongoose
      .connect(MONGODB_URL!, opts)
      .then(() => {
        console.log('✅ MongoDB connected successfully!');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('');
        console.error('Troubleshooting:');
        console.error('1. Check MongoDB Atlas cluster is running');
        console.error('2. Verify IP whitelist (Network Access → 0.0.0.0/0)');
        console.error('3. Check username/password in connection string');
        console.error('4. Wait 1-2 minutes after updating whitelist');
        console.error('');
        
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

/**
 * Gets the MongoDB database instance (native driver)
 * Use this for native MongoDB operations
 */
export async function getDB() {
  const conn = await connectDB();
  return conn.connection.db;
}

/**
 * Gets the database name
 */
export function getDbName(): string {
  return MONGODB_DB;
}

export default connectDB;

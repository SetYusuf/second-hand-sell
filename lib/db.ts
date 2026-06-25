import mongoose from 'mongoose';

// ========================================
// MONGODB CONNECTION SETUP
// ========================================
// 
// Environment variables required in .env.local:
// - MONGODB_URL: MongoDB connection string
// - MONGODB_DB: Database name
//
// CONNECTION URL EXAMPLES:
// - Local MongoDB: mongodb://localhost:27017
// - MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/
// ========================================

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB || 'rupp_marketplace';

if (!MONGODB_URL) {
  throw new Error('MONGODB_URL environment variable is not set');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: MongooseCache = (global as { mongoose?: MongooseCache }).mongoose || { conn: null, promise: null };
(global as { mongoose?: MongooseCache }).mongoose = cached;

/**
 * Connects to MongoDB using Mongoose
 * Uses connection caching to prevent multiple connections during development
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: MONGODB_DB,
    };
    cached.promise = mongoose.connect(MONGODB_URL!, opts);
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
import mongoose from 'mongoose';

// Use environment variables with fallback to hardcoded for development
const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://set_yusuf_29:415GoRcS0lO5gbEL@cluster0.hktblwm.mongodb.net/?appName=Cluster0";
const MONGODB_DB = process.env.MONGODB_DB || "dashboard_ex";

if (!MONGODB_URL) {
  throw new Error('MongoDB connection string not available');
}

// Cache the connection so hot-reload doesn't open multiple connections
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

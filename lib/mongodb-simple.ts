import { MongoClient, Db } from 'mongodb';

// Simple MongoDB connection without complex caching
let client: MongoClient | null = null;

// MongoDB connection configuration
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/';
const MONGODB_DB = process.env.MONGODB_DB || 'dashboard_ex';

// Connect to MongoDB database
export async function getDatabase(): Promise<Db> {
  try {
    if (!client) {
      console.log('Creating new MongoDB client...');
      client = new MongoClient(MONGODB_URL);
      await client.connect();
      console.log('MongoDB connected successfully!');
    }
    
    const db = client.db(MONGODB_DB);
    console.log(`Using database: ${MONGODB_DB}`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Close MongoDB connection
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    console.log('MongoDB connection closed');
  }
}

// Test connection
export async function testConnection(): Promise<boolean> {
  try {
    const db = await getDatabase();
    await db.admin().ping();
    console.log('MongoDB connection test successful');
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return false;
  }
}

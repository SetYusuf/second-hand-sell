import { MongoClient, Db } from 'mongodb';

// ========================================
// MONGODB CONNECTION SETUP
// ========================================
// 
// STEP 1: Create .env.local file in your project root
// STEP 2: Add your MongoDB connection details there:
//
// MONGODB_URL=your_connection_url_here
// MONGODB_DB=your_database_name_here
//
// CONNECTION URL EXAMPLES:
// - Local MongoDB: mongodb://localhost:27017
// - MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/
// - MongoDB with auth: mongodb://username:password@host:port/database
//
// DATABASE NAME EXAMPLES:
// - MONGODB_DB=dashboard_ex
// - MONGODB_DB=my_app_db
// ========================================

// NOTE: Add your MongoDB connection URL to .env.local file
// Example: MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
// For local: MONGODB_URL=mongodb://localhost:27017
const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017/';

// NOTE: Add your database name to .env.local file
// Example: MONGODB_DB=your_database_name
const dbName = process.env.MONGODB_DB || 'dashboard_ex';

// Connection options - you can customize these if needed
const options = {
  // Add custom options here if needed
  // maxPoolSize: 10,
  // serverSelectionTimeoutMS: 5000,
  // connectTimeoutMS: 10000,
  // retryWrites: true,
  // w: 'majority'
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// ========================================
// HELPER FUNCTIONS
// ========================================
// Use these functions to interact with your database

// Get database instance - use this in your API routes
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  // Uses your database name from .env.local or defaults to dashboard_ex
  return client.db(dbName);
}

// Connect to database - returns both client and db instances
export async function connectToDatabase() {
  const client = await clientPromise;
  // Uses your database name from .env.local or defaults to dashboard_ex
  const db = client.db(dbName);
  
  return { client, db };
}

// ========================================
// USAGE EXAMPLES
// ========================================
/*
// In your API route:
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection('login'); // Your collection name
    const users = await collection.find({}).toArray();
    
    return Response.json(users);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// Example for login data:
export async function POST(request: Request) {
  try {
    const db = await getDatabase();
    const collection = db.collection('login'); // Your collection name
    const loginData = await request.json();
    
    const result = await collection.insertOne(loginData);
    
    return Response.json({ success: true, id: result.insertedId });
  } catch (error) {
    return Response.json({ error: 'Failed to create login' }, { status: 500 });
  }
}
*/

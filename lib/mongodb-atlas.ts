import { MongoClient, Db } from 'mongodb';

// MongoDB Atlas connection without complex caching
let client: MongoClient | null = null;

// Load environment variables from mongo.env file
import fs from 'fs';
import path from 'path';

function loadEnvVars() {
  try {
    const envPath = path.join(process.cwd(), 'mongo', 'mongo.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');
      const envVars: { [key: string]: string } = {};
      
      lines.forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      });
      
      return envVars;
    }
  } catch (error) {
    console.error('Error loading mongo.env:', error);
  }
  return {};
}

const env = loadEnvVars();
const MONGODB_URL = env.MONGODB_URL || process.env.MONGODB_URL || 'mongodb://localhost:27017/';
const MONGODB_DB = env.MONGODB_DB || process.env.MONGODB_DB || 'dashboard_ex';

console.log('MongoDB URL loaded:', MONGODB_URL ? '✓' : '✗');
console.log('MongoDB DB loaded:', MONGODB_DB);

// Connect to MongoDB Atlas
export async function getDatabase(): Promise<Db> {
  try {
    if (!client) {
      console.log('Creating new MongoDB Atlas client (v3.7.4)...');
      client = new MongoClient(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      await client.connect();
      console.log('MongoDB Atlas connected successfully!');
    }
    
    const db = client.db(MONGODB_DB);
    console.log(`Using database: ${MONGODB_DB}`);
    return db;
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    throw error;
  }
}

// Close MongoDB connection
export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    console.log('MongoDB Atlas connection closed');
  }
}

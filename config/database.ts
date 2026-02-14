// Database Configuration
// NOTE: Update these values in your .env.local file

export const DATABASE_CONFIG = {
  // Your MongoDB connection URL goes here in .env.local
  // Examples:
  // - Local MongoDB: mongodb://localhost:27017
  // - MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/
  // - MongoDB with auth: mongodb://username:password@host:port/
  URL: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  
  // Your database name goes here in .env.local
  // Example: MONGODB_DB=secondhand_sell
  NAME: process.env.MONGODB_DB || 'secondhand_sell',
  
  // Optional: Connection options
  OPTIONS: {
    // Add any MongoDB connection options here
    // maxPoolSize: 10,
    // serverSelectionTimeoutMS: 5000,
    // socketTimeoutMS: 45000,
  }
};

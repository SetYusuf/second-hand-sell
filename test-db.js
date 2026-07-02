const mongoose = require('mongoose');

async function testConnection() {
  try {
    const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Cluster0";
    const DB_NAME = process.env.MONGODB_DB || 'second_hand_sell';
    
    if (!process.env.MONGODB_URL) {
      console.error('❌ MONGODB_URL environment variable is not set');
      console.error('Please set MONGODB_URL in .env.local');
      process.exit(1);
    }
    
    await mongoose.connect(MONGODB_URL, {
      dbName: DB_NAME
    });
    
    console.log('✅ Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Count documents in products collection (or first available)
    const firstCollection = collections[0]?.name;
    if (firstCollection) {
      const count = await mongoose.connection.db.collection(firstCollection).countDocuments();
      console.log(`📝 ${firstCollection} collection has ${count} documents`);
      
      const sample = await mongoose.connection.db.collection(firstCollection).findOne();
      console.log('🔍 Sample document:', sample ? 'Found' : 'No documents found');
    }
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();

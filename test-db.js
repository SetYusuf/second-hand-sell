const mongoose = require('mongoose');

async function testConnection() {
  try {
    const MONGODB_URL = "mongodb+srv://set_yusuf_29:415GoRcS0lO5gbEL@cluster0.hktblwm.mongodb.net/?appName=Cluster0";
    
    await mongoose.connect(MONGODB_URL, {
      dbName: 'dashboard_ex'
    });
    
    console.log('✅ Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Count documents in posts collection
    const postsCount = await mongoose.connection.db.collection('posts').countDocuments();
    console.log(`📝 Posts collection has ${postsCount} documents`);
    
    // Get one sample post
    const samplePost = await mongoose.connection.db.collection('posts').findOne();
    console.log('🔍 Sample post:', samplePost?.title || 'No posts found');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();

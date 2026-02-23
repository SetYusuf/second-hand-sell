const mongoose = require('mongoose');

async function detailedCheck() {
  try {
    const MONGODB_URL = "mongodb+srv://set_yusuf_29:415GoRcS0lO5gbEL@cluster0.hktblwm.mongodb.net/?appName=Cluster0";
    
    await mongoose.connect(MONGODB_URL);
    
    console.log('=== MONGODB CONNECTION DETAILS ===');
    console.log('Connected to:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    // List all databases
    const admin = mongoose.connection.db.admin();
    const databases = await admin.listDatabases();
    console.log('\n=== ALL DATABASES ===');
    databases.databases.forEach(db => {
      console.log(`- ${db.name} (size: ${db.sizeOnDisk} bytes)`);
    });
    
    // Switch to dashboard_ex and check collections
    const dashboardDB = mongoose.connection.useDb('dashboard_ex');
    console.log('\n=== DASHBOARD_EX DATABASE ===');
    
    const collections = await dashboardDB.listCollections().toArray();
    console.log('Collections found:', collections.length);
    collections.forEach(collection => {
      console.log(`- ${collection.name} (type: ${collection.type})`);
    });
    
    // Check posts collection details
    if (collections.some(c => c.name === 'posts')) {
      const postsCollection = dashboardDB.collection('posts');
      const count = await postsCollection.countDocuments();
      console.log(`\nPosts collection has ${count} documents`);
      
      if (count > 0) {
        const posts = await postsCollection.find({}).limit(3).toArray();
        console.log('Sample posts:');
        posts.forEach((post, i) => {
          console.log(`${i+1}. Title: "${post.title}", Brand: "${post.brand}", Price: $${post.price}`);
        });
      }
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

detailedCheck();

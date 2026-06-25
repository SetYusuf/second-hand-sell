/**
 * MongoDB Connection Test Script
 * Run with: node test-mongo-connection.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB || 'dashboard_ex';

console.log('🔍 MongoDB Connection Test');
console.log('==============================');
console.log('📝 Connection String:', MONGODB_URL ? MONGODB_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'NOT SET');
console.log('📝 Database Name:', MONGODB_DB);
console.log('');

if (!MONGODB_URL) {
  console.error('❌ MONGODB_URL is not set in .env.local');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔌 Attempting to connect...');
    
    const conn = await mongoose.connect(MONGODB_URL, {
      dbName: MONGODB_DB,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('');
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('📦 Connected to database:', conn.connection.db.databaseName);
    console.log('🖥️  Host:', conn.connection.host);
    console.log('🔢 Port:', conn.connection.port);
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('');
    console.log('📚 Collections in database:');
    if (collections.length === 0) {
      console.log('   (no collections found)');
    } else {
      collections.forEach(col => console.log('   -', col.name));
    }
    
    await mongoose.disconnect();
    console.log('');
    console.log('👋 Disconnected successfully');
    
  } catch (error) {
    console.log('');
    console.error('❌ CONNECTION FAILED!');
    console.error('');
    console.error('Error details:');
    console.error('  Name:', error.name);
    console.error('  Message:', error.message);
    console.error('');
    
    // Provide troubleshooting hints
    if (error.message.includes('Authentication failed')) {
      console.error('💡 HINT: Authentication failed. Check:');
      console.error('   1. Username and password are correct');
      console.error('   2. Database user has access to this database');
      console.error('   3. User was created for this specific cluster');
      console.error('   4. Password doesn\'t contain special characters that need URL encoding');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('💡 HINT: Cannot resolve hostname. Check:');
      console.error('   1. Internet connection is working');
      console.error('   2. MongoDB cluster is active');
    } else if (error.message.includes('timeout')) {
      console.error('💡 HINT: Connection timed out. Check:');
      console.error('   1. IP address is whitelisted in MongoDB Atlas');
      console.error('   2. Firewall is not blocking MongoDB port (27017)');
    }
    
    process.exit(1);
  }
}

testConnection();
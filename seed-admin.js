import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb+srv://second_hand_sell:Q90vymkK2DcKoUEU@cluster0.hktblwm.mongodb.net/second_hand_sell';
const DB_NAME = 'second_hand_sell';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  avatar: { type: String, default: null },
  phone: { type: String, default: null },
  location: { type: String, default: null },
  bio: { type: String, default: null },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log('Connected to MongoDB');

    const email = 'setyusuf12@gmail.com';
    const password = '#Yu12345';
    const name = 'Set Yusuf';

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.log('Admin user exists. Updating role to admin...');
      existingUser.role = 'admin';
      existingUser.name = name;
      existingUser.isEmailVerified = true;
      await existingUser.save();
      console.log('Admin user updated successfully');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
      });
      await admin.save();
      console.log('Admin user created successfully');
    }

    console.log('\nAdmin credentials:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Role: admin');
    console.log('\nLogin at: /login');
    console.log('   Will redirect to: /dashboardadmin');

    await mongoose.disconnect();
    console.log('\nDone');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedAdmin();
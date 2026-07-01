import { getDB } from './db';
import mongoose from 'mongoose';

// ========================================
// MONGODB COLLECTION HELPERS
// ========================================
// Use these functions to get MongoDB collections for native driver operations

export async function getUsers() {
  const db = await getDB();
  if (!db) throw new Error('Database not connected');
  return db.collection('users');
}

export async function getProducts() {
  const db = await getDB();
  if (!db) throw new Error('Database not connected');
  return db.collection('products');
}

export async function getImages() {
  const db = await getDB();
  if (!db) throw new Error('Database not connected');
  return db.collection('images');
}

export async function getChats() {
  const db = await getDB();
  if (!db) throw new Error('Database not connected');
  return db.collection('chats');
}

export async function getNotifications() {
  const db = await getDB();
  if (!db) throw new Error('Database not connected');
  return db.collection('notifications');
}

// ========================================
// MONGOOSE MODELS
// ========================================

// Product Schema & Model
export interface IProduct {
  _id?: mongoose.Types.ObjectId;
  title: string;
  type: string;
  brand: string;
  specs: string;
  condition: string;
  price: number;
  description: string;
  location: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  imageUrl: string;
  userId: string;
  status?: 'active' | 'removed' | 'pending' | 'rejected';
  featured?: boolean;
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  title: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  specs: { type: String },
  condition: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  location: { type: String, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  userId: { type: String, required: true },
  status: { type: String, enum: ['active', 'removed', 'pending', 'rejected'], default: 'active' },
  featured: { type: Boolean, default: false },
  rejectReason: { type: String, default: '' },
}, { timestamps: true });


export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// User Schema & Model
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string | null;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  isEmailVerified?: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  avatar: { type: String, default: null },
  phone: { type: String, default: null },
  location: { type: String, default: null },
  bio: { type: String, default: null },
  isEmailVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null, select: false },
  resetPasswordExpires: { type: Date, default: null, select: false },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Message Schema & Model
export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  conversationId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: { createdAt: true, updatedAt: false } });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

// Conversation Schema & Model
export interface IConversation {
  _id?: mongoose.Types.ObjectId;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new mongoose.Schema<IConversation>({
  participants: { type: [String], required: true, index: true },
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
  unreadCount: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

// Follow Schema & Model
export interface IFollow {
  _id?: mongoose.Types.ObjectId;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

const FollowSchema = new mongoose.Schema<IFollow>({
  followerId: { type: String, required: true, index: true },
  followingId: { type: String, required: true, index: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const Follow = mongoose.models.Follow || mongoose.model<IFollow>('Follow', FollowSchema);

// ========================================
// TYPES
// ========================================


export interface IImage {
  _id?: mongoose.Types.ObjectId;
  filename: string;
  mimeType: string;
  data: string;
  size: number;
  uploadedAt: Date;
}

export interface IChat {
  _id?: mongoose.Types.ObjectId;
  participants: string[];
  messages: {
    senderId: string;
    content: string;
    timestamp: Date;
  }[];
  updatedAt: Date;
  createdAt: Date;
}

export interface INotification {
  _id?: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}
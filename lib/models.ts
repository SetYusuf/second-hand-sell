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
}, { timestamps: true });

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

// User Schema & Model
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  avatar: { type: String },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

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
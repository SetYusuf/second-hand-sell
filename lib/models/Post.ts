import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
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

const PostSchema = new Schema<IPost>({
  title:        { type: String, required: true },
  type:         { type: String, required: true },
  brand:        { type: String, required: true },
  specs:        { type: String },
  condition:    { type: String, required: true },
  price:        { type: Number, required: true },
  description:  { type: String },
  location:     { type: String, required: true },
  contactName:  { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  imageUrl:     { type: String, default: '' },
  userId:       { type: String, required: true },
}, { timestamps: true });

// Prevent model re-compilation during hot reload
export default mongoose.models.Post ||
  mongoose.model<IPost>('Post', PostSchema);

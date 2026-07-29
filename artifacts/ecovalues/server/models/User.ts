import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  studentId: string;
  major: string;
  points: number;
  itemsRecycled: number;
  badge?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: { type: String, required: true, unique: true },
  major: { type: String, default: "Công nghệ Thông tin" },
  points: { type: Number, default: 2450 },
  itemsRecycled: { type: Number, default: 10 },
  badge: { type: String, default: "Đại Sứ Xanh" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

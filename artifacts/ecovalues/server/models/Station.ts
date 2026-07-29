import mongoose, { Schema, Document } from 'mongoose';

export interface IStation extends Document {
  stationId: string;
  name: string;
  campus: 'CS1' | 'CS2';
  campusName: string;
  building: string;
  floor: string;
  location: string;
  types: string[];
  status: 'active' | 'full' | 'maintenance';
  capacity: number;
  lastCollected: string;
  hours: string;
  lat: number;
  lng: number;
}

const StationSchema: Schema = new Schema({
  stationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  campus: { type: String, enum: ['CS1', 'CS2'], required: true },
  campusName: { type: String, required: true },
  building: { type: String },
  floor: { type: String },
  location: { type: String, required: true },
  types: [{ type: String }],
  status: { type: String, enum: ['active', 'full', 'maintenance'], default: 'active' },
  capacity: { type: Number, default: 45 },
  lastCollected: { type: String, default: '10:30 Hôm nay' },
  hours: { type: String, default: '08:00 - 20:00' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

export default mongoose.models.Station || mongoose.model<IStation>('Station', StationSchema);

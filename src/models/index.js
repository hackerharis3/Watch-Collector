import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
  founded_year: { type: Number },
  website: { type: String }
}, { timestamps: true });

const CollectionSchema = new mongoose.Schema({
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true }
}, { timestamps: true });

const MovementSchema = new mongoose.Schema({
  manufacturer: { type: String, required: true },
  calibre: { type: String, required: true },
  type: { type: String, required: true },
  jewels: { type: Number },
  frequency: { type: String },
  power_reserve: { type: String }
}, { timestamps: true });

const WatchSchema = new mongoose.Schema({
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  collection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  model_name: { type: String, required: true },
  reference_number: { type: String, required: true, unique: true },
  movement_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movement' },
  case_diameter: { type: String },
  case_thickness: { type: String },
  case_material: { type: String },
  crystal: { type: String },
  water_resistance: { type: String },
  dial_color: { type: String },
  strap: { type: String },
  power_reserve: { type: String },
  release_year: { type: Number },
  image_url: { type: String }
}, { timestamps: true });

export const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
export const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
export const Movement = mongoose.models.Movement || mongoose.model('Movement', MovementSchema);
export const Watch = mongoose.models.Watch || mongoose.model('Watch', WatchSchema);

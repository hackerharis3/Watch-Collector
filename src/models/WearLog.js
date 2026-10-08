import mongoose from "mongoose";

const WearLogSchema = new mongoose.Schema({
  watch_id:     { type: mongoose.Schema.Types.ObjectId, ref: "CollectionWatch", required: true },
  date:         { type: Date, required: true, default: () => new Date() },
  occasion:     { type: String, default: "" },      // "Work", "Date Night", "Travel", "Workout", etc.
  outfit_notes: { type: String, default: "" },       // Free text about the outfit
  weather:      { type: String, default: "" },       // "Sunny", "Rainy", "Cold", "Hot", etc.
  rating:       { type: Number, min: 1, max: 5, default: null },
  photo:        { type: String, default: "" },
  notes:        { type: String, default: "" },
}, { timestamps: true });

// Compound index for fast queries: by watch and by date
WearLogSchema.index({ watch_id: 1, date: -1 });
WearLogSchema.index({ date: -1 });

export const WearLog =
  mongoose.models.WearLog ||
  mongoose.model("WearLog", WearLogSchema);

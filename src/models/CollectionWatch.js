import mongoose from "mongoose";

// CollectionWatch - simple watch schema used by the Gallery UI.
// Separate from the complex horological Watch model.
const CollectionWatchSchema = new mongoose.Schema({
  brand:            { type: String, required: true },
  model:            { type: String, required: true },
  movement:         { type: String, default: "Quartz" },
  caliber:          { type: String, default: "" },
  type:             { type: [String], default: [] },
  complications:    { type: [String], default: [] },
  features:         { type: [String], default: [] },
  occasions:        { type: [String], default: [] },
  in_collection:    { type: Boolean, default: true },
  image:            { type: String, default: "" },
  case_diameter:    { type: String, default: "" },
  case_material:    { type: String, default: "" },
  crystal:          { type: String, default: "" },
  water_resistance: { type: String, default: "" },
  lug_width:        { type: String, default: "" },
  year:             { type: String, default: "" },
}, { timestamps: true });

export const CollectionWatch =
  mongoose.models.CollectionWatch ||
  mongoose.model("CollectionWatch", CollectionWatchSchema);

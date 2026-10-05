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
  // ── Acquisition & Provenance ──
  purchase_price:     { type: Number, default: null },
  purchase_date:      { type: Date, default: null },
  purchase_from:      { type: String, default: "" },
  current_value:      { type: Number, default: null },
  serial_number:      { type: String, default: "" },
  reference_number:   { type: String, default: "" },
  condition:          { type: String, default: "" },
  box_papers:         { type: String, default: "" },

  // ── Extended Specs ──
  dial_color:         { type: String, default: "" },
  strap_material:     { type: String, default: "" },
  strap_color:        { type: String, default: "" },
  case_back:          { type: String, default: "" },
  case_shape:         { type: String, default: "" },
  case_thickness:     { type: String, default: "" },
  power_reserve:      { type: String, default: "" },
  frequency:          { type: String, default: "" },
  jewels:             { type: Number, default: null },
  lug_to_lug:         { type: String, default: "" },

  // ── Rich Content & Legacy Fields ──
  notes:              { type: String, default: "" },
  rating:             { type: Number, min: 1, max: 5, default: null },
  photos:             { type: [String], default: [] },
  service_history:    [{ date: Date, notes: String }],
  accuracy:           { type: String, default: "" },
  wrist_time_hours:   { type: Number, default: 0 },
  memories:           [{ date: Date, story: String, location: String }],

  // ── Status & Tracking ──
  status:             { type: String, default: "active" }, // active, sold, gifted, lost, retired
  sold_date:          { type: Date, default: null },
  sold_price:         { type: Number, default: null },
}, { timestamps: true });

export const CollectionWatch =
  mongoose.models.CollectionWatch ||
  mongoose.model("CollectionWatch", CollectionWatchSchema);

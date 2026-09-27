import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { CollectionWatch } from "@/models/CollectionWatch";

// Default watches to seed on first run
const DEFAULT_WATCHES = [
  {
    brand: "HMT", model: "Vijay", movement: "Manual-Wind",
    type: ["Dress", "Vintage"], complications: ["Date"],
    features: ["White Dial", "Gold Hands", "Arabic Numerals"],
    occasions: ["Formal", "Business Casual"], in_collection: true,
    image: "images/watch_dress_classic.png", caliber: "HMT 0231",
    case_material: "Stainless Steel", crystal: "Acrylic",
    water_resistance: "30m", case_diameter: "36mm", lug_width: "18mm", year: "1980s",
  },
  {
    brand: "Casio", model: "GA-B2100LUU-8A", movement: "Tough Solar",
    type: ["Sports", "Digital-Analog"], complications: ["Chronograph", "World Time", "Timer", "Alarm"],
    features: ["Bluetooth", "Black Dial", "Carbon Core Guard", "LED Light"],
    occasions: ["Casual", "Sports"], in_collection: true,
    image: "images/watch_sports_gshock.png", caliber: "Module 5680",
    case_material: "Carbon/Resin", crystal: "Mineral",
    water_resistance: "200m", case_diameter: "45.4mm", lug_width: "22mm", year: "2024",
  },
  {
    brand: "Swatch", model: "New Gent", movement: "Quartz",
    type: ["Casual", "Fashion"], complications: [],
    features: ["Colorful Dial", "Silicone Strap", "Swiss Made"],
    occasions: ["Casual"], in_collection: true,
    image: "images/watch_casual_swatch.png", caliber: "ETA Normflatwerk",
    case_material: "Bio-Sourced Plastic", crystal: "Acrylic",
    water_resistance: "30m", case_diameter: "41mm", lug_width: "20mm", year: "2023",
  },
  {
    brand: "Orient", model: "Bambino V2", movement: "Automatic",
    type: ["Dress", "Classic"], complications: ["Date"],
    features: ["Domed Crystal", "Cream Dial", "Exhibition Back"],
    occasions: ["Formal", "Business Casual"], in_collection: true,
    image: "images/watch_orient_bambino.png", caliber: "F6722",
    case_material: "Stainless Steel", crystal: "Mineral (Domed)",
    water_resistance: "30m", case_diameter: "40.5mm", lug_width: "21mm", year: "2022",
  },
  {
    brand: "Casio", model: "F-91W", movement: "Quartz",
    type: ["Digital", "Retro"], complications: ["Alarm", "Chronograph"],
    features: ["LED Backlight", "Iconic Design", "7-Year Battery"],
    occasions: ["Casual", "Sports"], in_collection: true,
    image: "images/watch_digital_retro.png", caliber: "Module 593",
    case_material: "Resin", crystal: "Acrylic",
    water_resistance: "30m", case_diameter: "33.2mm", lug_width: "18mm", year: "1989",
  },
  {
    brand: "Seiko", model: "SKX007", movement: "Automatic",
    type: ["Diver", "Sports"], complications: ["Date", "Day"],
    features: ["Rotating Bezel", "Lume", "Exhibition Back"],
    occasions: ["Casual", "Sports"], in_collection: false,
    image: "images/watch_automatic_diver.png", caliber: "7S26",
    case_material: "Stainless Steel", crystal: "Hardlex",
    water_resistance: "200m", case_diameter: "42mm", lug_width: "22mm", year: "1996",
  },
];

/** GET /api/collection — fetch all watches, seed defaults if empty */
export async function GET() {
  try {
    await dbConnect();
    let watches = await CollectionWatch.find({}).sort({ createdAt: 1 }).lean();

    // First-time seed
    if (watches.length === 0) {
      const seeded = await CollectionWatch.insertMany(DEFAULT_WATCHES);
      watches = seeded.map((w) => w.toObject ? w.toObject() : w);
    }

    // Normalize _id -> id for the frontend
    const normalized = watches.map(({ _id, __v, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));

    return NextResponse.json({ success: true, watches: normalized });
  } catch (err) {
    console.error("[GET /api/collection]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/collection — add a new watch */
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const watch = await CollectionWatch.create(body);
    const { _id, __v, ...rest } = watch.toObject();
    return NextResponse.json({ success: true, watch: { ...rest, id: _id.toString() } }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/collection]", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

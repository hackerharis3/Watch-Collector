const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// We need to define models directly since the exported models in src/models/index.js might be ES Modules
const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  country: { type: String },
  founded_year: { type: Number },
  website: { type: String }
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
  model_name: { type: String, required: true },
  reference_number: { type: String, required: true, unique: true },
  movement_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movement' },
  case_diameter: { type: String },
  case_material: { type: String },
  water_resistance: { type: String },
  dial_color: { type: String },
  release_year: { type: Number }
}, { timestamps: true });

const Brand = mongoose.models.Brand || mongoose.model('Brand', BrandSchema);
const Movement = mongoose.models.Movement || mongoose.model('Movement', MovementSchema);
const Watch = mongoose.models.Watch || mongoose.model('Watch', WatchSchema);

const MONGODB_URI = process.env.MONGODB_URI;

const RAW_DATA = [
  {
    "brand": "Casio",
    "model": "G-Shock DW-5600",
    "refNumber": "DW-5600E-1V",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Quartz",
      "waterResistance": "200m",
      "dialColor": "Black",
      "features": ["Shock Resistant", "Alarm", "Stopwatch"],
      "releaseEra": "1996 (original 5600 series 1983)"
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock GA-2100 (CasiOak)",
    "refNumber": "GA-2100-1A1",
    "specifications": {
      "caseMaterial": "Resin/Carbon Core Guard",
      "caseDiameter": "45.4mm",
      "movement": "Quartz",
      "waterResistance": "200m",
      "dialColor": "Black",
      "features": ["Shock Resistant", "World Time", "LED Light"],
      "releaseYear": 2019
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock GA-100",
    "refNumber": "GA-100-1A1",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Quartz (Analog-Digital)",
      "waterResistance": "200m",
      "dialColor": "Black",
      "releaseYear": 2010
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock GD-100",
    "refNumber": "GD-100-1B",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Quartz (Digital)",
      "waterResistance": "200m",
      "dialColor": "Black"
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock Square Screwback",
    "refNumber": "GW-5000-1JF",
    "specifications": {
      "caseMaterial": "Stainless Steel/Resin",
      "movement": "Tough Solar, Multi-Band 6",
      "waterResistance": "200m",
      "dialColor": "Black",
      "notes": "Made in Japan, screw-back case, fan-favorite"
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock Mudmaster",
    "refNumber": "GWG-100-1AJF",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Tough Solar, Multi-Band 6",
      "waterResistance": "200m",
      "features": ["Mud Resistant"]
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock Frogman",
    "refNumber": "GWF-1000-1JF",
    "specifications": {
      "caseMaterial": "Resin/Stainless Steel",
      "movement": "Tough Solar",
      "waterResistance": "200m (ISO diver's)",
      "features": ["Depth Sensor", "Temperature Sensor"]
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock Rangeman",
    "refNumber": "GW-9400-1",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Tough Solar, Triple Sensor",
      "waterResistance": "200m",
      "features": ["Compass", "Altimeter", "Barometer", "Thermometer"]
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock MT-G",
    "refNumber": "MTG-B1000D-1AJF",
    "specifications": {
      "caseMaterial": "Stainless Steel/Resin",
      "movement": "Tough Solar, Bluetooth",
      "waterResistance": "200m"
    }
  },
  {
    "brand": "Casio",
    "model": "Vintage A168",
    "refNumber": "A168WA-1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Quartz (Digital)",
      "waterResistance": "30m",
      "dialColor": "Black/Mirror",
      "features": ["EL Backlight", "Alarm", "Stopwatch"]
    }
  },
  {
    "brand": "Casio",
    "model": "Vintage A158",
    "refNumber": "A158WA-1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Quartz (Digital)",
      "waterResistance": "30m",
      "dialColor": "Silver"
    }
  },
  {
    "brand": "Casio",
    "model": "Vintage AQ230GA",
    "refNumber": "AQ230GA-9BVT",
    "specifications": {
      "caseMaterial": "Gold-tone Stainless Steel",
      "movement": "Quartz (Analog-Digital)",
      "features": ["Dual Time"],
      "batteryLife": "3 years"
    }
  },
  {
    "brand": "Casio",
    "model": "Classic F-91W",
    "refNumber": "F-91W-1",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Quartz (Digital)",
      "waterResistance": "30m",
      "dialColor": "Black",
      "notes": "Best-selling Casio digital watch in history"
    }
  },
  {
    "brand": "Casio",
    "model": "Standard Analog",
    "refNumber": "W-800H-1AV",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Quartz (Analog-Digital)",
      "waterResistance": "50m"
    }
  },
  {
    "brand": "Casio",
    "model": "MTP Classic",
    "refNumber": "MTP-1302L-7BV",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Quartz (Analog)",
      "waterResistance": "50m",
      "dialColor": "Silver"
    }
  },
  {
    "brand": "Casio",
    "model": "Edifice Chronograph",
    "refNumber": "EFR-539D-1AVUDF",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Quartz Chronograph",
      "waterResistance": "100m",
      "dialColor": "Black"
    }
  },
  {
    "brand": "Casio",
    "model": "Pro Trek",
    "refNumber": "PRG-650-1",
    "specifications": {
      "caseMaterial": "Resin/Stainless Steel",
      "movement": "Tough Solar, Triple Sensor",
      "waterResistance": "100m",
      "features": ["Compass", "Altimeter", "Barometer"]
    }
  },
  {
    "brand": "Casio",
    "model": "Illuminator",
    "refNumber": "W-218H-3AVCF",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Quartz (Digital)",
      "waterResistance": "50m",
      "features": ["Chronograph", "Alarm", "Backlight"]
    }
  },
  {
    "brand": "Casio",
    "model": "Sheen",
    "refNumber": "SHE-4050",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Quartz",
      "waterResistance": "50m",
      "notes": "Women's dress line with Swarovski crystals"
    }
  },
  {
    "brand": "Casio",
    "model": "G-Shock GBA-950",
    "refNumber": "GBA-950-1ACR",
    "specifications": {
      "caseMaterial": "Resin",
      "movement": "Quartz (Analog-Digital, Bluetooth)",
      "waterResistance": "200m"
    }
  },

  {
    "brand": "Seiko",
    "model": "Seiko 5 Classic",
    "refNumber": "SNK809K1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "37mm",
      "movement": "Automatic (7S26)",
      "waterResistance": "30m",
      "dialColor": "Black"
    }
  },
  {
    "brand": "Seiko",
    "model": "Seiko 5 Sports SKX Style",
    "refNumber": "SRPD51K1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "42.5mm",
      "movement": "Automatic (4R36)",
      "powerReserve": "41 hours",
      "waterResistance": "100m"
    }
  },
  {
    "brand": "Seiko",
    "model": "Seiko 5 Sports SKX399 Re-issue",
    "refNumber": "SBSA307",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "42.5mm",
      "caseThickness": "13.9mm",
      "movement": "Automatic (4R36, 24 jewels, 21600vph)",
      "powerReserve": "41 hours",
      "waterResistance": "100m"
    }
  },
  {
    "brand": "Seiko",
    "model": "Prospex Diver SKX007",
    "refNumber": "SKX007J1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "42.5mm",
      "movement": "Automatic (7S26)",
      "waterResistance": "200m",
      "notes": "Discontinued 2019, cult favorite dive watch"
    }
  },
  {
    "brand": "Seiko",
    "model": "Prospex Diver SKX013",
    "refNumber": "SKX013K2",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "37.8mm",
      "movement": "Automatic (7S26)",
      "waterResistance": "200m"
    }
  },
  {
    "brand": "Seiko",
    "model": "Prospex Solar Alarm Chrono",
    "refNumber": "SNJ033P1",
    "specifications": {
      "caseMaterial": "Stainless Steel/Resin",
      "movement": "Solar Quartz (Analog-Digital)",
      "waterResistance": "80m",
      "features": ["Dual Time", "Stopwatch", "Dive Log", "Depth Measurement", "Alarm"]
    }
  },
  {
    "brand": "Seiko",
    "model": "Presage Cocktail Time",
    "refNumber": "SSA347J1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Automatic (4R35)",
      "waterResistance": "50m",
      "dialColor": "Blue (Sunburst)"
    }
  },
  {
    "brand": "Seiko",
    "model": "Astron GPS Solar",
    "refNumber": "SSH003",
    "specifications": {
      "caseMaterial": "Titanium",
      "movement": "GPS Solar",
      "waterResistance": "100m"
    }
  },
  {
    "brand": "Seiko",
    "model": "5 Sports SKX",
    "refNumber": "SBSA299",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "38.0mm",
      "caseThickness": "12.1mm",
      "movement": "Automatic (4R36, 24 jewels, 21600vph)",
      "powerReserve": "41 hours",
      "waterResistance": "100m",
      "dialColor": "Blue"
    }
  },
  {
    "brand": "Seiko",
    "model": "Turtle",
    "refNumber": "SRP777K1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "44.3mm",
      "movement": "Automatic (4R36)",
      "waterResistance": "200m",
      "dialColor": "Black"
    }
  },
  {
    "brand": "Seiko",
    "model": "Samurai",
    "refNumber": "SRPB51K1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "43.8mm",
      "movement": "Automatic (4R35)",
      "waterResistance": "200m",
      "dialColor": "Blue"
    }
  },
  {
    "brand": "Seiko",
    "model": "Sumo",
    "refNumber": "SBDC001",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "44.3mm",
      "movement": "Automatic (6R15)",
      "waterResistance": "200m"
    }
  },
  {
    "brand": "Seiko",
    "model": "Alpinist",
    "refNumber": "SARB017",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "38.5mm",
      "movement": "Automatic (6R15)",
      "waterResistance": "200m",
      "dialColor": "Green",
      "notes": "Discontinued, highly sought collector piece"
    }
  },
  {
    "brand": "Seiko",
    "model": "Tuna",
    "refNumber": "SBBN045",
    "specifications": {
      "caseMaterial": "Titanium (shroud)",
      "movement": "Quartz",
      "waterResistance": "1000m"
    }
  },
  {
    "brand": "Seiko",
    "model": "Chronograph",
    "refNumber": "SSB345P1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Quartz Chronograph",
      "waterResistance": "100m"
    }
  },
  {
    "brand": "Seiko",
    "model": "Seiko 5 Sports SNZH Re-creation",
    "refNumber": "SRPK99K1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "42.5mm",
      "movement": "Automatic (4R36)",
      "waterResistance": "100m",
      "dialColor": "Black"
    }
  },
  {
    "brand": "Seiko",
    "model": "Seiko 5 Sports SKX Style (SNZG)",
    "refNumber": "SNZG13K1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "44mm",
      "movement": "Automatic (7S36)",
      "waterResistance": "100m",
      "dialColor": "Black"
    }
  },

  {
    "brand": "HMT",
    "model": "Janata",
    "refNumber": "Cal. 0980",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "dialColor": "White",
      "notes": "Best-selling HMT model historically; made at Bangalore factory from 1961"
    }
  },
  {
    "brand": "HMT",
    "model": "Pilot",
    "refNumber": "Cal. 0980_1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "dialColor": "Black/White",
      "notes": "Favoured by military/pilots for durability"
    }
  },
  {
    "brand": "HMT",
    "model": "Sona",
    "refNumber": "Cal. 0230",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels (Para Shock)",
      "caseDiameter": "38mm",
      "waterResistance": "30m",
      "dialColor": "Golden"
    }
  },
  {
    "brand": "HMT",
    "model": "Kohinoor",
    "refNumber": "Cal. 0980_2",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "notes": "Known for luxurious, intricate dial design"
    }
  },
  {
    "brand": "HMT",
    "model": "Kanchan",
    "refNumber": "Cal. 0980_3",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "notes": "One of the highest-selling HMT models historically"
    }
  },
  {
    "brand": "HMT",
    "model": "Jawan",
    "refNumber": "Cal. 0980_4",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "notes": "Popular affordable option among youth"
    }
  },
  {
    "brand": "HMT",
    "model": "Rajat",
    "refNumber": "Cal. 2602 (Automatic)",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Automatic",
      "notes": "One of HMT's first automatic models"
    }
  },
  {
    "brand": "HMT",
    "model": "Vijay",
    "refNumber": "Cal. 0980_5",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "dialColor": "Non-lume"
    }
  },
  {
    "brand": "HMT",
    "model": "Kapila",
    "refNumber": "Cal. 0170 (Ladies)",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "powerReserve": "48 hours",
      "notes": "One of HMT's first models, produced from 1961"
    }
  },
  {
    "brand": "HMT",
    "model": "Taurus",
    "refNumber": "Cal. 2602 (Automatic)_1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Automatic"
    }
  },
  {
    "brand": "HMT",
    "model": "Braille",
    "refNumber": "Cal. 0980 (Tactile)",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind",
      "notes": "Tactile dial for visually impaired users"
    }
  },
  {
    "brand": "HMT",
    "model": "Chinar",
    "refNumber": "Cal. 0980_6",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels"
    }
  },
  {
    "brand": "HMT",
    "model": "Jubilee (25th Anniversary)",
    "refNumber": "Cal. 0980_7",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Mechanical Hand-wind, 17 jewels",
      "dialColor": "Dappled, Roman numerals",
      "releaseYear": 1987
    }
  },

  {
    "brand": "Ellesse",
    "model": "Performance",
    "refNumber": "03-0001-005",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "34mm",
      "movement": "Swiss Quartz",
      "waterResistance": "50m",
      "strapMaterial": "Leather"
    }
  },
  {
    "brand": "Ellesse",
    "model": "Performance WR200M",
    "refNumber": "03-0034",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "27mm",
      "movement": "Swiss Quartz",
      "waterResistance": "200m",
      "strapMaterial": "Stainless Steel Bracelet"
    }
  },
  {
    "brand": "Ellesse",
    "model": "Sports Quartz",
    "refNumber": "03-0128 / P889.15PI",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "movement": "Quartz",
      "waterResistance": "30m",
      "dialColor": "Royal Blue",
      "strapMaterial": "Rubber"
    }
  },
  {
    "brand": "Ellesse",
    "model": "Dress Watch",
    "refNumber": "03-0377-504",
    "specifications": {
      "caseMaterial": "Solid Stainless Steel",
      "movement": "Quartz",
      "features": ["Day/Date", "Water Resistant"]
    }
  },
  {
    "brand": "Ellesse",
    "model": "Sport Chronograph",
    "refNumber": "03-0407-503",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "bandMaterial": "Stainless Steel",
      "movement": "Quartz",
      "features": ["Chronograph", "Date", "Water Resistant"]
    }
  },
  {
    "brand": "Ellesse",
    "model": "Dress",
    "refNumber": "03-0461-502",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "bandMaterial": "Stainless Steel",
      "movement": "Swiss Quartz",
      "features": ["Date"],
      "countryOfOrigin": "Switzerland"
    }
  },
  {
    "brand": "Ellesse",
    "model": "P-1400CH Chronograph",
    "refNumber": "03-0468-504",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "44mm",
      "bandMaterial": "Stainless Steel",
      "movement": "Quartz",
      "features": ["Chronograph", "Day/Date", "Water Resistant"],
      "notes": "Bi-color retrograde chronograph"
    }
  },
  {
    "brand": "Ellesse",
    "model": "P-1500AN Analog-Digital",
    "refNumber": "03-0469-502",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "44mm",
      "movement": "Quartz",
      "features": ["Multiple-Time", "Alarm", "Chronograph"],
      "display": "Analog & Digital"
    }
  },
  {
    "brand": "Ellesse",
    "model": "P-900CH Chronograph",
    "refNumber": "03-0407-503_1",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "42mm",
      "bandMaterial": "Stainless Steel",
      "movement": "Quartz",
      "features": ["Chronograph", "Date", "Water Resistant"]
    }
  },
  {
    "brand": "Ellesse",
    "model": "Fly-back Three-Eye Chronograph",
    "refNumber": "03-0625-501",
    "specifications": {
      "caseMaterial": "Stainless Steel",
      "caseDiameter": "40mm",
      "dialColor": "Silver",
      "movement": "Quartz",
      "style": "Sport"
    }
  },

  {
    "brand": "Swatch",
    "model": "Originals \"Big Enuff\"",
    "refNumber": "GB151",
    "specifications": {
      "caseMaterial": "Plastic",
      "caseDiameter": "34mm",
      "movement": "Swiss Quartz",
      "waterResistance": "30m",
      "dialColor": "Silver/Multicolor",
      "releaseYear": 1993
    }
  },
  {
    "brand": "Swatch",
    "model": "Originals \"Glance\" (Piero Fornasetti)",
    "refNumber": "GB149",
    "specifications": {
      "caseMaterial": "Plastic",
      "caseDiameter": "34mm",
      "movement": "Swiss Quartz",
      "waterResistance": "30m",
      "releaseYear": 1991
    }
  },
  {
    "brand": "Swatch",
    "model": "Originals \"Annie Leibovitz Olympic Portrait\"",
    "refNumber": "GB178",
    "specifications": {
      "movement": "Swiss Quartz",
      "releaseYear": 1996,
      "notes": "Atlanta Olympics commemorative"
    }
  },
  {
    "brand": "Swatch",
    "model": "\"Knight of the Night\"",
    "refNumber": "GB716",
    "specifications": {
      "movement": "Swiss Quartz",
      "releaseYear": 1990
    }
  },
  {
    "brand": "Swatch",
    "model": "Originals \"Franco\"",
    "refNumber": "GG110",
    "specifications": {
      "movement": "Swiss Quartz",
      "releaseYear": 1991
    }
  },
  {
    "brand": "Swatch",
    "model": "Chrono \"Lodge\"",
    "refNumber": "SCB111",
    "specifications": {
      "movement": "Swiss Quartz Chronograph",
      "strapMaterial": "Leather",
      "releaseYear": 1992
    }
  },
  {
    "brand": "Swatch",
    "model": "Scuba 200 \"Happy Fish\"",
    "refNumber": "SDN101",
    "specifications": {
      "movement": "Swiss Quartz",
      "waterResistance": "200m",
      "releaseYear": 1991
    }
  },
  {
    "brand": "Swatch",
    "model": "Scuba 200 \"Medusa\"",
    "refNumber": "SDS100",
    "specifications": {
      "movement": "Swiss Quartz",
      "waterResistance": "200m",
      "releaseYear": 1991
    }
  },
  {
    "brand": "Swatch",
    "model": "Automatic \"Time & Stripes\"",
    "refNumber": "SAN105",
    "specifications": {
      "movement": "Swiss Automatic",
      "releaseYear": 1994
    }
  },
  {
    "brand": "Swatch",
    "model": "Lady \"Nadia Comaneci\"",
    "refNumber": "LZ105",
    "specifications": {
      "movement": "Swiss Quartz",
      "releaseYear": 1995,
      "notes": "Atlanta Olympics commemorative"
    }
  },
  {
    "brand": "Swatch",
    "model": "Special \"Metrica\"",
    "refNumber": "GK263",
    "specifications": {
      "movement": "Swiss Quartz",
      "dialColor": "Yellow",
      "releaseYear": 1998
    }
  },
  {
    "brand": "Swatch",
    "model": "Special (shoulder strap)",
    "refNumber": "GK340",
    "specifications": {
      "movement": "Swiss Quartz",
      "releaseYear": 2001
    }
  },
  {
    "brand": "Swatch",
    "model": "Touch \"Bunnysutra\"",
    "refNumber": "STGK101",
    "specifications": {
      "movement": "Swiss Quartz",
      "releaseYear": 2004
    }
  },
  {
    "brand": "Swatch",
    "model": "x Omega Moonswatch \"Mission to the Moon\"",
    "refNumber": "SO33M100",
    "specifications": {
      "caseMaterial": "Bioceramic",
      "caseDiameter": "42mm",
      "movement": "Swiss Quartz Chronograph",
      "releaseYear": 2022
    }
  },
  {
    "brand": "Swatch",
    "model": "x Omega Moonswatch \"Mission on Earth\"",
    "refNumber": "SO33T100",
    "specifications": {
      "caseMaterial": "Bioceramic",
      "caseDiameter": "42mm",
      "movement": "Swiss Quartz Chronograph",
      "releaseYear": 2022
    }
  },
  {
    "brand": "Swatch",
    "model": "Bioceramic Scuba Fifty Fathoms",
    "refNumber": "SO35B400",
    "specifications": {
      "caseMaterial": "Bioceramic",
      "movement": "Swiss Quartz",
      "waterResistance": "200m"
    }
  },
  {
    "brand": "Swatch",
    "model": "Big Bold",
    "refNumber": "SO34S700",
    "specifications": {
      "caseMaterial": "Bioceramic",
      "movement": "Swiss Quartz",
      "waterResistance": "50m",
      "dialColor": "Orange"
    }
  }
];

async function importData() {
  if (!MONGODB_URI) {
    console.error('Please define MONGODB_URI in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to local MongoDB database...');

    console.log(`Starting import of ${RAW_DATA.length} watches...`);

    for (const item of RAW_DATA) {
      // 1. Find or create the brand
      let brandDoc = await Brand.findOne({ name: item.brand });
      if (!brandDoc) {
        brandDoc = await Brand.create({ name: item.brand });
        console.log(`Created new Brand: ${item.brand}`);
      }

      // 2. We don't have collection or movement logic fully specified for this dump,
      // so we'll just parse the movement text and insert it into a dummy movement doc if needed,
      // or we just save the watch without strict movement mapping since movement_id is optional.
      // But wait, our API route expects watch.movement_id?.type
      
      let movementDoc = null;
      if (item.specifications && item.specifications.movement) {
        const movementStr = item.specifications.movement;
        // Since movement requires manufacturer, calibre, type:
        // We'll just create a dummy one
        movementDoc = await Movement.findOne({ type: movementStr });
        if (!movementDoc) {
          movementDoc = await Movement.create({
            manufacturer: item.brand,
            calibre: 'Unknown',
            type: movementStr
          });
        }
      }

      // 3. Upsert the Watch
      // Use refNumber to prevent duplicates if script is run multiple times
      const watchExists = await Watch.findOne({ reference_number: item.refNumber });
      if (!watchExists) {
        await Watch.create({
          brand_id: brandDoc._id,
          model_name: item.model,
          reference_number: item.refNumber,
          movement_id: movementDoc ? movementDoc._id : undefined,
          case_diameter: item.specifications?.caseDiameter || '',
          case_material: item.specifications?.caseMaterial || '',
          water_resistance: item.specifications?.waterResistance || '',
          dial_color: item.specifications?.dialColor || '',
          release_year: item.specifications?.releaseYear || null
        });
        console.log(`Imported: ${item.brand} ${item.model}`);
      } else {
        console.log(`Skipped (Already exists): ${item.brand} ${item.model}`);
      }
    }

    console.log('Database import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing database:', error);
    process.exit(1);
  }
}

importData();
m o d u l e . e x p o r t s   =   R A W _ D A T A ;  
 
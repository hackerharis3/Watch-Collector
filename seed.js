import mongoose from 'mongoose';
import { Brand, Collection, Movement, Watch } from './src/models/index.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error('Please define MONGODB_URI in .env.local');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to local MongoDB database...');

    // Clear existing data
    console.log('Clearing old data...');
    await Brand.deleteMany({});
    await Collection.deleteMany({});
    await Movement.deleteMany({});
    await Watch.deleteMany({});

    // Create Brands
    console.log('Creating brands...');
    const rolex = await Brand.create({ name: 'Rolex', country: 'Switzerland', founded_year: 1905 });
    const omega = await Brand.create({ name: 'Omega', country: 'Switzerland', founded_year: 1848 });
    const breitling = await Brand.create({ name: 'Breitling', country: 'Switzerland', founded_year: 1884 });

    // Create Collections
    console.log('Creating collections...');
    const subCollection = await Collection.create({ brand_id: rolex._id, name: 'Submariner' });
    const speedCollection = await Collection.create({ brand_id: omega._id, name: 'Speedmaster' });
    const naviCollection = await Collection.create({ brand_id: breitling._id, name: 'Navitimer' });

    // Create Movements
    console.log('Creating movements...');
    const cal3135 = await Movement.create({ manufacturer: 'Rolex', calibre: '3135', type: 'Automatic', power_reserve: '48h' });
    const cal3861 = await Movement.create({ manufacturer: 'Omega', calibre: '3861', type: 'Manual Winding', power_reserve: '50h' });
    const calB01 = await Movement.create({ manufacturer: 'Breitling', calibre: 'B01', type: 'Automatic', power_reserve: '70h' });

    // Create Watches
    console.log('Creating watches...');
    await Watch.create([
      {
        brand_id: rolex._id,
        collection_id: subCollection._id,
        model_name: 'Submariner Date',
        reference_number: '116610LN',
        movement_id: cal3135._id,
        case_diameter: '40mm',
        case_material: 'Oystersteel',
        release_year: 2010,
        image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=400'
      },
      {
        brand_id: omega._id,
        collection_id: speedCollection._id,
        model_name: 'Speedmaster Professional Moonwatch',
        reference_number: '310.30.42.50.01.001',
        movement_id: cal3861._id,
        case_diameter: '42mm',
        case_material: 'Steel',
        release_year: 2021,
        image_url: 'https://images.unsplash.com/photo-1623998021450-85c29c644e0d?auto=format&fit=crop&q=80&w=400'
      },
      {
        brand_id: breitling._id,
        collection_id: naviCollection._id,
        model_name: 'Navitimer B01 Chronograph 43',
        reference_number: 'AB0138241G1A1',
        movement_id: calB01._id,
        case_diameter: '43mm',
        case_material: 'Stainless Steel',
        release_year: 2022,
        image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=400'
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

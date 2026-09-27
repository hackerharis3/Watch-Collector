import { NextResponse } from 'next/server';
import { watchesData } from '../../watchesData';

const RAPIDAPI_HOST = 'watch-database1.p.rapidapi.com';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const apiToken = searchParams.get('api_token');
  const RAPIDAPI_KEY = apiToken || process.env.RAPIDAPI_KEY;

  // If a valid RapidAPI key is configured, use the live API
  if (RAPIDAPI_KEY && RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY_HERE') {
    try {
      const response = await fetch(`https://${RAPIDAPI_HOST}/make`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
      });

      if (!response.ok) {
        throw new Error(`RapidAPI returned ${response.status}`);
      }

      const data = await response.json();

      // Normalize — API returns array of make objects with id and name
      let brands = [];
      if (Array.isArray(data)) {
        brands = data.map(b => (typeof b === 'string' ? b : b.name || b.brand || b.Make || '')).filter(Boolean).sort();
      } else if (data.data && Array.isArray(data.data)) {
        brands = data.data.map(b => (typeof b === 'string' ? b : b.name || b.brand || '')).filter(Boolean).sort();
      }

      // Also store IDs for later use
      let makeMap = {};
      if (Array.isArray(data)) {
        data.forEach(b => {
          const name = typeof b === 'string' ? b : (b.name || b.brand || b.Make || '');
          const id = typeof b === 'object' ? (b.id || b._id || b.makeId || '') : '';
          if (name) makeMap[name] = id;
        });
      }

      return NextResponse.json({ data: brands, makeMap, source: 'rapidapi' });
    } catch (err) {
      console.error('RapidAPI brand list failed, falling back to local:', err.message);
    }
  }

  // Fallback: use local static data
  const uniqueBrands = [...new Set(watchesData.map(w => w.brand))].sort();
  return NextResponse.json({ data: uniqueBrands, source: 'local' });
}

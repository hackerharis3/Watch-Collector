import { NextResponse } from 'next/server';
import { watchesData } from '../../watchesData';

const RAPIDAPI_HOST = 'watch-database1.p.rapidapi.com';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const brandName = searchParams.get('brand');
  const search = searchParams.get('search');
  const searchAttrs = searchParams.get('search_attributes');
  const apiToken = searchParams.get('api_token');
  
  const RAPIDAPI_KEY = apiToken || process.env.RAPIDAPI_KEY;

  // If a valid RapidAPI key is configured, use the live API
  if (RAPIDAPI_KEY && RAPIDAPI_KEY !== 'YOUR_RAPIDAPI_KEY_HERE') {
    try {
      let watches = [];

      if (search) {
        // Use POST /search-watches-by-name endpoint
        const formData = new URLSearchParams();
        formData.append('searchTerm', search);
        formData.append('limit', '30');
        formData.append('page', '1');

        const response = await fetch(`https://${RAPIDAPI_HOST}/search-watches-by-name`, {
          method: 'POST',
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        });

        if (!response.ok) {
          if (response.status === 404) {
            watches = []; // No watches found, will trigger brand fallback
          } else if (response.status === 401 || response.status === 403) {
            return NextResponse.json({ error: { code: 'unauthorized', message: 'Invalid or expired RapidAPI key.' } }, { status: 401 });
          } else if (response.status === 429 || response.status === 402) {
            throw new Error('API rate limit reached');
          } else {
            throw new Error(`RapidAPI returned ${response.status}`);
          }
        } else {
          const data = await response.json();
          watches = Array.isArray(data) ? data : (data.data || data.results || data.watches || []);
        }

        // If no watches found by name, it might be a brand name (e.g. they typed "Rolex")
        if (watches.length === 0) {
          const makesRes = await fetch(`https://${RAPIDAPI_HOST}/make`, {
            headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': RAPIDAPI_HOST }
          });
          if (makesRes.ok) {
            const makes = await makesRes.json();
            const makesList = Array.isArray(makes) ? makes : (makes.data || []);
            const matchedMake = makesList.find(m => {
              const name = typeof m === 'string' ? m : (m.name || m.Make || m.brand || '');
              return name.toLowerCase() === search.toLowerCase();
            });
            if (matchedMake) {
              const makeId = typeof matchedMake === 'string' ? matchedMake : (matchedMake.id || matchedMake._id || matchedMake.makeId || matchedMake.MakeId || '');
              if (makeId) {
                const watchesRes = await fetch(`https://${RAPIDAPI_HOST}/watches/make/${makeId}/page/1/limit/30`, {
                  headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': RAPIDAPI_HOST }
                });
                if (watchesRes.ok) {
                  const watchesData = await watchesRes.json();
                  watches = Array.isArray(watchesData) ? watchesData : (watchesData.data || watchesData.results || watchesData.watches || []);
                }
              }
            }
          }
        }
      } else if (brandName) {
        // First get makes to find the makeId
        const makesRes = await fetch(`https://${RAPIDAPI_HOST}/make`, {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST,
          },
        });

        if (!makesRes.ok) throw new Error(`Failed to fetch makes: ${makesRes.status}`);
        const makes = await makesRes.json();
        
        // Find the make ID for the brand name
        const makesList = Array.isArray(makes) ? makes : (makes.data || []);
        const matchedMake = makesList.find(m => {
          const name = typeof m === 'string' ? m : (m.name || m.Make || m.brand || '');
          return name.toLowerCase() === brandName.toLowerCase();
        });

        if (matchedMake) {
          const makeId = typeof matchedMake === 'string' ? matchedMake : (matchedMake.id || matchedMake._id || matchedMake.makeId || matchedMake.MakeId || '');
          
          if (makeId) {
            // Use GET /watches/make/{makeID}/page/{page}/limit/{limit}
            const watchesRes = await fetch(`https://${RAPIDAPI_HOST}/watches/make/${makeId}/page/1/limit/30`, {
              headers: {
                'x-rapidapi-key': RAPIDAPI_KEY,
                'x-rapidapi-host': RAPIDAPI_HOST,
              },
            });

            if (watchesRes.ok) {
              const watchesData = await watchesRes.json();
              watches = Array.isArray(watchesData) ? watchesData : (watchesData.data || watchesData.results || watchesData.watches || []);
            }
          }
        }

        // If no watches found by make ID, try search by brand name
        if (watches.length === 0) {
          const formData = new URLSearchParams();
          formData.append('searchTerm', brandName);
          formData.append('limit', '30');
          formData.append('page', '1');

          const searchRes = await fetch(`https://${RAPIDAPI_HOST}/search-watches-by-name`, {
            method: 'POST',
            headers: {
              'x-rapidapi-key': RAPIDAPI_KEY,
              'x-rapidapi-host': RAPIDAPI_HOST,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
          });

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            watches = Array.isArray(searchData) ? searchData : (searchData.data || searchData.results || []);
          }
        }
      }

      // Map to frontend format — handle various field naming conventions
      const formattedWatches = watches.slice(0, 100).map(w => ({
        brand: w.makeName || w.brand || w.Brand || w.make || w.Make || '',
        model: w.modelName || w.model || w.Model || w.name || w.Name || '',
        reference_number: w.reference || w.reference_number || w.referenceNumber || w.Reference || w.ref || w.Ref || '',
        movement: w.movementName || w.movement || w.Movement || w.caliber_type || w.CalibreType || '',
        case_material: w.caseMaterialName || w.case_material || w.caseMaterial || w.CaseMaterial || w.Case || '',
        case_diameter: w.case_diameter || w.caseDiameter || w.CaseDiameter || w.diameter || w.Diameter || '',
        crystal: w.crystalName || w.crystal || w.Crystal || w.glass || w.Glass || '',
        water_resistance: w.waterResistanceName || w.water_resistance || w.waterResistance || w.WaterResistance || w.water_resistant || '',
        caliber: w.caliber || w.Caliber || w.calibre || w.Calibre || '',
        year_of_production: w.yearProducedName || w.year_of_production || w.yearOfProduction || w.year || w.Year || w.produced || '',
        description: w.descriptionContent || w.description || w.Description || '',
        image: w.watchImageName ? `https://watchbase.com/api/watches/image/model/${w.watchImageName}` : (w.image || w.Image || w.image_url || w.imageUrl || w.photo || w.Photo || ''),
        last_updated: w.last_updated || w.updated_at || w.updatedAt || '',
      }));

      return NextResponse.json({ data: formattedWatches, source: 'rapidapi' });
    } catch (err) {
      console.error('RapidAPI search failed, falling back to local:', err.message);
    }
  }

  // ── Fallback: use local static data ────────────────────
  let results = watchesData;

  if (brandName) {
    results = results.filter(w => w.brand.toLowerCase() === brandName.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(w => {
      if (searchAttrs === 'reference_number') {
        return w.refNumber && w.refNumber.toLowerCase().includes(term);
      }
      return (w.brand && w.brand.toLowerCase().includes(term)) || 
             (w.model && w.model.toLowerCase().includes(term)) ||
             (w.refNumber && w.refNumber.toLowerCase().includes(term));
    });
  }

  const formattedWatches = results.map(w => ({
    brand: w.brand,
    model: w.model,
    reference_number: w.refNumber,
    movement: w.specifications?.movement || 'Unknown',
    case_material: w.specifications?.caseMaterial || 'Unknown',
    case_diameter: w.specifications?.caseDiameter || '',
    crystal: w.specifications?.crystal || '',
    water_resistance: w.specifications?.waterResistance || '',
    caliber: w.specifications?.caliber || '',
    year_of_production: w.specifications?.releaseYear || w.specifications?.releaseEra || '',
    description: '',
    image: '',
    last_updated: '',
  }));

  return NextResponse.json({ data: formattedWatches, source: 'local' });
}

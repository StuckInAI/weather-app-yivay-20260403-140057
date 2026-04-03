import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  if (API_KEY === 'demo') {
    const mockCities = [
      { name: 'London', country: 'GB', state: 'England', lat: 51.5074, lon: -0.1278 },
      { name: 'Los Angeles', country: 'US', state: 'California', lat: 34.0522, lon: -118.2437 },
      { name: 'Lagos', country: 'NG', state: 'Lagos', lat: 6.5244, lon: 3.3792 },
      { name: 'Lisbon', country: 'PT', state: '', lat: 38.7169, lon: -9.1399 },
      { name: 'Lyon', country: 'FR', state: 'Auvergne-Rhône-Alpes', lat: 45.7640, lon: 4.8357 },
    ];
    const filtered = mockCities.filter((c) =>
      c.name.toLowerCase().startsWith(query.toLowerCase())
    );
    return NextResponse.json(filtered);
  }

  try {
    const res = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    return NextResponse.json(
      data.map((item: { name: string; country: string; state?: string; lat: number; lon: number }) => ({
        name: item.name,
        country: item.country,
        state: item.state || '',
        lat: item.lat,
        lon: item.lon,
      }))
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([]);
  }
}

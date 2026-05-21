import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let airportsData = null;

function loadAirports() {
  if (!airportsData) {
    try {
      const dataPath = path.join(process.cwd(), 'data', 'airports.json');
      const fileContent = fs.readFileSync(dataPath, 'utf-8');
      airportsData = JSON.parse(fileContent);
    } catch (e) {
      console.error('Failed to load airports data', e);
      airportsData = [];
    }
  }
  return airportsData;
}

/**
 * Handles GET requests to fetch flight data.
 * Supports searching by exact IATA code or resolving airport names.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response containing flight array or error.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const flight_iata = searchParams.get('flight_iata');
  let arr_iata = searchParams.get('arr_iata');
  
  if (arr_iata && arr_iata.length > 3) {
    const query = arr_iata.toLowerCase();
    const airports = loadAirports();
    
    const matches = airports.filter(a => a.name && a.name.toLowerCase().includes(query) && a.iata && a.status === 1);
    
    if (matches.length > 0) {
      matches.sort((a, b) => {
        const sizeWeight = { 'large': 3, 'medium': 2, 'small': 1 };
        return (sizeWeight[b.size] || 0) - (sizeWeight[a.size] || 0);
      });
      arr_iata = matches[0].iata;
    }
  }
  
  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey || apiKey.includes('your_aviation_key')) {
    return NextResponse.json({ error: 'AviationStack API key is missing. Update .env.local' }, { status: 500 });
  }

  try {
    let url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}`;
    if (flight_iata) url += `&flight_iata=${encodeURIComponent(flight_iata)}`;
    if (arr_iata) url += `&arr_iata=${encodeURIComponent(arr_iata)}`;
    
    if (!flight_iata && !arr_iata) url += `&flight_status=active&limit=15`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error.info || 'Failed to fetch flight data');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch real-time weather and geocoding data.
 *
 * @param {Request} request - The incoming HTTP request.
 * @returns {Promise<NextResponse>} JSON response containing weather and geo data.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here_do_not_share_in_chat') {
    return NextResponse.json({ error: 'API key is missing or invalid. Please update your .env.local file.' }, { status: 500 });
  }

  try {
    let url = '';
    let forecastUrl = '';
    
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${apiKey}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&units=metric&appid=${apiKey}`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    } else {
      return NextResponse.json({ error: 'Please provide city or coordinates' }, { status: 400 });
    }

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(url),
      fetch(forecastUrl)
    ]);

    if (!weatherRes.ok) {
      const errorData = await weatherRes.json();
      return NextResponse.json({ error: errorData.message || 'Failed to fetch weather data' }, { status: weatherRes.status });
    }
    if (!forecastRes.ok) {
      const errorData = await forecastRes.json();
      return NextResponse.json({ error: errorData.message || 'Failed to fetch forecast data' }, { status: forecastRes.status });
    }

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    let aqiData = null;
    let geoData = null;
    if (weatherData.coord) {
      const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`;
      const aqiRes = await fetch(aqiUrl);
      if (aqiRes.ok) {
        aqiData = await aqiRes.json();
      }

      const geoUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&limit=1&appid=${apiKey}`;
      const geoRes = await fetch(geoUrl);
      if (geoRes.ok) {
        geoData = await geoRes.json();
      }
    }

    return NextResponse.json({ current: weatherData, forecast: forecastData, aqi: aqiData, geo: geoData });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

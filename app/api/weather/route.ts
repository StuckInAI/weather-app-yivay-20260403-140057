import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY || 'demo';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: 'City or coordinates required' }, { status: 400 });
  }

  if (API_KEY === 'demo') {
    return NextResponse.json(getMockWeatherData(city || 'Current Location'));
  }

  try {
    let latitude = lat;
    let longitude = lon;
    let locationName = city || 'Current Location';

    if (city && !lat && !lon) {
      const geoRes = await fetch(
        `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error('Geocoding failed');
      const geoData = await geoRes.json();
      if (!geoData.length) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }
      latitude = geoData[0].lat.toString();
      longitude = geoData[0].lon.toString();
      locationName = `${geoData[0].name}, ${geoData[0].country}`;
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`),
      fetch(`${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Weather API failed');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const dailyForecasts = processForecast(forecastData.list);

    return NextResponse.json({
      location: locationName || `${currentData.name}, ${currentData.sys.country}`,
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        wind_speed: Math.round(currentData.wind.speed * 3.6),
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        visibility: Math.round((currentData.visibility || 0) / 1000),
        pressure: currentData.main.pressure,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
      },
      forecast: dailyForecasts,
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}

function processForecast(list: ForecastItem[]) {
  const daily: Record<string, ForecastItem[]> = {};

  list.forEach((item: ForecastItem) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!daily[date]) daily[date] = [];
    daily[date].push(item);
  });

  return Object.entries(daily).slice(0, 5).map(([date, items]) => {
    const temps = items.map((i) => i.main.temp);
    const icons = items.map((i) => i.weather[0].icon);
    const descriptions = items.map((i) => i.weather[0].description);
    return {
      date,
      temp_min: Math.round(Math.min(...temps)),
      temp_max: Math.round(Math.max(...temps)),
      icon: icons[Math.floor(icons.length / 2)],
      description: descriptions[Math.floor(descriptions.length / 2)],
      humidity: Math.round(items.reduce((a, b) => a + b.main.humidity, 0) / items.length),
    };
  });
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

function getMockWeatherData(cityName: string) {
  const forecasts = [
    { date: 'Mon, Jan 1', temp_min: 12, temp_max: 22, icon: '01d', description: 'clear sky', humidity: 55 },
    { date: 'Tue, Jan 2', temp_min: 10, temp_max: 19, icon: '02d', description: 'few clouds', humidity: 60 },
    { date: 'Wed, Jan 3', temp_min: 8, temp_max: 16, icon: '10d', description: 'light rain', humidity: 75 },
    { date: 'Thu, Jan 4', temp_min: 9, temp_max: 18, icon: '03d', description: 'scattered clouds', humidity: 65 },
    { date: 'Fri, Jan 5', temp_min: 11, temp_max: 21, icon: '01d', description: 'clear sky', humidity: 50 },
  ];

  return {
    location: cityName,
    current: {
      temp: 18,
      feels_like: 16,
      humidity: 62,
      wind_speed: 14,
      description: 'partly cloudy',
      icon: '02d',
      visibility: 10,
      pressure: 1013,
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 21600,
    },
    forecast: forecasts,
  };
}

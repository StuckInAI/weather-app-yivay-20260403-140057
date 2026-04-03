'use client';

import { useState, useEffect, useCallback } from 'react';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import ForecastCard from './ForecastCard';
import WeatherSkeleton from './WeatherSkeleton';
import { WeatherData } from '@/types/weather';

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bgGradient, setBgGradient] = useState('from-blue-600 via-blue-500 to-cyan-400');

  const fetchWeather = useCallback(async (params: { city?: string; lat?: number; lon?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (params.city) query.set('city', params.city);
      if (params.lat !== undefined) query.set('lat', params.lat.toString());
      if (params.lon !== undefined) query.set('lon', params.lon.toString());

      const res = await fetch(`/api/weather?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch weather');
        return;
      }

      setWeatherData(data);
      updateBackground(data.current.icon);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBackground = (icon: string) => {
    if (icon.includes('01')) {
      setBgGradient('from-amber-400 via-orange-400 to-yellow-300');
    } else if (icon.includes('02') || icon.includes('03') || icon.includes('04')) {
      setBgGradient('from-slate-500 via-blue-400 to-sky-300');
    } else if (icon.includes('09') || icon.includes('10') || icon.includes('11')) {
      setBgGradient('from-slate-700 via-slate-500 to-blue-400');
    } else if (icon.includes('13')) {
      setBgGradient('from-blue-200 via-slate-200 to-white');
    } else {
      setBgGradient('from-blue-600 via-blue-500 to-cyan-400');
    }
  };

  useEffect(() => {
    fetchWeather({ city: 'London' });
  }, [fetchWeather]);

  const handleSearch = (city: string) => {
    fetchWeather({ city });
  };

  const handleCoordinates = (lat: number, lon: number) => {
    fetchWeather({ lat, lon });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} transition-all duration-1000`}>
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">🌤 Weather App</h1>
            <p className="text-white/80 text-sm">Real-time forecasts for any location</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} onLocationSearch={handleCoordinates} />
          </div>

          {/* Content */}
          {loading && <WeatherSkeleton />}

          {error && !loading && (
            <div className="bg-red-500/20 border border-red-400/50 rounded-2xl p-6 text-center backdrop-blur-sm">
              <p className="text-white text-lg font-medium">⚠️ {error}</p>
              <button
                onClick={() => fetchWeather({ city: 'London' })}
                className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {weatherData && !loading && (
            <div className="space-y-6">
              <CurrentWeather data={weatherData} />
              <div>
                <h2 className="text-white/90 font-semibold text-lg mb-4 px-1">5-Day Forecast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {weatherData.forecast.map((day, index) => (
                    <ForecastCard key={index} forecast={day} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { Wind, Droplets, Eye, Gauge, Thermometer, Sunrise, Sunset } from 'lucide-react';
import { WeatherData } from '@/types/weather';

interface CurrentWeatherProps {
  data: WeatherData;
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  const { current, location } = data;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWeatherEmoji = (icon: string) => {
    if (icon.includes('01')) return '☀️';
    if (icon.includes('02')) return '⛅';
    if (icon.includes('03') || icon.includes('04')) return '☁️';
    if (icon.includes('09')) return '🌧️';
    if (icon.includes('10')) return '🌦️';
    if (icon.includes('11')) return '⛈️';
    if (icon.includes('13')) return '❄️';
    if (icon.includes('50')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/30 shadow-xl">
      {/* Location and main temp */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/70 text-sm">📍</span>
            <span className="text-white/90 font-medium">{location}</span>
          </div>
          <p className="text-white/60 text-xs capitalize">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-7xl">{getWeatherEmoji(current.icon)}</span>
          <div>
            <div className="text-7xl font-thin text-white leading-none">{current.temp}°</div>
            <div className="text-white/70 capitalize mt-1">{current.description}</div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Feels Like"
          value={`${current.feels_like}°C`}
        />
        <StatCard
          icon={<Droplets className="w-5 h-5" />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <StatCard
          icon={<Wind className="w-5 h-5" />}
          label="Wind Speed"
          value={`${current.wind_speed} km/h`}
        />
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          label="Visibility"
          value={`${current.visibility} km`}
        />
        <StatCard
          icon={<Gauge className="w-5 h-5" />}
          label="Pressure"
          value={`${current.pressure} hPa`}
        />
        <StatCard
          icon={<Sunrise className="w-5 h-5" />}
          label="Sunrise"
          value={formatTime(current.sunrise)}
        />
        <StatCard
          icon={<Sunset className="w-5 h-5" />}
          label="Sunset"
          value={formatTime(current.sunset)}
        />
        <StatCard
          icon={<Thermometer className="w-5 h-5" />}
          label="Condition"
          value={current.icon.includes('n') ? 'Night' : 'Day'}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 flex items-center gap-3 border border-white/20">
      <div className="text-white/70">{icon}</div>
      <div>
        <p className="text-white/60 text-xs">{label}</p>
        <p className="text-white font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

'use client';

import { DailyForecast } from '@/types/weather';

interface ForecastCardProps {
  forecast: DailyForecast;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
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

  const [dayName, ...rest] = forecast.date.split(',');

  return (
    <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg hover:bg-white/20 transition-all hover:scale-105 cursor-default">
      <p className="text-white/80 font-semibold text-sm text-center">{dayName}</p>
      <p className="text-white/50 text-xs text-center mb-3">{rest.join(',').trim()}</p>
      <div className="text-3xl text-center mb-3">{getWeatherEmoji(forecast.icon)}</div>
      <p className="text-white/70 text-xs text-center capitalize mb-3">{forecast.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-white font-bold text-sm">{forecast.temp_max}°</span>
        <span className="text-white/50 text-sm">{forecast.temp_min}°</span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-1">
        <span className="text-blue-300 text-xs">💧</span>
        <span className="text-white/60 text-xs">{forecast.humidity}%</span>
      </div>
    </div>
  );
}

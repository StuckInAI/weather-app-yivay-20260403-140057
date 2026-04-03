export interface CurrentWeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon: string;
  visibility: number;
  pressure: number;
  sunrise: number;
  sunset: number;
}

export interface DailyForecast {
  date: string;
  temp_min: number;
  temp_max: number;
  icon: string;
  description: string;
  humidity: number;
}

export interface WeatherData {
  location: string;
  current: CurrentWeatherData;
  forecast: DailyForecast[];
}

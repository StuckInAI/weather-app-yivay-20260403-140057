'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';

interface SearchResult {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
}

export default function SearchBar({ onSearch, onLocationSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data);
        setShowDropdown(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowDropdown(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(`${result.name}, ${result.country}`);
    setShowDropdown(false);
    onLocationSearch(result.lat, result.lon);
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSearch(position.coords.latitude, position.coords.longitude);
        setLocating(false);
        setQuery('');
      },
      () => {
        alert('Unable to retrieve your location');
        setLocating(false);
      }
    );
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            placeholder="Search city..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all"
          />
          {searching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4 animate-spin" />
          )}
          {!searching && query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium transition-all hover:scale-105 active:scale-95"
        >
          Search
        </button>
        <button
          type="button"
          onClick={handleGeoLocation}
          disabled={locating}
          title="Use my location"
          className="px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden z-50">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
            >
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <div>
                <span className="font-medium text-gray-800">{result.name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {result.state ? `${result.state}, ` : ''}{result.country}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

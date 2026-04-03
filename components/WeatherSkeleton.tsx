export default function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white/15 rounded-3xl p-6 border border-white/30">
        <div className="flex flex-col md:flex-row md:justify-between mb-6">
          <div className="space-y-2">
            <div className="h-4 bg-white/20 rounded-full w-32"></div>
            <div className="h-3 bg-white/10 rounded-full w-48"></div>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="w-16 h-16 bg-white/20 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-16 bg-white/20 rounded-xl w-24"></div>
              <div className="h-4 bg-white/10 rounded-full w-20"></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/10 rounded-2xl p-3 h-16"></div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-5 bg-white/20 rounded-full w-32 mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/15 rounded-2xl p-4 h-40"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

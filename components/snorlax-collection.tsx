"use client";

export function SnorlaxCollection() {
  return (
    <div className="flex justify-center items-center animate-float group max-w-full">
      <div className="relative max-w-full">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse-slow" />
        
        <div className="animate-sleeping group-hover:scale-110 transition-all duration-300 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 glass p-3 md:p-4 shadow-2xl border-2 border-primary/30 group-hover:border-primary/60 rounded-2xl relative">
          <img 
            src="/snorlax-pixel.gif"
            alt="Snorlax"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm glass px-6 py-2 rounded-full border border-primary/20 shadow-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap font-semibold hover:scale-105">
          Snorlax is vibing 💤✨
        </div>
      </div>
    </div>
  );
}


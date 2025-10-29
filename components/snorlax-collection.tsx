"use client";

export function SnorlaxCollection() {
  return (
    <div className="flex justify-center items-center animate-float group">
      <div className="relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse-slow" />
        
        <div className="animate-sleeping group-hover:scale-110 transition-all duration-300 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 glass p-4 md:p-6 shadow-2xl border-2 border-primary/30 group-hover:border-primary/60 rounded-2xl relative">
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


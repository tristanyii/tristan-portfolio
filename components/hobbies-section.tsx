"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TravelMap } from "./travel-map";
import { PhotographyGallery } from "./photography-gallery";

export function HobbiesSection() {
  const [isTravelMapOpen, setIsTravelMapOpen] = useState(false);
  const [isPhotographyOpen, setIsPhotographyOpen] = useState(false);
  const hobbies = [
    { emoji: "📸", title: "Photography", desc: "View my photo collection from travels and everyday moments.", color: "from-purple-500/20 to-pink-500/10", rotation: "rotate-1", available: true },
    { emoji: "✈️", title: "Traveling", desc: "Explore my travel map and photos from places I've visited.", color: "from-indigo-500/20 to-violet-500/10", rotation: "-rotate-1", available: true },
  ];

  return (
    <>
      <TravelMap isOpen={isTravelMapOpen} onClose={() => setIsTravelMapOpen(false)} />
      <PhotographyGallery isOpen={isPhotographyOpen} onClose={() => setIsPhotographyOpen(false)} />
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {hobbies.map((hobby, idx) => (
        <div
          key={idx}
          className={`group relative ${hobby.available ? 'cursor-pointer' : 'cursor-default'} ${hobby.rotation} hover:rotate-0 ${hobby.available ? 'hover:scale-105' : 'hover:scale-102'} transition-all duration-500`}
            onClick={() => {
              if (hobby.available) {
                if (hobby.title === "Traveling") {
                  setIsTravelMapOpen(true);
                } else if (hobby.title === "Photography") {
                  setIsPhotographyOpen(true);
                }
              }
            }}
          >
          <Card className="relative overflow-hidden glass border-2 border-white/10 hover:border-primary/50 h-full">
            {/* Circular emoji background */}
            <div className={`absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br ${hobby.color} blur-2xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500`} />
            
            {/* Decorative corner element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent group-hover:scale-150 transition-transform duration-700" />
            
            <CardHeader className="relative z-10 pb-2">
              {/* Large centered emoji */}
              <div className="flex justify-center mb-3">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${hobby.color} flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                  <span className="text-5xl">{hobby.emoji}</span>
                </div>
              </div>
              
              <CardTitle className="text-2xl font-bold text-center group-hover:text-primary transition-colors">
                {hobby.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="relative z-10 text-center">
              <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">
                {hobby.desc}
              </p>
              
              {/* Click indicator */}
              <div className="mt-4 text-xs text-primary/0 group-hover:text-primary/70 transition-all duration-300">
                {hobby.available ? "✨ Click to explore" : "🚧 Coming soon"}
              </div>
            </CardContent>
          </Card>
          {/* External twisty arrow pointing to the card */}
          {hobby.available && (
            <svg
              className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-24 text-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-twisty-bounce"
              viewBox="0 0 200 200"
              fill="none"
              aria-hidden="true"
            >
              <path d="M10 110 C 50 70, 90 130, 130 100 S 160 90, 185 100" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M160 88 L186 100 L162 114" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          )}
        </div>
      ))}
    </div>
    </>
  );
}


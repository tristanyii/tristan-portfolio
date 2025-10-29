"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TravelMap } from "./travel-map";
import { PhotographyGallery } from "./photography-gallery";

export function HobbiesSection() {
  const [isTravelMapOpen, setIsTravelMapOpen] = useState(false);
  const [isPhotographyOpen, setIsPhotographyOpen] = useState(false);
  const hobbies = [
    { emoji: "⚽", title: "Sports", desc: "Playing pickup games and staying active. Whether it's basketball, soccer, or hitting the gym, sports keep me energized and competitive.", color: "from-green-500/20 to-emerald-500/10", rotation: "-rotate-1" },
    { emoji: "📸", title: "Photography", desc: "Capturing moments and exploring creative perspectives. Photography helps me see the world differently and appreciate the details.", color: "from-purple-500/20 to-pink-500/10", rotation: "rotate-1" },
    { emoji: "🎵", title: "Music", desc: "Listening to various genres and discovering new artists. Music is my constant companion for focus, relaxation, and motivation.", color: "from-blue-500/20 to-cyan-500/10", rotation: "-rotate-2" },
    { emoji: "🎮", title: "Gaming", desc: "Playing strategy and competitive games. Gaming is a fun way to unwind, challenge myself, and connect with friends online.", color: "from-red-500/20 to-orange-500/10", rotation: "rotate-2" },
    { emoji: "🍔", title: "Eating", desc: "Exploring different cuisines and trying new restaurants. Food is an adventure and a way to experience different cultures.", color: "from-yellow-500/20 to-amber-500/10", rotation: "rotate-1" },
    { emoji: "✈️", title: "Traveling", desc: "Exploring new places and cultures around the world. Each trip brings new perspectives, experiences, and unforgettable memories.", color: "from-indigo-500/20 to-violet-500/10", rotation: "-rotate-1" },
  ];

  return (
    <>
      <TravelMap isOpen={isTravelMapOpen} onClose={() => setIsTravelMapOpen(false)} />
      <PhotographyGallery isOpen={isPhotographyOpen} onClose={() => setIsPhotographyOpen(false)} />
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {hobbies.map((hobby, idx) => (
          <div
            key={idx}
            className={`group cursor-pointer ${hobby.rotation} hover:rotate-0 hover:scale-105 transition-all duration-500`}
            onClick={() => {
              if (hobby.title === "Traveling") {
                setIsTravelMapOpen(true);
              } else if (hobby.title === "Photography") {
                setIsPhotographyOpen(true);
              } else {
                // TODO: Add modal or expanded view for other hobbies
                console.log(`Clicked on ${hobby.title}`);
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
                ✨ Click to explore more
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
    </>
  );
}


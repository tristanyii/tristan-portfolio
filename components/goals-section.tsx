"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GoalsChecklist = dynamic(
  () => import("./goals-checklist").then((m) => m.GoalsChecklist),
  { ssr: false }
);

export function GoalsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <GoalsChecklist isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div
        className="group relative cursor-pointer rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-500"
        onClick={() => setIsOpen(true)}
      >
        <Card className="relative overflow-hidden glass border-2 border-white/10 hover:border-primary/50 h-full">
          <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 blur-2xl opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary/5 to-transparent group-hover:scale-150 transition-transform duration-700" />

          <CardHeader className="relative z-10 pb-2">
            <div className="flex justify-center mb-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <span className="text-5xl">🎯</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center group-hover:text-primary transition-colors">
              2026 Goals
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 text-center">
            <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors">
              Check out what I&apos;m working towards this year — a live checklist of my 2026 goals.
            </p>
            <div className="mt-4 text-xs text-primary/0 group-hover:text-primary/70 transition-all duration-300">
              ✨ Click to explore
            </div>
          </CardContent>
        </Card>

        <img
          src="/12761818.png"
          alt="arrow"
          aria-hidden="true"
          className="pointer-events-none absolute -left-8 md:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 animate-twisty-bounce rotate-12"
        />
      </div>
    </>
  );
}

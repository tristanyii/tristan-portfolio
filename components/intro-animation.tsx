"use client";

import { useState, useEffect } from "react";

export function IntroAnimation() {
  const [phase, setPhase] = useState<"idle" | "snorlax" | "typing" | "exit" | "done">("idle");
  const [typedLen, setTypedLen] = useState(0);
  const name = "Tristan Yi";

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.body.style.overflow = "hidden";
    setPhase("snorlax");

    const t1 = setTimeout(() => setPhase("typing"), 500);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typedLen >= name.length) {
      const t = setTimeout(() => setPhase("exit"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTypedLen((l) => l + 1), 70);
    return () => clearTimeout(t);
  }, [phase, typedLen, name.length]);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(() => {
      document.body.style.overflow = "";
      setPhase("done");
    }, 700);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;
  if (phase === "idle") {
    return <div className="intro-overlay" />;
  }

  return (
    <div
      className={`intro-overlay ${phase === "exit" ? "intro-exit" : ""}`}
    >
      <div className="flex flex-col items-center gap-4 sm:gap-6 px-4">
        <img
          src="/snorlax-pixel.gif"
          alt="Snorlax"
          className={`w-24 h-24 sm:w-36 sm:h-36 object-contain drop-shadow-2xl transition-opacity duration-500 ${
            phase === "snorlax" || phase === "typing" || phase === "exit" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="h-10 sm:h-12 flex items-center">
          {(phase === "typing" || phase === "exit") && (
            <span className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {name.slice(0, typedLen)}
              <span className="intro-cursor">|</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export function IntroAnimation() {
  const [phase, setPhase] = useState<"idle" | "snorlax" | "typing" | "exit" | "done">("idle");
  const [typedLen, setTypedLen] = useState(0);
  const name = "Tristan Yi";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("intro_played")) {
      setPhase("done");
      return;
    }

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
      sessionStorage.setItem("intro_played", "true");
      document.body.style.overflow = "";
      setPhase("done");
    }, 700);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;
  if (phase === "idle") {
    return <div className="intro-overlay" style={{ opacity: 1 }} />;
  }

  return (
    <div
      className={`intro-overlay ${phase === "exit" ? "intro-exit" : ""}`}
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src="/snorlax-pixel.gif"
          alt="Snorlax"
          className={`w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl transition-opacity duration-500 ${
            phase === "snorlax" || phase === "typing" || phase === "exit" ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="h-12 flex items-center">
          {(phase === "typing" || phase === "exit") && (
            <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {name.slice(0, typedLen)}
              <span className="intro-cursor">|</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

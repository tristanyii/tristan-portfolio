"use client";

import { useEffect, useRef } from "react";

type AnimationVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom" | "blur" | "none";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  variant?: AnimationVariant;
  /** Duration override in ms */
  duration?: number;
  /** If true, staggers direct children instead of animating the wrapper */
  stagger?: boolean;
  /** Stagger delay between children in ms */
  staggerInterval?: number;
};

export function Reveal({
  children,
  className = "",
  delayMs = 0,
  variant = "fade-up",
  duration,
  stagger = false,
  staggerInterval = 80,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      el.classList.add("is-visible");
      if (stagger) {
        Array.from(el.children).forEach(c => (c as HTMLElement).classList.add("is-visible"));
      }
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            if (delayMs > 0) target.style.transitionDelay = `${delayMs}ms`;

            if (stagger) {
              Array.from(target.children).forEach((child, i) => {
                const c = child as HTMLElement;
                c.style.transitionDelay = `${delayMs + i * staggerInterval}ms`;
                requestAnimationFrame(() => c.classList.add("is-visible"));
              });
            }

            target.classList.add("is-visible");
            observer.unobserve(target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs, stagger, staggerInterval]);

  const durationStyle = duration ? { transitionDuration: `${duration}ms` } : undefined;

  return (
    <div
      ref={ref}
      className={`reveal reveal--${variant} ${className}`}
      style={durationStyle}
    >
      {children}
    </div>
  );
}

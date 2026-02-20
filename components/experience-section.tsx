"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface Experience {
  role: string;
  org: string;
  location: string;
  date: string;
  num: string;
  description: string;
  bgColor: string;
  bgText: string;
  link?: { href: string; label: string; logo: string; useNext?: boolean };
}

const experiences: Experience[] = [
  {
    num: "01",
    role: "Market Platforms",
    org: "Kalshi",
    location: "NYC, NY",
    date: "Jan 2026 — Present",
    description: "Building features for the world's first regulated prediction market exchange.",
    bgColor: "from-emerald-900/80 to-emerald-950/90",
    bgText: "Kalshi",
    link: { href: "https://kalshi.com/", label: "Kalshi", logo: "/kalshi.png", useNext: true },
  },
  {
    num: "02",
    role: "SWE Intern",
    org: "Duke Code+",
    location: "Durham, NC",
    date: "May 2025 — Jan 2026",
    description: "AI fundraising platform. 1 of 4 from 300+ applicants. Projected $10M+ in gifts.",
    bgColor: "from-blue-900/80 to-blue-950/90",
    bgText: "Code+",
    link: { href: "https://codeplus.duke.edu/project/philanthropy-intelligence-using-aiml-connect-research-and-donors/", label: "Code+", logo: "/CodePlusLogo.png", useNext: true },
  },
  {
    num: "03",
    role: "SWE Intern",
    org: "Blue Devil Buddies",
    location: "Durham, NC",
    date: "Jun — Aug 2025",
    description: "Duke's largest mentorship matching system. 12.5K+ participants, 80% faster processing.",
    bgColor: "from-indigo-900/80 to-indigo-950/90",
    bgText: "BDB",
    link: { href: "https://dukestudentgovernment.org/affiliates/blue-devil-buddies/", label: "Blue Devil Buddies", logo: "/BlueDevilBuddies.png" },
  },
  {
    num: "04",
    role: "SDE Intern",
    org: "AspinRock",
    location: "Durham, NC",
    date: "Mar — Apr 2025",
    description: "AI stock forecasting. 1M+ daily records across 5,000+ companies. 35% accuracy improvement.",
    bgColor: "from-amber-900/80 to-amber-950/90",
    bgText: "Aspin",
    link: { href: "https://www.aspinrock.com/individual", label: "AspinRock", logo: "/aspinrock1_logo.jpeg" },
  },
  {
    num: "05",
    role: "Research Assistant",
    org: "Duke Fuqua",
    location: "Durham, NC",
    date: "Aug 2024 — Jul 2025",
    description: "Automated web-scraping for political finance analysis. 98% dataset accuracy.",
    bgColor: "from-slate-800/80 to-slate-900/90",
    bgText: "Fuqua",
    link: { href: "http://fuqua.duke.edu/", label: "Duke Fuqua", logo: "/DukeFuqua.png" },
  },
];

interface Leadership {
  role: string;
  org: string;
  date: string;
  description: string;
  link: { href: string; label: string; logo: string };
}

const leadership: Leadership[] = [
  {
    role: "Marketing Executive",
    org: "Catalyst",
    date: "Apr 2025 — Jan 2026",
    description: "Duke's largest pre-professional tech org — 150K+ social impressions, 30% attendance boost",
    link: { href: "https://www.instagram.com/dukecatalyst/", label: "Catalyst", logo: "/Catalyst.png" },
  },
  {
    role: "DukeLife Mentor",
    org: "DukeLife",
    date: "Jun 2025 — Present",
    description: "Mentoring first-gen/low-income students — ~25% increase in campus resource use",
    link: { href: "https://dukelife.duke.edu/", label: "DukeLife", logo: "/DukeLife.png" },
  },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (-rect.top + vh * 0.35) / (rect.height - vh * 0.4)));
    setActiveIdx(Math.min(experiences.length - 1, Math.floor(progress * experiences.length)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-10">Experience</p>

      {/* Desktop: expanding columns */}
      <div className="hidden md:flex gap-1.5 h-[540px]">
        {experiences.map((exp, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl cursor-pointer"
              style={{
                flex: isActive ? 6 : 1,
                transition: "flex 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onClick={() => setActiveIdx(i)}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-b ${exp.bgColor}`} />

              {/* Ghost watermark text */}
              <span className="absolute top-6 left-0 right-0 text-center text-[4rem] font-black text-white/[0.05] select-none leading-none tracking-tighter pointer-events-none whitespace-nowrap overflow-hidden">
                {exp.bgText}
              </span>

              {/* Collapsed: vertical org name */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-3 transition-opacity duration-500"
                style={{ opacity: isActive ? 0 : 1, pointerEvents: isActive ? "none" : "auto" }}
              >
                {exp.link && (
                  <div className="w-8 h-8 rounded-md bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                    {exp.link.useNext ? (
                      <Image src={exp.link.logo} alt={exp.link.label} width={24} height={24} className="w-5 h-5 object-contain" unoptimized />
                    ) : (
                      <img src={exp.link.logo} alt={exp.link.label} className="w-5 h-5 object-contain" />
                    )}
                  </div>
                )}
                <div className="writing-vertical-lr rotate-180">
                  <span className="text-[11px] font-medium tracking-widest uppercase text-white/40 whitespace-nowrap">
                    {exp.org}
                  </span>
                </div>
              </div>

              {/* Expanded: full content */}
              <div
                className="absolute inset-0 flex flex-col transition-opacity duration-500"
                style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
              >
                {/* Top area with logo */}
                <div className="flex-1 relative p-6">
                  {exp.link && (
                    <div className="absolute bottom-4 left-6">
                      <div className="w-11 h-11 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                        {exp.link.useNext ? (
                          <Image src={exp.link.logo} alt={exp.link.label} width={32} height={32} className="w-8 h-8 object-contain" unoptimized />
                        ) : (
                          <img src={exp.link.logo} alt={exp.link.label} className="w-8 h-8 object-contain" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom content */}
                <div className="bg-card/95 backdrop-blur-sm border-t border-border p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">
                    Experience {exp.num}
                  </p>
                  <h3 className="text-xl font-bold text-foreground">{exp.org}</h3>

                  <h4 className="text-sm font-semibold text-foreground mt-3 border-b border-foreground/20 pb-1 inline-block">
                    {exp.role}
                  </h4>

                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground/40">{exp.date}</span>
                    {exp.link && (
                      <a
                        href={exp.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground/40 hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: stacked panels */}
      <div className="md:hidden space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="rounded-xl overflow-hidden">
            <div className={`relative h-32 bg-gradient-to-b ${exp.bgColor}`}>
              <span className="absolute inset-0 flex items-center justify-center text-[3.5rem] font-black text-white/[0.05] select-none leading-none tracking-tighter">
                {exp.bgText}
              </span>
              {exp.link && (
                <div className="absolute bottom-3 left-3">
                  <div className="w-9 h-9 rounded-md bg-black/30 backdrop-blur-sm border border-white/10 flex items-center justify-center overflow-hidden">
                    {exp.link.useNext ? (
                      <Image src={exp.link.logo} alt={exp.link.label} width={28} height={28} className="w-6 h-6 object-contain" unoptimized />
                    ) : (
                      <img src={exp.link.logo} alt={exp.link.label} className="w-6 h-6 object-contain" />
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border border-t-0 border-border bg-card rounded-b-xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">Experience {exp.num}</p>
              <h3 className="text-lg font-bold text-foreground">{exp.org}</h3>
              <h4 className="text-sm font-semibold text-foreground mt-2 border-b border-foreground/20 pb-1 inline-block">{exp.role}</h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground/40">{exp.date}</span>
                {exp.link && (
                  <a href={exp.link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-foreground transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot nav */}
      <div className="hidden md:flex justify-center gap-2 mt-6">
        {experiences.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`rounded-full transition-all duration-500 ${
              i === activeIdx ? "w-8 h-1.5 bg-foreground" : "w-1.5 h-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>

      {/* Leadership */}
      <div className="mt-20">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-8">Leadership</p>
        <div className="grid gap-px sm:grid-cols-2 border border-border rounded-lg overflow-hidden">
          {leadership.map((l, i) => (
            <div key={i} className="bg-card p-6 flex flex-col">
              <p className="text-xs font-mono text-muted-foreground/50 mb-3">{l.date}</p>
              <h4 className="text-base font-semibold text-foreground">{l.role}</h4>
              <p className="text-xs text-muted-foreground mb-3">{l.org}</p>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed">{l.description}</p>
              <a href={l.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
                <img src={l.link.logo} alt={l.link.label} className="h-5 w-auto" />
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

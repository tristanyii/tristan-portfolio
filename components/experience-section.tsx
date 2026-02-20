"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface Experience {
  role: string;
  org: string;
  location: string;
  date: string;
  description?: string;
  bullets?: string[];
  tags?: string[];
  link?: { href: string; label: string; logo: string; useNext?: boolean };
  accent: string;
}

const experiences: Experience[] = [
  {
    role: "Market Platforms",
    org: "Kalshi",
    location: "NYC, NY",
    date: "Jan 2026 — Present",
    description: "Mention Markets",
    accent: "bg-emerald-500",
    link: { href: "https://kalshi.com/", label: "Kalshi", logo: "/kalshi.png", useNext: true },
  },
  {
    role: "Software Engineer Intern",
    org: "Duke Code+",
    location: "Durham, NC",
    date: "May — Jan 2026",
    tags: ["Flask", "Python", "Neo4j", "Selenium"],
    accent: "bg-blue-500",
    bullets: [
      '1 of 4 interns from 300+ applicants — built an AI fundraising platform projected to drive $10M+ in gifts',
      'Boosted donor-research match accuracy 40% via Sentence Transformers + Neo4j graph of 2K+ alumni',
      'Cut donor data acquisition time 95% with a Selenium pipeline scraping 13K+ records',
    ],
    link: { href: "https://codeplus.duke.edu/project/philanthropy-intelligence-using-aiml-connect-research-and-donors/", label: "Code+", logo: "/CodePlusLogo.png", useNext: true },
  },
  {
    role: "Software Engineer Intern",
    org: "Blue Devil Buddies",
    location: "Durham, NC",
    date: "Jun — Aug 2025",
    tags: ["Python", "Pandas"],
    accent: "bg-indigo-500",
    bullets: [
      "Built Duke's largest mentorship matching system scaling to 12.5K+ participants",
      "Cut manual processing 80% by standardizing 100K+ survey responses with Pandas",
    ],
    link: { href: "https://dukestudentgovernment.org/affiliates/blue-devil-buddies/", label: "Blue Devil Buddies", logo: "/BlueDevilBuddies.png" },
  },
  {
    role: "Software Developer Intern",
    org: "AspinRock",
    location: "Durham, NC",
    date: "Mar — Apr 2025",
    tags: ["Python", "OpenAI API", "Pandas"],
    accent: "bg-amber-500",
    bullets: [
      'Improved AI stock forecast accuracy 35% via Python + OpenAI API tuning',
      'Built pipeline processing 1M+ daily price records across 5,000+ companies',
    ],
    link: { href: "https://www.aspinrock.com/individual", label: "AspinRock", logo: "/aspinrock1_logo.jpeg" },
  },
  {
    role: "Research Assistant",
    org: "Duke Fuqua",
    location: "Durham, NC",
    date: "Aug 2024 — Jul 2025",
    tags: ["Python", "BeautifulSoup", "Excel"],
    accent: "bg-rose-500",
    bullets: [
      'Automated web-scraping pipelines cutting manual data gathering 9+ hrs/week',
      'Validated legislative financial datasets at 98% accuracy',
    ],
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
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const sectionTop = sectionRef.current.getBoundingClientRect().top;
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportH = window.innerHeight;

    const scrollProgress = Math.max(0, Math.min(1, (-sectionTop + viewportH * 0.4) / (sectionHeight - viewportH * 0.3)));
    const idx = Math.min(experiences.length - 1, Math.floor(scrollProgress * experiences.length));
    setActiveIdx(idx);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={sectionRef} className="max-w-6xl mx-auto">
      {/* Section label */}
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-12">Experience</p>

      {/* Expanding columns — desktop */}
      <div className="hidden md:flex gap-1 h-[520px]">
        {experiences.map((exp, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={i}
              ref={(el) => { columnRefs.current[i] = el; }}
              className="relative overflow-hidden rounded-lg cursor-pointer group"
              style={{
                flex: isActive ? 5 : 0.6,
                transition: "flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onClick={() => setActiveIdx(i)}
            >
              {/* Accent strip when collapsed */}
              <div className={`absolute inset-0 ${exp.accent} opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`} />

              {/* Collapsed state — rotated org name */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                style={{ opacity: isActive ? 0 : 1, pointerEvents: isActive ? "none" : "auto" }}
              >
                <div className="writing-vertical-lr rotate-180 flex flex-col items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${exp.accent} shrink-0`} />
                  <span className="text-xs font-medium tracking-wider uppercase text-muted-foreground whitespace-nowrap">
                    {exp.org}
                  </span>
                </div>
              </div>

              {/* Expanded state — full content */}
              <div
                className="absolute inset-0 p-6 md:p-8 flex flex-col transition-opacity duration-500 overflow-y-auto"
                style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
              >
                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <p className="text-xs font-mono text-muted-foreground/60 tracking-wide mb-3">{exp.date}</p>
                    <h3 className="text-2xl font-bold text-foreground leading-tight">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{exp.org} &middot; {exp.location}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${exp.accent} shrink-0 mt-1`} />
                </div>

                {exp.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {exp.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{t}</span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex-1 text-sm text-muted-foreground leading-relaxed space-y-2">
                  {exp.description && <p>{exp.description}</p>}
                  {exp.bullets?.map((b, j) => (
                    <div key={j} className="flex gap-2.5">
                      <span className="shrink-0 mt-[7px] w-1 h-1 rounded-full bg-muted-foreground/40" />
                      <span dangerouslySetInnerHTML={{ __html: b }} />
                    </div>
                  ))}
                </div>

                {exp.link && (
                  <a
                    href={exp.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-colors group/link self-start"
                  >
                    {exp.link.useNext ? (
                      <Image src={exp.link.logo} alt={exp.link.label} width={80} height={32} className="h-6 w-auto pointer-events-none select-none" unoptimized />
                    ) : (
                      <img src={exp.link.logo} alt={exp.link.label} className="h-6 w-auto pointer-events-none select-none" />
                    )}
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-foreground transition-colors" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile — stacked, no columns */}
      <div className="md:hidden space-y-8">
        {experiences.map((exp, i) => (
          <div key={i} className="relative pl-6 border-l-2 border-border">
            <div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full ${exp.accent}`} />
            <p className="text-xs font-mono text-muted-foreground/60 tracking-wide mb-2">{exp.date}</p>
            <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
            <p className="text-sm text-muted-foreground">{exp.org} &middot; {exp.location}</p>
            {exp.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {exp.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-3 text-sm text-muted-foreground leading-relaxed space-y-1.5">
              {exp.description && <p>{exp.description}</p>}
              {exp.bullets?.map((b, j) => (
                <div key={j} className="flex gap-2">
                  <span className="shrink-0 mt-[7px] w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span dangerouslySetInnerHTML={{ __html: b }} />
                </div>
              ))}
            </div>
            {exp.link && (
              <a href={exp.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {exp.link.useNext ? (
                  <Image src={exp.link.logo} alt={exp.link.label} width={80} height={32} className="h-5 w-auto" unoptimized />
                ) : (
                  <img src={exp.link.logo} alt={exp.link.label} className="h-5 w-auto" />
                )}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Dot nav */}
      <div className="hidden md:flex justify-center gap-2 mt-6">
        {experiences.map((exp, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeIdx ? `w-8 ${exp.accent}` : "w-1.5 bg-muted-foreground/20 hover:bg-muted-foreground/40"
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

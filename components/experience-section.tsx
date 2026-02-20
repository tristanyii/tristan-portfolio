"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { EditableText } from "./editable-text";
import { EditableImage } from "./editable-image";

interface Experience {
  role: string;
  org: string;
  location: string;
  date: string;
  num: string;
  description: string;
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

const SCROLL_PER_ITEM = 700;

export function ExperienceSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [vh, setVh] = useState(800);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    setVh(window.innerHeight);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleScroll = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrolled = -rect.top;

    // Only show content when section top is within half a viewport of the screen
    setSectionVisible(rect.top < vh * 0.5);

    if (scrolled < 0) { setActiveIdx(0); return; }
    const idx = Math.min(experiences.length - 1, Math.floor(scrolled / SCROLL_PER_ITEM));
    setActiveIdx(idx);
  }, [vh]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const totalHeight = SCROLL_PER_ITEM * experiences.length + vh;

  return (
    <>
      {/* Desktop: sticky scroll-locked columns */}
      <div ref={outerRef} className="relative hidden md:block" style={{ height: totalHeight }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div
            className="w-full px-6 lg:px-10 transition-opacity duration-500"
            style={{ opacity: sectionVisible ? 1 : 0 }}
          >
            <p className="text-base uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">Experience</p>
            <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">Work</h2>

            <div className="flex gap-[2px] h-[70vh] max-h-[580px] rounded-xl overflow-hidden">
              {experiences.map((exp, i) => {
                const isActive = i === activeIdx;
                return (
                  <div
                    key={i}
                    className="relative overflow-hidden cursor-pointer"
                    style={{
                      flex: isActive ? 6 : 0.8,
                      transition: "flex 1s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onClick={() => setActiveIdx(i)}
                  >
                    <div className="absolute inset-0 bg-[#161616]" />

                    <div
                      className="absolute inset-0 panel-dots"
                      style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    />

                    <div
                      className="absolute left-0 top-0 bottom-0 w-[2px] z-10"
                      style={{
                        opacity: isActive ? 1 : 0,
                        background: "linear-gradient(180deg, transparent 10%, rgba(255,255,255,0.5) 50%, transparent 90%)",
                        transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />

                    <span className="absolute top-8 left-0 right-0 text-center text-[5rem] font-black text-white/[0.025] select-none leading-none tracking-tighter pointer-events-none whitespace-nowrap overflow-hidden">
                      {exp.bgText}
                    </span>

                    {/* Collapsed */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-3"
                      style={{
                        opacity: isActive ? 0 : 1,
                        pointerEvents: isActive ? "none" : "auto",
                        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      {exp.link && (
                        <div className="w-8 h-8 rounded-md bg-white/[0.06] border border-white/[0.1] flex items-center justify-center overflow-hidden">
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

                    {/* Expanded */}
                    <div
                      className="absolute inset-0 flex flex-col"
                      style={{
                        opacity: isActive ? 1 : 0,
                        pointerEvents: isActive ? "auto" : "none",
                        transform: isActive ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
                        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="flex-1 relative p-8">
                        {exp.link && (
                          <div className="absolute bottom-6 left-8">
                            <div className="w-14 h-14 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center overflow-hidden">
                              <EditableImage
                                contentKey={`exp.${i}.logo`}
                                defaultSrc={exp.link.logo}
                                alt={exp.link.label}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-[#111111] border-t border-white/[0.08] p-6 lg:p-8">
                        <p className="text-sm uppercase tracking-[0.25em] text-white/40 mb-1 font-mono">
                          {exp.num}
                        </p>
                        <EditableText
                          contentKey={`exp.${i}.org`}
                          defaultValue={exp.org}
                          as="h3"
                          className="text-4xl font-bold text-white"
                        />

                        <EditableText
                          contentKey={`exp.${i}.role`}
                          defaultValue={exp.role}
                          as="h4"
                          className="text-xl font-semibold text-white/80 mt-3 border-b border-white/15 pb-1 inline-block"
                        />

                        <EditableText
                          contentKey={`exp.${i}.desc`}
                          defaultValue={exp.description}
                          as="p"
                          className="text-xl text-white/60 mt-3 leading-relaxed"
                          multiline
                        />

                        <div className="mt-4 flex items-center justify-between">
                          <EditableText
                            contentKey={`exp.${i}.date`}
                            defaultValue={exp.date}
                            as="span"
                            className="text-base font-mono text-white/40"
                          />
                          {exp.link && (
                            <a href={exp.link.href} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
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

            {/* Dot nav */}
            <div className="flex justify-center gap-2 mt-5">
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
          </div>
        </div>
      </div>

      {/* Mobile: stacked panels */}
      <div className="md:hidden px-4">
        <p className="text-base uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">Experience</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">Work</h2>
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="relative h-28 bg-[#161616]">
                <div className="absolute inset-0 panel-dots" />
                <span className="absolute inset-0 flex items-center justify-center text-[3rem] font-black text-white/[0.025] select-none leading-none tracking-tighter">
                  {exp.bgText}
                </span>
                {exp.link && (
                  <div className="absolute bottom-3 left-3">
                    <div className="w-10 h-10 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center overflow-hidden">
                      <EditableImage
                        contentKey={`exp.${i}.logo`}
                        defaultSrc={exp.link.logo}
                        alt={exp.link.label}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 border border-t-0 border-border bg-card rounded-b-xl">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">{exp.num}</p>
                <EditableText contentKey={`exp.${i}.org`} defaultValue={exp.org} as="h3" className="text-3xl font-bold text-foreground" />
                <EditableText contentKey={`exp.${i}.role`} defaultValue={exp.role} as="h4" className="text-xl font-semibold text-foreground mt-2 border-b border-foreground/20 pb-1 inline-block" />
                <EditableText contentKey={`exp.${i}.desc`} defaultValue={exp.description} as="p" className="text-xl text-muted-foreground mt-2 leading-relaxed" multiline />
                <div className="mt-3 flex items-center justify-between">
                  <EditableText contentKey={`exp.${i}.date`} defaultValue={exp.date} as="span" className="text-base font-mono text-muted-foreground/40" />
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
      </div>

      {/* Leadership — aligned with Projects section */}
      <div className="mx-auto px-6 lg:px-10 mt-10">
      <div className="max-w-7xl mx-auto">
        <p className="text-base uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">Involvement</p>
        <h2 className="text-5xl sm:text-6xl font-bold text-foreground mb-8">Leadership</h2>
        <div className="grid gap-px sm:grid-cols-2 border border-border rounded-lg overflow-hidden">
          {leadership.map((l, i) => (
            <div key={i} className="bg-card p-6 flex flex-col">
              <EditableText contentKey={`lead.${i}.date`} defaultValue={l.date} as="p" className="text-base font-mono text-muted-foreground/50 mb-3" />
              <EditableText contentKey={`lead.${i}.role`} defaultValue={l.role} as="h4" className="text-2xl font-semibold text-foreground" />
              <EditableText contentKey={`lead.${i}.org`} defaultValue={l.org} as="p" className="text-lg text-muted-foreground mb-3" />
              <EditableText contentKey={`lead.${i}.desc`} defaultValue={l.description} as="p" className="text-xl text-muted-foreground flex-1 leading-relaxed" multiline />
              <a href={l.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
                <EditableImage contentKey={`lead.${i}.logo`} defaultSrc={l.link.logo} alt={l.link.label} className="h-5 w-auto" />
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}

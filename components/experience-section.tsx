"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ExternalLink, Plus, Trash2, GripVertical } from "lucide-react";
import Image from "next/image";
import { EditableText } from "./editable-text";
import { EditableImage } from "./editable-image";
import { useAdmin } from "./admin-provider";
import { useDragReorder } from "@/hooks/use-drag-reorder";

interface Experience {
  role: string;
  org: string;
  location: string;
  date: string;
  num: string;
  description: string;
  bgText: string;
  link?: { href: string; label: string; logo: string; useNext?: boolean };
  isCustom?: boolean;
  customId?: number;
}

const defaultExperiences: Experience[] = [
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
  isCustom?: boolean;
  customId?: number;
}

const defaultLeadership: Leadership[] = [
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

function parseCustomItems<T>(json: string | undefined): T[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

export function ExperienceSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [vh, setVh] = useState(800);
  const [sectionVisible, setSectionVisible] = useState(false);
  const { isAdmin, getContent, setContent, overrides } = useAdmin();

  const customExps = parseCustomItems<Experience>(overrides["added_experiences"]);
  const experiences: Experience[] = [
    ...defaultExperiences,
    ...customExps.map((e, i): Experience => ({ ...e, isCustom: true, customId: i, num: String(defaultExperiences.length + i + 1).padStart(2, "0") })),
  ];

  const customLeads = parseCustomItems<Leadership>(overrides["added_leadership"]);
  const leadership: Leadership[] = [
    ...defaultLeadership,
    ...customLeads.map((l, i): Leadership => ({ ...l, isCustom: true, customId: i })),
  ];

  const addExperience = () => {
    const newExp: Experience = {
      num: "",
      role: "New Role",
      org: "New Company",
      location: "Location",
      date: "Date",
      description: "Description of your work.",
      bgText: "New",
      link: { href: "#", label: "Logo", logo: "" },
    };
    const updated = [...customExps, newExp];
    setContent("added_experiences", JSON.stringify(updated));
  };

  const removeExperience = (customIdx: number) => {
    const updated = customExps.filter((_, i) => i !== customIdx);
    setContent("added_experiences", JSON.stringify(updated));
  };

  const addLeadership = () => {
    const newLead: Leadership = {
      role: "New Role",
      org: "New Organization",
      date: "Date",
      description: "Description of your involvement.",
      link: { href: "#", label: "Link", logo: "" },
    };
    const updated = [...customLeads, newLead];
    setContent("added_leadership", JSON.stringify(updated));
  };

  const removeLeadership = (customIdx: number) => {
    const updated = customLeads.filter((_, i) => i !== customIdx);
    setContent("added_leadership", JSON.stringify(updated));
  };

  useEffect(() => {
    setVh(window.innerHeight);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getExpKey = (exp: Experience, i: number) =>
    exp.isCustom ? `cexp.${exp.customId}` : `exp.${i}`;

  const getLeadKey = (l: Leadership, i: number) =>
    l.isCustom ? `clead.${l.customId}` : `lead.${i}`;

  const expDrag = useDragReorder(experiences, "exp_order", getExpKey);
  const orderedExperiences = expDrag.orderedItems;

  const leadDrag = useDragReorder(leadership, "lead_order", getLeadKey);
  const orderedLeadership = leadDrag.orderedItems;

  const handleScroll = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrolled = -rect.top;
    setSectionVisible(rect.top < vh * 0.5);
    if (scrolled < 0) { setActiveIdx(0); return; }
    const idx = Math.min(orderedExperiences.length - 1, Math.floor(scrolled / SCROLL_PER_ITEM));
    setActiveIdx(idx);
  }, [vh, orderedExperiences.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const totalHeight = SCROLL_PER_ITEM * orderedExperiences.length + vh;

  return (
    <>
      {/* Desktop: sticky scroll-locked columns */}
      <div ref={outerRef} className="relative hidden md:block" style={{ height: totalHeight }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div
            className="w-full px-6 lg:px-10 transition-opacity duration-500"
            style={{ opacity: sectionVisible ? 1 : 0 }}
          >
            <div className="flex items-baseline gap-4 mb-6">
              <div>
                <EditableText contentKey="section.experience.label" defaultValue="Experience" as="p" className="text-base uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
                <EditableText contentKey="section.experience.title" defaultValue="Work" as="h2" className="text-5xl sm:text-6xl font-bold text-foreground" />
              </div>
              {isAdmin && (
                <button
                  onClick={addExperience}
                  className="ml-4 p-2 rounded-lg border border-dashed border-primary/40 text-primary/60 hover:text-primary hover:border-primary transition-colors"
                  title="Add experience"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex gap-[2px] h-[70vh] max-h-[580px] rounded-xl overflow-hidden">
              {orderedExperiences.map((exp, i) => {
                const isActive = i === activeIdx;
                const origIdx = experiences.indexOf(exp);
                const key = getExpKey(exp, origIdx);
                const orgDisplay = getContent(`${key}.org`, exp.org);
                return (
                  <div
                    key={key}
                    className={`relative overflow-hidden cursor-pointer ${expDrag.overIdx === i && expDrag.dragIdx !== i ? "drag-over" : ""}`}
                    {...expDrag.bind(i)}
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

                    <EditableText
                      contentKey={`${key}.bgText`}
                      defaultValue={exp.bgText}
                      as="span"
                      className="absolute top-8 left-0 right-0 text-center text-[5rem] font-black text-white/[0.025] select-none leading-none tracking-tighter whitespace-nowrap overflow-hidden"
                      adminClassName="ghost-text"
                    />

                    {/* Collapsed */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-end pb-6 gap-3"
                      style={{
                        opacity: isActive ? 0 : 1,
                        pointerEvents: isActive ? "none" : "auto",
                        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div className="w-8 h-8 rounded-md bg-white/[0.06] border border-white/[0.1] flex items-center justify-center overflow-hidden">
                        <EditableImage
                          contentKey={`${key}.logo`}
                          defaultSrc={exp.link?.logo || ""}
                          alt={exp.link?.label || exp.org}
                          className="w-5 h-5 object-contain"
                        />
                      </div>
                      <div className="writing-vertical-lr rotate-180">
                        <span className="text-[11px] font-medium tracking-widest uppercase text-white/40 whitespace-nowrap">
                          {orgDisplay}
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
                        <div className="absolute bottom-6 left-8">
                          <div className="w-14 h-14 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center overflow-hidden">
                            <EditableImage
                              contentKey={`${key}.logo`}
                              defaultSrc={exp.link?.logo || ""}
                              alt={exp.link?.label || exp.org}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                        </div>
                        {isAdmin && (
                          <div className="absolute top-4 right-4 flex items-center gap-1.5">
                            <div className="drag-handle p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] transition-colors">
                              <GripVertical className="h-4 w-4 text-white/40" />
                            </div>
                            {exp.isCustom && (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeExperience(exp.customId!); }}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Remove experience"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="bg-[#111111] border-t border-white/[0.08] p-6 lg:p-8">
                        <p className="text-sm uppercase tracking-[0.25em] text-white/40 mb-1 font-mono">
                          {exp.num}
                        </p>
                        <EditableText
                          contentKey={`${key}.org`}
                          defaultValue={exp.org}
                          as="h3"
                          className="text-4xl font-bold text-white"
                        />

                        <EditableText
                          contentKey={`${key}.role`}
                          defaultValue={exp.role}
                          as="h4"
                          className="text-xl font-semibold text-white/80 mt-3 border-b border-white/15 pb-1 inline-block"
                        />

                        <EditableText
                          contentKey={`${key}.desc`}
                          defaultValue={exp.description}
                          as="p"
                          className="text-xl text-white/60 mt-3 leading-relaxed"
                          multiline
                        />

                        <div className="mt-4 flex items-center justify-between">
                          <EditableText
                            contentKey={`${key}.date`}
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
              {orderedExperiences.map((_, i) => (
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
        <div className="flex items-center gap-3 mb-2">
          <EditableText contentKey="section.experience.label" defaultValue="Experience" as="p" className="text-sm uppercase tracking-[0.2em] text-muted-foreground/50" />
          {isAdmin && (
            <button onClick={addExperience} className="p-1 rounded border border-dashed border-primary/40 text-primary/60 hover:text-primary hover:border-primary transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
        <EditableText contentKey="section.experience.title" defaultValue="Work" as="h2" className="text-3xl sm:text-5xl font-bold text-foreground mb-6" />
        <div className="space-y-5">
          {orderedExperiences.map((exp, i) => {
            const origIdx = experiences.indexOf(exp);
            const key = getExpKey(exp, origIdx);
            return (
              <div key={key} className={`rounded-xl overflow-hidden relative ${expDrag.overIdx === i && expDrag.dragIdx !== i ? "drag-over" : ""}`} {...expDrag.bind(i)}>
                {isAdmin && (
                  <div className="absolute top-2 left-2 z-20 drag-handle p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <GripVertical className="h-4 w-4 text-white/50" />
                  </div>
                )}
                {isAdmin && exp.isCustom && (
                  <button
                    onClick={() => removeExperience(exp.customId!)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <div className="relative h-32 bg-[#161616]">
                  <div className="absolute inset-0 panel-dots" />
                  <EditableText
                    contentKey={`${key}.bgText`}
                    defaultValue={exp.bgText}
                    as="span"
                    className="absolute inset-0 flex items-center justify-center text-[3rem] font-black text-white/[0.025] select-none leading-none tracking-tighter"
                    adminClassName="ghost-text"
                  />
                  <div className="absolute bottom-3 left-4">
                    <div className="w-11 h-11 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center overflow-hidden">
                      <EditableImage
                        contentKey={`${key}.logo`}
                        defaultSrc={exp.link?.logo || ""}
                        alt={exp.link?.label || exp.org}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-5 border border-t-0 border-border bg-card rounded-b-xl">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">{exp.num}</p>
                  <EditableText contentKey={`${key}.org`} defaultValue={exp.org} as="h3" className="text-2xl sm:text-3xl font-bold text-foreground" />
                  <EditableText contentKey={`${key}.role`} defaultValue={exp.role} as="h4" className="text-base sm:text-lg font-semibold text-foreground mt-2 border-b border-foreground/20 pb-1 inline-block" />
                  <EditableText contentKey={`${key}.desc`} defaultValue={exp.description} as="p" className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed" multiline />
                  <div className="mt-3 flex items-center justify-between">
                    <EditableText contentKey={`${key}.date`} defaultValue={exp.date} as="span" className="text-sm font-mono text-muted-foreground/40" />
                    {exp.link && (
                      <a href={exp.link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-foreground transition-colors p-1">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership */}
      <div className="mx-auto px-4 sm:px-6 lg:px-10 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 mb-2">
          <EditableText contentKey="section.leadership.label" defaultValue="Involvement" as="p" className="text-base uppercase tracking-[0.2em] text-muted-foreground/50" />
          {isAdmin && (
            <button onClick={addLeadership} className="p-1 rounded border border-dashed border-primary/40 text-primary/60 hover:text-primary hover:border-primary transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
        <EditableText contentKey="section.leadership.title" defaultValue="Leadership" as="h2" className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 sm:mb-8" />
        <div className="grid gap-px sm:grid-cols-2 border border-border rounded-lg overflow-hidden">
          {orderedLeadership.map((l, i) => {
            const origIdx = leadership.indexOf(l);
            const key = getLeadKey(l, origIdx);
            return (
              <div key={key} className={`bg-card p-4 sm:p-6 flex flex-col relative ${leadDrag.overIdx === i && leadDrag.dragIdx !== i ? "drag-over" : ""}`} {...leadDrag.bind(i)}>
                {isAdmin && (
                  <div className="absolute top-3 left-3 drag-handle p-1.5 rounded-lg bg-muted hover:bg-muted-foreground/20 transition-colors z-10">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
                {isAdmin && l.isCustom && (
                  <button
                    onClick={() => removeLeadership(l.customId!)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <EditableText contentKey={`${key}.date`} defaultValue={l.date} as="p" className="text-sm sm:text-base font-mono text-muted-foreground/50 mb-2 sm:mb-3" />
                <EditableText contentKey={`${key}.role`} defaultValue={l.role} as="h4" className="text-xl sm:text-2xl font-semibold text-foreground" />
                <EditableText contentKey={`${key}.org`} defaultValue={l.org} as="p" className="text-base sm:text-lg text-muted-foreground mb-2 sm:mb-3" />
                <EditableText contentKey={`${key}.desc`} defaultValue={l.description} as="p" className="text-base sm:text-lg text-muted-foreground flex-1 leading-relaxed" multiline />
                <a href={l.link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors self-start">
                  <EditableImage contentKey={`${key}.logo`} defaultSrc={l.link.logo} alt={l.link.label} className="h-5 w-auto" />
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </>
  );
}

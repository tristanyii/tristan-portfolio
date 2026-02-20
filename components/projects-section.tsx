"use client";

import { ExternalLink, Plus, Trash2, GripVertical } from "lucide-react";
import { EditableText } from "./editable-text";
import { EditableImage } from "./editable-image";
import { useAdmin } from "./admin-provider";
import { useDragReorder } from "@/hooks/use-drag-reorder";

interface Project {
  title: string;
  subtitle: string;
  award?: string;
  date: string;
  description: string;
  tags: string[];
  link?: { href: string; logo: string; label: string };
  isCustom?: boolean;
  customId?: number;
}

const defaultProjects: Project[] = [
  {
    title: "Excess",
    subtitle: "AI Voice Agent",
    award: "Deutsche Bank Hackathon — 1st Place",
    date: "Oct 2025",
    description: "AI voice agent bridging users to 800+ verified aid programs for housing, food, and energy assistance in underrepresented communities. ~60% lower cost than human ops.",
    tags: ["Python", "Flask", "Retell AI"],
    link: { href: "https://github.com/tristanyii/deutchebank-hackathon", logo: "/Deutsche Bank.png", label: "Deutsche Bank" },
  },
  {
    title: "Devil's Tracker",
    subtitle: "Poker Session App",
    date: "Apr 2025",
    description: "Cross-platform mobile app managing poker sessions — QR-based encoding cut setup from 2min to 10sec, real-time Firebase sync across 30+ games.",
    tags: ["React Native", "TypeScript", "Node.js", "PostgreSQL"],
    link: { href: "https://github.com/tristanyii/poker-tracker-catalyst", logo: "/DevilsTracker.png", label: "Devil's Tracker" },
  },
  {
    title: "GoHelpMe",
    subtitle: "Disaster Response App",
    award: "CUHackIt — 1st Place",
    date: "Mar 2025",
    description: "Disaster-response platform connecting victims with volunteers via real-time geolocation. Backend handled 500+ live help requests during testing.",
    tags: ["React Native", "Expo", "Node.js", "Express", "PostgreSQL"],
    link: { href: "https://devpost.com/software/gohelpme", logo: "/GoHelpMe.jpeg", label: "GoHelpMe" },
  },
  {
    title: "This Website",
    subtitle: "Personal Portfolio",
    date: "2025",
    description: "The site you're on. Real-time Spotify integration, interactive travel map, photography gallery, analytics dashboard, and a goals checklist backed by Postgres.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Spotify API"],
  },
];

function parseCustom(json: string | undefined): Project[] {
  if (!json) return [];
  try { return JSON.parse(json); } catch { return []; }
}

export function ProjectsSection() {
  const { isAdmin, overrides, setContent, getContent } = useAdmin();

  const customProjects = parseCustom(overrides["added_projects"]);
  const projects: Project[] = [
    ...defaultProjects,
    ...customProjects.map((p, i) => ({ ...p, isCustom: true, customId: i })),
  ];

  const addProject = () => {
    const newProj: Project = {
      title: "New Project",
      subtitle: "Subtitle",
      date: "2026",
      description: "Describe your project here.",
      tags: ["Tag"],
      link: { href: "#", logo: "", label: "Logo" },
    };
    const updated = [...customProjects, newProj];
    setContent("added_projects", JSON.stringify(updated));
  };

  const removeProject = (customIdx: number) => {
    const updated = customProjects.filter((_, i) => i !== customIdx);
    setContent("added_projects", JSON.stringify(updated));
  };

  const getKey = (p: Project, i: number) =>
    p.isCustom ? `cproj.${p.customId}` : `proj.${i}`;

  const projDrag = useDragReorder(projects, "proj_order", getKey);
  const orderedProjects = projDrag.orderedItems;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <EditableText contentKey="section.projects.label" defaultValue="Portfolio" as="p" className="text-base uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
        <div className="flex items-baseline gap-4">
          <EditableText contentKey="section.projects.title" defaultValue="Projects" as="h2" className="text-5xl sm:text-6xl font-bold text-foreground" />
          <EditableText contentKey="section.projects.subtitle" defaultValue="2x Hackathon Winner" as="span" className="text-base text-muted-foreground/40" />
          {isAdmin && (
            <button
              onClick={addProject}
              className="ml-2 p-1.5 rounded border border-dashed border-primary/40 text-primary/60 hover:text-primary hover:border-primary transition-colors"
              title="Add project"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-0 divide-y divide-border">
        {orderedProjects.map((p, i) => {
          const origIdx = projects.indexOf(p);
          const key = getKey(p, origIdx);
          const tagsStr = getContent(`${key}.tags`, p.tags.join(", "));
          const displayTags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);

          return (
            <div key={key} className={`py-8 first:pt-0 last:pb-0 group relative ${projDrag.overIdx === i && projDrag.dragIdx !== i ? "drag-over" : ""}`} {...projDrag.bind(i)}>
              {isAdmin && (
                <div className="absolute top-8 -left-9 drag-handle p-1.5 rounded-lg hover:bg-muted transition-colors hidden md:flex items-center">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                </div>
              )}
              {isAdmin && p.isCustom && (
                <button
                  onClick={() => removeProject(p.customId!)}
                  className="absolute top-8 right-0 p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                <div className="md:w-40 shrink-0">
                  <EditableText contentKey={`${key}.date`} defaultValue={p.date} as="p" className="text-base font-mono text-muted-foreground/50" />
                  {(p.award || p.isCustom) && (
                    <EditableText contentKey={`${key}.award`} defaultValue={p.award || "Award"} as="p" className="text-base text-foreground/70 mt-1 font-medium" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <EditableText contentKey={`${key}.title`} defaultValue={p.title} as="h3" className="text-3xl font-bold text-foreground" />
                    <EditableText contentKey={`${key}.subtitle`} defaultValue={p.subtitle} as="span" className="text-lg text-muted-foreground" />
                  </div>

                  <EditableText contentKey={`${key}.desc`} defaultValue={p.description} as="p" className="text-lg text-muted-foreground mt-2 leading-relaxed max-w-3xl" multiline />

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {isAdmin ? (
                        <EditableText contentKey={`${key}.tags`} defaultValue={p.tags.join(", ")} as="span" className="text-base text-muted-foreground" />
                      ) : (
                        displayTags.map((t) => (
                          <span key={t} className="text-base px-3 py-1 rounded-full border border-border text-muted-foreground">{t}</span>
                        ))
                      )}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
                      <EditableImage contentKey={`${key}.logo`} defaultSrc={p.link?.logo || ""} alt={p.link?.label || p.title} className="h-5 w-auto" />
                      {p.link && p.link.href !== "#" && (
                        <a href={p.link.href} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

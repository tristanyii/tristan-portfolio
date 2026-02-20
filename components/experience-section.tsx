"use client";

import { useRef, useEffect } from "react";
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
}

const experiences: Experience[] = [
  {
    role: "Market Platforms",
    org: "Kalshi",
    location: "NYC, NY • Remote",
    date: "Jan. 2026 - Present",
    description: "Mention Markets",
    link: { href: "https://kalshi.com/", label: "Kalshi", logo: "/kalshi.png", useNext: true },
  },
  {
    role: "Software Engineer Intern",
    org: "Duke Code+ Program",
    location: "Durham, NC",
    date: "May 2025 - Jan. 2026",
    tags: ["Flask", "Python", "Neo4j", "Selenium"],
    bullets: [
      'Selected as <strong>1 of 4 interns</strong> from <strong>300+ applicants</strong> to build an AI-powered fundraising platform using Flask and Python, projected to drive <strong>$10M+</strong> in gifts',
      'Increased donor-research match accuracy by <strong>40%</strong> by embedding donor interests with Sentence Transformers and mapping <strong>2K+</strong> alumni relationships in Neo4j',
      'Accelerate donor data acquisition by <strong>95%</strong> by building a Selenium pipeline to scrape <strong>13K+</strong> records',
    ],
    link: { href: "https://codeplus.duke.edu/project/philanthropy-intelligence-using-aiml-connect-research-and-donors/", label: "Code+", logo: "/CodePlusLogo.png", useNext: true },
  },
  {
    role: "Software Engineer Intern",
    org: "Blue Devil Buddies",
    location: "Durham, NC",
    date: "Jun. 2025 - Aug. 2025",
    tags: ["Python", "Pandas", "Data Processing"],
    bullets: [
      "Developing Duke's largest mentorship program through a Python-based matching system, scaling to support <strong>12.5K+</strong> participants",
      "Reducing manual processing time by <strong>80%</strong> by cleaning and standardizing <strong>100K+</strong> survey responses with Pandas",
    ],
    link: { href: "https://dukestudentgovernment.org/affiliates/blue-devil-buddies/", label: "Blue Devil Buddies", logo: "/BlueDevilBuddies.png" },
  },
  {
    role: "Software Developer Intern",
    org: "AspinRock",
    location: "Durham, NC",
    date: "Mar. 2025 - Apr. 2025",
    tags: ["Python", "Pandas", "OpenAI API", "RESTful APIs"],
    bullets: [
      'Optimized AI-driven stock forecasts using Python and OpenAI API, improving accuracy by <strong>35%</strong> through data tuning',
      'Built a financial data pipeline processing <strong>1M+</strong> daily stock price records across <strong>5,000+</strong> companies',
    ],
    link: { href: "https://www.aspinrock.com/individual", label: "AspinRock", logo: "/aspinrock1_logo.jpeg" },
  },
  {
    role: "Research Assistant",
    org: "Duke Fuqua Graduate School of Business",
    location: "Durham, NC",
    date: "Aug. 2024 - Jul. 2025",
    tags: ["Python", "BeautifulSoup", "Excel", "Data Analysis"],
    bullets: [
      'Automated web-scraping pipelines with BeautifulSoup, cutting manual data gathering by <strong>9+ hours</strong> weekly',
      'Structured and validated datasets of legislative financial records with <strong>98%</strong> accuracy',
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
    role: "Catalyst Marketing Executive",
    org: "Catalyst",
    date: "Apr. 2025 - Jan. 2026",
    description: 'Expanding Duke\'s largest pre-professional tech org; generated <strong>150K+</strong> social media impressions and boosted event attendance by <strong>30%</strong>',
    link: { href: "https://www.instagram.com/dukecatalyst/", label: "Catalyst", logo: "/Catalyst.png" },
  },
  {
    role: "DukeLife Mentor",
    org: "DukeLife",
    date: "Jun. 2025 - Present",
    description: 'Mentoring first-gen/low-income students across multiple cohorts, driving a <strong>~25%</strong> increase in campus resource use',
    link: { href: "https://dukelife.duke.edu/", label: "DukeLife", logo: "/DukeLife.png" },
  },
];

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const side = index % 2 === 0 ? "left" : "right";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.opacity = "1";
            target.style.transform = "translateX(0)";
            observer.unobserve(target);
          }
        });
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative grid grid-cols-[1fr_40px_1fr] md:grid-cols-[1fr_48px_1fr] items-start gap-0">
      {/* Left content or spacer */}
      {side === "left" ? (
        <div
          ref={ref}
          className="pr-4 md:pr-8"
          style={{
            opacity: 0,
            transform: "translateX(-40px)",
            transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <ExperienceCard exp={exp} align="right" />
        </div>
      ) : (
        <div className="hidden md:flex justify-end pr-4 md:pr-8 pt-2">
          <span className="text-xs font-mono text-muted-foreground/60 tracking-wide whitespace-nowrap">{exp.date}</span>
        </div>
      )}

      {/* Center dot + line */}
      <div className="flex flex-col items-center relative">
        <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background ring-2 ring-border z-10 mt-2 shrink-0" />
        <div className="w-px flex-1 bg-border" />
      </div>

      {/* Right content or spacer */}
      {side === "right" ? (
        <div
          ref={ref}
          className="pl-4 md:pl-8"
          style={{
            opacity: 0,
            transform: "translateX(40px)",
            transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <ExperienceCard exp={exp} align="left" />
        </div>
      ) : (
        <div className="hidden md:block pl-4 md:pl-8 pt-2">
          <span className="text-xs font-mono text-muted-foreground/60 tracking-wide">{exp.date}</span>
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ exp, align }: { exp: Experience; align: "left" | "right" }) {
  return (
    <div className={`pb-10 ${align === "right" ? "md:text-right" : ""}`}>
      {/* Date - shown inline on mobile since the opposite-side date label is hidden */}
      <p className="text-xs font-mono text-muted-foreground/60 tracking-wide mb-2 md:hidden">{exp.date}</p>

      <h3 className="text-lg font-semibold text-foreground leading-snug">{exp.role}</h3>
      <p className="text-sm text-muted-foreground mt-0.5">{exp.org} &middot; {exp.location}</p>

      {exp.tags && exp.tags.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 mt-3 ${align === "right" ? "md:justify-end" : ""}`}>
          {exp.tags.map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
          ))}
        </div>
      )}

      <div className={`mt-3 text-sm text-muted-foreground leading-relaxed space-y-1.5 ${align === "right" ? "md:text-right" : ""}`}>
        {exp.description && <p>{exp.description}</p>}
        {exp.bullets && (
          <ul className={`space-y-1.5 ${align === "right" ? "md:text-right" : ""}`}>
            {exp.bullets.map((b, j) => (
              <li key={j} className={`flex gap-2 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
                <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span dangerouslySetInnerHTML={{ __html: b }} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {exp.link && (
        <a
          href={exp.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 group ${align === "right" ? "md:ml-auto" : ""}`}
        >
          {exp.link.useNext ? (
            <Image src={exp.link.logo} alt={exp.link.label} width={80} height={32} className="h-6 w-auto pointer-events-none select-none" unoptimized />
          ) : (
            <img src={exp.link.logo} alt={exp.link.label} className="h-6 w-auto pointer-events-none select-none" />
          )}
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </a>
      )}
    </div>
  );
}

export function ExperienceSection() {
  return (
    <div className="max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          Experience
        </h2>
        <p className="text-muted-foreground text-lg">My professional and academic journey</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {experiences.map((exp, i) => (
          <TimelineItem key={i} exp={exp} index={i} />
        ))}
      </div>

      {/* Leadership */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-foreground">Leadership</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {leadership.map((l, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 flex flex-col">
              <span className="text-xs font-mono text-muted-foreground/60 tracking-wide mb-2">{l.date}</span>
              <h4 className="text-base font-semibold text-foreground">{l.role}</h4>
              <p className="text-xs text-muted-foreground mb-2">{l.org}</p>
              <p className="text-sm text-muted-foreground flex-1 leading-relaxed" dangerouslySetInnerHTML={{ __html: l.description }} />
              <a
                href={l.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 group self-start"
              >
                <img src={l.link.logo} alt={l.link.label} className="h-6 w-auto pointer-events-none select-none" />
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

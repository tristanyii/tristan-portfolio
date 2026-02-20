import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import { SnorlaxCollection } from "@/components/snorlax-collection";
import { Reveal } from "@/components/reveal";
const SpotifySection = dynamic(() => import("@/components/spotify-section").then(m => m.SpotifySection), { ssr: true, loading: () => null });
import { ClientLocalMusicPlayer } from "@/components/client-local-music";
import { HobbiesSection } from "@/components/hobbies-section";
import { GoalsSection } from "@/components/goals-section";
import { ExperienceSection } from "@/components/experience-section";
import { Nav } from "@/components/nav";
import Image from "next/image";

const techStack = {
  "Languages": ["TypeScript", "JavaScript", "Python", "Java", "C", "C#", "Swift"],
  "Frameworks": ["React", "Next.js", "Flask", "HTML/CSS"],
  "Databases": ["PostgreSQL", "MongoDB", "Neo4j", "Firebase"],
  "Tools": ["Docker", "AWS", "Git", "CI/CD", "REST APIs"],
};

const projects = [
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative w-full max-w-full">
      <Nav />

      {/* ── Hero ── */}
      <section id="home" className="container mx-auto px-4 py-12 md:py-20 lg:py-28 scroll-mt-16">
        <div className="flex flex-col lg:flex-row items-center justify-start gap-6 lg:gap-16 max-w-7xl mx-auto w-full">
          <div className="flex-shrink-0 animate-slide-in-left lg:mr-4">
            <SnorlaxCollection />
          </div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 flex-1">
            <div className="space-y-2 animate-slide-in-right">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                Tristan Yi
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                CS @ <span className="font-duke text-foreground">Duke</span> &nbsp;·&nbsp; Software Engineer &nbsp;·&nbsp; First-Gen
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start animate-fade-in-delay-3">
              <Button size="lg" asChild>
                <a href="mailto:triyi0513@gmail.com"><Mail className="mr-2 h-5 w-5" />Contact</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/tristanyii" target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-5 w-5" />GitHub</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://linkedin.com/in/tristan-yi" target="_blank" rel="noopener noreferrer"><Linkedin className="mr-2 h-5 w-5" />LinkedIn</a>
              </Button>
            </div>

            <div className="pt-4">
              <a href="#experience" className="inline-block p-2 rounded-full hover:bg-muted transition-colors">
                <ArrowDown className="h-6 w-6 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Photos */}
          <div className="flex-shrink-0 animate-fade-in mt-8 lg:mt-0">
            <div className="relative w-[280px] h-[340px] mx-auto lg:w-[400px] lg:h-[480px]">
              <div className="absolute left-0 top-0 w-32 h-32 lg:w-48 lg:h-48 rotate-[-8deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-10">
                <div className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image src="/Headshot.jpg" alt="Tristan Yi" width={500} height={500} quality={95} priority className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute right-0 top-2 lg:top-8 w-32 h-32 lg:w-48 lg:h-48 rotate-[6deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-15">
                <div className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image src="/MirrorPic.jpg" alt="Tristan Yi" width={500} height={500} quality={95} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute left-2 lg:left-4 top-24 lg:top-36 w-32 h-32 lg:w-48 lg:h-48 rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-20">
                <div className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image src="/Selfie.jpg" alt="Tristan Yi" width={500} height={500} quality={95} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute right-2 lg:right-4 top-28 lg:top-44 w-32 h-32 lg:w-48 lg:h-48 rotate-[-5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-25">
                <div className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image src="/Carowinds.jpg" alt="Tristan Yi" width={500} height={500} quality={95} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack — inline, no box ── */}
      <section className="container mx-auto px-4 pb-16 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center lg:justify-start">
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className="flex items-baseline gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground/50 shrink-0">{category}</span>
                <span className="text-sm text-muted-foreground">{items.join(" · ")}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section id="experience" className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4">
          <ExperienceSection />
        </div>
      </section>

      {/* ── Projects ── */}
      <Reveal delayMs={80}>
      <section id="projects" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline gap-4 mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Projects</p>
            <span className="text-xs text-muted-foreground/40">2x Hackathon Winner</span>
          </div>

          <div className="space-y-0 divide-y divide-border">
            {projects.map((p, i) => (
              <div key={i} className="py-8 first:pt-0 last:pb-0 group">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                  {/* Left: date + award */}
                  <div className="md:w-40 shrink-0">
                    <p className="text-xs font-mono text-muted-foreground/50">{p.date}</p>
                    {p.award && (
                      <p className="text-xs text-foreground/70 mt-1 font-medium">{p.award}</p>
                    )}
                  </div>

                  {/* Right: content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                      <span className="text-sm text-muted-foreground">{p.subtitle}</span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">{p.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map((t) => (
                          <span key={t} className="text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">{t}</span>
                        ))}
                      </div>
                      {p.link && (
                        <a
                          href={p.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
                        >
                          <img src={p.link.logo} alt={p.link.label} className="h-5 w-auto" />
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* ── Music ── */}
      <Reveal delayMs={120}>
      <section id="music" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <SpotifySection />
        </div>
      </section>
      </Reveal>

      {/* ── Hobbies ── */}
      <Reveal delayMs={160}>
      <section id="hobbies" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Beyond Code</p>
          <h2 className="text-3xl font-bold text-foreground mb-8">Hobbies</h2>
          <HobbiesSection />
        </div>
      </section>
      </Reveal>

      {/* ── 2026 Goals ── */}
      <Reveal delayMs={200}>
      <section id="goals" className="container mx-auto px-4 py-20 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 mb-4">Looking Ahead</p>
          <h2 className="text-3xl font-bold text-foreground mb-8">2026 Goals</h2>
          <div className="w-full max-w-sm">
            <GoalsSection />
          </div>
        </div>
      </section>
      </Reveal>

      {/* ── Footer ── */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground/50">© 2025 Tristan Yi</p>
            <div className="flex gap-6 text-xs text-muted-foreground">
              <a href="mailto:triyi0513@gmail.com" className="hover:text-foreground transition-colors">Email</a>
              <a href="https://github.com/tristanyii" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/tristan-yi" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      <ClientLocalMusicPlayer />
    </div>
  );
}

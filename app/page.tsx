import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import dynamic from "next/dynamic";
import { SnorlaxCollection } from "@/components/snorlax-collection";
import { Reveal } from "@/components/reveal";
const SpotifySection = dynamic(() => import("@/components/spotify-section").then(m => m.SpotifySection), { ssr: true, loading: () => null });
import { ClientLocalMusicPlayer } from "@/components/client-local-music";
import { HobbiesSection } from "@/components/hobbies-section";
import { GoalsSection } from "@/components/goals-section";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectsSection } from "@/components/projects-section";
import { Nav } from "@/components/nav";
import Image from "next/image";
import { EditableText } from "@/components/editable-text";

const techStack = {
  "Languages": ["TypeScript", "JavaScript", "Python", "Java", "C", "C#", "Swift"],
  "Frameworks": ["React", "Next.js", "Flask", "HTML/CSS"],
  "Databases": ["PostgreSQL", "MongoDB", "Neo4j", "Firebase"],
  "Tools": ["Docker", "AWS", "Git", "CI/CD", "REST APIs"],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative w-full">
      <Nav />

      {/* ── Hero ── */}
      <section id="home" className="container mx-auto px-4 py-12 md:py-20 lg:py-28 scroll-mt-16">
        <div className="flex flex-col lg:flex-row items-center justify-start gap-6 lg:gap-16 max-w-7xl mx-auto w-full">
          <div className="flex-shrink-0 animate-slide-in-left lg:mr-4">
            <SnorlaxCollection />
          </div>

          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 flex-1">
            <div className="space-y-2 animate-slide-in-right">
              <EditableText
                contentKey="hero.name"
                defaultValue="Tristan Yi"
                as="h1"
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight"
              />
              <EditableText
                contentKey="hero.subtitle"
                defaultValue="CS @ Duke · Software Engineer · First-Gen"
                as="p"
                className="text-2xl md:text-3xl text-muted-foreground"
              />
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
      <Reveal variant="fade-up" delayMs={300} duration={800}>
      <section className="container mx-auto px-6 lg:px-10 pb-16 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center lg:justify-start">
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className="flex items-baseline gap-2">
                <EditableText
                  contentKey={`tech.${category}.label`}
                  defaultValue={category}
                  as="span"
                  className="text-base uppercase tracking-wider text-muted-foreground/50 shrink-0"
                />
                <EditableText
                  contentKey={`tech.${category}.items`}
                  defaultValue={items.join(" · ")}
                  as="span"
                  className="text-lg text-muted-foreground"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      </Reveal>

      {/* ── Experience ── */}
      <section id="experience" className="scroll-mt-16">
        <ExperienceSection />
      </section>

      {/* ── Projects ── */}
      <Reveal variant="fade-up" duration={900}>
      <section id="projects" className="mx-auto px-6 lg:px-10 py-20 scroll-mt-16">
        <ProjectsSection />
      </section>
      </Reveal>

      {/* ── Music ── */}
      <Reveal variant="blur" duration={1000}>
      <section id="music" className="mx-auto px-6 lg:px-10 py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <SpotifySection />
        </div>
      </section>
      </Reveal>

      {/* ── Hobbies ── */}
      <Reveal variant="fade-up" duration={900}>
      <section id="hobbies" className="mx-auto px-6 lg:px-10 py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <EditableText contentKey="section.hobbies.label" defaultValue="Beyond Code" as="p" className="text-base uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
          <EditableText contentKey="section.hobbies.title" defaultValue="Hobbies" as="h2" className="text-5xl sm:text-6xl font-bold text-foreground mb-8" />
          <HobbiesSection />
        </div>
      </section>
      </Reveal>

      {/* ── 2026 Goals ── */}
      <Reveal variant="zoom" duration={900}>
      <section id="goals" className="mx-auto px-6 lg:px-10 py-20 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <EditableText contentKey="section.goals.label" defaultValue="Looking Ahead" as="p" className="text-base uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
          <EditableText contentKey="section.goals.title" defaultValue="2026 Goals" as="h2" className="text-5xl sm:text-6xl font-bold text-foreground mb-8" />
          <div className="w-full max-w-sm">
            <GoalsSection />
          </div>
        </div>
      </section>
      </Reveal>

      {/* ── Footer ── */}
      <Reveal variant="fade-up" duration={700}>
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-base text-muted-foreground/50">© 2025 Tristan Yi</p>
            <div className="flex gap-6 text-base text-muted-foreground">
              <a href="mailto:triyi0513@gmail.com" className="hover:text-foreground transition-colors">Email</a>
              <a href="https://github.com/tristanyii" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/tristan-yi" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
      </Reveal>

      <ClientLocalMusicPlayer />
    </div>
  );
}

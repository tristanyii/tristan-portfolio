import { Nav } from "@/components/nav";
import { ExperienceSection } from "@/components/experience-section";

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <section className="container py-24 px-4">
        <ExperienceSection />
      </section>
    </div>
  );
}

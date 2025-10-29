import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/nav";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Nav />

      <section className="container py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
            <p className="text-muted-foreground text-lg">Some things I've built</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
            {/* Excess - Deutsche Bank Hackathon */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle>Excess - AI Voice Agent</CardTitle>
                    <CardDescription>Deutsche Bank Hackathon: 1st Place 🏆</CardDescription>
                  </div>
                  <Badge variant="secondary">Oct. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Built an AI voice agent using Flask and Retell AI to bridge users to <strong>800+</strong> verified aid programs, 
                  improving access to housing, food, and energy assistance in underrepresented rural communities.
                </p>
                <p className="text-muted-foreground text-sm">
                  Enhanced the system with multilingual and SMS support, delivering real-time voice assistance at <strong>~60%</strong> 
                  lower cost than human operations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Flask</Badge>
                  <Badge variant="outline">Retell AI</Badge>
                  <Badge variant="outline">REST APIs</Badge>
                </div>
              </CardContent>
            </Card>

            {/* GoHelpMe - CUHackIt */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle>GoHelpMe - Disaster Response App</CardTitle>
                    <CardDescription>CUHackIt: 1st Place 🥇</CardDescription>
                  </div>
                  <Badge variant="secondary">Mar. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Led development of a disaster-response app that connects victims with volunteers via real-time geolocation, 
                  enabling faster mobilization and more effective resource allocation during crises.
                </p>
                <p className="text-muted-foreground text-sm">
                  Enabled the mobile frontend to process <strong>500+</strong> live help requests during testing by developing and 
                  deploying backend services with Node.js, Express, and PostgreSQL.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React Native</Badge>
                  <Badge variant="outline">Expo</Badge>
                  <Badge variant="outline">Node.js</Badge>
                  <Badge variant="outline">Express</Badge>
                  <Badge variant="outline">PostgreSQL</Badge>
                  <Badge variant="outline">Firebase</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Personal Website (This site!) */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle>Personal Portfolio Website</CardTitle>
                    <CardDescription>You're looking at it! ✨</CardDescription>
                  </div>
                  <Badge variant="secondary">2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Built a modern, responsive personal website featuring real-time Spotify integration with my listening stats, 
                  a YouTube music player, and a clean multi-page navigation system.
                </p>
                <p className="text-muted-foreground text-sm">
                  Integrated Spotify Web API and YouTube Data API to dynamically display my top artists, tracks, and enable 
                  music playback directly on the site.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">Spotify API</Badge>
                  <Badge variant="outline">YouTube API</Badge>
                  <Badge variant="outline">shadcn/ui</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowDown, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import { SnorlaxCollection } from "@/components/snorlax-collection";
import { Reveal } from "@/components/reveal";
const SpotifySection = dynamic(() => import("@/components/spotify-section").then(m => m.SpotifySection), { ssr: true, loading: () => null });
import { ClientLocalMusicPlayer } from "@/components/client-local-music";
import { HobbiesSection } from "@/components/hobbies-section";
import { SkillsSection } from "@/components/skills-section";
import { Nav } from "@/components/nav";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative w-full max-w-full">

      {/* Navigation with glassmorphism */}
      <Nav />

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-12 md:py-20 lg:py-24 scroll-mt-16 relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row items-center justify-start gap-6 lg:gap-12 max-w-7xl mx-auto relative z-10 w-full">
          {/* Snorlax on the far left */}
          <div className="flex-shrink-0 animate-slide-in-left lg:mr-8">
            <SnorlaxCollection />
          </div>

          {/* Content in the center */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 flex-1">
            <div className="space-y-3 animate-slide-in-right max-w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight relative break-words">
                Hi, I'm{" "}
                <span className="text-foreground">
                  Tristan Yi
                </span>
          </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground">
                Computer Science @ <span className="font-duke text-foreground">Duke University</span>
              </p>
        </div>
            
            <div className="flex gap-2 justify-center lg:justify-start animate-fade-in-delay">
              <Badge variant="secondary" className="text-sm px-4 py-2 cursor-default">
                Software Engineer
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2 cursor-default">
                First-Gen College Student
              </Badge>
            </div>


            <div className="flex flex-wrap gap-3 pt-4 justify-center lg:justify-start animate-fade-in-delay-3">
              <Button size="lg" asChild>
                <a href="mailto:triyi0513@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Me
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/tristanyii" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://linkedin.com/in/tristan-yi" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
            </div>

            {/* Tech Stack moved to its own section to declutter hero */}

            {/* Scroll indicator */}
            <div className="pt-6">
              <a href="#experience" className="inline-block p-3 rounded-full hover:bg-muted transition-all">
                <ArrowDown className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            </div>
          </div>

          {/* Scattered Photo Grid - Mobile & Desktop (same layout) */}
          <div className="flex-shrink-0 animate-fade-in mt-8 lg:mt-0">
            <div className="relative w-[280px] h-[340px] mx-auto lg:w-[400px] lg:h-[480px]">
              {/* Photo 1 - Top Left */}
              <div className="absolute left-0 top-0 w-32 h-32 lg:w-48 lg:h-48 rotate-[-8deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group z-10">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image 
                    src="/Headshot.jpg" 
                    alt="Tristan Yi"
                    width={500}
                    height={500}
                    quality={95}
                    priority
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Photo 2 - Top Right */}
              <div className="absolute right-0 top-2 lg:top-8 w-32 h-32 lg:w-48 lg:h-48 rotate-[6deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group z-15">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image 
                    src="/MirrorPic.jpg" 
                    alt="Tristan Yi"
                    width={500}
                    height={500}
                    quality={95}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Photo 3 - Middle Left */}
              <div className="absolute left-2 lg:left-4 top-24 lg:top-36 w-32 h-32 lg:w-48 lg:h-48 rotate-[4deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group z-20">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image 
                    src="/Selfie.jpg" 
                    alt="Tristan Yi"
                    width={500}
                    height={500}
                    quality={95}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Photo 4 - Middle Right */}
              <div className="absolute right-2 lg:right-4 top-28 lg:top-44 w-32 h-32 lg:w-48 lg:h-48 rotate-[-5deg] hover:rotate-0 hover:scale-105 transition-all duration-300 group z-25">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border shadow-lg">
                  <Image 
                    src="/Carowinds.jpg" 
                    alt="Tristan Yi"
                    width={500}
                    height={500}
                    quality={95}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section (separate, simpler) */}
      <section id="techstack" className="container mx-auto px-4 pt-1 md:pt-4 pb-12 md:pb-16 -mt-20 md:-mt-28 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="text-3xl font-bold">Tech Stack</h3>
            <p className="text-muted-foreground mt-2">A quick snapshot of the tools I use most.</p>
          </div>

          <div className="relative rounded-2xl border bg-card p-6 md:p-8 shadow-sm overflow-hidden">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">💻 Languages & Frameworks</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {["TypeScript","JavaScript","Python","Java","C","C#","React","Next.js","Swift","Flask","HTML/CSS"].map((s)=>(
                    <Badge key={s} variant="outline" className="text-xs bg-background/60 hover:bg-primary/5 transition-colors">{s}</Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">🗄️ Databases</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {["PostgreSQL","MongoDB","Neo4j","SQL","Firebase"].map((s)=>(
                    <Badge key={s} variant="outline" className="text-xs bg-background/60 hover:bg-primary/5 transition-colors">{s}</Badge>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">⚙️ Tools</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {["Docker","AWS","Git","CI/CD","REST APIs"].map((s)=>(
                    <Badge key={s} variant="outline" className="text-xs bg-background/60 hover:bg-primary/5 transition-colors">{s}</Badge>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <Reveal>
      <section id="experience" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="space-y-12 max-w-5xl mx-auto relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Experience
            </h2>
            <p className="text-muted-foreground text-lg">My professional and academic journey</p>
          </div>

          <div className="grid gap-6">
            {/* Kalshi */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Market Platforms</CardTitle>
                    <CardDescription className="text-base">Kalshi • NYC, NY • Remote</CardDescription>
                  </div>
                  <Badge variant="secondary">Jan. 2026 - Present</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Mention Markets</p>
                <a 
                  href="https://kalshi.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative z-20 inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <Image 
                    src="/kalshi.png" 
                    alt="Kalshi" 
                    width={80}
                    height={32}
                    className="h-8 w-auto pointer-events-none select-none"
                    unoptimized
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* Duke Code+ */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Software Engineer Intern</CardTitle>
                    <CardDescription className="text-base">Duke Code+ Program • Durham, NC</CardDescription>
                  </div>
                  <Badge variant="secondary">May 2025 - Jan. 2026</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Flask</Badge>
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Neo4j</Badge>
                  <Badge variant="outline">Selenium</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li>Selected as <strong>1 of 4 interns</strong> from <strong>300+ applicants</strong> to build an AI-powered fundraising platform using Flask and Python, projected to drive <strong>$10M+</strong> in gifts by connecting philanthropists with Duke research initiatives</li>
                  <li>Increased donor-research match accuracy by <strong>40%</strong> by embedding donor interests with Sentence Transformers and mapping <strong>2K+</strong> alumni relationships in Neo4j to surface high-value connections for targeted outreach</li>
                  <li>Accelerate donor data acquisition by <strong>95%</strong> by building a Selenium pipeline to scrape <strong>13K+</strong> records and enriching profiles with DukeGPT insights spanning board roles, affiliations, and career history</li>
                </ul>
                <a 
                  href="https://codeplus.duke.edu/project/philanthropy-intelligence-using-aiml-connect-research-and-donors/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <Image 
                    src="/CodePlusLogo.png" 
                    alt="Duke Code+ Program" 
                    width={120}
                    height={32}
                    className="h-8 w-auto pointer-events-none select-none"
                    unoptimized
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* Blue Devil Buddies */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Software Engineer Intern</CardTitle>
                    <CardDescription className="text-base">Blue Devil Buddies • Durham, NC</CardDescription>
                  </div>
                  <Badge variant="secondary">Jun. 2025 - Aug. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Pandas</Badge>
                  <Badge variant="outline">Data Processing</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li>Developing Duke's largest mentorship program through a Python-based matching system that pairs mentors and freshmen by shared interests and backgrounds, scaling to support <strong>12.5K+</strong> participants</li>
                  <li>Improving match accuracy and reducing manual processing time by <strong>80%</strong> by cleaning and standardizing <strong>100K+</strong> survey responses across multiple semesters with Pandas</li>
                </ul>
                <a 
                  href="https://dukestudentgovernment.org/affiliates/blue-devil-buddies/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <img 
                    src="/BlueDevilBuddies.png" 
                    alt="Blue Devil Buddies" 
                    className="h-8 w-auto pointer-events-none select-none"
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* AspinRock */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Software Developer Intern</CardTitle>
                    <CardDescription className="text-base">AspinRock • Durham, NC</CardDescription>
                  </div>
                  <Badge variant="secondary">Mar. 2025 - Apr. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Pandas</Badge>
                  <Badge variant="outline">OpenAI API</Badge>
                  <Badge variant="outline">RESTful APIs</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li>Collaborated with fellow first-gen students in Duke's Spring Forward Program to deliver financial forecasting tools; Optimized AI-driven stock forecasts using Python and OpenAI API, improving accuracy by <strong>35%</strong> through data tuning</li>
                  <li>Implemented a financial data pipeline using Python, Pandas, and RESTful APIs to process <strong>1M+</strong> daily stock price records across <strong>5,000+</strong> companies, and analyzed large-scale stock price data for real-time market insights</li>
                </ul>
                <a 
                  href="https://www.aspinrock.com/individual" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <img 
                    src="/aspinrock1_logo.jpeg" 
                    alt="Aspin Rock" 
                    className="h-8 w-auto pointer-events-none select-none"
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* Research Assistant */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Research Assistant</CardTitle>
                    <CardDescription className="text-base">Duke Fuqua Graduate School of Business • Durham, NC</CardDescription>
                  </div>
                  <Badge variant="secondary">Aug. 2024 - Jul. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">BeautifulSoup</Badge>
                  <Badge variant="outline">Excel</Badge>
                  <Badge variant="outline">Data Analysis</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li>Automated Python web-scraping pipelines with BeautifulSoup to collect and process financial disclosures, cutting manual data gathering by <strong>9+ hours</strong> weekly and enabling large-scale political finance analysis</li>
                  <li>Structured and validated datasets of legislative financial records with <strong>98%</strong> accuracy in Excel, supporting reliable research on lawmakers' business affiliations and investment activity</li>
                </ul>
                <a 
                  href="http://fuqua.duke.edu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <img 
                    src="/DukeFuqua.png" 
                    alt="Duke Fuqua School of Business" 
                    className="h-8 w-auto pointer-events-none select-none"
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* Leadership Section */}
            <div className="mt-12">
              <h3 className="text-3xl font-bold mb-6 text-foreground">Leadership</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover-lift transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">Catalyst Marketing Executive</CardTitle>
                        <CardDescription>Durham, NC</CardDescription>
                      </div>
                      <Badge variant="secondary">Apr. 2025 - Jan. 2026</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Expanding Duke's largest pre-professional tech org by hosting resume workshops and professional events; generated <strong>150K+</strong> social media impressions and boosted event attendance by <strong>30%</strong> YTD
                    </p>
                    <a 
                      href="https://www.instagram.com/dukecatalyst/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                    >
                      <img 
                        src="/Catalyst.png" 
                        alt="Duke Catalyst" 
                        className="h-8 w-auto pointer-events-none select-none"
                      />
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  </CardContent>
                </Card>

                <Card className="hover-lift transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">DukeLife Mentor</CardTitle>
                        <CardDescription>Durham, NC</CardDescription>
                      </div>
                      <Badge variant="secondary">Jun. 2025 - Present</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Mentoring first-gen/low-income students across multiple cohorts, easing academic and social transitions and driving a <strong>~25%</strong> increase in campus resource use
                    </p>
                    <a 
                      href="https://dukelife.duke.edu/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                    >
                      <img 
                        src="/DukeLife.png" 
                        alt="DukeLife" 
                        className="h-8 w-auto pointer-events-none select-none"
                      />
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Projects Section */}
      <Reveal delayMs={80}>
      <section id="projects" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="space-y-12 max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
                Projects
              </h2>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                🏆 2x Hackathon Winner
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">Award-winning projects and personal builds</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Excess - Deutsche Bank Hackathon */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Excess - AI Voice Agent</CardTitle>
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
                <a 
                  href="https://github.com/tristanyii/deutchebank-hackathon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <img 
                    src="/Deutsche Bank.png" 
                    alt="Deutsche Bank Hackathon" 
                    className="h-8 w-auto pointer-events-none select-none"
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* The Devil's Tracker */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">The Devil's Tracker</CardTitle>
                    <CardDescription>Poker Session Management App</CardDescription>
                  </div>
                  <Badge variant="secondary">Apr. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Built a cross-platform mobile app to manage poker sessions, automating buy-ins and earnings across <strong>30+</strong> games, reducing settlement time by <strong>90%</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Implemented QR-based game/user encoding with Expo Camera cutting setup time from 2 min → 10 secs and real-time sync with Firebase Firestore for game state and earnings
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">React Native</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Node.js</Badge>
                  <Badge variant="outline">Express.js</Badge>
                  <Badge variant="outline">PostgreSQL</Badge>
                  <Badge variant="outline">Firebase</Badge>
                </div>
                <a 
                  href="https://github.com/tristanyii/poker-tracker-catalyst" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <img 
                    src="/DevilsTracker.png" 
                    alt="The Devil's Tracker - Duke Project" 
                    className="h-8 w-auto pointer-events-none select-none"
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* GoHelpMe - CUHackIt */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">GoHelpMe - Disaster Response App</CardTitle>
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
                </div>
                <a 
                  href="https://devpost.com/software/gohelpme" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-lg border border-border hover:border-foreground/20 transition-all duration-200 cursor-pointer group"
                >
                  <img 
                    src="/GoHelpMe.jpeg" 
                    alt="GoHelpMe - CUHackIt Winner" 
                    className="h-12 w-auto rounded-lg pointer-events-none select-none"
                  />
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </CardContent>
            </Card>

            {/* Personal Website */}
            <Card className="hover-lift transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Personal Portfolio Website</CardTitle>
                    <CardDescription>You're looking at it! ✨</CardDescription>
                  </div>
                  <Badge variant="secondary">2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Built a modern, responsive personal website featuring real-time Spotify integration with my listening stats, 
                  smooth scrolling animations, and a clean design system.
                </p>
                <p className="text-muted-foreground text-sm">
                  Integrated Spotify Web API to dynamically display my top artists and tracks with real-time updates.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                  <Badge variant="outline">Spotify API</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Music Section */}
      <Reveal delayMs={120}>
      <section id="music" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="space-y-12 max-w-6xl mx-auto relative z-10">
          
          <SpotifySection />
        </div>
      </section>
      </Reveal>

      {/* Hobbies Section */}
      <Reveal delayMs={160}>
      <section id="hobbies" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="space-y-12 max-w-5xl mx-auto relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
              Hobbies & Interests
            </h2>
            <p className="text-muted-foreground text-lg">What I do outside of coding</p>
          </div>

          <HobbiesSection />
        </div>
      </section>
      </Reveal>

      {/* Footer */}
      <footer className="border-t mt-24 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <p className="text-muted-foreground">
              © 2025 Tristan Yi. Built with Next.js and shadcn/ui.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform" asChild>
                <a href="mailto:triyi0513@gmail.com">Email</a>
              </Button>
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform" asChild>
                <a href="https://github.com/tristanyii" target="_blank" rel="noopener noreferrer">GitHub</a>
              </Button>
              <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform" asChild>
                <a href="https://linkedin.com/in/tristan-yi" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </Button>
            </div>
          </div>
        </div>
      </footer>

      {/* Music Player */}
      <ClientLocalMusicPlayer />
    </div>
  );
}

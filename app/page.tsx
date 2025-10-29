import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import { SpotifySection } from "@/components/spotify-section";
import { SnorlaxCollection } from "@/components/snorlax-collection";
import { MusicPlayer } from "@/components/music-player";
import { HobbiesSection } from "@/components/hobbies-section";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden relative">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation with glassmorphism */}
      <Nav />

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-4 py-16 md:py-24 lg:py-32 scroll-mt-16 relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/5 to-blue-500/10 animate-gradient pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center justify-start gap-8 lg:gap-16 max-w-7xl mx-auto relative z-10">
          {/* Snorlax on the far left */}
          <div className="flex-shrink-0 animate-slide-in-left lg:mr-8">
            <SnorlaxCollection />
          </div>

          {/* Content in the center */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 flex-1">
            <div className="space-y-3 animate-slide-in-right">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight relative">
                Hi, I'm{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                    Tristan Yi
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient rounded-full"></span>
                </span>
          </h1>
              <div className="space-y-1">
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">
                  Computer Science & Statistics @ Duke University
                </p>
                <p className="text-sm sm:text-base text-muted-foreground/80">
                  Union, SC • Expected Graduation May 2027
                </p>
              </div>
        </div>
            
            <div className="flex gap-2 flex-wrap justify-center lg:justify-start animate-fade-in-delay">
              <Badge variant="secondary" className="text-sm px-4 py-2 hover:scale-110 transition-all cursor-default glass border-primary/20 hover:border-primary/40">
                Software Engineer
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2 hover:scale-110 transition-all cursor-default glass border-purple-500/20 hover:border-purple-500/40">
                First-Gen College Student
              </Badge>
            </div>


            <div className="flex flex-wrap gap-3 pt-4 justify-center lg:justify-start animate-fade-in-delay-3">
              <Button size="lg" className="hover:scale-110 transition-all shadow-lg hover:shadow-2xl" asChild>
                <a href="mailto:triyi0513@gmail.com">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Me
                </a>
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-110 transition-all glass hover:bg-primary/10" asChild>
                <a href="https://github.com/tristanyii" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </a>
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-110 transition-all glass hover:bg-primary/10" asChild>
                <a href="https://linkedin.com/in/tristan-yi" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-5 w-5" />
                  LinkedIn
                </a>
              </Button>
            </div>

            {/* Scroll indicator */}
            <div className="pt-8 animate-bounce">
              <a href="#experience" className="inline-block p-3 rounded-full glass hover:bg-primary/10 transition-all">
                <ArrowDown className="h-8 w-8 text-muted-foreground/50 hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Scattered Photo Grid - Right Side */}
          <div className="hidden lg:block flex-shrink-0 animate-fade-in">
            <div className="relative w-[400px] h-[480px]">
              {/* Photo 1 - Top Left */}
              <div className="absolute left-0 top-0 w-48 h-48 rotate-[-8deg] hover:rotate-[-4deg] hover:scale-110 hover:z-40 transition-all duration-300 group z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl">
                  <img 
                    src="/Headshot.jpg" 
                    alt="Tristan Yi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Photo 2 - Top Right */}
              <div className="absolute right-0 top-8 w-48 h-48 rotate-[6deg] hover:rotate-[3deg] hover:scale-110 hover:z-40 transition-all duration-300 group z-15">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl">
                  <img 
                    src="/MirrorPic.jpg" 
                    alt="Tristan Yi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Photo 3 - Middle Left */}
              <div className="absolute left-4 top-36 w-48 h-48 rotate-[4deg] hover:rotate-[2deg] hover:scale-110 hover:z-40 transition-all duration-300 group z-20">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl">
                  <img 
                    src="/Selfie.jpg" 
                    alt="Tristan Yi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Photo 4 - Middle Right */}
              <div className="absolute right-4 top-44 w-48 h-48 rotate-[-5deg] hover:rotate-[-2deg] hover:scale-110 hover:z-40 transition-all duration-300 group z-25">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl">
                  <img 
                    src="/Carowinds.jpg" 
                    alt="Tristan Yi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Photo 5 - Bottom Center */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-48 h-48 rotate-[8deg] hover:rotate-[4deg] hover:scale-110 hover:z-40 transition-all duration-300 group z-30">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/90 shadow-2xl">
                  <img 
                    src="/GreatAunt.jpg" 
                    alt="Tristan Yi"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="space-y-12 max-w-5xl mx-auto relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient relative inline-block">
              Experience
              <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient rounded-full"></div>
            </h2>
            <p className="text-muted-foreground text-lg">My professional and academic journey</p>
          </div>

          <div className="grid gap-6">
            {/* Duke Code+ */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-l-primary/50 glass rounded-3xl">
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Software Engineer Intern</CardTitle>
                    <CardDescription className="text-base">Duke Code+ Program • Durham, NC</CardDescription>
                  </div>
                  <Badge className="bg-green-600/10 text-green-600 border-green-600/20">May 2025 - Present</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Flask</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Python</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Neo4j</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Selenium</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">Selected as <strong>1 of 4 interns</strong> from <strong>300+ applicants</strong> to build an AI-powered fundraising platform using Flask and Python, projected to drive <strong>$10M+</strong> in gifts by connecting philanthropists with Duke research initiatives</li>
                  <li className="hover:text-foreground transition-colors">Increased donor-research match accuracy by <strong>40%</strong> by embedding donor interests with Sentence Transformers and mapping <strong>2K+</strong> alumni relationships in Neo4j to surface high-value connections for targeted outreach</li>
                  <li className="hover:text-foreground transition-colors">Accelerate donor data acquisition by <strong>95%</strong> by building a Selenium pipeline to scrape <strong>13K+</strong> records and enriching profiles with DukeGPT insights spanning board roles, affiliations, and career history</li>
                </ul>
                <a 
                  href="https://codeplus.duke.edu/project/philanthropy-intelligence-using-aiml-connect-research-and-donors/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/Code+ Logo.png" 
                    alt="Duke Code+ Program" 
                    className="h-8 w-auto"
                  />
                </a>
              </CardContent>
            </Card>

            {/* Blue Devil Buddies */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-tl-3xl rounded-br-3xl border-t-4 border-t-blue-500/30">
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
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Python</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Pandas</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Data Processing</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">Developing Duke's largest mentorship program through a Python-based matching system that pairs mentors and freshmen by shared interests and backgrounds, scaling to support <strong>12.5K+</strong> participants</li>
                  <li className="hover:text-foreground transition-colors">Improving match accuracy and reducing manual processing time by <strong>80%</strong> by cleaning and standardizing <strong>100K+</strong> survey responses across multiple semesters with Pandas</li>
                </ul>
                <a 
                  href="https://dukestudentgovernment.org/affiliates/blue-devil-buddies/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/BlueDevilBuddies.png" 
                    alt="Blue Devil Buddies" 
                    className="h-8 w-auto"
                  />
                </a>
              </CardContent>
            </Card>

            {/* AspinRock */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl border-r-4 border-r-amber-500/30">
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
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Python</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Pandas</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">OpenAI API</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">RESTful APIs</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">Collaborated with fellow first-gen students in Duke's Spring Forward Program to deliver financial forecasting tools; Optimized AI-driven stock forecasts using Python and OpenAI API, improving accuracy by <strong>35%</strong> through data tuning</li>
                  <li className="hover:text-foreground transition-colors">Implemented a financial data pipeline using Python, Pandas, and RESTful APIs to process <strong>1M+</strong> daily stock price records across <strong>5,000+</strong> companies, and analyzed large-scale stock price data for real-time market insights</li>
                </ul>
                <a 
                  href="https://www.aspinrock.com/individual" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/aspinrock1_logo.jpeg" 
                    alt="Aspin Rock" 
                    className="h-8 w-auto"
                  />
                </a>
              </CardContent>
            </Card>

            {/* Research Assistant */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-tr-3xl rounded-bl-3xl border-b-4 border-b-indigo-500/30">
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
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Python</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">BeautifulSoup</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Excel</Badge>
                  <Badge variant="outline" className="hover:bg-primary/5 transition-colors">Data Analysis</Badge>
                </div>
                <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                  <li className="hover:text-foreground transition-colors">Automated Python web-scraping pipelines with BeautifulSoup to collect and process financial disclosures, cutting manual data gathering by <strong>9+ hours</strong> weekly and enabling large-scale political finance analysis</li>
                  <li className="hover:text-foreground transition-colors">Structured and validated datasets of legislative financial records with <strong>98%</strong> accuracy in Excel, supporting reliable research on lawmakers' business affiliations and investment activity</li>
                </ul>
                <a 
                  href="http://fuqua.duke.edu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/DukeFuqua.png" 
                    alt="Duke Fuqua School of Business" 
                    className="h-8 w-auto"
                  />
                </a>
              </CardContent>
            </Card>

            {/* Leadership Section */}
            <div className="mt-12">
              <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Leadership</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-3xl border-l-4 border-l-cyan-500/30">
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle className="text-lg">Catalyst Marketing Executive</CardTitle>
                        <CardDescription>Durham, NC</CardDescription>
                      </div>
                      <Badge variant="secondary">Apr. 2024 - Present</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground hover:text-foreground transition-colors">
                      Expanding Duke's largest pre-professional tech org by hosting resume workshops and professional events; generated <strong>150K+</strong> social media impressions and boosted event attendance by <strong>30%</strong> YTD
                    </p>
                    <a 
                      href="https://www.instagram.com/dukecatalyst/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-4 hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src="/Catalyst.png" 
                        alt="Duke Catalyst" 
                        className="h-8 w-auto"
                      />
                    </a>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] rounded-2xl border-r-4 border-r-green-500/30">
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
                    <p className="text-muted-foreground hover:text-foreground transition-colors">
                      Mentoring first-gen/low-income students across multiple cohorts, easing academic and social transitions and driving a <strong>~25%</strong> increase in campus resource use
                    </p>
                    <a 
                      href="https://dukelife.duke.edu/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-4 hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src="/DukeLife.png" 
                        alt="DukeLife" 
                        className="h-8 w-auto"
                      />
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        <div className="space-y-12 max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient relative inline-block">
                Projects
                <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient rounded-full"></div>
              </h2>
              <Badge className="text-sm px-4 py-2 bg-black text-white border-none shadow-lg">
                🏆 2x Hackathon Winner
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">Award-winning projects and personal builds</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Excess - Deutsche Bank Hackathon */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] group relative overflow-hidden glass border-2 border-yellow-500/20 rounded-tl-3xl rounded-br-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Excess - AI Voice Agent</CardTitle>
                    <CardDescription>Deutsche Bank Hackathon: 1st Place 🏆</CardDescription>
                  </div>
                  <Badge variant="secondary">Oct. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <p className="text-muted-foreground">
                  Built an AI voice agent using Flask and Retell AI to bridge users to <strong>800+</strong> verified aid programs, 
                  improving access to housing, food, and energy assistance in underrepresented rural communities.
                </p>
                <p className="text-muted-foreground text-sm">
                  Enhanced the system with multilingual and SMS support, delivering real-time voice assistance at <strong>~60%</strong> 
                  lower cost than human operations.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="hover:bg-yellow-500/10 transition-colors">Python</Badge>
                  <Badge variant="outline" className="hover:bg-yellow-500/10 transition-colors">Flask</Badge>
                  <Badge variant="outline" className="hover:bg-yellow-500/10 transition-colors">Retell AI</Badge>
                  <Badge variant="outline" className="hover:bg-yellow-500/10 transition-colors">REST APIs</Badge>
                </div>
                <a 
                  href="https://github.com/tristanyii/deutchebank-hackathon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/Deutsche Bank.png" 
                    alt="Deutsche Bank Hackathon" 
                    className="h-8 w-auto"
                  />
                </a>
              </CardContent>
            </Card>

            {/* The Devil's Tracker */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] group relative overflow-hidden glass rounded-tr-3xl rounded-bl-3xl border-t-4 border-t-red-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">The Devil's Tracker</CardTitle>
                    <CardDescription>Poker Session Management App</CardDescription>
                  </div>
                  <Badge variant="secondary">Apr. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <p className="text-muted-foreground">
                  Built a cross-platform mobile app to manage poker sessions, automating buy-ins and earnings across <strong>30+</strong> games, reducing settlement time by <strong>90%</strong>
                </p>
                <p className="text-muted-foreground text-sm">
                  Implemented QR-based game/user encoding with Expo Camera cutting setup time from 2 min → 10 secs and real-time sync with Firebase Firestore for game state and earnings
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="hover:bg-red-500/10 transition-colors">React Native</Badge>
                  <Badge variant="outline" className="hover:bg-red-500/10 transition-colors">TypeScript</Badge>
                  <Badge variant="outline" className="hover:bg-red-500/10 transition-colors">Node.js</Badge>
                  <Badge variant="outline" className="hover:bg-red-500/10 transition-colors">Express.js</Badge>
                  <Badge variant="outline" className="hover:bg-red-500/10 transition-colors">PostgreSQL</Badge>
                  <Badge variant="outline" className="hover:bg-red-500/10 transition-colors">Firebase</Badge>
                </div>
                <a 
                  href="https://github.com/tristanyii/poker-tracker-catalyst" 
            target="_blank"
            rel="noopener noreferrer"
                  className="inline-block mt-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/DevilsTracker.png" 
                    alt="The Devil's Tracker - Duke Project" 
                    className="h-8 w-auto"
                  />
                </a>
              </CardContent>
            </Card>

            {/* GoHelpMe - CUHackIt */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.05] group relative overflow-hidden glass border-2 border-blue-500/20 rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">GoHelpMe - Disaster Response App</CardTitle>
                    <CardDescription>CUHackIt: 1st Place 🥇</CardDescription>
                  </div>
                  <Badge variant="secondary">Mar. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <p className="text-muted-foreground">
                  Led development of a disaster-response app that connects victims with volunteers via real-time geolocation, 
                  enabling faster mobilization and more effective resource allocation during crises.
                </p>
                <p className="text-muted-foreground text-sm">
                  Enabled the mobile frontend to process <strong>500+</strong> live help requests during testing by developing and 
                  deploying backend services with Node.js, Express, and PostgreSQL.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="hover:bg-blue-500/10 transition-colors">React Native</Badge>
                  <Badge variant="outline" className="hover:bg-blue-500/10 transition-colors">Expo</Badge>
                  <Badge variant="outline" className="hover:bg-blue-500/10 transition-colors">Node.js</Badge>
                  <Badge variant="outline" className="hover:bg-blue-500/10 transition-colors">Express</Badge>
                  <Badge variant="outline" className="hover:bg-blue-500/10 transition-colors">PostgreSQL</Badge>
                </div>
                <a 
                  href="https://devpost.com/software/gohelpme" 
            target="_blank"
            rel="noopener noreferrer"
                  className="inline-block mt-4 hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="/GoHelpMe.jpeg" 
                    alt="GoHelpMe - CUHackIt Winner" 
                    className="h-12 w-auto rounded-lg"
                  />
                </a>
              </CardContent>
            </Card>

            {/* Personal Website */}
            <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden rounded-2xl border-l-4 border-l-purple-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-xl">Personal Portfolio Website</CardTitle>
                    <CardDescription>You're looking at it! ✨</CardDescription>
                  </div>
                  <Badge variant="secondary">2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <p className="text-muted-foreground">
                  Built a modern, responsive personal website featuring real-time Spotify integration with my listening stats, 
                  smooth scrolling animations, and a unique gradient design system.
                </p>
                <p className="text-muted-foreground text-sm">
                  Integrated Spotify Web API to dynamically display my top artists and tracks with real-time updates.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="hover:bg-purple-500/10 transition-colors">Next.js</Badge>
                  <Badge variant="outline" className="hover:bg-purple-500/10 transition-colors">TypeScript</Badge>
                  <Badge variant="outline" className="hover:bg-purple-500/10 transition-colors">Tailwind CSS</Badge>
                  <Badge variant="outline" className="hover:bg-purple-500/10 transition-colors">Spotify API</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Music Section */}
      <section id="music" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        <div className="space-y-12 max-w-6xl mx-auto relative z-10">
          <SpotifySection />
        </div>
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="container mx-auto px-4 py-24 scroll-mt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="space-y-12 max-w-5xl mx-auto relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Hobbies & Interests
            </h2>
            <p className="text-muted-foreground text-lg">What I do outside of coding</p>
          </div>

          <HobbiesSection />
        </div>
      </section>

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
      <MusicPlayer />
    </div>
  );
}

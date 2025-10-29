import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Nav } from "@/components/nav";

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Nav />

      <section className="container py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Experience</h1>
            <p className="text-muted-foreground text-lg">My professional and academic journey</p>
          </div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {/* Duke Code+ */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle>Software Engineer Intern</CardTitle>
                    <CardDescription className="text-base">Duke Code+ Program • Durham, NC</CardDescription>
                  </div>
                  <Badge>May 2025 - Present</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Flask</Badge>
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Neo4j</Badge>
                  <Badge variant="outline">Selenium</Badge>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Selected as <strong>1 of 4 interns</strong> from <strong>300+ applicants</strong> to build an AI-powered fundraising platform using Flask and Python, projected to drive <strong>$10M+</strong> in gifts by connecting philanthropists with Duke research initiatives</li>
                  <li>Increased donor-research match accuracy by <strong>40%</strong> by embedding donor interests with Sentence Transformers and mapping <strong>2K+</strong> alumni relationships in Neo4j to surface high-value connections for targeted outreach</li>
                  <li>Accelerate donor data acquisition by <strong>95%</strong> by building a Selenium pipeline to scrape <strong>13K+</strong> records and enriching profiles with DukeGPT insights spanning board roles, affiliations, and career history</li>
                </ul>
              </CardContent>
            </Card>

            {/* Blue Devil Buddies */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle>Software Engineer Intern</CardTitle>
                    <CardDescription className="text-base">Blue Devil Buddies • Durham, NC</CardDescription>
                  </div>
                  <Badge>Jun. 2025 - Aug. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">Pandas</Badge>
                  <Badge variant="outline">Data Processing</Badge>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Developing Duke's largest mentorship program through a Python-based matching system that pairs mentors and freshmen by shared interests and backgrounds, scaling to support <strong>12.5K+</strong> participants</li>
                  <li>Improving match accuracy and reducing manual processing time by <strong>80%</strong> by cleaning and standardizing <strong>100K+</strong> survey responses across multiple semesters with Pandas</li>
                </ul>
              </CardContent>
            </Card>

            {/* Research Assistant */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <CardTitle>Research Assistant</CardTitle>
                    <CardDescription className="text-base">Duke Fuqua Graduate School of Business • Durham, NC</CardDescription>
                  </div>
                  <Badge>Aug. 2024 - Jul. 2025</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Python</Badge>
                  <Badge variant="outline">BeautifulSoup</Badge>
                  <Badge variant="outline">Excel</Badge>
                  <Badge variant="outline">Data Analysis</Badge>
                </div>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Automated Python web-scraping pipelines with BeautifulSoup to collect and process financial disclosures, cutting manual data gathering by <strong>9+ hours</strong> weekly and enabling large-scale political finance analysis</li>
                  <li>Structured and validated datasets of legislative financial records with <strong>98%</strong> accuracy in Excel, supporting reliable research on lawmakers' business affiliations and investment activity</li>
                </ul>
              </CardContent>
            </Card>

            {/* Leadership Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Leadership</h2>
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle>Catalyst Marketing Executive</CardTitle>
                        <CardDescription className="text-base">Durham, NC</CardDescription>
                      </div>
                      <Badge>Apr. 2024 - Present</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Expanding Duke's largest pre-professional tech org by hosting resume workshops and professional events; generated <strong>150K+</strong> social media impressions and boosted event attendance by <strong>30%</strong> YTD</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <CardTitle>DukeLife Mentor</CardTitle>
                        <CardDescription className="text-base">Durham, NC</CardDescription>
                      </div>
                      <Badge>Jun. 2025 - Present</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Mentoring first-gen/low-income students across multiple cohorts, easing academic and social transitions and driving a <strong>~25%</strong> increase in campus resource use</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


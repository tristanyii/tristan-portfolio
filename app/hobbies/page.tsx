import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Nav } from "@/components/nav";

export default function HobbiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Nav />

      <section className="container py-24">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Hobbies & Interests</h1>
            <p className="text-muted-foreground text-lg">What I do outside of coding</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏀
                  <span>Basketball</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Playing pickup games at the gym and following the NBA. 
                  Basketball helps me stay active and build teamwork skills.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📚
                  <span>Reading</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Love reading books on technology, science fiction, and personal development. 
                  Currently exploring AI and machine learning literature.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✈️
                  <span>Travel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Exploring new places and cultures. Traveled to 5+ countries 
                  and counting. Each trip brings new perspectives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎵
                  <span>Music</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enjoy listening to various genres and discovering new artists. 
                  Music is my go-to for focus and relaxation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🍳
                  <span>Cooking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experimenting with recipes from different cuisines. 
                  Cooking is a creative outlet and a way to share with friends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎮
                  <span>Gaming</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Playing strategy and puzzle games. Gaming is a fun way to 
                  unwind and connect with friends online.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}


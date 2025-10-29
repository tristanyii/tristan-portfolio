import { Nav } from "@/components/nav";
import { LocalMusicPlayer } from "@/components/local-music-player";

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Nav />

      <section className="container py-24">
        <div className="space-y-12 pb-32">
          {/* Music Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient relative inline-block">
              My Music Taste 🎵
              <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient rounded-full"></div>
            </h2>
            <p className="text-muted-foreground text-lg">Check out what I'm listening to</p>
          </div>
          
          {/* Song Cards */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { title: "ONLY", artist: "LeeHi", emoji: "🎤", genre: "K-Pop/R&B" },
                { title: "My Lady", artist: "marQ", emoji: "🎵", genre: "Alternative R&B" },
                { title: "Call On Me", artist: "Daniel Caesar", emoji: "🎶", genre: "R&B/Soul" },
              ].map((song, i) => (
                <div key={i} className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-8 text-center hover:shadow-xl hover:scale-105 transition-all border border-primary/10">
                  <div className="text-5xl mb-4">{song.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{song.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{song.artist}</p>
                  <p className="text-xs text-muted-foreground/70">{song.genre}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Ready to listen?</p>
            <p className="text-sm text-muted-foreground">
              🎧 Click the gradient button in the bottom right corner to start playing
            </p>
          </div>
          
          <LocalMusicPlayer />
        </div>
      </section>
    </div>
  );
}


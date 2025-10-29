import { Nav } from "@/components/nav";
import { SpotifySection } from "@/components/spotify-section";
import { YouTubeMusicPlayer } from "@/components/youtube-music-player";

export default function MusicPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Nav />

      <section className="container py-24">
        <SpotifySection />
      </section>

      <YouTubeMusicPlayer />
    </div>
  );
}


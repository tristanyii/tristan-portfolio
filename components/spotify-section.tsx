"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Loader2, TrendingUp, Clock } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
  popularity: number;
  followers: { total: number };
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export function SpotifySection() {
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Custom genre mappings
  const genreMap: { [key: string]: string } = {
    "marQ": "Alternative R&B",
    "beabadoobee": "Indie Rock",
    "Malcolm Todd": "Indie Pop",
    "Laufey": "Jazz Pop",
    "The Beach Boys": "Surf Rock",
    "The Marías": "Dream Pop",
    "Daniel Caesar": "R&B/Soul",
    "A Tribe Called Quest": "Jazz Rap",
  };

  const getGenre = (artistName: string, defaultGenres: string[]): string => {
    if (genreMap[artistName]) {
      return genreMap[artistName];
    }
    return defaultGenres[0] || "Music";
  };

  useEffect(() => {
    fetchSpotifyData();
  }, []);

  const fetchSpotifyData = async () => {
    setLoading(true);
    try {
      const [artistsRes, tracksRes] = await Promise.all([
        fetch("/api/spotify/top-artists"),
        fetch("/api/spotify/top-tracks"),
      ]);
      
      const artistsData = await artistsRes.json();
      const tracksData = await tracksRes.json();
      
      if (artistsData.items) {
        setTopArtists(artistsData.items);
      }
      if (tracksData.items) {
        setTopTracks(tracksData.items);
      }
    } catch (err) {
      console.error("Error fetching Spotify data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient relative inline-block">
            My Music Taste 🎵
            <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient rounded-full"></div>
          </h2>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading my Spotify stats...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || topArtists.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient relative inline-block">
            My Music Taste 🎵
            <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient rounded-full"></div>
          </h2>
          <p className="text-muted-foreground">Check out my Spotify profile!</p>
          <Button variant="outline" asChild>
            <a 
              href="https://open.spotify.com/user/kjq94n4jsrovc840u9qvpx0o5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="gap-2"
            >
              <Music2 className="h-4 w-4" />
              View My Spotify Profile
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient relative inline-block">
          My Music Taste 🎵
          <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-gradient rounded-full"></div>
        </h2>
        <p className="text-muted-foreground text-lg">Artists I'm currently listening to on Spotify (last 6 months)</p>
        <Button variant="outline" asChild>
          <a 
            href="https://open.spotify.com/user/kjq94n4jsrovc840u9qvpx0o5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="gap-2"
          >
            <Music2 className="h-4 w-4" />
            View My Spotify Profile
          </a>
        </Button>
      </div>

      {/* Top Artists */}
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          {topArtists.slice(0, 3).map((artist, index) => (
            <Card key={artist.id} className="relative overflow-hidden hover:shadow-xl transition-all group">
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                #{index + 1}
              </div>
              <CardHeader className="text-center pb-4">
                {artist.images[0] ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                    {artist.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{artist.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Genres */}
                <div className="flex flex-wrap gap-1.5 justify-center min-h-[28px]">
                  <span className="text-xs bg-secondary px-2.5 py-1 rounded-full hover:bg-primary/10 transition-colors">
                    {getGenre(artist.name, artist.genres)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* More Artists */}
      {topArtists.length > 3 && (
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-5">
            {topArtists.slice(3).map((artist) => (
              <Card key={artist.id} className="hover:shadow-lg transition-all hover:scale-105 group">
                <CardHeader className="text-center p-4">
                  {artist.images[0] ? (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-20 h-20 mx-auto mb-2 rounded-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
                      {artist.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <CardTitle className="text-sm group-hover:text-primary transition-colors">{artist.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {getGenre(artist.name, artist.genres)}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

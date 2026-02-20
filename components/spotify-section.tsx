"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Loader2, TrendingUp, Clock } from "lucide-react";
import { EditableText } from "./editable-text";

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
  const [visibleArtists, setVisibleArtists] = useState<number>(0);
  const [timeRange, setTimeRange] = useState<'medium_term' | 'long_term'>('medium_term');

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
  }, [timeRange]);

  // Trigger fade-in animation when artists are loaded (not during loading state)
  useEffect(() => {
    if (!loading && topArtists.length > 0 && visibleArtists === 0) {
      topArtists.forEach((_: Artist, index: number) => {
        setTimeout(() => {
          setVisibleArtists(index + 1);
        }, index * 120);
      });
    }
  }, [topArtists, loading]);

  const fetchSpotifyData = async () => {
    setLoading(true);
    setVisibleArtists(0); // Reset visible artists
    let artistsData: any = null;
    try {
      const [artistsRes, tracksRes] = await Promise.all([
        fetch(`/api/spotify/top-artists?time_range=${timeRange}`),
        fetch("/api/spotify/top-tracks"),
      ]);
      
      artistsData = await artistsRes.json();
      const tracksData = await tracksRes.json();
      
      if (artistsData.items) {
        setTopArtists(artistsData.items);
        // Fade in artists one by one with smoother timing
        artistsData.items.forEach((_: Artist, index: number) => {
          setTimeout(() => {
            setVisibleArtists(index + 1);
          }, index * 120); // 120ms delay between each artist for smoother flow
        });
      }
      if (tracksData.items) {
        setTopTracks(tracksData.items);
      }
    } catch (err) {
      console.error("Error fetching Spotify data:", err);
      setError(true);
    } finally {
      const animationDuration = artistsData?.items?.length ? artistsData.items.length * 120 + 600 : 500;
      setTimeout(() => {
        setLoading(false);
      }, animationDuration); // Wait for all animations + buffer
    }
  };

  // Show fade-in animation during loading
  if (loading && topArtists.length > 0) {
    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <EditableText contentKey="section.music.label" defaultValue="What I Listen To" as="p" className="text-sm uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
          <EditableText contentKey="section.music.title" defaultValue="Music" as="h2" className="text-5xl font-bold tracking-tight sm:text-6xl text-foreground" />
          <div className="flex items-center justify-center gap-2">
            <p className="text-muted-foreground text-xl">
              Artists I&apos;m currently listening to on Spotify ({timeRange === 'medium_term' ? 'last 6 months' : 'all time'})
            </p>
            <div className="flex gap-2 ml-3">
              <Button
                variant={timeRange === 'medium_term' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('medium_term')}
                disabled={loading}
              >
                6 months
              </Button>
              <Button
                variant={timeRange === 'long_term' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('long_term')}
                disabled={loading}
              >
                All time
              </Button>
            </div>
          </div>
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

        {/* Fade-in animation for artists */}
        <div className="max-w-6xl mx-auto">
          {/* Mobile Pyramid Layout */}
          <div className="block md:hidden space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {topArtists.slice(0, 3).map((artist, index) => (
                  <Card 
                    key={artist.id} 
                    className={`relative overflow-hidden hover:shadow-xl hover:scale-105 group transition-all ${
                      index < visibleArtists 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2'
                    }`}
                    style={{
                      transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: index >= visibleArtists ? 'opacity, transform' : 'auto',
                    }}
                  >
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform z-10">
                      #{index + 1}
                    </div>
                    <CardHeader className="text-center p-4">
                      {artist.images[0] ? (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-20 h-20 mx-auto mb-2 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                          {artist.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <CardTitle className="text-xs group-hover:text-primary transition-colors line-clamp-2">{artist.name}</CardTitle>
                      <div className="flex flex-wrap gap-1 justify-center mt-1">
                        <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors line-clamp-1">
                          {getGenre(artist.name, artist.genres)}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            {topArtists.length > 3 && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                <div className="space-y-3">
                  <h3 className="text-center text-sm font-semibold text-muted-foreground">More Artists</h3>
                  {topArtists.slice(3, 5).length > 0 && (
                    <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                      {topArtists.slice(3, 5).map((artist, index) => (
                        <Card 
                          key={artist.id} 
                          className={`overflow-hidden hover:shadow-lg hover:scale-105 group transition-all ${
                            index + 3 < visibleArtists 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{
                            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: index + 3 >= visibleArtists ? 'opacity, transform' : 'auto',
                          }}
                        >
                          <CardHeader className="text-center p-3">
                            {artist.images[0] ? (
                              <img
                                src={artist.images[0].url}
                                alt={artist.name}
                                className="w-16 h-16 mx-auto mb-2 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
                                {artist.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <CardTitle className="text-xs group-hover:text-primary transition-colors line-clamp-2">{artist.name}</CardTitle>
                            <div className="flex flex-wrap gap-1 justify-center mt-1">
                              <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors line-clamp-1">
                                {getGenre(artist.name, artist.genres)}
                              </span>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                  {topArtists.slice(5, 8).length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {topArtists.slice(5, 8).map((artist, index) => (
                        <Card 
                          key={artist.id} 
                          className={`overflow-hidden hover:shadow-lg hover:scale-105 group transition-all ${
                            index + 5 < visibleArtists 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{
                            transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: index + 5 >= visibleArtists ? 'opacity, transform' : 'auto',
                          }}
                        >
                          <CardHeader className="text-center p-2">
                            {artist.images[0] ? (
                              <img
                                src={artist.images[0].url}
                                alt={artist.name}
                                className="w-12 h-12 mx-auto mb-1 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform"
                              />
                            ) : (
                              <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                                {artist.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <CardTitle className="text-[10px] group-hover:text-primary transition-colors line-clamp-2">{artist.name}</CardTitle>
                            <div className="flex flex-wrap gap-1 justify-center mt-0.5">
                              <span className="text-[8px] bg-secondary px-1 py-0.5 rounded-full hover:bg-primary/10 transition-colors line-clamp-1">
                                {getGenre(artist.name, artist.genres)}
                              </span>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Desktop Pyramid Layout */}
          <div className="hidden md:block space-y-12">
            <div className="flex justify-center px-4">
              <div className="grid grid-cols-3 gap-8 w-full" style={{ maxWidth: '1000px' }}>
                {topArtists.slice(0, 3).map((artist, index) => (
                  <Card 
                    key={artist.id} 
                    className={`relative overflow-hidden hover:shadow-xl hover:scale-105 group transition-all ${
                      index < visibleArtists 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2'
                    }`}
                    style={{
                      transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: index >= visibleArtists ? 'opacity, transform' : 'auto',
                    }}
                  >
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform z-10">
                      #{index + 1}
                    </div>
                    <CardHeader className="text-center pb-6 pt-6">
                      {artist.images[0] ? (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-40 h-40 mx-auto mb-6 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                          {artist.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-3">{artist.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="text-sm bg-secondary px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                          {getGenre(artist.name, artist.genres)}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
            {topArtists.length > 3 && (
              <div className="flex justify-center px-4">
                <div className="grid grid-cols-5 gap-6 w-full" style={{ maxWidth: '1400px' }}>
                  {topArtists.slice(3, 8).map((artist, index) => (
                    <Card 
                      key={artist.id} 
                      className={`hover:shadow-lg hover:scale-105 group transition-all ${
                        index + 3 < visibleArtists 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-2'
                      }`}
                      style={{
                        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: index + 3 >= visibleArtists ? 'opacity, transform' : 'auto',
                      }}
                    >
                      <CardHeader className="text-center p-6">
                        {artist.images[0] ? (
                          <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className="w-28 h-28 mx-auto mb-4 rounded-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                            {artist.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <CardTitle className="text-base group-hover:text-primary transition-colors mb-2">{artist.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {getGenre(artist.name, artist.genres)}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <EditableText contentKey="section.music.label" defaultValue="What I Listen To" as="p" className="text-sm uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
          <EditableText contentKey="section.music.title" defaultValue="Music" as="h2" className="text-5xl font-bold tracking-tight sm:text-6xl text-foreground" />
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
          <EditableText contentKey="section.music.label" defaultValue="What I Listen To" as="p" className="text-sm uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
          <EditableText contentKey="section.music.title" defaultValue="Music" as="h2" className="text-5xl font-bold tracking-tight sm:text-6xl text-foreground" />
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
      <div className="text-center space-y-3 sm:space-y-4">
        <EditableText contentKey="section.music.label" defaultValue="What I Listen To" as="p" className="text-sm uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" />
        <EditableText contentKey="section.music.title" defaultValue="Music" as="h2" className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <p className="text-muted-foreground text-base sm:text-xl">
            Artists I&apos;m currently listening to on Spotify ({timeRange === 'medium_term' ? 'last 6 months' : 'all time'})
          </p>
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'medium_term' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('medium_term')}
            >
              6 months
            </Button>
            <Button
              variant={timeRange === 'long_term' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('long_term')}
            >
              All time
            </Button>
          </div>
        </div>
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

      {/* All Artists - Pyramid Layout on Mobile, Grid on Desktop */}
      <div className="max-w-6xl mx-auto">
        {/* Mobile Pyramid Layout */}
        <div className="block md:hidden space-y-6">
          {/* Top 3 Artists - Large Cards */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {topArtists.slice(0, 3).map((artist, index) => (
                  <Card 
                    key={artist.id} 
                    className={`relative overflow-hidden hover:shadow-xl hover:scale-105 group transition-all ${
                      index < visibleArtists 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2'
                    }`}
                    style={{
                      transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: index >= visibleArtists ? 'opacity, transform' : 'auto',
                    }}
                  >
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm group-hover:scale-110 transition-transform z-10">
                    #{index + 1}
                  </div>
                  <CardHeader className="text-center p-2 sm:p-4">
                    {artist.images[0] ? (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                        {artist.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <CardTitle className="text-[11px] sm:text-xs group-hover:text-primary transition-colors line-clamp-2">{artist.name}</CardTitle>
                    <div className="flex flex-wrap gap-1 justify-center mt-1">
                      <span className="text-[9px] sm:text-[10px] bg-secondary px-1.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors line-clamp-1">
                        {getGenre(artist.name, artist.genres)}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

          {/* Remaining Artists - Smaller Pyramid */}
          {topArtists.length > 3 && (
            <div className="space-y-3">
              <h3 className="text-center text-sm font-semibold text-muted-foreground">More Artists</h3>
              
              {/* Row of 2 */}
              {topArtists.slice(3, 5).length > 0 && (
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {topArtists.slice(3, 5).map((artist) => (
                    <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 group">
                      <CardHeader className="text-center p-3">
                        {artist.images[0] ? (
                          <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className="w-16 h-16 mx-auto mb-2 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
                            {artist.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <CardTitle className="text-xs group-hover:text-primary transition-colors line-clamp-2">{artist.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 justify-center mt-1">
                          <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors line-clamp-1">
                            {getGenre(artist.name, artist.genres)}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}

              {/* Row of 3 */}
              {topArtists.slice(5, 8).length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {topArtists.slice(5, 8).map((artist) => (
                    <Card key={artist.id} className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 group">
                      <CardHeader className="text-center p-2">
                        {artist.images[0] ? (
                          <img
                            src={artist.images[0].url}
                            alt={artist.name}
                            className="w-12 h-12 mx-auto mb-1 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                            {artist.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <CardTitle className="text-[10px] group-hover:text-primary transition-colors line-clamp-2">{artist.name}</CardTitle>
                        <div className="flex flex-wrap gap-1 justify-center mt-0.5">
                          <span className="text-[8px] bg-secondary px-1 py-0.5 rounded-full hover:bg-primary/10 transition-colors line-clamp-1">
                            {getGenre(artist.name, artist.genres)}
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Pyramid Layout */}
        <div className="hidden md:block space-y-12">
          {/* Top 3 Artists - Large Cards Centered */}
          <div className="flex justify-center px-4">
            <div className="grid grid-cols-3 gap-8 w-full" style={{ maxWidth: '1000px' }}>
              {topArtists.slice(0, 3).map((artist, index) => (
                  <Card 
                    key={artist.id} 
                    className={`relative overflow-hidden hover:shadow-xl hover:scale-105 group transition-all ${
                      index < visibleArtists 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-2'
                    }`}
                    style={{
                      transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: index >= visibleArtists ? 'opacity, transform' : 'auto',
                    }}
                  >
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform z-10">
                    #{index + 1}
                  </div>
                  <CardHeader className="text-center pb-6 pt-6">
                    {artist.images[0] ? (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-40 h-40 mx-auto mb-6 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                        {artist.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-3">{artist.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-sm bg-secondary px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                        {getGenre(artist.name, artist.genres)}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom 5 Artists - Medium Cards */}
          {topArtists.length > 3 && (
            <div className="flex justify-center px-4">
              <div className="grid grid-cols-5 gap-6 w-full" style={{ maxWidth: '1400px' }}>
                  {topArtists.slice(3, 8).map((artist, index) => (
                    <Card 
                      key={artist.id} 
                      className={`hover:shadow-lg transition-all hover:scale-105 group ${
                        index + 3 < visibleArtists 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                      } transition-all duration-500`}
                    >
                    <CardHeader className="text-center p-6">
                      {artist.images[0] ? (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-28 h-28 mx-auto mb-4 rounded-full object-cover group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-28 h-28 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                          {artist.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <CardTitle className="text-base group-hover:text-primary transition-colors mb-2">{artist.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {getGenre(artist.name, artist.genres)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

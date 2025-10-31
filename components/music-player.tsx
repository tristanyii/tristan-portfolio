"use client";

import { useState, useEffect, useRef } from "react";
import { Music, Play, Pause, SkipForward, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Track {
  id: string;
  name: string;
  artists: string;
  album: string;
  albumArt: string;
  youtubeId?: string;
}

// Declare YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Load cache from localStorage on initial load
const loadCacheFromStorage = (): { [key: string]: string } => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('youtube_cache_music');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }
  return {};
};

// Save cache to localStorage
const saveCacheToStorage = (cache: { [key: string]: string }) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('youtube_cache_music', JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }
};

export function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  const [playerReady, setPlayerReady] = useState(false);
  // Cache for YouTube video IDs (initialized client-side only to prevent hydration mismatch)
  const youtubeCacheRef = useRef<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);

  // Initialize cache on client-side only
  useEffect(() => {
    setIsClient(true);
    youtubeCacheRef.current = loadCacheFromStorage();
  }, []);

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setPlayerReady(true);
      };
    } else {
      setPlayerReady(true);
    }
  }, []);

  // Refetch tracks every time player is opened to get latest Spotify data
  useEffect(() => {
    if (isOpen) {
      fetchTracks();
      setCurrentTrackIndex(0); // Reset to first track
    }
  }, [isOpen]);

  const fetchTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🎵 Fetching Spotify tracks...");
      const spotifyResponse = await fetch("/api/spotify/top-tracks");
      
      if (!spotifyResponse.ok) {
        throw new Error(`Failed to fetch tracks: ${spotifyResponse.status}`);
      }
      
      const spotifyData = await spotifyResponse.json();
      console.log("📦 Received Spotify data:", spotifyData.length, "tracks");
      
      if (!Array.isArray(spotifyData) || spotifyData.length === 0) {
        setError("No tracks found");
        return;
      }
      
      // Get YouTube IDs for the first 5 tracks (reduced from 10 to save quota)
      const tracksToFetch = spotifyData.slice(0, 5);
      console.log(`🔍 Checking ${tracksToFetch.length} tracks (with cache)...`);
      
      const tracksWithYoutube = await Promise.all(
        tracksToFetch.map(async (track: any) => {
          const searchQuery = `${track.name} ${track.artists.map((a: any) => a.name).join(' ')}`;
          const cacheKey = `${track.id}-${searchQuery}`;
          
          // Check cache first (only if client-side is ready)
          if (isClient && youtubeCacheRef.current[cacheKey]) {
            console.log(`✅ Cache hit for: ${track.name}`);
            return {
              id: track.id,
              name: track.name,
              artists: track.artists.map((a: any) => a.name).join(", "),
              album: track.album.name,
              albumArt: track.album.images[0]?.url || "",
              youtubeId: youtubeCacheRef.current[cacheKey],
            };
          }
          
          try {
            console.log(`🔍 Cache miss, searching YouTube for: "${searchQuery}"`);
            const youtubeResponse = await fetch(`/api/youtube/search?q=${encodeURIComponent(searchQuery)}`);
            
            if (youtubeResponse.ok) {
              const youtubeData = await youtubeResponse.json();
              
              if (youtubeData.videoId) {
                // Store in cache and localStorage (only if client-side is ready)
                if (isClient) {
                  youtubeCacheRef.current[cacheKey] = youtubeData.videoId;
                  saveCacheToStorage(youtubeCacheRef.current);
                  console.log(`✅ Cached video ID for: ${track.name} (saved to localStorage)`);
                }
                
                return {
                  id: track.id,
                  name: track.name,
                  artists: track.artists.map((a: any) => a.name).join(", "),
                  album: track.album.name,
                  albumArt: track.album.images[0]?.url || "",
                  youtubeId: youtubeData.videoId,
                };
              }
            } else if (youtubeResponse.status === 403) {
              console.warn(`⚠️ Quota exceeded, skipping YouTube search for remaining tracks`);
              // Stop trying after quota exceeded
            }
          } catch (err) {
            console.error(`❌ Error for ${track.name}:`, err);
          }
          
          return {
            id: track.id,
            name: track.name,
            artists: track.artists.map((a: any) => a.name).join(", "),
            album: track.album.name,
            albumArt: track.album.images[0]?.url || "",
          };
        })
      );

      const playableTracks = tracksWithYoutube.filter(track => track.youtubeId);
      console.log(`✅ Found ${playableTracks.length} playable tracks with YouTube out of ${tracksWithYoutube.length} total`);
      console.log(`📋 Playable tracks:`, playableTracks.map(t => t.name));
      
      if (playableTracks.length === 0) {
        setError("No playable tracks available");
        setTracks([]);
      } else {
        setTracks(playableTracks);
      }
    } catch (err) {
      console.error("❌ Error fetching tracks:", err);
      setError("Failed to load tracks");
    } finally {
      setLoading(false);
    }
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    const track = tracks[index];
    
    if (!track.youtubeId) return;

    if (playerRef.current) {
      playerRef.current.loadVideoById(track.youtubeId);
      playerRef.current.playVideo();
      setIsPlaying(true);
    } else if (playerReady && window.YT) {
      // Create player
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: track.youtubeId,
        playerVars: {
          autoplay: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              nextTrack();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) {
      if (tracks.length > 0) {
        playTrack(currentTrackIndex);
      }
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    playTrack(nextIndex);
  };

  useEffect(() => {
    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const currentTrack = tracks[currentTrackIndex];

  return (
    <>
      {/* Hidden YouTube Player */}
      <div id="youtube-player" style={{ display: 'none' }}></div>

      {/* Floating Music Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full shadow-2xl bg-black hover:bg-black/80 text-white border-4 border-background"
        size="icon"
      >
        <Music className="h-8 w-8" />
      </Button>

      {/* Music Player Panel */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 w-80 bg-background/95 backdrop-blur border rounded-lg shadow-2xl p-4 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">My Top Tracks</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </Button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              </div>
            )}

            {error && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {error}
              </div>
            )}

            {!loading && !error && tracks.length > 0 && currentTrack && (
              <>
                {/* Album Art */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={currentTrack.albumArt}
                    alt={currentTrack.album}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Track Info */}
                <div className="space-y-1">
                  <h4 className="font-semibold truncate">{currentTrack.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentTrack.artists}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.album}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTrack}
                    className="w-10 h-10 rounded-full"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                {/* Track List */}
                <div className="max-h-48 overflow-y-auto space-y-2 border-t pt-2">
                  {tracks.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(index)}
                      className={`w-full text-left p-2 rounded hover:bg-muted transition-colors ${
                        index === currentTrackIndex ? "bg-red-600/10" : ""
                      }`}
                    >
                      <p className="text-sm font-medium truncate">{track.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artists}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

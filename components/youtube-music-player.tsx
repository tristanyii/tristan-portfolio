"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
}

interface VideoResult {
  videoId: string;
  title: string;
}

// Load cache from localStorage on initial load
const loadVideoCacheFromStorage = (): { [key: string]: string } => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('youtube_cache_player');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }
  return {};
};

// Save cache to localStorage
const saveVideoCacheToStorage = (cache: { [key: string]: string }) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('youtube_cache_player', JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }
};

// Cache for YouTube video IDs (persists across sessions via localStorage)
const youtubeVideoCache: { [key: string]: string } = loadVideoCacheFromStorage();

export function YouTubeMusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<VideoResult | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  // Fetch tracks on mount
  useEffect(() => {
    fetchTopTracks();
  }, []);

  // Refetch tracks every time player is opened to get latest Spotify data
  useEffect(() => {
    if (isOpen) {
      fetchTopTracks();
      setCurrentTrackIndex(0); // Reset to first track
    }
  }, [isOpen]);

  useEffect(() => {
    if (tracks.length > 0 && isOpen) {
      searchYouTubeVideo(tracks[currentTrackIndex]);
    }
  }, [currentTrackIndex, tracks, isOpen]);

  const searchYouTubeVideo = async (track: Track) => {
    setLoadingVideo(true);
    try {
      const artist = track.artists[0]?.name || "";
      const song = track.name;
      const query = `${artist} ${song} official audio`;
      const cacheKey = `${track.id}-${query}`;
      
      // Check cache first
      if (youtubeVideoCache[cacheKey]) {
        console.log(`✅ YouTube cache hit for: ${track.name}`);
        setCurrentVideo({
          videoId: youtubeVideoCache[cacheKey],
          title: track.name
        });
        setLoadingVideo(false);
        return;
      }
      
      console.log(`🔍 YouTube cache miss, fetching: ${track.name}`);
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.videoId) {
        // Store in cache and localStorage
        youtubeVideoCache[cacheKey] = data.videoId;
        saveVideoCacheToStorage(youtubeVideoCache);
        console.log(`✅ Cached YouTube video for: ${track.name} (saved to localStorage)`);
        setCurrentVideo(data);
      } else if (response.status === 403) {
        console.warn("⚠️ YouTube quota exceeded");
      }
    } catch (error) {
      console.error("Error searching YouTube:", error);
    } finally {
      setLoadingVideo(false);
    }
  };

  const fetchTopTracks = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching tracks from /api/spotify/top-tracks...");
      const response = await fetch("/api/spotify/top-tracks");
      
      if (!response.ok) {
        console.error("❌ API response not OK:", response.status, response.statusText);
        return;
      }
      
      const data = await response.json();
      console.log("📦 Received data type:", typeof data, "isArray:", Array.isArray(data));
      console.log("📦 Data:", data);
      
      // API returns direct array, not wrapped in items
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ Loaded ${data.length} tracks for YouTube player`);
        console.log("🎵 First track:", data[0]);
        setTracks(data.slice(0, 10)); // Use top 10 tracks
      } else {
        console.error("❌ No valid tracks. Got:", data);
      }
    } catch (error) {
      console.error("❌ Error fetching top tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentTrack = tracks[currentTrackIndex];
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setCurrentVideo(null);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setCurrentVideo(null);
  };

  return (
    <>
      {/* Floating Music Button */}
      {!isOpen && (
        <Button
          size="lg"
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg z-50 hover:scale-110 transition-transform bg-red-600 hover:bg-red-700"
          onClick={() => setIsOpen(true)}
          disabled={loading}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Music className="h-6 w-6" />
          )}
        </Button>
      )}

      {/* YouTube Music Player Card */}
      {isOpen && (
        <Card className="fixed bottom-8 right-8 w-[420px] shadow-2xl z-50 animate-in slide-in-from-bottom-5">
          <CardContent className="p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">Loading your music...</p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Music className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  No tracks available
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="mt-4"
                >
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                      <Music className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm leading-tight">
                        {currentTrack.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {currentTrack.artists.map(a => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* YouTube Player */}
                {loadingVideo ? (
                  <div className="flex items-center justify-center h-60 bg-black/50 rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                ) : currentVideo ? (
                  <div className="rounded-lg overflow-hidden">
                    <iframe
                      key={currentVideo.videoId}
                      width="100%"
                      height="240"
                      src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-60 bg-black/50 rounded-lg">
                    <p className="text-white text-sm">Video not found</p>
                  </div>
                )}

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTrack}
                    disabled={tracks.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Track {currentTrackIndex + 1} of {tracks.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextTrack}
                    disabled={tracks.length <= 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Playing from YouTube • Based on your Spotify history
                </p>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}


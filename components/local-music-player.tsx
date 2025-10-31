"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, X } from "lucide-react";

interface Song {
  title: string;
  artist: string;
  file: string; // Path to MP3 file in /public/music/
  cover?: string; // Optional: Path to album cover image
}

// 🎵 ADD YOUR SONGS HERE - Starting with LeeHi
const playlist: Song[] = [
  {
    title: "ONLY",
    artist: "LeeHi",
    file: "/이하이 (LeeHi) - 'ONLY' Official MV (ENG_CHN).mp3",
    cover: "/download (1).jpeg",
  },
  {
    title: "My Lady",
    artist: "marQ",
    file: "/marQ - My Lady (Lyrics).mp3",
    cover: "/hq720.jpg",
  },
  {
    title: "Call On Me",
    artist: "Daniel Caesar",
    file: "/Daniel Caesar - Call On Me (Official Lyric Video).mp3",
    cover: "/maxresdefault.jpg",
  },
  {
    title: "Moon River",
    artist: "Frank Ocean",
    file: "/Frank Ocean - Moon River.mp3",
    cover: "/maxresdefault (1).jpg",
  },
  {
    title: "Clementine",
    artist: "grentperez",
    file: "/grentperez - Clementine (Official Lyric Video).mp3",
    cover: "/images (1).jpeg",
  },
  // Add more songs here...
];

export function LocalMusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.3); // Start softly at 30%
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Note: Auto-play removed - music starts when user clicks button

  const startMusic = () => {
    setShowPlayer(true);
    setTimeout(() => {
      if (audioRef.current) {
        // Start LeeHi's ONLY at 30 seconds
        if (currentSongIndex === 0) {
          audioRef.current.currentTime = 30;
        }
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.error("Autoplay prevented:", err);
          // Browser blocked autoplay - user will need to click button
        });
      }
    }, 100);
  };

  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextSong();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Hide the floating player UI but keep audio playing
  const hidePlayer = () => {
    setIsExpanded(false);
    setShowPlayer(false);
  };

  // Close/exit the floating player and stop audio
  const closeAndPause = () => {
    setIsExpanded(false);
    setShowPlayer(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  // Allow external sections to close the player (e.g., from Music section "Exit")
  useEffect(() => {
    const handler = () => hidePlayer();
    window.addEventListener("music:close", handler as EventListener);
    return () => window.removeEventListener("music:close", handler as EventListener);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hidePlayer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const nextSong = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        // Start LeeHi's ONLY at 30 seconds
        if (nextIndex === 0) {
          audioRef.current.currentTime = 30;
        }
        audioRef.current.play();
      }
    }, 100);
  };

  const prevSong = () => {
    if (currentTime > 3) {
      // If more than 3 seconds in, restart current song
      if (currentSongIndex === 0) {
        audioRef.current!.currentTime = 30; // Start LeeHi at 0:30
      } else {
        audioRef.current!.currentTime = 0;
      }
    } else {
      // Otherwise go to previous song
      const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
      setCurrentSongIndex(prevIndex);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          // Start LeeHi's ONLY at 30 seconds
          if (prevIndex === 0) {
            audioRef.current.currentTime = 30;
          }
          audioRef.current.play();
        }
      }, 100);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (playlist.length === 0) {
    return null;
  }

  return (
    <>
      {/* Compact Music Button */}
      <div className="fixed bottom-8 right-8 z-50">
        {!isExpanded ? (
          /* Collapsed - Show Mini Player */
                 <button
                   onClick={() => {
                     if (!showPlayer) {
                       // First click: start music AND open menu
                       startMusic();
                     }
                     setIsExpanded(true);
                   }}
                   className="flex items-center gap-3 text-white px-5 py-3 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 animate-pulse-glow"
                   style={{
                     background: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 50%, #6366F1 100%)'
                   }}
                 >
            <div className="relative">
              <Music className={`h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight">
                {showPlayer ? currentSong.title : "Music"}
              </p>
              {showPlayer && (
                <p className="text-xs opacity-90">{currentSong.artist}</p>
              )}
            </div>
          </button>
        ) : (
          /* Expanded - Show Full Player */
          <div className="bg-background/98 backdrop-blur-lg border-2 border-primary/30 rounded-xl shadow-2xl w-72 animate-in zoom-in-95"
          >
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Now Playing</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeAndPause}
                className="h-7 w-7 rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Album Art */}
            <div className="p-3">
              <div className="relative">
                {currentSong.cover ? (
                  <div className={`relative ${isPlaying ? 'animate-pulse-slow' : ''}`}>
                    <img
                      src={currentSong.cover}
                      alt={currentSong.title}
                      className="w-full aspect-square rounded-lg object-cover shadow-lg"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-transparent via-transparent to-primary/20 animate-gradient pointer-events-none"></div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gradient-to-br from-primary via-purple-500 to-blue-500 rounded-lg shadow-lg flex items-center justify-center animate-gradient">
                    <Music className={`h-16 w-16 text-white/80 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute -inset-2 bg-primary/20 rounded-lg blur-md animate-pulse-slow -z-10"></div>
                )}
              </div>
            </div>

            {/* Song Info */}
            <div className="px-3 pb-3 text-center">
              <h4 className="font-bold text-base mb-1">{currentSong.title}</h4>
              <p className="text-xs text-muted-foreground">{currentSong.artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="px-3 pb-3">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={seek}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer 
                         [&::-webkit-slider-thumb]:appearance-none 
                         [&::-webkit-slider-thumb]:w-3 
                         [&::-webkit-slider-thumb]:h-3 
                         [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-primary
                         [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="px-3 pb-3 flex items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevSong}
                className="h-8 w-8 rounded-full"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                onClick={togglePlayPause}
                className="h-11 w-11 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextSong}
                className="h-8 w-8 rounded-full"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="px-3 pb-3 flex items-center gap-2">
              <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none 
                         [&::-webkit-slider-thumb]:w-2.5 
                         [&::-webkit-slider-thumb]:h-2.5 
                         [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-primary
                         [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-[10px] text-muted-foreground w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Playlist */}
            <div className="border-t p-3">
              <p className="text-[10px] font-semibold mb-1.5 text-muted-foreground">
                Up Next
              </p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {playlist.map((song, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSongIndex(index);
                      setIsPlaying(true);
                      setTimeout(() => {
                        if (audioRef.current) {
                          // Start LeeHi's ONLY at 30 seconds
                          if (index === 0) {
                            audioRef.current.currentTime = 30;
                          }
                          audioRef.current.play();
                        }
                      }, 100);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors text-xs ${
                      index === currentSongIndex
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-[10px] opacity-80 truncate">{song.artist}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentSong.file} />
    </>
  );
}

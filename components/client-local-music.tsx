"use client";

import dynamic from "next/dynamic";

export const ClientLocalMusicPlayer = dynamic(
  () => import("./local-music-player").then((m) => m.LocalMusicPlayer),
  { ssr: false }
);



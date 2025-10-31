"use client";

import { Button } from "@/components/ui/button";

export function MusicExitButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full bg-background/70 backdrop-blur hover:bg-primary/10"
      onClick={() => {
        window.dispatchEvent(new Event("music:close"));
      }}
    >
      Exit Player
    </Button>
  );
}



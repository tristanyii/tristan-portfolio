import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center h-full">
          Tristan Yi
        </Link>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/experience">Experience</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">Projects</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/music">Music</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hobbies">Hobbies</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}


"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", hash: "#home" },
    { href: "/#experience", label: "Experience", hash: "#experience" },
    { href: "/#projects", label: "Projects", hash: "#projects" },
    { href: "/#music", label: "Music", hash: "#music" },
    { href: "/#hobbies", label: "Hobbies", hash: "#hobbies" },
  ];

  return (
    <nav className="border-b glass sticky top-0 z-50 shadow-lg backdrop-blur-xl bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a 
          href="#home" 
          className="text-xl font-bold hover:opacity-80 transition-all hover:scale-105 flex items-center h-full bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient"
          onClick={() => setMobileMenuOpen(false)}
        >
          Tristan Yi
        </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-2 items-center">
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#home">Home</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#experience">Experience</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#skills">Skills</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#projects">Projects</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#music">Music</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#hobbies">Hobbies</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t glass">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <a
              href="#home"
              className="block px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#experience"
              className="block px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Experience
            </a>
            <a
              href="#skills"
              className="block px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Skills
            </a>
            <a
              href="#projects"
              className="block px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </a>
            <a
              href="#music"
              className="block px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Music
            </a>
            <a
              href="#hobbies"
              className="block px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hobbies
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}


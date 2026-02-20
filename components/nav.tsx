"use client";

import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "./admin-provider";
import { EditableText } from "./editable-text";

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();

  return (
    <nav className="border-b glass sticky top-0 z-50 shadow-lg backdrop-blur-xl bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a 
          href="#home" 
          className="text-2xl font-bold hover:opacity-70 transition-opacity flex items-center h-full text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          <EditableText
            contentKey="nav.logo"
            defaultValue="Tristan Yi"
            as="span"
            className="text-2xl font-bold"
          />
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
            <a href="#projects">Projects</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#music">Music</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#hobbies">Hobbies</a>
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
            <a href="#goals">Goals</a>
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="sm" className="hover:bg-primary/20 hover:text-primary transition-all hover:scale-105" asChild>
              <a href="/analytics" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </a>
            </Button>
          )}
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            className="rounded-full"
            onClick={() => {
              const root = document.documentElement;
              const nextIsDark = !root.classList.contains("dark");
              root.classList.toggle("dark", nextIsDark);
              localStorage.setItem("theme", nextIsDark ? "dark" : "light");
            }}
          >
            <Sun className="h-4 w-4 hidden dark:inline" />
            <Moon className="h-4 w-4 dark:hidden" />
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
        <div className="md:hidden border-t glass animate-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {[
              { href: "#home", label: "Home" },
              { href: "#experience", label: "Experience" },
              { href: "#projects", label: "Projects" },
              { href: "#music", label: "Music" },
              { href: "#hobbies", label: "Hobbies" },
              { href: "#goals", label: "Goals" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-3 rounded-lg hover:bg-primary/10 active:bg-primary/20 transition-colors text-center text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            {isAdmin && (
              <a
                href="/analytics"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/10 active:bg-primary/20 transition-colors text-center text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </a>
            )}
          </div>
          <div className="container mx-auto px-4 pb-3 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => {
                const root = document.documentElement;
                const nextIsDark = !root.classList.contains("dark");
                root.classList.toggle("dark", nextIsDark);
                localStorage.setItem("theme", nextIsDark ? "dark" : "light");
              }}
            >
              <Sun className="h-4 w-4 mr-2 hidden dark:inline" />
              <Moon className="h-4 w-4 mr-2 dark:hidden" />
              Theme
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

"use client";

import { useEffect, useState } from 'react';

export function AnalyticsUnlock() {
  const [tapSequence, setTapSequence] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    let keySequence: string[] = [];
    let timeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        keySequence.push('Shift');
        keySequence = keySequence.slice(-10);

        if (timeout) clearTimeout(timeout);

        if (keySequence.length === 10 && keySequence.every(k => k === 'Shift')) {
          if (typeof document !== 'undefined') {
            document.cookie = 'analytics_unlocked=true; path=/; max-age=3600; SameSite=Lax';
          }
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
          keySequence = [];
        }

        timeout = setTimeout(() => { keySequence = []; }, 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleLogoClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const logoLink = target.closest('a[href="#home"]');
      if (logoLink) {
        const now = Date.now();
        setTapSequence(prev => {
          const newSeq = [...prev.filter(t => now - t < 3000), now].slice(-10);
          if (newSeq.length === 10) {
            if (typeof document !== 'undefined') {
              document.cookie = 'analytics_unlocked=true; path=/; max-age=3600; SameSite=Lax';
            }
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return [];
          }
          return newSeq;
        });
      }
    };

    document.addEventListener('click', handleLogoClick, true);
    document.addEventListener('touchend', handleLogoClick, true);
    return () => {
      document.removeEventListener('click', handleLogoClick, true);
      document.removeEventListener('touchend', handleLogoClick, true);
    };
  }, []);

  if (!showToast) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-fade-in">
      Admin mode activated
    </div>
  );
}

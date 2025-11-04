"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AnalyticsUnlock() {
  const router = useRouter();
  const [tapSequence, setTapSequence] = useState<number[]>([]);

  useEffect(() => {
    let keySequence: string[] = [];
    let timeout: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        keySequence.push('Shift');
        keySequence = keySequence.slice(-10); // Keep last 10 presses
        
        // Clear timeout
        if (timeout) {
          clearTimeout(timeout);
        }
        
        // Check if we have 10 Shifts in a row
        if (keySequence.length === 10 && keySequence.every(k => k === 'Shift')) {
          // Set cookie to unlock analytics (with SameSite for security)
          if (typeof document !== 'undefined') {
            document.cookie = 'analytics_unlocked=true; path=/; max-age=3600; SameSite=Lax'; // 1 hour
          }
          // Redirect to analytics
          router.push('/analytics');
          keySequence = [];
        }
        
        // Reset sequence after 3 seconds of no activity
        timeout = setTimeout(() => {
          keySequence = [];
        }, 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [router]);

  // Mobile: Tap sequence handler (10 taps on logo)
  useEffect(() => {
    const handleLogoClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      // Check if clicking on the logo (Tristan Yi text in nav)
      const logoLink = target.closest('a[href="#home"]');
      if (logoLink) {
        const now = Date.now();
        setTapSequence(prev => {
          const newSeq = [...prev.filter(t => now - t < 3000), now].slice(-10);
          
          // Check if we have 10 taps within 3 seconds (each tap within 500ms of previous)
          if (newSeq.length === 10) {
            // Set cookie to unlock analytics
            if (typeof document !== 'undefined') {
              document.cookie = 'analytics_unlocked=true; path=/; max-age=3600; SameSite=Lax';
            }
            // Redirect to analytics
            router.push('/analytics');
            return [];
          }
          return newSeq;
        });
      }
    };

    // Add both mouse and touch listeners (use capture phase to catch before navigation)
    document.addEventListener('click', handleLogoClick, true);
    document.addEventListener('touchend', handleLogoClick, true);
    
    return () => {
      document.removeEventListener('click', handleLogoClick, true);
      document.removeEventListener('touchend', handleLogoClick, true);
    };
  }, [router]);

  return null; // This component doesn't render anything
}


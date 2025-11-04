"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AnalyticsUnlock() {
  const router = useRouter();

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
          // Set cookie to unlock analytics
          document.cookie = 'analytics_unlocked=true; path=/; max-age=3600'; // 1 hour
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

  return null; // This component doesn't render anything
}


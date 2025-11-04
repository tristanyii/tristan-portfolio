"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view
    const trackVisit = async () => {
      try {
        const page = pathname.split('/').pop() || 'home';
        const referrer = document.referrer || null;
        
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: page === '' ? 'home' : page,
            path: pathname,
            referrer,
          }),
        });
      } catch (error) {
        // Silently fail - analytics shouldn't break the site
        console.error('Analytics tracking error:', error);
      }
    };

    // Small delay to ensure page is fully loaded
    const timeout = setTimeout(trackVisit, 500);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null; // This component doesn't render anything
}


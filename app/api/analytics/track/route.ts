import { NextRequest, NextResponse } from 'next/server';
import { logVisit } from '@/lib/analytics';

// Force dynamic rendering - database operations and request headers require runtime access
export const dynamic = 'force-dynamic';

// Simple user agent parser
function parseUserAgent(userAgent: string) {
  let browser = 'Unknown';
  let os = 'Unknown';
  let deviceType = 'Desktop';
  
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';
  
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';
  
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    deviceType = 'Mobile';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    deviceType = 'Tablet';
  }
  
  return { browser, os, deviceType };
}

// Extract name/username from referrer URL
function extractNameFromReferrer(referrer: string | null | undefined, path: string | null | undefined): string | undefined {
  if (!referrer) return undefined;
  
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.toLowerCase();
    
    // LinkedIn: linkedin.com/in/username or linkedin.com/company/name
    if (hostname.includes('linkedin.com')) {
      const match = url.pathname.match(/\/(?:in|company)\/([^\/\?]+)/);
      if (match) {
        // Decode URL encoding and format nicely
        return decodeURIComponent(match[1]).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
    
    // GitHub: github.com/username
    if (hostname.includes('github.com')) {
      const match = url.pathname.match(/^\/([^\/\?]+)/);
      if (match && match[1] !== 'search' && match[1] !== 'settings' && match[1] !== 'notifications') {
        return match[1];
      }
    }
    
    // Twitter/X: twitter.com/username or x.com/username
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      const match = url.pathname.match(/^\/([^\/\?]+)/);
      if (match && !['home', 'explore', 'notifications', 'messages', 'i'].includes(match[1])) {
        return `@${match[1]}`;
      }
    }
    
    // Facebook: facebook.com/username or facebook.com/profile.php?id=...
    if (hostname.includes('facebook.com')) {
      const match = url.pathname.match(/^\/([^\/\?\.]+)/);
      if (match && !['home', 'watch', 'marketplace', 'groups', 'events'].includes(match[1])) {
        return match[1];
      }
    }
    
    // Instagram: instagram.com/username
    if (hostname.includes('instagram.com')) {
      const match = url.pathname.match(/^\/([^\/\?]+)/);
      if (match && !['explore', 'accounts', 'direct'].includes(match[1])) {
        return `@${match[1]}`;
      }
    }
    
    // Check URL parameters for name (common in email tracking)
    const nameParam = url.searchParams.get('name') || url.searchParams.get('user') || url.searchParams.get('username');
    if (nameParam) {
      return decodeURIComponent(nameParam);
    }
    
    // Check path for name parameter
    if (path) {
      const pathUrl = new URL(path, 'https://example.com');
      const pathNameParam = pathUrl.searchParams.get('name') || pathUrl.searchParams.get('user') || pathUrl.searchParams.get('username');
      if (pathNameParam) {
        return decodeURIComponent(pathNameParam);
      }
    }
    
  } catch (e) {
    // Invalid URL, skip
  }
  
  return undefined;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { page, path, referrer } = body;
    
    // Get user info from request
    const userAgent = req.headers.get('user-agent') || '';
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';
    
    // Parse user agent
    const { browser, os, deviceType } = parseUserAgent(userAgent);
    
    // Get country/city from headers (if available via Vercel/Cloudflare)
    const country = req.headers.get('x-vercel-ip-country') || 
                    req.headers.get('cf-ipcountry') || 
                    undefined;
    const city = req.headers.get('x-vercel-ip-city') || undefined;
    
    // Extract name/username from referrer
    const name = extractNameFromReferrer(referrer, path);
    
    await logVisit({
      page: page || 'Unknown',
      path: path || '/',
      referrer: referrer || undefined,
      user_agent: userAgent || undefined,
      ip: ip !== 'unknown' ? ip : undefined,
      country: country || undefined,
      city: city || undefined,
      device_type: deviceType,
      browser,
      os,
      name,
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking visit:', error);
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    );
  }
}


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
                    null;
    const city = req.headers.get('x-vercel-ip-city') || null;
    
    await logVisit({
      page: page || 'Unknown',
      path: path || '/',
      referrer: referrer || null,
      user_agent: userAgent,
      ip: ip !== 'unknown' ? ip : null,
      country: country || null,
      city: city || null,
      device_type: deviceType,
      browser,
      os,
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


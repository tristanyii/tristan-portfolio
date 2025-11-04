import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats, resetAnalytics } from '@/lib/analytics';

// Force dynamic rendering - database operations and cookies require runtime access
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Check for analytics_unlocked cookie
    const cookies = req.headers.get('cookie') || '';
    const isUnlocked = cookies.includes('analytics_unlocked=true');
    
    if (!isUnlocked) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Use nextUrl instead of req.url to avoid static generation issues
    const days = parseInt(req.nextUrl.searchParams.get('days') || '30', 10);
    
    const stats = await getAnalyticsStats(days);
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check for analytics_unlocked cookie
    const cookies = req.headers.get('cookie') || '';
    const isUnlocked = cookies.includes('analytics_unlocked=true');
    
    if (!isUnlocked) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await resetAnalytics();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error resetting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to reset analytics' },
      { status: 500 }
    );
  }
}


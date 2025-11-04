import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  try {
    // Check for analytics_unlocked cookie
    const cookies = req.headers.get('cookie') || '';
    const isUnlocked = cookies.includes('analytics_unlocked=true');
    
    if (!isUnlocked) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    
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


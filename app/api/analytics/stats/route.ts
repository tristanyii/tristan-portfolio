import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsStats, resetAnalytics, getAllVisitors } from '@/lib/analytics';

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

// Get all visitors endpoint
export async function POST(req: NextRequest) {
  try {
    // Check for analytics_unlocked cookie
    const cookies = req.headers.get('cookie') || '';
    const isUnlocked = cookies.includes('analytics_unlocked=true');
    
    if (!isUnlocked) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    let body: { days?: string | number; limit?: string | number; offset?: string | number } = {};
    try {
      body = await req.json();
    } catch (e) {
      // If body is empty, use defaults
      body = {};
    }
    
    const days = parseInt(String(body.days || '30'), 10);
    const limit = parseInt(String(body.limit || '100'), 10);
    const offset = parseInt(String(body.offset || '0'), 10);
    
    const result = await getAllVisitors(days, limit, offset);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching visitors:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: 'Failed to fetch visitors', details: error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { getGoals, createGoal, updateGoal, deleteGoal } from '@/lib/goals';

export const dynamic = 'force-dynamic';

function isAdmin(req: NextRequest): boolean {
  const cookies = req.headers.get('cookie') || '';
  return cookies.includes('analytics_unlocked=true');
}

export async function GET() {
  try {
    const goals = await getGoals();
    return NextResponse.json(goals);
  } catch (error: any) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, category } = await req.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const goal = await createGoal(title, category || 'General');
    return NextResponse.json(goal);
  } catch (error: any) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, completed, note, title, category } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }
    const goal = await updateGoal(id, { completed, note, title, category });
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json(goal);
  } catch (error: any) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }
    const success = await deleteGoal(id);
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}

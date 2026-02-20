import { NextRequest, NextResponse } from 'next/server';
import { getAllContent, setContent, deleteContent } from '@/lib/content';

function isAdmin(req: NextRequest): boolean {
  return (req.headers.get('cookie') || '').includes('analytics_unlocked=true');
}

export async function GET() {
  try {
    return NextResponse.json(await getAllContent());
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { key, value } = await req.json();
    if (!key || typeof value !== 'string') return NextResponse.json({ error: 'Invalid' }, { status: 400 });
    await setContent(key, value);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { key } = await req.json();
    if (!key) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
    await deleteContent(key);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

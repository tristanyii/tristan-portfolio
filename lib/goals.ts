import { neon } from '@neondatabase/serverless';

export interface Goal {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  note?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

function getDb() {
  if (!process.env.POSTGRES_URL) {
    console.warn('POSTGRES_URL not set - goals will be disabled');
    return null;
  }
  try {
    return neon(process.env.POSTGRES_URL);
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    return null;
  }
}

async function ensureTable() {
  const sql = getDb();
  if (!sql) return null;

  await sql`
    CREATE TABLE IF NOT EXISTS goals (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL DEFAULT 'General',
      completed BOOLEAN NOT NULL DEFAULT false,
      note TEXT,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  return sql;
}

export async function getGoals(): Promise<Goal[]> {
  const sql = await ensureTable();
  if (!sql) return [];

  try {
    const rows = await sql`
      SELECT id, title, category, completed, note, display_order, created_at, updated_at
      FROM goals
      ORDER BY completed ASC, display_order ASC, created_at DESC
    `;
    return rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      completed: r.completed,
      note: r.note || undefined,
      display_order: r.display_order,
      created_at: r.created_at,
      updated_at: r.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function createGoal(title: string, category: string): Promise<Goal | null> {
  const sql = await ensureTable();
  if (!sql) return null;

  try {
    const maxOrder = await sql`SELECT COALESCE(MAX(display_order), 0) as max_order FROM goals`;
    const nextOrder = Number(maxOrder[0]?.max_order || 0) + 1;

    const rows = await sql`
      INSERT INTO goals (title, category, display_order)
      VALUES (${title}, ${category}, ${nextOrder})
      RETURNING id, title, category, completed, note, display_order, created_at, updated_at
    `;
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      category: r.category,
      completed: r.completed,
      note: r.note || undefined,
      display_order: r.display_order,
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  } catch (error) {
    console.error('Error creating goal:', error);
    return null;
  }
}

export async function updateGoal(
  id: number,
  updates: { completed?: boolean; note?: string; title?: string; category?: string }
): Promise<Goal | null> {
  const sql = await ensureTable();
  if (!sql) return null;

  try {
    if (updates.completed !== undefined) {
      await sql`UPDATE goals SET completed = ${updates.completed}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
    }
    if (updates.note !== undefined) {
      await sql`UPDATE goals SET note = ${updates.note}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
    }
    if (updates.title !== undefined) {
      await sql`UPDATE goals SET title = ${updates.title}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
    }
    if (updates.category !== undefined) {
      await sql`UPDATE goals SET category = ${updates.category}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;
    }

    const rows = await sql`
      SELECT id, title, category, completed, note, display_order, created_at, updated_at
      FROM goals WHERE id = ${id}
    `;
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      category: r.category,
      completed: r.completed,
      note: r.note || undefined,
      display_order: r.display_order,
      created_at: r.created_at,
      updated_at: r.updated_at,
    };
  } catch (error) {
    console.error('Error updating goal:', error);
    return null;
  }
}

export async function deleteGoal(id: number): Promise<boolean> {
  const sql = await ensureTable();
  if (!sql) return false;

  try {
    await sql`DELETE FROM goals WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting goal:', error);
    return false;
  }
}

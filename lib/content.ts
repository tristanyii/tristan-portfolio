import { neon } from '@neondatabase/serverless';

function getDb() {
  if (!process.env.POSTGRES_URL) return null;
  try { return neon(process.env.POSTGRES_URL); }
  catch { return null; }
}

async function ensureTable() {
  const sql = getDb();
  if (!sql) return null;
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  return sql;
}

export async function getAllContent(): Promise<Record<string, string>> {
  const sql = await ensureTable();
  if (!sql) return {};
  try {
    const rows = await sql`SELECT key, value FROM site_content`;
    const result: Record<string, string> = {};
    for (const r of rows) result[r.key as string] = r.value as string;
    return result;
  } catch { return {}; }
}

export async function setContent(key: string, value: string) {
  const sql = await ensureTable();
  if (!sql) return;
  await sql`
    INSERT INTO site_content (key, value, updated_at)
    VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = NOW()
  `;
}

export async function deleteContent(key: string) {
  const sql = await ensureTable();
  if (!sql) return;
  await sql`DELETE FROM site_content WHERE key = ${key}`;
}

import { neon } from '@neondatabase/serverless';

export interface AnalyticsEvent {
  id?: string;
  page: string;
  path: string;
  referrer?: string;
  user_agent?: string;
  ip?: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  name?: string;
  timestamp?: Date;
}

// Get database connection
function getDb() {
  if (!process.env.POSTGRES_URL) {
    console.warn('POSTGRES_URL environment variable is not set - analytics will be disabled');
    return null;
  }
  try {
    return neon(process.env.POSTGRES_URL);
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    return null;
  }
}

// Log a visit/event
export async function logVisit(event: AnalyticsEvent): Promise<void> {
  try {
    const sql = getDb();
    if (!sql) {
      // Silently fail if database is not configured
      return;
    }
    
    // Create table if it doesn't exist (idempotent)
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        path VARCHAR(255) NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        ip VARCHAR(45),
        country VARCHAR(100),
        city VARCHAR(100),
        device_type VARCHAR(50),
        browser VARCHAR(100),
        os VARCHAR(100),
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Add name column if it doesn't exist (for existing databases)
    try {
      await sql`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS name VARCHAR(255)`;
    } catch (e) {
      // Column might already exist, ignore
    }
    
    await sql`
      INSERT INTO analytics_events (
        page, path, referrer, user_agent, ip, country, city, device_type, browser, os, name
      ) VALUES (
        ${event.page},
        ${event.path},
        ${event.referrer || null},
        ${event.user_agent || null},
        ${event.ip || null},
        ${event.country || null},
        ${event.city || null},
        ${event.device_type || null},
        ${event.browser || null},
        ${event.os || null},
        ${event.name || null}
      )
    `;
  } catch (error) {
    console.error('Error logging visit:', error);
    // Don't throw - analytics shouldn't break the site
  }
}

// Get analytics stats
export interface AnalyticsStats {
  totalVisits: number;
  uniqueVisitors: number;
  visitsByPage: Array<{ page: string; count: number }>;
  visitsByCountry: Array<{ country: string; count: number }>;
  visitsByDevice: Array<{ device: string; count: number }>;
  visitsByBrowser: Array<{ browser: string; count: number }>;
  recentVisits: AnalyticsEvent[];
  visitsOverTime: Array<{ date: string; count: number }>;
}

export async function getAnalyticsStats(days: number = 30): Promise<AnalyticsStats> {
  const sql = getDb();
  if (!sql) {
    // Return empty stats if database is not configured
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      visitsByPage: [],
      visitsByCountry: [],
      visitsByDevice: [],
      visitsByBrowser: [],
      recentVisits: [],
      visitsOverTime: [],
    };
  }
  
  try {
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        path VARCHAR(255) NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        ip VARCHAR(45),
        country VARCHAR(100),
        city VARCHAR(100),
        device_type VARCHAR(50),
        browser VARCHAR(100),
        os VARCHAR(100),
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Add name column if it doesn't exist (for existing databases)
    try {
      await sql`ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS name VARCHAR(255)`;
    } catch (e) {
      // Column might already exist, ignore
    }
  } catch (error) {
    console.error('Error creating analytics table:', error);
    // Return empty stats if table creation fails
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      visitsByPage: [],
      visitsByCountry: [],
      visitsByDevice: [],
      visitsByBrowser: [],
      recentVisits: [],
      visitsOverTime: [],
    };
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  try {
    // Total visits
    const totalVisitsResult = await sql`
      SELECT COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()}
    `;
    const totalVisits = Number(totalVisitsResult[0]?.count || 0);
    
    // Unique visitors (by IP)
    const uniqueVisitorsResult = await sql`
      SELECT COUNT(DISTINCT ip) as count
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()} AND ip IS NOT NULL
    `;
    const uniqueVisitors = Number(uniqueVisitorsResult[0]?.count || 0);
    
    // Visits by page
    const visitsByPageResult = await sql`
      SELECT page, COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()}
      GROUP BY page
      ORDER BY count DESC
      LIMIT 20
    `;
    const visitsByPage = visitsByPageResult.map((row: any) => ({
      page: row.page,
      count: Number(row.count),
    }));
    
    // Visits by country
    const visitsByCountryResult = await sql`
      SELECT country, COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()} AND country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 20
    `;
    const visitsByCountry = visitsByCountryResult.map((row: any) => ({
      country: row.country || 'Unknown',
      count: Number(row.count),
    }));
    
    // Visits by device
    const visitsByDeviceResult = await sql`
      SELECT device_type, COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()} AND device_type IS NOT NULL
      GROUP BY device_type
      ORDER BY count DESC
    `;
    const visitsByDevice = visitsByDeviceResult.map((row: any) => ({
      device: row.device_type || 'Unknown',
      count: Number(row.count),
    }));
    
    // Visits by browser
    const visitsByBrowserResult = await sql`
      SELECT browser, COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()} AND browser IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 10
    `;
    const visitsByBrowser = visitsByBrowserResult.map((row: any) => ({
      browser: row.browser || 'Unknown',
      count: Number(row.count),
    }));
    
    // Recent visits (increased limit for pagination)
    const recentVisitsResult = await sql`
      SELECT id, page, path, referrer, country, city, device_type, browser, os, name, created_at
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()}
      ORDER BY created_at DESC
      LIMIT 200
    `;
    const recentVisits = recentVisitsResult.map((row: any) => ({
      id: row.id.toString(),
      page: row.page,
      path: row.path,
      referrer: row.referrer,
      country: row.country,
      city: row.city,
      device_type: row.device_type,
      browser: row.browser,
      os: row.os,
      name: row.name,
      timestamp: row.created_at,
    }));
    
    // Visits over time (last N days)
    const visitsOverTimeResult = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= ${cutoffDate.toISOString()}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    const visitsOverTime = visitsOverTimeResult.map((row: any) => ({
      date: row.date.toISOString().split('T')[0],
      count: Number(row.count),
    }));
    
    return {
      totalVisits,
      uniqueVisitors,
      visitsByPage,
      visitsByCountry,
      visitsByDevice,
      visitsByBrowser,
      recentVisits,
      visitsOverTime,
    };
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    // Return empty stats if query fails
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      visitsByPage: [],
      visitsByCountry: [],
      visitsByDevice: [],
      visitsByBrowser: [],
      recentVisits: [],
      visitsOverTime: [],
    };
  }
}

// Get all unique visitors with their visit history
export interface VisitorProfile {
  ip: string;
  firstVisit: Date;
  lastVisit: Date;
  totalVisits: number;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  name?: string;
  pages: string[];
  visits: AnalyticsEvent[];
}

export async function getAllVisitors(days: number = 30, limit: number = 100, offset: number = 0): Promise<{
  visitors: VisitorProfile[];
  total: number;
}> {
  const sql = getDb();
  if (!sql) {
    console.warn('Database not configured - returning empty visitors list');
    return { visitors: [], total: 0 };
  }
  
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffDateISO = cutoffDate.toISOString();
  
  try {
    // Ensure table exists first
    await sql`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        path VARCHAR(255) NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        ip VARCHAR(45),
        country VARCHAR(100),
        city VARCHAR(100),
        device_type VARCHAR(50),
        browser VARCHAR(100),
        os VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    // Get all unique IPs with their visit counts
    const uniqueIPsResult = await sql`
      SELECT 
        ip,
        COUNT(*) as visit_count,
        MIN(created_at) as first_visit,
        MAX(created_at) as last_visit
      FROM analytics_events
      WHERE created_at >= ${cutoffDateISO} AND ip IS NOT NULL
      GROUP BY ip
      ORDER BY last_visit DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    // Get total count for pagination
    const totalResult = await sql`
      SELECT COUNT(DISTINCT ip) as total
      FROM analytics_events
      WHERE created_at >= ${cutoffDateISO} AND ip IS NOT NULL
    `;
    const total = Number(totalResult[0]?.total || 0);
    
    // For each IP, get their visit details
    const visitors: VisitorProfile[] = [];
    
    for (const ipRow of uniqueIPsResult) {
      const ip = ipRow.ip;
      
      // Get all visits for this IP
      const visitsResult = await sql`
        SELECT id, page, path, referrer, country, city, device_type, browser, os, name, created_at
        FROM analytics_events
        WHERE ip = ${ip} AND created_at >= ${cutoffDateISO}
        ORDER BY created_at DESC
      `;
      
      const visits = visitsResult.map((row: any) => ({
        id: row.id.toString(),
        page: row.page,
        path: row.path,
        referrer: row.referrer,
        country: row.country,
        city: row.city,
        device_type: row.device_type,
        browser: row.browser,
        os: row.os,
        name: row.name,
        timestamp: row.created_at,
      }));
      
      // Get unique pages visited
      const pages = [...new Set(visits.map(v => v.page))];
      
      // Get most common device/browser/os from visits
      const deviceCounts: Record<string, number> = {};
      const browserCounts: Record<string, number> = {};
      const osCounts: Record<string, number> = {};
      
      visits.forEach(visit => {
        if (visit.device_type) deviceCounts[visit.device_type] = (deviceCounts[visit.device_type] || 0) + 1;
        if (visit.browser) browserCounts[visit.browser] = (browserCounts[visit.browser] || 0) + 1;
        if (visit.os) osCounts[visit.os] = (osCounts[visit.os] || 0) + 1;
      });
      
      const mostCommonDevice = Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const mostCommonBrowser = Object.entries(browserCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const mostCommonOS = Object.entries(osCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      
      // Get most common location
      const countryCounts: Record<string, number> = {};
      const cityCounts: Record<string, number> = {};
      visits.forEach(visit => {
        if (visit.country) countryCounts[visit.country] = (countryCounts[visit.country] || 0) + 1;
        if (visit.city) cityCounts[visit.city] = (cityCounts[visit.city] || 0) + 1;
      });
      
      const mostCommonCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      const mostCommonCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      
      // Get most common name from visits
      const nameCounts: Record<string, number> = {};
      visits.forEach(visit => {
        if (visit.name) nameCounts[visit.name] = (nameCounts[visit.name] || 0) + 1;
      });
      const mostCommonName = Object.entries(nameCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      
      visitors.push({
        ip,
        firstVisit: ipRow.first_visit,
        lastVisit: ipRow.last_visit,
        totalVisits: Number(ipRow.visit_count),
        country: mostCommonCountry,
        city: mostCommonCity,
        device_type: mostCommonDevice,
        browser: mostCommonBrowser,
        os: mostCommonOS,
        name: mostCommonName,
        pages,
        visits,
      });
    }
    
    return { visitors, total };
  } catch (error: any) {
    console.error('Error fetching visitors:', error);
    console.error('Error details:', error.message, error.stack);
    // Return empty result instead of throwing to prevent breaking the page
    return { visitors: [], total: 0 };
  }
}

// Delete all analytics data
export async function resetAnalytics(): Promise<void> {
  try {
    const sql = getDb();
    if (!sql) {
      throw new Error('Database not configured');
    }
    
    await sql`
      DELETE FROM analytics_events
    `;
  } catch (error) {
    console.error('Error resetting analytics:', error);
    throw error;
  }
}


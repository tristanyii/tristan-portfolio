"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, Globe, Monitor, RefreshCw, Calendar, TrendingUp, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnalyticsStats {
  totalVisits: number;
  uniqueVisitors: number;
  visitsByPage: Array<{ page: string; count: number }>;
  visitsByCountry: Array<{ country: string; count: number }>;
  visitsByDevice: Array<{ device: string; count: number }>;
  visitsByBrowser: Array<{ browser: string; count: number }>;
  recentVisits: Array<{
    id: string;
    page: string;
    path: string;
    referrer?: string;
    country?: string;
    city?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    timestamp: Date;
  }>;
  visitsOverTime: Array<{ date: string; count: number }>;
}

// Check if analytics is unlocked via cookie
function isUnlocked(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('analytics_unlocked=true'));
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const router = useRouter();

  // Check cookie on mount
  useEffect(() => {
    if (isUnlocked()) {
      setUnlocked(true);
    } else {
      // If not unlocked, redirect to home
      router.push('/');
    }
  }, [router]);

  // Private view unlock via Shift x10
  useEffect(() => {
    if (typeof window === 'undefined' || unlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setKeySequence(prev => {
          const next = [...prev, 'Shift'].slice(-10);
          if (next.length === 10 && next.every(k => k === 'Shift')) {
            // Set cookie
            document.cookie = 'analytics_unlocked=true; path=/; max-age=3600'; // 1 hour
            setUnlocked(true);
            return [];
          }
          return next;
        });
        // auto-clear sequence after 3s
        window.setTimeout(() => setKeySequence([]), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlocked]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics/stats?days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unlocked) {
      fetchStats();
    }
  }, [days, unlocked]);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Analytics (Private)</CardTitle>
                <CardDescription>Press Shift 10 times to unlock</CardDescription>
              </div>
              <Lock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This page is hidden from public view. Press Shift 10 times anywhere on the site to unlock.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Progress: {keySequence.length}/10
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Website Analytics
            </h1>
            <p className="text-muted-foreground mt-2">Track visitors and activity on your site</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={days === 7 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDays(7)}
            >
              7 days
            </Button>
            <Button
              variant={days === 30 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDays(30)}
            >
              30 days
            </Button>
            <Button
              variant={days === 90 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDays(90)}
            >
              90 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="pt-6">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last {days} days
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on IP addresses
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Top Country</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.visitsByCountry[0]?.country || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.visitsByCountry[0]?.count.toLocaleString() || 0} visits
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Top Device</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.visitsByDevice[0]?.device || 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.visitsByDevice[0]?.count.toLocaleString() || 0} visits
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Pages
                  </CardTitle>
                  <CardDescription>Most visited pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.visitsByPage.slice(0, 10).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm font-medium text-muted-foreground w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm truncate">{item.page}</span>
                        </div>
                        <span className="text-sm font-semibold ml-4">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Countries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Top Countries
                  </CardTitle>
                  <CardDescription>Visitor locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.visitsByCountry.slice(0, 10).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm font-medium text-muted-foreground w-6">
                            #{index + 1}
                          </span>
                          <span className="text-sm truncate">{item.country}</span>
                        </div>
                        <span className="text-sm font-semibold ml-4">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Devices and Browsers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Devices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Devices
                  </CardTitle>
                  <CardDescription>Device types used</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.visitsByDevice.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.device}</span>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Browsers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Browsers
                  </CardTitle>
                  <CardDescription>Browser distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.visitsByBrowser.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.browser}</span>
                        <span className="text-sm font-semibold">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Visits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Visits
                </CardTitle>
                <CardDescription>Latest visitor activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Time</th>
                        <th className="text-left p-2">Page</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Device</th>
                        <th className="text-left p-2">Browser</th>
                        <th className="text-left p-2">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentVisits.slice(0, 20).map((visit) => (
                        <tr key={visit.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-muted-foreground">
                            {new Date(visit.timestamp).toLocaleString()}
                          </td>
                          <td className="p-2 font-medium">{visit.page}</td>
                          <td className="p-2 text-muted-foreground">
                            {visit.city && visit.country
                              ? `${visit.city}, ${visit.country}`
                              : visit.country || 'Unknown'}
                          </td>
                          <td className="p-2 text-muted-foreground">{visit.device_type || 'Unknown'}</td>
                          <td className="p-2 text-muted-foreground">{visit.browser || 'Unknown'}</td>
                          <td className="p-2 text-muted-foreground truncate max-w-xs">
                            {visit.referrer ? (
                              <a
                                href={visit.referrer}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {visit.referrer.replace(/^https?:\/\//, '').split('/')[0]}
                              </a>
                            ) : (
                              'Direct'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}


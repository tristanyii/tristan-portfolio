"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Globe, Monitor, RefreshCw, Calendar, TrendingUp, Lock, Trash2, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
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
    name?: string;
    timestamp: Date;
  }>;
  visitsOverTime: Array<{ date: string; count: number }>;
}

interface VisitorProfile {
  ip: string;
  firstVisit: Date;
  lastVisit: Date;
  totalVisits: number;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  pages: string[];
  visits: Array<{
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
}

// Check if analytics is unlocked via cookie
function isUnlocked(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some(c => c.trim().startsWith('analytics_unlocked=true'));
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [visitors, setVisitors] = useState<VisitorProfile[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [days, setDays] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [resetting, setResetting] = useState(false);
  const [visitorPage, setVisitorPage] = useState(0);
  const [recentVisitsPage, setRecentVisitsPage] = useState(0);
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorProfile | null>(null);
  const router = useRouter();
  
  const RECENT_VISITS_PER_PAGE = 20;

  // Check cookie on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isUnlocked()) {
      setUnlocked(true);
    } else {
      // Small delay before redirect to avoid flash
      const timer = setTimeout(() => {
        router.push('/');
      }, 100);
      return () => clearTimeout(timer);
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
            // Set cookie (with SameSite for security)
            if (typeof document !== 'undefined') {
              document.cookie = 'analytics_unlocked=true; path=/; max-age=3600; SameSite=Lax'; // 1 hour
            }
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

  // Escape key to go back to homepage (only when unlocked)
  useEffect(() => {
    if (typeof window === 'undefined' || !unlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlocked, router]);

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

  const fetchVisitors = async (page: number = 0) => {
    setLoadingVisitors(true);
    setError(null);
    try {
      const response = await fetch('/api/analytics/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          days,
          limit: 50,
          offset: page * 50,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Failed to fetch visitors: ${response.status}`);
      }
      
      const data = await response.json();
      setVisitors(data.visitors || []);
      setTotalVisitors(data.total || 0);
    } catch (err: any) {
      console.error('Error fetching visitors:', err);
      setError(err.message || 'Failed to load visitors');
    } finally {
      setLoadingVisitors(false);
    }
  };

  // Helper function to mask IP address for privacy
  const maskIP = (ip: string): string => {
    if (!ip) return 'Unknown';
    const parts = ip.split('.');
    if (parts.length === 4) {
      // IPv4: show first 2 octets
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    // IPv6: show first 3 groups
    const ipv6Parts = ip.split(':');
    if (ipv6Parts.length > 3) {
      return `${ipv6Parts.slice(0, 3).join(':')}:xxxx:xxxx`;
    }
    return ip;
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to delete ALL analytics data? This action cannot be undone.')) {
      return;
    }
    
    setResetting(true);
    setError(null);
    try {
      const response = await fetch('/api/analytics/stats', {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to reset analytics');
      }
      // Refresh stats after reset
      await fetchStats();
    } catch (err: any) {
      setError(err.message || 'Failed to reset analytics');
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    if (unlocked) {
      fetchStats();
      fetchVisitors(visitorPage);
      setRecentVisitsPage(0); // Reset to first page when days filter changes
    }
  }, [days, unlocked, visitorPage]);

  // Show loading or locked screen while checking
  if (typeof window === 'undefined' || !unlocked) {
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
              {typeof window !== 'undefined' && (
                <p className="text-xs text-muted-foreground mt-2">
                  Progress: {keySequence.length}/10
                </p>
              )}
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
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReset}
              disabled={resetting || loading}
            >
              <Trash2 className={`h-4 w-4 mr-2 ${resetting ? 'animate-spin' : ''}`} />
              Reset
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
                  Recent Visits ({stats.recentVisits.length.toLocaleString()})
                </CardTitle>
                <CardDescription>Latest visitor activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Time</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Page</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Device</th>
                        <th className="text-left p-2">Browser</th>
                        <th className="text-left p-2">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentVisits
                        .slice(recentVisitsPage * RECENT_VISITS_PER_PAGE, (recentVisitsPage + 1) * RECENT_VISITS_PER_PAGE)
                        .map((visit) => (
                        <tr key={visit.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 text-muted-foreground">
                            {new Date(visit.timestamp).toLocaleString()}
                          </td>
                          <td className="p-2">
                            {visit.name ? (
                              <span className="font-semibold text-primary">{visit.name}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
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
                {/* Pagination for Recent Visits */}
                {stats.recentVisits.length > RECENT_VISITS_PER_PAGE && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {recentVisitsPage * RECENT_VISITS_PER_PAGE + 1}-{Math.min((recentVisitsPage + 1) * RECENT_VISITS_PER_PAGE, stats.recentVisits.length)} of {stats.recentVisits.length} visits
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRecentVisitsPage(p => Math.max(0, p - 1))}
                        disabled={recentVisitsPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRecentVisitsPage(p => p + 1)}
                        disabled={(recentVisitsPage + 1) * RECENT_VISITS_PER_PAGE >= stats.recentVisits.length}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Visitors */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      All Visitors ({totalVisitors.toLocaleString()})
                    </CardTitle>
                    <CardDescription>Detailed visitor profiles with visit history</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingVisitors ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-muted-foreground">Loading visitors...</span>
                  </div>
                ) : visitors.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No visitors found</p>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">IP Address</th>
                            <th className="text-left p-2">Location</th>
                            <th className="text-left p-2">Device</th>
                            <th className="text-left p-2">Browser/OS</th>
                            <th className="text-left p-2">Visits</th>
                            <th className="text-left p-2">First Visit</th>
                            <th className="text-left p-2">Last Visit</th>
                            <th className="text-left p-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visitors.map((visitor) => (
                            <tr key={visitor.ip} className="border-b hover:bg-muted/50">
                              <td className="p-2">
                                {visitor.name ? (
                                  <span className="font-semibold text-primary">{visitor.name}</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="p-2 font-mono text-xs">{maskIP(visitor.ip)}</td>
                              <td className="p-2 text-muted-foreground">
                                {visitor.city && visitor.country
                                  ? `${visitor.city}, ${visitor.country}`
                                  : visitor.country || 'Unknown'}
                              </td>
                              <td className="p-2 text-muted-foreground">{visitor.device_type || 'Unknown'}</td>
                              <td className="p-2 text-muted-foreground">
                                {visitor.browser || 'Unknown'} / {visitor.os || 'Unknown'}
                              </td>
                              <td className="p-2 font-semibold">{visitor.totalVisits}</td>
                              <td className="p-2 text-muted-foreground text-xs">
                                {new Date(visitor.firstVisit).toLocaleDateString()}
                              </td>
                              <td className="p-2 text-muted-foreground text-xs">
                                {new Date(visitor.lastVisit).toLocaleString()}
                              </td>
                              <td className="p-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedVisitor(visitor)}
                                  className="h-7"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Showing {visitorPage * 50 + 1}-{Math.min((visitorPage + 1) * 50, totalVisitors)} of {totalVisitors} visitors
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVisitorPage(p => Math.max(0, p - 1))}
                          disabled={visitorPage === 0 || loadingVisitors}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVisitorPage(p => p + 1)}
                          disabled={(visitorPage + 1) * 50 >= totalVisitors || loadingVisitors}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Visitor Detail Modal */}
        {selectedVisitor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedVisitor(null)}>
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="flex items-center justify-between border-b">
                <div>
                  <CardTitle>Visitor Details</CardTitle>
                  <CardDescription className="font-mono text-xs mt-1">{selectedVisitor.ip}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedVisitor(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6 pt-4">
                  {/* Visitor Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedVisitor.name && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Name</p>
                        <p className="font-medium text-primary text-lg">{selectedVisitor.name}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="font-medium">
                        {selectedVisitor.city && selectedVisitor.country
                          ? `${selectedVisitor.city}, ${selectedVisitor.country}`
                          : selectedVisitor.country || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Device</p>
                      <p className="font-medium">{selectedVisitor.device_type || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Browser</p>
                      <p className="font-medium">{selectedVisitor.browser || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">OS</p>
                      <p className="font-medium">{selectedVisitor.os || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Visits</p>
                      <p className="font-medium text-lg">{selectedVisitor.totalVisits}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Pages Visited</p>
                      <p className="font-medium">{selectedVisitor.pages.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">First Visit</p>
                      <p className="font-medium text-xs">{new Date(selectedVisitor.firstVisit).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Visit</p>
                      <p className="font-medium text-xs">{new Date(selectedVisitor.lastVisit).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Pages Visited */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Pages Visited</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVisitor.pages.map((page, idx) => (
                        <Badge key={idx} variant="outline">{page}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Visit History */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Visit History ({selectedVisitor.visits.length} visits)</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Time</th>
                            <th className="text-left p-2">Name</th>
                            <th className="text-left p-2">Page</th>
                            <th className="text-left p-2">Path</th>
                            <th className="text-left p-2">Referrer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedVisitor.visits.map((visit) => (
                            <tr key={visit.id} className="border-b hover:bg-muted/50">
                              <td className="p-2 text-muted-foreground">
                                {new Date(visit.timestamp).toLocaleString()}
                              </td>
                              <td className="p-2">
                                {visit.name ? (
                                  <span className="font-semibold text-primary">{visit.name}</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="p-2 font-medium">{visit.page}</td>
                              <td className="p-2 text-muted-foreground font-mono text-xs">{visit.path}</td>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}


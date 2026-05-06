"use client";

import { useMemo, useState } from "react";

interface VisitsChartProps {
  data: Array<{ date: string; count: number }>;
  days: number;
}

interface ChartPoint {
  date: string;
  count: number;
  x: number;
  y: number;
}

function parseDate(s: string): Date {
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  const [y, m, day] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, day || 1);
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildSeries(
  data: Array<{ date: string; count: number }>,
  days: number,
): Array<{ date: string; count: number }> {
  const counts = new Map<string, number>();
  for (const d of data) {
    counts.set(d.date, (counts.get(d.date) || 0) + d.count);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start: Date;
  if (days > 0) {
    start = new Date(today);
    start.setDate(start.getDate() - (days - 1));
  } else {
    let earliest: Date | null = null;
    for (const d of data) {
      const dd = parseDate(d.date);
      if (!earliest || dd < earliest) earliest = dd;
    }
    start = earliest ?? new Date(today);
    start.setHours(0, 0, 0, 0);
  }

  const series: Array<{ date: string; count: number }> = [];
  const cursor = new Date(start);
  while (cursor <= today) {
    const key = toISODate(cursor);
    series.push({ date: key, count: counts.get(key) || 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}

export function VisitsChart({ data, days }: VisitsChartProps) {
  const [hover, setHover] = useState<ChartPoint | null>(null);

  const series = useMemo(() => buildSeries(data, days), [data, days]);

  const width = 800;
  const height = 280;
  const padding = { top: 20, right: 24, bottom: 36, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxCount = Math.max(1, ...series.map((p) => p.count));
  const yTicks = 4;
  const yStep = Math.ceil(maxCount / yTicks) || 1;
  const yMax = yStep * yTicks;

  const points: ChartPoint[] = series.map((p, i) => {
    const x =
      padding.left +
      (series.length === 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
    const y = padding.top + innerH - (p.count / yMax) * innerH;
    return { date: p.date, count: p.count, x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${(
          padding.top + innerH
        ).toFixed(2)} L ${points[0].x.toFixed(2)} ${(padding.top + innerH).toFixed(
          2,
        )} Z`
      : "";

  const xLabelCount = Math.min(6, points.length);
  const xLabelIndices: number[] = [];
  if (points.length > 0) {
    if (xLabelCount === 1) {
      xLabelIndices.push(0);
    } else {
      for (let i = 0; i < xLabelCount; i++) {
        xLabelIndices.push(
          Math.round((i / (xLabelCount - 1)) * (points.length - 1)),
        );
      }
    }
  }

  const formatXLabel = (iso: string) => {
    const d = parseDate(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const totalVisits = series.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="w-full">
      <div className="text-xs text-muted-foreground mb-2">
        {totalVisits.toLocaleString()} visits across {series.length}{" "}
        {series.length === 1 ? "day" : "days"}
      </div>
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          preserveAspectRatio="none"
          className="block"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            if (points.length === 0) return;
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const xRel = ((e.clientX - rect.left) / rect.width) * width;
            let nearest = points[0];
            let bestDist = Math.abs(points[0].x - xRel);
            for (const p of points) {
              const dist = Math.abs(p.x - xRel);
              if (dist < bestDist) {
                bestDist = dist;
                nearest = p;
              }
            }
            setHover(nearest);
          }}
        >
          <defs>
            <linearGradient id="visitsAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const y = padding.top + (i / yTicks) * innerH;
            const value = yMax - (i / yTicks) * yMax;
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y}
                  y2={y}
                  className="stroke-border"
                  strokeWidth={1}
                  strokeDasharray={i === yTicks ? "0" : "3,4"}
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  style={{ fontSize: 11 }}
                >
                  {Math.round(value).toLocaleString()}
                </text>
              </g>
            );
          })}

          {areaPath && (
            <path
              d={areaPath}
              fill="url(#visitsAreaGradient)"
              className="text-primary"
            />
          )}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              className="stroke-primary"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {xLabelIndices.map((i) => {
            const p = points[i];
            if (!p) return null;
            return (
              <text
                key={`xlabel-${i}`}
                x={p.x}
                y={height - padding.bottom + 18}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 11 }}
              >
                {formatXLabel(p.date)}
              </text>
            );
          })}

          {hover && (
            <g>
              <line
                x1={hover.x}
                x2={hover.x}
                y1={padding.top}
                y2={padding.top + innerH}
                className="stroke-border"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
              <circle
                cx={hover.x}
                cy={hover.y}
                r={4}
                className="fill-primary stroke-background"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-md"
            style={{
              left: `${(hover.x / width) * 100}%`,
              top: `${(hover.y / height) * 100}%`,
              transform: "translate(-50%, calc(-100% - 10px))",
            }}
          >
            <div className="font-medium">
              {parseDate(hover.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="text-muted-foreground">
              {hover.count.toLocaleString()}{" "}
              {hover.count === 1 ? "visit" : "visits"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryTabProps {
  summary: {
    tldr: string;
    full: string;
    bullets: string[];
    insights: string[];
  };
}

export function SummaryTab({ summary }: SummaryTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>TL;DR</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{summary.tldr}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Full Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{summary.full}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1">💡</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


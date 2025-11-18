"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KeyMomentsTabProps {
  keyMoments: {
    time: string;
    text: string;
    description: string;
  }[];
}

export function KeyMomentsTab({ keyMoments }: KeyMomentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Timestamps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keyMoments.map((moment, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 border rounded-lg"
            >
              <Badge variant="secondary" className="mt-1">
                {moment.time}
              </Badge>
              <div>
                <p className="font-medium">{moment.text}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {moment.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


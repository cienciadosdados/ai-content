"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HashtagsTabProps {
  hashtags: {
    youtube: string[];
    instagram: string[];
    tiktok: string[];
    linkedin: string[];
    twitter: string[];
  };
}

const PLATFORMS = [
  { key: "youtube" as const, title: "YouTube" },
  { key: "instagram" as const, title: "Instagram" },
  { key: "tiktok" as const, title: "TikTok" },
  { key: "linkedin" as const, title: "LinkedIn" },
  { key: "twitter" as const, title: "Twitter" },
];

export function HashtagsTab({ hashtags }: HashtagsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Hashtags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {PLATFORMS.map((platform) => (
            <div key={platform.key}>
              <p className="text-sm font-medium mb-2">{platform.title}</p>
              <div className="flex flex-wrap gap-2">
                {hashtags[platform.key].map((tag, idx) => (
                  <Badge key={`${platform.key}-${idx}`} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


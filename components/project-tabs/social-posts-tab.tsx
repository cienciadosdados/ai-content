"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SocialPostsTabProps {
  socialPosts: {
    twitter: string;
    linkedin: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    facebook: string;
  };
}

const PLATFORMS = [
  { key: "twitter" as const, title: "Twitter / X" },
  { key: "linkedin" as const, title: "LinkedIn" },
  { key: "instagram" as const, title: "Instagram" },
  { key: "tiktok" as const, title: "TikTok" },
  { key: "youtube" as const, title: "YouTube Description" },
  { key: "facebook" as const, title: "Facebook" },
];

export function SocialPostsTab({ socialPosts }: SocialPostsTabProps) {
  return (
    <div className="space-y-4">
      {PLATFORMS.map((platform) => (
        <Card key={platform.key}>
          <CardHeader>
            <CardTitle>{platform.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{socialPosts[platform.key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


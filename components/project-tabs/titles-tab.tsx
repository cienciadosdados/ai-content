"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TitlesTabProps {
  titles: {
    youtubeShort: string[];
    youtubeLong: string[];
    podcastTitles: string[];
    seoKeywords: string[];
  };
}

const TITLE_CATEGORIES = [
  {
    key: "youtubeShort" as const,
    title: "YouTube Short Titles",
    type: "list" as const,
  },
  {
    key: "youtubeLong" as const,
    title: "YouTube Long Titles",
    type: "list" as const,
  },
  {
    key: "podcastTitles" as const,
    title: "Podcast Titles",
    type: "list" as const,
  },
  {
    key: "seoKeywords" as const,
    title: "SEO Keywords",
    type: "badges" as const,
  },
];

export function TitlesTab({ titles }: TitlesTabProps) {
  return (
    <div className="space-y-4">
      {TITLE_CATEGORIES.map((category) => (
        <Card key={category.key}>
          <CardHeader>
            <CardTitle>{category.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {category.type === "list" ? (
              <ul className="space-y-2">
                {titles[category.key].map((title) => (
                  <li key={title} className="p-3 border rounded-lg">
                    {title}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-wrap gap-2">
                {titles[category.key].map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

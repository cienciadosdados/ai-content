import {
  FileText,
  Hash,
  type LucideIcon,
  MessageSquare,
  Sparkles,
  Upload,
  Zap,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description:
      "Advanced audio analysis using AssemblyAI to understand your podcast content and power all AI features.",
  },
  {
    icon: FileText,
    title: "Smart Summaries",
    description:
      "Generate comprehensive summaries with key points and insights from your podcast content.",
  },
  {
    icon: MessageSquare,
    title: "Social Posts",
    description:
      "Generate platform-optimized social media posts for Twitter, LinkedIn, Instagram, TikTok, YouTube, and Facebook.",
  },
  {
    icon: Hash,
    title: "Titles & Hashtags",
    description:
      "Get SEO-optimized titles and platform-specific hashtags automatically for maximum reach.",
  },
  {
    icon: Zap,
    title: "Key Moments & Chapters",
    description:
      "Automatically identify viral moments and generate YouTube timestamps for better engagement.",
  },
  {
    icon: Users,
    title: "Speaker Dialogue",
    description:
      "Full transcript with speaker identification - see exactly who said what and when (ULTRA only).",
  },
];

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need in One Platform
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

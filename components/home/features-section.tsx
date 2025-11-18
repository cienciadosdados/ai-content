import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Sparkles,
  Zap,
  MessageSquare,
  Hash,
  Upload,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "AI Transcription",
    description:
      "Get accurate transcripts with timestamps and speaker identification using OpenAI Whisper.",
  },
  {
    icon: Sparkles,
    title: "Smart Summaries",
    description:
      "Generate comprehensive summaries, key points, and insights from your podcast content.",
  },
  {
    icon: Zap,
    title: "Key Moments",
    description:
      "Automatically identify and timestamp the most important moments in your podcast.",
  },
  {
    icon: MessageSquare,
    title: "Social Posts",
    description:
      "Generate platform-optimized social media posts for Twitter, LinkedIn, Instagram, and more.",
  },
  {
    icon: Hash,
    title: "Smart Hashtags & Titles",
    description:
      "Get SEO-optimized titles and relevant hashtags for every platform automatically.",
  },
  {
    icon: Upload,
    title: "Easy Upload",
    description:
      "Drag & drop your audio files. Supports MP3, WAV, M4A, FLAC, and more formats.",
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

import type { LucideIcon } from "lucide-react";
import {
  FileSignature,
  Hash,
  Heading,
  MessageSquare,
  Target,
  Youtube,
} from "lucide-react";

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/aac",
  "audio/aacp",
  "audio/ogg",
  "audio/opus",
  "audio/webm",
  "audio/flac",
  "audio/x-flac",
  "audio/3gpp",
  "audio/3gpp2",
];

export const ALLOWED_AUDIO_EXTENSIONS = [
  ".mp3",
  ".m4a",
  ".wav",
  ".wave",
  ".aac",
  ".ogg",
  ".oga",
  ".opus",
  ".webm",
  ".flac",
  ".3gp",
  ".3g2",
];

export interface GenerationOutput {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const GENERATION_OUTPUTS: GenerationOutput[] = [
  {
    name: "Summary",
    icon: FileSignature,
    description:
      "Creating comprehensive podcast summary with key insights and takeaways",
  },
  {
    name: "Key Moments",
    icon: Target,
    description:
      "Identifying important timestamps, highlights, and memorable quotes",
  },
  {
    name: "Social Posts",
    icon: MessageSquare,
    description:
      "Crafting platform-optimized posts for Twitter, LinkedIn, Instagram, TikTok, YouTube, and Facebook",
  },
  {
    name: "Titles",
    icon: Heading,
    description:
      "Generating engaging SEO-optimized titles and keywords for maximum reach",
  },
  {
    name: "Hashtags",
    icon: Hash,
    description:
      "Creating trending platform-specific hashtag strategies for better discoverability",
  },
  {
    name: "YouTube Timestamps",
    icon: Youtube,
    description:
      "Formatting clickable chapter markers for YouTube video descriptions",
  },
];

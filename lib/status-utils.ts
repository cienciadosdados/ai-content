/**
 * Centralized status utilities for project status
 */

import type { Doc } from "@/convex/_generated/dataModel";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  type LucideIcon,
} from "lucide-react";

export type ProjectStatus = Doc<"projects">["status"];

/**
 * Get the appropriate badge variant for a project status
 */
export function getStatusVariant(
  status: ProjectStatus
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "uploaded":
      return "default";
    case "processing":
      return "secondary";
    case "completed":
      return "default";
    case "failed":
      return "destructive";
  }
}

/**
 * Get the appropriate icon component for a project status
 */
export function getStatusIcon(status: ProjectStatus): LucideIcon {
  switch (status) {
    case "uploaded":
      return Clock;
    case "processing":
      return Loader2;
    case "completed":
      return CheckCircle2;
    case "failed":
      return XCircle;
  }
}

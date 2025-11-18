/**
 * Centralized status utilities for project status
 */

import type { Doc } from "@/convex/_generated/dataModel";

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

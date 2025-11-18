/**
 * Centralized formatting utilities for the application
 */

import bytes from "bytes";
import { format } from "date-fns";

/**
 * Format bytes into a human-readable file size
 */
export function formatFileSize(size: number): string {
  return bytes(size, { unitSeparator: " " });
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/**
 * Format a timestamp to a localized date string
 */
export function formatDate(timestamp: number): string {
  return format(new Date(timestamp), "PPpp");
}

/**
 * Format timestamp for display with relative time for recent dates
 */
export function formatSmartDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

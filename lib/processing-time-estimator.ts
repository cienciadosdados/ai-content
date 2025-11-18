/**
 * Estimate transcription time for AssemblyAI based on audio duration.
 * Based on real AssemblyAI data:
 * - Best case RTF: 0.008× (1 hour in ~29 seconds)
 * - Conservative RTF: 0.25× (10 minutes in ~2.5 minutes)
 *
 * Returns a range to set proper expectations.
 */
export function estimateAssemblyAITime(durationSeconds?: number) {
  if (!durationSeconds) {
    // Fallback if duration not available: assume medium-length podcast (30 min)
    durationSeconds = 1800;
  }

  // Based on AssemblyAI's best-case RTF as low as 0.008×
  const bestFactor = 0.008;
  // Conservative real-world: 10 minutes → ~2-3 minutes (0.2× to 0.3×)
  const conservativeFactor = 0.25;

  const bestCaseSeconds = Math.round(durationSeconds * bestFactor);
  const conservativeSeconds = Math.round(durationSeconds * conservativeFactor);

  return {
    bestCase: Math.max(30, bestCaseSeconds), // Minimum 30 seconds
    conservative: Math.max(60, conservativeSeconds), // Minimum 1 minute
    average: Math.round((bestCaseSeconds + conservativeSeconds) / 2),
  };
}

/**
 * Format seconds into a human-readable time estimate
 */
export function formatTimeEstimate(seconds: number): string {
  if (seconds < 60) return `${Math.ceil(seconds)} seconds`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
  return `${Math.ceil(seconds / 3600)} hours`;
}

/**
 * Format a time range for display
 */
export function formatTimeRange(
  bestCase: number,
  conservative: number
): string {
  const bestStr = formatTimeEstimate(bestCase);
  const conservativeStr = formatTimeEstimate(conservative);
  return `${bestStr} - ${conservativeStr}`;
}

/**
 * Format bytes into a human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

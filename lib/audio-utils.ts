/**
 * Extract duration from an audio file using HTML5 Audio API
 * This works in the browser before uploading the file
 */
export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(objectUrl);
      // Return duration in seconds, rounded to nearest integer
      resolve(Math.floor(audio.duration));
    });

    audio.addEventListener("error", (e) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load audio file"));
    });

    audio.src = objectUrl;
  });
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

/**
 * Fallback: Estimate duration from file size (less accurate)
 * Assumes average bitrate of 128kbps for MP3
 */
export function estimateDurationFromSize(fileSize: number): number {
  // 1MB ≈ 8 seconds of 128kbps audio
  const estimatedSeconds = (fileSize / (1024 * 1024)) * 8;
  return Math.floor(estimatedSeconds);
}


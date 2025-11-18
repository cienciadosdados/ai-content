/**
 * Extract duration from an audio file using HTML5 Audio API
 */
export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.addEventListener("loadedmetadata", () => {
      URL.revokeObjectURL(objectUrl);
      resolve(Math.floor(audio.duration));
    });

    audio.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load audio file"));
    });

    audio.src = objectUrl;
  });
}

/**
 * Estimate duration from file size (fallback)
 * Assumes average bitrate of 128kbps for MP3
 */
export function estimateDurationFromSize(fileSize: number): number {
  return Math.floor((fileSize / (1024 * 1024)) * 8);
}


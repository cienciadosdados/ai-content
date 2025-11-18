import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { TranscriptWithExtras } from "../../types/assemblyai";
import {
  publishStepStart,
  publishStepComplete,
  type PublishFunction,
} from "../../lib/realtime";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

type KeyMoment = {
  time: string;
  timestamp: number;
  text: string;
  description: string;
};

export async function generateKeyMoments(
  transcript: TranscriptWithExtras,
  projectId: Id<"projects">,
  publish: PublishFunction
): Promise<KeyMoment[]> {
  await convex.mutation(api.projects.updateJobStatus, {
    projectId,
    job: "keyMoments",
    status: "running",
  });

  await publishStepStart(
    publish,
    projectId,
    "keyMoments",
    "Extracting key moments from chapters...",
    35
  );

  console.log("Generating key moments from AssemblyAI chapters");

  // Use AssemblyAI's auto-generated chapters
  const chapters = transcript.chapters || [];

  const keyMoments = chapters.map((chapter) => {
    const startSeconds = chapter.start / 1000;
    const hours = Math.floor(startSeconds / 3600);
    const minutes = Math.floor((startSeconds % 3600) / 60);
    const seconds = Math.floor(startSeconds % 60);

    const timeString = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return {
      time: timeString,
      timestamp: startSeconds,
      text: chapter.headline,
      description: chapter.summary,
    };
  });

  await convex.mutation(api.projects.updateJobStatus, {
    projectId,
    job: "keyMoments",
    status: "completed",
  });

  await publishStepComplete(
    publish,
    projectId,
    "keyMoments",
    "Key moments extracted!",
    38
  );

  return keyMoments;
}


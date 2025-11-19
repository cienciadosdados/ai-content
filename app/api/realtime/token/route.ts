import { getSubscriptionToken } from "@inngest/realtime";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { inngest } from "@/inngest/client";
import { REALTIME_TOPICS } from "@/inngest/lib/realtime-topics";
import { apiError, apiResponse, withAuth } from "@/lib/api-utils";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export async function GET(request: Request) {
  try {
    const { userId } = await withAuth();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") as Id<"projects"> | null;

    if (!projectId) {
      return apiError("Missing projectId", 400);
    }

    const project = await convex.query(api.projects.getProject, { projectId });

    if (!project) {
      return apiError("Project not found", 404);
    }

    if (project.userId !== userId) {
      return apiError("Forbidden", 403);
    }

    const channelName = `project:${projectId}`;
    const topics = [
      REALTIME_TOPICS.TRANSCRIPTION_START,
      REALTIME_TOPICS.TRANSCRIPTION_DONE,
      REALTIME_TOPICS.GENERATION_START,
      REALTIME_TOPICS.GENERATION_DONE,
    ];

    console.log("🎫 Generating subscription token for channel:", channelName);

    const token = await getSubscriptionToken(inngest, {
      channel: channelName,
      topics,
    });

    return apiResponse({ token });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Error generating subscription token:", error);
    return apiError(
      error instanceof Error
        ? error.message
        : "Failed to generate subscription token",
    );
  }
}

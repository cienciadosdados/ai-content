import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getSubscriptionToken } from "@inngest/realtime";
import { inngest } from "@/inngest/client";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export async function GET(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get project ID from query params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") as Id<"projects"> | null;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    // Verify user owns this project
    const project = await convex.query(api.projects.getProject, { projectId });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate Inngest Realtime subscription token
    // Scoped to this specific project channel
    const token = await getSubscriptionToken(inngest, {
      channel: `project:${projectId}`,
      topics: ["processing", "ai_stream", "progress", "results"],
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating subscription token:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate subscription token",
      },
      { status: 500 }
    );
  }
}

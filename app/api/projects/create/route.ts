import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { fileUrl, fileName, fileSize, mimeType, fileDuration } =
      await request.json();

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract file metadata
    const fileExtension = fileName.split(".").pop() || "unknown";

    // Create project in Convex
    const projectId = await convex.mutation(api.projects.createProject, {
      userId,
      inputUrl: fileUrl,
      fileName,
      fileSize: fileSize || 0,
      fileDuration: fileDuration, // Audio duration in seconds
      fileFormat: fileExtension,
      mimeType: mimeType || "application/octet-stream",
    });

    // Trigger Inngest workflow
    await inngest.send({
      name: "podcast/uploaded",
      data: {
        projectId,
        userId,
        fileUrl,
        fileName,
        fileSize: fileSize || 0,
        mimeType: mimeType || "application/octet-stream",
      },
    });

    return NextResponse.json({ projectId });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

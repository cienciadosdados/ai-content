"use server";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

interface CreateProjectInput {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileDuration?: number;
}

export async function createProjectAction(input: CreateProjectInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const { fileUrl, fileName, fileSize, mimeType, fileDuration } = input;

    if (!fileUrl || !fileName) {
      throw new Error("Missing required fields");
    }

    const fileExtension = fileName.split(".").pop() || "unknown";

    // Create project in Convex
    const projectId = await convex.mutation(api.projects.createProject, {
      userId,
      inputUrl: fileUrl,
      fileName,
      fileSize: fileSize || 0,
      fileDuration,
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

    return { success: true, projectId };
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

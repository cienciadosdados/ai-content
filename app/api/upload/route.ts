import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  // Authenticate user
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Generate a client token for the browser to upload the file
        // User is already authenticated via Clerk

        return {
          allowedContentTypes: [
            // Audio formats only
            "audio/mpeg",
            "audio/mp3",
            "audio/mp4", // M4A files often report as audio/mp4
            "audio/m4a",
            "audio/x-m4a",
            "audio/wav",
            "audio/x-wav",
            "audio/wave",
            "audio/aac",
            "audio/aacp",
            "audio/ogg",
            "audio/opus",
            "audio/webm",
            "audio/flac",
            "audio/x-flac",
            "audio/3gpp",
            "audio/3gpp2",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_FILE_SIZE,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Upload completed - just log for now
        // Project creation is handled separately in /api/projects/create
        console.log("Blob upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

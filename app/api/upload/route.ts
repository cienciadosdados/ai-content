import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { apiError, withAuth } from "@/lib/api-utils";
import { ALLOWED_AUDIO_TYPES, MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await withAuth();
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_AUDIO_TYPES,
        addRandomSuffix: true,
        maximumSizeInBytes: MAX_FILE_SIZE,
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log("Blob upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    console.error("Upload error:", error);
    return apiError(
      error instanceof Error ? error.message : String(error),
      400,
    );
  }
}

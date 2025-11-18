"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useAuth } from "@clerk/nextjs";
import { UploadDropzone } from "@/components/upload-dropzone";
import { UploadProgress } from "@/components/upload-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getAudioDuration, estimateDurationFromSize } from "@/lib/audio-utils";

type UploadStatus = "idle" | "uploading" | "processing" | "completed" | "error";

export default function UploadPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDuration, setFileDuration] = useState<number | undefined>(
    undefined
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);

    // Extract audio duration using HTML5 Audio API
    try {
      const duration = await getAudioDuration(file);
      setFileDuration(duration);
      console.log(`Audio duration extracted: ${duration} seconds`);
    } catch (err) {
      console.warn("Could not extract duration from audio file:", err);
      // Fallback: estimate from file size
      const estimated = estimateDurationFromSize(file.size);
      setFileDuration(estimated);
      console.log(`Using estimated duration: ${estimated} seconds`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      // Step 1: Upload file to Vercel Blob
      const blob = await upload(selectedFile.name, selectedFile, {
        // Note: Client uploads MUST use access: "public"
        // Security is enforced at the application level:
        // - URLs have random suffixes (hard to guess)
        // - Projects are only accessible to authenticated owners
        // - Convex queries validate userId
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) => {
          setUploadProgress(percentage);
        },
      });

      setUploadStatus("processing");
      setUploadProgress(100);

      // Step 2: Create project in Convex and trigger Inngest
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: blob.url,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
          fileDuration: fileDuration, // Include duration for accurate time estimation
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const { projectId } = await response.json();

      toast.success("Upload completed! Processing your podcast...");

      // Redirect to the specific project page
      setTimeout(() => {
        setUploadStatus("completed");
        router.push(`/dashboard/projects/${projectId}`);
      }, 1000);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("error");
      setError(err instanceof Error ? err.message : "Failed to upload file");
      toast.error("Upload failed. Please try again.");
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFileDuration(undefined);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Your Podcast</h1>
        <p className="text-muted-foreground mt-2">
          Upload your audio file to generate AI-powered insights,
          summaries, and social media content.
        </p>
      </div>

      {/* Upload Area */}
      <div className="space-y-6">
        {!selectedFile && uploadStatus === "idle" && (
          <UploadDropzone
            onFileSelect={handleFileSelect}
            disabled={uploadStatus !== "idle"}
          />
        )}

        {selectedFile && (
          <>
            <UploadProgress
              fileName={selectedFile.name}
              fileSize={selectedFile.size}
              fileDuration={fileDuration}
              progress={uploadProgress}
              status={uploadStatus}
              error={error || undefined}
            />

            {uploadStatus === "idle" && (
              <div className="flex gap-3">
                <Button onClick={handleUpload} className="flex-1">
                  Start Upload
                </Button>
                <Button onClick={handleReset} variant="outline">
                  Cancel
                </Button>
              </div>
            )}
          </>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your file will be securely uploaded to our storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  AI will transcribe your podcast and extract key moments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Generate summaries, social posts, titles, and hashtags
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Access your results in the project dashboard</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


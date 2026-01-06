/**
 * Content Uploader Component
 *
 * Main orchestration component for content uploads.
 * Supports both file upload and YouTube URL extraction.
 */
"use client";

import { useAuth } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Youtube } from "lucide-react";
import {
  createProjectAction,
  createYouTubeProjectAction,
  validateUploadAction,
} from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/upload-dropzone";
import { UploadProgress } from "@/components/upload-progress";
import { YouTubeInput } from "@/components/youtube-input";
import { estimateDurationFromSize, getAudioDuration } from "@/lib/audio-utils";
import type { UploadStatus } from "@/lib/types";

type InputMode = "upload" | "youtube";

export function PodcastUploader() {
  const router = useRouter();
  const { userId } = useAuth();

  // Input mode state
  const [inputMode, setInputMode] = useState<InputMode>("youtube");

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDuration, setFileDuration] = useState<number | undefined>(
    undefined,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle file selection from dropzone
   *
   * Extracts duration for better UX (shows processing time estimates)
   * Falls back to size-based estimation if extraction fails
   */
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);

    // Attempt to extract accurate duration from audio file
    try {
      const duration = await getAudioDuration(file);
      setFileDuration(duration);
      console.log(`Audio duration extracted: ${duration} seconds`);
    } catch (err) {
      // Fallback: Estimate duration based on file size
      // Rough estimate: 1MB ≈ 60 seconds at 128kbps
      console.warn("Could not extract duration from audio file:", err);
      const estimated = estimateDurationFromSize(file.size);
      setFileDuration(estimated);
      console.log(`Using estimated duration: ${estimated} seconds`);
    }
  };

  /**
   * Handle upload button click
   *
   * Upload Flow:
   * 1. Pre-validate upload limits (server action - clean and type-safe)
   * 2. Upload file to Vercel Blob (with progress tracking)
   * 3. Create project and trigger workflow
   * 4. Redirect to project detail page
   */
  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      setUploadStatus("uploading");
      setUploadProgress(0);

      // Step 1: Pre-validate upload using server action
      const validation = await validateUploadAction({
        fileSize: selectedFile.size,
        duration: fileDuration,
      });

      if (!validation.success) {
        throw new Error(validation.error || "Validation failed");
      }

      // Step 2: Upload file to Vercel Blob
      const blob = await upload(selectedFile.name, selectedFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: ({ percentage }) => {
          setUploadProgress(percentage);
        },
      });

      // Step 3: Create project and trigger workflow
      setUploadStatus("processing");
      setUploadProgress(100);

      const { projectId } = await createProjectAction({
        fileUrl: blob.url,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type,
        fileDuration,
      });

      toast.success("Upload completed! Processing your podcast...");
      setUploadStatus("completed");

      // Step 4: Navigate to project detail page
      router.push(`/dashboard/projects/${projectId}`);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus("error");

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to upload file. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  /**
   * Reset upload state to allow new upload
   */
  const handleReset = () => {
    setSelectedFile(null);
    setFileDuration(undefined);
    setUploadStatus("idle");
    setUploadProgress(0);
    setError(null);
  };

  /**
   * Handle YouTube transcript extraction result
   */
  const handleYouTubeExtracted = async (data: {
    transcript: string;
    title: string;
    videoId: string;
    duration: number;
  }) => {
    if (!userId) {
      toast.error("Você precisa estar logado");
      return;
    }

    try {
      setUploadStatus("processing");

      // Criar projeto com transcrição do YouTube (usa action específica)
      const { projectId } = await createYouTubeProjectAction({
        videoId: data.videoId,
        title: data.title,
        transcript: data.transcript,
        duration: data.duration,
      });

      toast.success("Transcrição extraída! Processando conteúdo...");
      setUploadStatus("completed");

      router.push(`/dashboard/projects/${projectId}`);
    } catch (err) {
      console.error("Error creating project from YouTube:", err);
      setUploadStatus("error");
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar projeto";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector Tabs */}
      {!selectedFile && uploadStatus === "idle" && (
        <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-emerald-500/20">
          <button
            type="button"
            onClick={() => setInputMode("youtube")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              inputMode === "youtube"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Youtube className="h-4 w-4" />
            Link do YouTube
          </button>
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              inputMode === "upload"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload de Arquivo
          </button>
        </div>
      )}

      {/* YouTube Input */}
      {inputMode === "youtube" && !selectedFile && uploadStatus === "idle" && (
        <YouTubeInput
          onExtracted={handleYouTubeExtracted}
          disabled={uploadStatus !== "idle"}
        />
      )}

      {/* File Upload Dropzone */}
      {inputMode === "upload" && !selectedFile && uploadStatus === "idle" && (
        <UploadDropzone
          onFileSelect={handleFileSelect}
          disabled={uploadStatus !== "idle"}
        />
      )}

      {/* Show progress card when file is selected */}
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

          {/* Action buttons (show when idle or error) */}
          {(uploadStatus === "idle" || uploadStatus === "error") && (
            <div className="flex gap-3">
              <Button onClick={handleUpload} className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500">
                {uploadStatus === "error" ? "Tentar Novamente" : "Iniciar Upload"}
              </Button>
              <Button onClick={handleReset} variant="outline" className="border-emerald-500/30 text-slate-300 hover:bg-emerald-500/10">
                Cancelar
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  maxSize?: number; // in bytes, default 100MB
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function UploadDropzone({
  onFileSelect,
  disabled = false,
  maxSize = MAX_FILE_SIZE,
}: UploadDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "audio/*": [
          ".mp3",
          ".mp4", // M4A files
          ".m4a",
          ".wav",
          ".wave",
          ".aac",
          ".aacp",
          ".ogg",
          ".oga",
          ".opus",
          ".webm",
          ".flac",
          ".3gp",
          ".3g2",
        ],
      },
      maxSize,
      maxFiles: 1,
      disabled,
    });

  const errorMessage = fileRejections[0]?.errors[0]?.message;

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
          "hover:border-primary/50 hover:bg-accent/50",
          isDragActive && "border-primary bg-accent",
          disabled && "opacity-50 cursor-not-allowed",
          errorMessage && "border-destructive",
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-6">
            {isDragActive ? (
              <Upload className="h-10 w-10 text-primary animate-bounce" />
            ) : (
              <FileAudio className="h-10 w-10 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold">
              {isDragActive
                ? "Drop your podcast file here"
                : "Drag & drop your podcast file"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground">
              Supports audio files: MP3, WAV, M4A, FLAC, OGG, AAC, and more
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Maximum file size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

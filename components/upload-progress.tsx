"use client";

import { CheckCircle2, Clock, FileAudio, Loader2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDuration, formatFileSize } from "@/lib/format";

interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  fileDuration?: number;
  progress: number;
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  error?: string;
}

export function UploadProgress({
  fileName,
  fileSize,
  fileDuration,
  progress,
  status,
  error,
}: UploadProgressProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileAudio className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{fileName}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{formatFileSize(fileSize)}</span>
                {fileDuration && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(fileDuration)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              {status === "uploading" && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
              {status === "processing" && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
              {status === "completed" && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {status === "error" && (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {(status === "uploading" || status === "processing") && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {status === "uploading" ? "Uploading..." : "Processing..."}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status === "completed" && (
            <p className="text-sm text-green-600">
              Upload completed! Redirecting to project dashboard...
            </p>
          )}

          {status === "error" && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

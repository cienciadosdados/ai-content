"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

interface ProcessingInstructionsProps {
  status: "uploaded" | "processing" | "completed" | "failed";
}

export function ProcessingInstructions({ status }: ProcessingInstructionsProps) {
  if (status === "processing") {
    return (
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Your podcast is being processed
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This typically takes about 5-10 minutes depending on your audio
                length. Feel free to close this page and come back later - we'll
                keep processing in the background!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-red-900 dark:text-red-100">
                Processing failed
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Something went wrong while processing your podcast. Please try
                uploading again or contact support if the issue persists.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}


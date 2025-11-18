"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  FileText,
  Sparkles,
  MessageSquare,
  Type,
  Hash,
  Share2,
} from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

interface ProcessingStepsProps {
  jobStatus: Doc<"projects">["jobStatus"];
  realtimeStatus?: {
    step?: string;
    status?: string;
    message?: string;
    progress?: number;
  } | null;
  stepUpdates?: Map<string, { message: string; status: string }>;
}

type JobStep = {
  key: keyof Doc<"projects">["jobStatus"];
  label: string;
  icon: React.ElementType;
};

const JOB_STEPS: JobStep[] = [
  { key: "transcription", label: "Transcription", icon: FileText },
  { key: "keyMoments", label: "Key Moments", icon: Sparkles },
  { key: "summary", label: "Summary", icon: MessageSquare },
  { key: "social", label: "Social Posts", icon: Share2 },
  { key: "titles", label: "Titles", icon: Type },
  { key: "hashtags", label: "Hashtags", icon: Hash },
];

export function ProcessingSteps({
  jobStatus,
  stepUpdates,
}: ProcessingStepsProps) {
  const getStatusIcon = (
    status: "pending" | "running" | "completed" | "failed" | "skipped",
  ) => {
    switch (status) {
      case "pending":
        return <Circle className="h-5 w-5 text-muted-foreground" />;
      case "running":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "skipped":
        return <Circle className="h-5 w-5 text-muted-foreground/50" />;
    }
  };

  const getStatusBadge = (
    status: "pending" | "running" | "completed" | "failed" | "skipped",
  ) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "running":
        return <Badge variant="secondary">Running</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "skipped":
        return <Badge variant="outline">Skipped</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {JOB_STEPS.map((step, index) => {
            const status = jobStatus[step.key] || "pending";
            const Icon = step.icon;

            // Check if this step has a realtime update
            const stepUpdate = stepUpdates?.get(step.key);
            const hasRealtimeUpdate = !!stepUpdate;

            return (
              <div key={step.key} className="space-y-2">
                <div className="flex items-center gap-4">
                  {/* Step Number & Icon */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Step Label */}
                  <div className="flex-1">
                    <p className="font-medium">{step.label}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    {getStatusBadge(status)}
                  </div>
                </div>

                {/* Inngest Realtime Status Message */}
                {hasRealtimeUpdate && stepUpdate && (
                  <div className="ml-14 text-sm text-primary/80 italic flex items-center gap-2">
                    <span>✨</span>
                    <span>{stepUpdate.message}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

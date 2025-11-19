"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { ProcessingFlow } from "@/components/processing-flow";
import { TabContent } from "@/components/project-detail/tab-content";
import { ProjectStatusCard } from "@/components/project-status-card";
import { HashtagsTab } from "@/components/project-tabs/hashtags-tab";
import { KeyMomentsTab } from "@/components/project-tabs/key-moments-tab";
import { SocialPostsTab } from "@/components/project-tabs/social-posts-tab";
import { SummaryTab } from "@/components/project-tabs/summary-tab";
import { TitlesTab } from "@/components/project-tabs/titles-tab";
import { TranscriptTab } from "@/components/project-tabs/transcript-tab";
import { YouTubeTimestampsTab } from "@/components/project-tabs/youtube-timestamps-tab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useProjectRealtime } from "@/hooks/use-project-realtime";

type PhaseStatus = "pending" | "running" | "completed";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = useAuth();
  const { id } = use(params);
  const projectId = id as Id<"projects">;

  const project = useQuery(api.projects.getProject, { projectId });
  const { transcriptionStatus, generationStatus, hasRealtimeUpdates } =
    useProjectRealtime(projectId);

  const [localTranscriptionStatus, setLocalTranscriptionStatus] =
    useState<PhaseStatus>("pending");
  const [localGenerationStatus, setLocalGenerationStatus] =
    useState<PhaseStatus>("pending");

  // Sync realtime status
  useEffect(() => {
    setLocalTranscriptionStatus(transcriptionStatus);
    setLocalGenerationStatus(generationStatus);
  }, [transcriptionStatus, generationStatus]);

  // Fallback to Convex job status if no realtime updates
  useEffect(() => {
    if (hasRealtimeUpdates || !project) return;

    if (project.jobStatus?.transcription === "running") {
      setLocalTranscriptionStatus("running");
    } else if (project.jobStatus?.transcription === "completed") {
      setLocalTranscriptionStatus("completed");
    }

    const generationJobs = [
      project.jobStatus?.keyMoments,
      project.jobStatus?.summary,
      project.jobStatus?.social,
      project.jobStatus?.titles,
      project.jobStatus?.hashtags,
      project.jobStatus?.youtubeTimestamps,
    ];

    const anyGenerationRunning = generationJobs.some(
      (job) => job === "running",
    );
    const allGenerationCompleted = generationJobs.every(
      (job) => job === "completed",
    );

    if (allGenerationCompleted) {
      setLocalGenerationStatus("completed");
    } else if (anyGenerationRunning) {
      setLocalGenerationStatus("running");
    }
  }, [project, hasRealtimeUpdates]);

  if (!project) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (project.userId !== userId) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You don't have access to this project.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isProcessing = project.status === "processing";
  const isCompleted = project.status === "completed";
  const hasFailed = project.status === "failed";
  const showGenerating = isProcessing && localGenerationStatus === "running";

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Project Details</h1>
      </div>

      <div className="grid gap-6">
        <ProjectStatusCard project={project} />

        {isProcessing && (
          <ProcessingFlow
            transcriptionStatus={localTranscriptionStatus}
            generationStatus={localGenerationStatus}
            fileDuration={project.fileDuration}
            createdAt={project.createdAt}
          />
        )}

        {hasFailed && project.error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{project.error.message}</p>
              {project.error.step && (
                <p className="text-sm text-muted-foreground mt-2">
                  Failed at: {project.error.step}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {(showGenerating || isCompleted) && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="flex flex-col md:flex-row md:inline-flex w-full md:w-auto h-auto">
              <TabsTrigger value="summary" className="w-full md:w-auto">
                Summary
              </TabsTrigger>
              <TabsTrigger value="moments" className="w-full md:w-auto">
                Key Moments
              </TabsTrigger>
              <TabsTrigger
                value="youtube-timestamps"
                className="w-full md:w-auto"
              >
                YouTube Timestamps
              </TabsTrigger>
              <TabsTrigger value="social" className="w-full md:w-auto">
                Social Posts
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="w-full md:w-auto">
                Hashtags
              </TabsTrigger>
              <TabsTrigger value="titles" className="w-full md:w-auto">
                Titles
              </TabsTrigger>
              <TabsTrigger value="transcript" className="w-full md:w-auto">
                Transcript
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <TabContent isLoading={showGenerating} data={project.summary}>
                {project.summary && <SummaryTab summary={project.summary} />}
              </TabContent>
            </TabsContent>

            <TabsContent value="moments" className="space-y-4">
              <TabContent isLoading={showGenerating} data={project.keyMoments}>
                {project.keyMoments && (
                  <KeyMomentsTab keyMoments={project.keyMoments} />
                )}
              </TabContent>
            </TabsContent>

            <TabsContent value="youtube-timestamps" className="space-y-4">
              <TabContent
                isLoading={showGenerating}
                data={project.youtubeTimestamps}
              >
                {project.youtubeTimestamps && (
                  <YouTubeTimestampsTab
                    timestamps={project.youtubeTimestamps}
                  />
                )}
              </TabContent>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <TabContent isLoading={showGenerating} data={project.socialPosts}>
                {project.socialPosts && (
                  <SocialPostsTab socialPosts={project.socialPosts} />
                )}
              </TabContent>
            </TabsContent>

            <TabsContent value="hashtags" className="space-y-4">
              <TabContent isLoading={showGenerating} data={project.hashtags}>
                {project.hashtags && (
                  <HashtagsTab hashtags={project.hashtags} />
                )}
              </TabContent>
            </TabsContent>

            <TabsContent value="titles" className="space-y-4">
              <TabContent isLoading={showGenerating} data={project.titles}>
                {project.titles && <TitlesTab titles={project.titles} />}
              </TabContent>
            </TabsContent>

            <TabsContent value="transcript" className="space-y-4">
              <TabContent isLoading={showGenerating} data={project.transcript}>
                {project.transcript && (
                  <TranscriptTab
                    transcript={project.transcript}
                    captions={project.captions}
                  />
                )}
              </TabContent>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

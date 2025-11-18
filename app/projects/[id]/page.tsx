"use client";

import { use, useState, useCallback, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ProjectStatusCard } from "@/components/project-status-card";
import { ProcessingFlow } from "@/components/processing-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useInngestSubscription } from "@inngest/realtime/hooks";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = useAuth();
  const { id } = use(params);
  const projectId = id as Id<"projects">;

  // Fetch project data from Convex (for persistence)
  const project = useQuery(api.projects.getProject, { projectId });

  // State for real-time updates from Inngest Realtime
  const [processingStatus, setProcessingStatus] = useState<{
    step?: string;
    status?: string;
    message?: string;
    progress?: number;
  } | null>(null);

  // Track all step updates for showing completion messages
  const [stepUpdates, setStepUpdates] = useState<
    Map<string, { message: string; status: string }>
  >(new Map());

  // Fetch Inngest Realtime subscription token
  const fetchRealtimeToken = useCallback(async () => {
    const response = await fetch(`/api/realtime/token?projectId=${projectId}`);
    const data = await response.json();
    return data.token;
  }, [projectId]);

  // Subscribe to Inngest Realtime updates (showcases real-time streaming!)
  const { freshData } = useInngestSubscription({
    refreshToken: fetchRealtimeToken,
  });

  // Process real-time messages from Inngest
  useEffect(() => {
    if (!freshData || freshData.length === 0) return;

    freshData.forEach(
      (message: { topic: string; data: Record<string, unknown> }) => {
        if (message.topic === "processing") {
          const data = message.data as typeof processingStatus;
          setProcessingStatus(data);

          // Track updates for each step (including completion messages)
          if (data?.step && data?.message && data.step) {
            setStepUpdates((prev) => {
              const newMap = new Map(prev);
              newMap.set(data.step as string, {
                message: data.message as string,
                status: (data.status as string) || "running",
              });
              return newMap;
            });
          }
        }
      },
    );
  }, [freshData]);

  if (!project) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Check if user owns this project
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

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Project Details</h1>
      </div>

      {/* Project Info */}
      <div className="grid gap-6">
        <ProjectStatusCard project={project} />

        {/* Processing Steps - Only show while processing (hide when completed) */}
        {isProcessing && (
          <ProcessingFlow
            jobStatus={project.jobStatus}
            fileDuration={project.fileDuration}
            createdAt={project.createdAt}
            stepUpdates={stepUpdates}
          />
        )}

        {/* Error Message */}
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

        {/* Results - Only show when completed */}
        {isCompleted && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="moments">Key Moments</TabsTrigger>
              <TabsTrigger value="social">Social Posts</TabsTrigger>
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              <TabsTrigger value="titles">Titles</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-4">
              {project.summary && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>TL;DR</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">{project.summary.tldr}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Full Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{project.summary.full}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {project.summary.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {project.summary.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">💡</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Key Moments Tab */}
            <TabsContent value="moments" className="space-y-4">
              {project.keyMoments && (
                <Card>
                  <CardHeader>
                    <CardTitle>Key Timestamps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.keyMoments.map((moment, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 border rounded-lg"
                        >
                          <Badge variant="secondary" className="mt-1">
                            {moment.time}
                          </Badge>
                          <div>
                            <p className="font-medium">{moment.text}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {moment.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Social Posts Tab */}
            <TabsContent value="social" className="space-y-4">
              {project.socialPosts && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Twitter / X</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">
                        {project.socialPosts.twitter}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>LinkedIn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">
                        {project.socialPosts.linkedin}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Instagram</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">
                        {project.socialPosts.instagram}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>TikTok</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">
                        {project.socialPosts.tiktok}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>YouTube Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">
                        {project.socialPosts.youtube}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Facebook</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">
                        {project.socialPosts.facebook}
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Hashtags Tab */}
            <TabsContent value="hashtags" className="space-y-4">
              {project.hashtags && (
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">YouTube</p>
                        <div className="flex flex-wrap gap-2">
                          {project.hashtags.youtube.map((tag, idx) => (
                            <Badge key={`yt-${idx}`} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Instagram</p>
                        <div className="flex flex-wrap gap-2">
                          {project.hashtags.instagram.map((tag, idx) => (
                            <Badge key={`ig-${idx}`} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">TikTok</p>
                        <div className="flex flex-wrap gap-2">
                          {project.hashtags.tiktok.map((tag, idx) => (
                            <Badge key={`tt-${idx}`} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">LinkedIn</p>
                        <div className="flex flex-wrap gap-2">
                          {project.hashtags.linkedin.map((tag, idx) => (
                            <Badge key={`li-${idx}`} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Twitter</p>
                        <div className="flex flex-wrap gap-2">
                          {project.hashtags.twitter.map((tag, idx) => (
                            <Badge key={`tw-${idx}`} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Titles Tab */}
            <TabsContent value="titles" className="space-y-4">
              {project.titles && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>YouTube Short Titles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {project.titles.youtubeShort.map((title, idx) => (
                          <li key={idx} className="p-3 border rounded-lg">
                            {title}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>YouTube Long Titles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {project.titles.youtubeLong.map((title, idx) => (
                          <li key={idx} className="p-3 border rounded-lg">
                            {title}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Podcast Titles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {project.titles.podcastTitles.map((title, idx) => (
                          <li key={idx} className="p-3 border rounded-lg">
                            {title}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Keywords</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {project.titles.seoKeywords.map((keyword, idx) => (
                          <Badge key={idx} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Transcript Tab */}
            <TabsContent value="transcript" className="space-y-4">
              {project.transcript && (
                <>
                  {/* Speaker View (if available) */}
                  {project.transcript.speakers &&
                    project.transcript.speakers.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Speaker Dialogue</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            AssemblyAI identified{" "}
                            {
                              new Set(
                                project.transcript.speakers.map(
                                  (s) => s.speaker,
                                ),
                              ).size
                            }{" "}
                            speaker(s) in this podcast
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {project.transcript.speakers.map(
                              (utterance, idx) => (
                                <div
                                  key={`speaker-${idx}`}
                                  className="flex gap-4 items-start"
                                >
                                  <Badge
                                    variant={
                                      utterance.speaker === "A"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="h-fit min-w-[80px] justify-center"
                                  >
                                    Speaker {utterance.speaker}
                                  </Badge>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {new Date(utterance.start * 1000)
                                          .toISOString()
                                          .substr(11, 8)}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {Math.round(utterance.confidence * 100)}
                                        % confidence
                                      </span>
                                    </div>
                                    <p>{utterance.text}</p>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  {/* Full Transcript */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Full Transcript</CardTitle>
                        {project.captions && (
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={project.captions.srtUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download SRT
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {project.transcript.segments.map((segment) => (
                          <div key={segment.id} className="flex gap-4">
                            <Badge variant="outline" className="h-fit">
                              {new Date(segment.start * 1000)
                                .toISOString()
                                .substr(11, 8)}
                            </Badge>
                            <p className="flex-1">{segment.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

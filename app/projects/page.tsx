"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileAudio,
  FileVideo,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { formatFileSize, formatSmartDate, formatDuration } from "@/lib/format";
import { getStatusVariant } from "@/lib/status-utils";

export default function ProjectsPage() {
  const { userId } = useAuth();

  // Subscribe to user's projects in real-time
  const projectsResult = useQuery(
    api.projects.listUserProjects,
    userId ? { userId } : "skip",
  );

  if (!userId) {
    return (
      <div className="container max-w-6xl mx-auto py-10 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please sign in to view your projects.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projects = projectsResult?.page || [];
  const hasProjects = projects.length > 0;

  const getStatusIcon = (
    status: "uploaded" | "processing" | "completed" | "failed",
  ) => {
    switch (status) {
      case "uploaded":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "failed":
        return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all your podcast projects
            </p>
          </div>
          <Link href="/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              New Upload
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects Grid */}
      {!hasProjects && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="rounded-full bg-primary/10 p-6 w-fit mx-auto mb-4">
                <FileAudio className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload your first podcast to get started
              </p>
              <Link href="/upload">
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Podcast
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {hasProjects && (
        <div className="grid gap-4">
          {projects.map((project) => {
            const isVideo = project.mimeType.startsWith("video/");
            const Icon = isVideo ? FileVideo : FileAudio;

            return (
              <Link key={project._id} href={`/projects/${project._id}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* File Icon */}
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              {project.fileName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatSmartDate(project.createdAt)}
                            </p>
                          </div>
                          <Badge
                            variant={getStatusVariant(project.status)}
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(project.status)}
                            {project.status}
                          </Badge>
                        </div>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(project.fileSize)}</span>
                          <span className="uppercase">{project.fileFormat}</span>
                          {project.fileDuration && (
                            <span>{formatDuration(project.fileDuration)}</span>
                          )}
                        </div>

                        {/* Progress Indicator for Processing */}
                        {project.status === "processing" && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span className="text-muted-foreground">
                                Processing...
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Error Message */}
                        {project.status === "failed" && project.error && (
                          <div className="mt-3">
                            <p className="text-sm text-destructive">
                              {project.error.message}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {/* Load More (if pagination is needed) */}
      {projectsResult?.continueCursor && (
        <div className="mt-6 text-center">
          <Button variant="outline">Load More</Button>
        </div>
      )}
    </div>
  );
}

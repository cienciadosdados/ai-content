"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { LoadingSpinner } from "@/components/projects/loading-spinner";
import { PageHeader } from "@/components/projects/page-header";
import { EmptyState } from "@/components/projects/empty-state";
import { ProjectCard } from "@/components/projects/project-card";

export default function ProjectsPage() {
  const { userId } = useAuth();

  // Subscribe to user's projects in real-time (userId guaranteed by middleware)
  const projectsResult = useQuery(
    api.projects.listUserProjects,
    userId ? { userId } : "skip",
  );

  // Loading state - data not yet fetched
  if (projectsResult === undefined) {
    return <LoadingSpinner />;
  }

  const projects = projectsResult.page || [];
  const hasProjects = projects.length > 0;

  return (
    <div className="container max-w-6xl mx-auto py-10 px-4">
      <PageHeader />

      {!hasProjects && <EmptyState />}

      {hasProjects && (
        <div className="grid gap-4 @container">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}


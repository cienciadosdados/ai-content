"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Doc } from "@/convex/_generated/dataModel";
import { formatFileSize, formatDate, formatDuration } from "@/lib/format";
import { getStatusVariant } from "@/lib/status-utils";

interface ProjectStatusCardProps {
  project: Doc<"projects">;
}

export function ProjectStatusCard({ project }: ProjectStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{project.fileName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(project.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusVariant(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">File Size</p>
            <p className="font-medium">{formatFileSize(project.fileSize)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Format</p>
            <p className="font-medium uppercase">{project.fileFormat}</p>
          </div>
          {project.fileDuration && (
            <div>
              <p className="text-muted-foreground">Duration</p>
              <p className="font-medium">
                {formatDuration(project.fileDuration)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { FileAudio, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
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
          <Link href="/dashboard/upload">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Podcast
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

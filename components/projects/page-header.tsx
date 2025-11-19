"use client";

import { Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PageHeader() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all your podcast projects
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            New Upload
          </Button>
        </Link>
      </div>
    </div>
  );
}

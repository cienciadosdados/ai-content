"use client";

import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-semibold">AI Podcast Assistant</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 AI Podcast Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}


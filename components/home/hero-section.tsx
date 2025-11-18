import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { PodcastUploader } from "@/components/podcast-uploader";

export async function HeroSection() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              AI-Powered Podcast Processing
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Transform Your Podcasts with AI
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            Upload your podcast audio and get AI-generated summaries, transcripts,
            social posts, key moments, and more - all in minutes.
          </p>
        </div>

        {isSignedIn ? (
          <div className="space-y-4">
            <PodcastUploader compact />
            <div className="text-center">
              <Link href="/dashboard/projects">
                <Button variant="outline">
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <SignInButton mode="modal">
              <Button size="lg">
                Get Started
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
            <Link href="/dashboard/projects">
              <Button size="lg" variant="outline">
                View Projects
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

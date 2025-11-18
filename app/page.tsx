"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Upload,
  FileText,
  MessageSquare,
  Hash,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Podcast Assistant</span>
          </div>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link href="/projects">
                  <Button variant="ghost">My Projects</Button>
                </Link>
                <UserButton />
              </>
            ) : (
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
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
            Upload your podcast audio and get AI-generated summaries,
            transcripts, social posts, key moments, and more - all in minutes.
          </p>

          <div className="flex items-center justify-center gap-4">
            {isSignedIn ? (
              <Link href="/upload">
                <Button size="lg">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Podcast
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button size="lg">
                  Get Started
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            )}
            <Link href="/projects">
              <Button size="lg" variant="outline">
                View Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need in One Platform
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Transcription</h3>
                <p className="text-muted-foreground">
                  Get accurate transcripts with timestamps and speaker
                  identification using OpenAI Whisper.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Summaries</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive summaries, key points, and insights
                  from your podcast content.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Key Moments</h3>
                <p className="text-muted-foreground">
                  Automatically identify and timestamp the most important
                  moments in your podcast.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Social Posts</h3>
                <p className="text-muted-foreground">
                  Generate platform-optimized social media posts for Twitter,
                  LinkedIn, Instagram, and more.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Smart Hashtags & Titles
                </h3>
                <p className="text-muted-foreground">
                  Get SEO-optimized titles and relevant hashtags for every
                  platform automatically.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg bg-primary/10 p-3 w-fit mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
                <p className="text-muted-foreground">
                  Drag & drop your audio files. Supports MP3, WAV, M4A, FLAC,
                  and more formats.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to supercharge your podcast workflow?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Upload your first podcast and see the magic happen in minutes.
            </p>
            {isSignedIn ? (
              <Link href="/upload">
                <Button size="lg">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Your First Podcast
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button size="lg">
                  Get Started Now
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
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
    </div>
  );
}

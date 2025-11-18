import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Upload } from "lucide-react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export async function CtaSection() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
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
            <Link href="/dashboard/upload">
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
  );
}

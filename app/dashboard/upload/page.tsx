import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PodcastUploader } from "@/components/podcast-uploader";

export default function UploadPage() {
  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload Your Podcast</h1>
        <p className="text-muted-foreground mt-2">
          Upload your audio file to generate AI-powered insights, summaries, and
          social media content.
        </p>
      </div>

      {/* Upload Area */}
      <div className="space-y-6">
        <PodcastUploader />

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Your file will be securely uploaded to our storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  AI will transcribe your podcast and extract key moments
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>
                  Generate summaries, social posts, titles, and hashtags
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Access your results in the project dashboard</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

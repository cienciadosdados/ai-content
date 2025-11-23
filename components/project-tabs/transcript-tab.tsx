"use client";

import { Protect } from "@clerk/nextjs";
import { UpgradePrompt } from "@/components/project-detail/upgrade-prompt";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES } from "@/lib/tier-config";

interface TranscriptTabProps {
  transcript: {
    speakers?: {
      speaker: string;
      text: string;
      start: number;
      confidence: number;
    }[];
  };
}

export function TranscriptTab({ transcript }: TranscriptTabProps) {
  const hasSpeakers = transcript.speakers && transcript.speakers.length > 0;

  if (!hasSpeakers) {
    return (
      <Protect
        feature={FEATURES.SPEAKER_DIARIZATION}
        fallback={
          <UpgradePrompt
            feature="Speaker Diarization"
            featureKey={FEATURES.SPEAKER_DIARIZATION}
            currentPlan="free"
          />
        }
      >
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No speaker diarization data available
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This project was processed before you upgraded to Ultra.
            </p>
          </CardContent>
        </Card>
      </Protect>
    );
  }

  return (
    <Protect
      feature={FEATURES.SPEAKER_DIARIZATION}
      fallback={
        <UpgradePrompt
          feature="Speaker Diarization"
          featureKey={FEATURES.SPEAKER_DIARIZATION}
          currentPlan="free"
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Speaker Dialogue</CardTitle>
          <p className="text-sm text-muted-foreground">
            AssemblyAI identified{" "}
            {new Set(transcript.speakers?.map((s) => s.speaker)).size}{" "}
            speaker(s) in this podcast
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transcript.speakers?.map((utterance) => (
              <div
                key={`${utterance.start}-${utterance.speaker}`}
                className="flex gap-4 items-start"
              >
                <Badge
                  variant={utterance.speaker === "A" ? "default" : "secondary"}
                  className="h-fit min-w-[80px] justify-center"
                >
                  Speaker {utterance.speaker}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {new Date(utterance.start * 1000)
                        .toISOString()
                        .substr(11, 8)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(utterance.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p>{utterance.text}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Protect>
  );
}

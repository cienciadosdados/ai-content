"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TranscriptTabProps {
  transcript: {
    speakers?: {
      speaker: string;
      text: string;
      start: number;
      confidence: number;
    }[];
    segments: {
      id: number | string;
      text: string;
      start: number;
    }[];
  };
  captions?: {
    srtUrl: string;
  };
}

export function TranscriptTab({ transcript, captions }: TranscriptTabProps) {
  return (
    <div className="space-y-4">
      {/* Speaker View (if available) */}
      {transcript.speakers && transcript.speakers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Speaker Dialogue</CardTitle>
            <p className="text-sm text-muted-foreground">
              AssemblyAI identified{" "}
              {new Set(transcript.speakers.map((s) => s.speaker)).size} speaker(s)
              in this podcast
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transcript.speakers.map((utterance, idx) => (
                <div key={`speaker-${idx}`} className="flex gap-4 items-start">
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
      )}

      {/* Full Transcript */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Full Transcript</CardTitle>
            {captions && (
              <Button asChild size="sm" variant="outline">
                <a
                  href={captions.srtUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download SRT
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transcript.segments.map((segment) => (
              <div key={segment.id} className="flex gap-4">
                <Badge variant="outline" className="h-fit">
                  {new Date(segment.start * 1000).toISOString().substr(11, 8)}
                </Badge>
                <p className="flex-1">{segment.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


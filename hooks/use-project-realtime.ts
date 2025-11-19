"use client";

import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useCallback, useEffect, useState } from "react";
import { REALTIME_TOPICS } from "@/inngest/lib/realtime-topics";

type PhaseStatus = "pending" | "running" | "completed";

interface UseProjectRealtimeResult {
  transcriptionStatus: PhaseStatus;
  generationStatus: PhaseStatus;
  hasRealtimeUpdates: boolean;
}

export function useProjectRealtime(
  projectId: string,
): UseProjectRealtimeResult {
  const [transcriptionStatus, setTranscriptionStatus] =
    useState<PhaseStatus>("pending");
  const [generationStatus, setGenerationStatus] =
    useState<PhaseStatus>("pending");
  const [hasRealtimeUpdates, setHasRealtimeUpdates] = useState(false);
  const [processedMessageIds] = useState(() => new Set<string>());

  const fetchRealtimeToken = useCallback(async () => {
    console.log("🔑 Fetching Inngest realtime token for project:", projectId);
    const response = await fetch(`/api/realtime/token?projectId=${projectId}`);
    const data = await response.json();
    console.log("🔑 Token received:", data.token ? "✓" : "✗");
    return data.token;
  }, [projectId]);

  const { data } = useInngestSubscription({
    refreshToken: fetchRealtimeToken,
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    data.forEach(
      (message: { topic: string; data: Record<string, unknown> }) => {
        const messageId = `${message.topic}-${JSON.stringify(message.data)}`;

        if (processedMessageIds.has(messageId)) {
          return;
        }

        processedMessageIds.add(messageId);
        setHasRealtimeUpdates(true);
        console.log("📡 Inngest realtime message:", {
          topic: message.topic,
          data: message.data,
        });

        if (message.topic === REALTIME_TOPICS.TRANSCRIPTION_START) {
          console.log("🎤 Transcription started");
          setTranscriptionStatus("running");
        } else if (message.topic === REALTIME_TOPICS.TRANSCRIPTION_DONE) {
          console.log("✅ Transcription completed");
          setTranscriptionStatus("completed");
        } else if (message.topic === REALTIME_TOPICS.GENERATION_START) {
          console.log("🤖 AI Generation started (6 outputs)");
          setGenerationStatus("running");
        } else if (message.topic === REALTIME_TOPICS.GENERATION_DONE) {
          console.log("✅ AI Generation completed");
          setGenerationStatus("completed");
        }
      },
    );
  }, [data, processedMessageIds]);

  return {
    transcriptionStatus,
    generationStatus,
    hasRealtimeUpdates,
  };
}

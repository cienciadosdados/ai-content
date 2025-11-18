// Inngest Realtime publishing helpers to reduce duplication

export type PublishFunction = (args: {
  channel: string;
  topic: string;
  data: Record<string, unknown>;
}) => Promise<Record<string, unknown>>;

export async function publishStepStart(
  publish: PublishFunction,
  projectId: string,
  step: string,
  message: string,
  progress: number
) {
  await publish({
    channel: `project:${projectId}`,
    topic: "processing",
    data: { step, status: "running", message, progress },
  });
}

export async function publishStepComplete(
  publish: PublishFunction,
  projectId: string,
  step: string,
  message: string,
  progress: number
) {
  await publish({
    channel: `project:${projectId}`,
    topic: "processing",
    data: { step, status: "completed", message, progress },
  });
}

export async function publishResult(
  publish: PublishFunction,
  projectId: string,
  type: string,
  content: unknown
) {
  await publish({
    channel: `project:${projectId}`,
    topic: "results",
    data: { type, content },
  });
}

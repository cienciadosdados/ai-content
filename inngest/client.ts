import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";

// Create a client with Realtime support for streaming updates
export const inngest = new Inngest({
  id: "ai-podcast-saas-inngest-coderabbit-clerk",
  middleware: [realtimeMiddleware()],
});

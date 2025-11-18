import OpenAI from "openai";

// Shared OpenAI client instance
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});


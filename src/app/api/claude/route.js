import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
    try {
          const { system, messages } = await request.json();

          const response = await client.messages.create({
                  model: "claude-opus-4-5",
                  max_tokens: 1024,
                  system,
                  messages,
                });

          return Response.json(response);
        } catch (error) {
          console.error("Claude API error:", error);
          return Response.json(
                  { error: "Failed to reach Claude API" },
                  { status: 500 }
                );
        }
  }

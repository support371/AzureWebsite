import "dotenv/config";
import express from "express";
import { AzureOpenAI } from "openai";

const {
  AZURE_OPENAI_ENDPOINT,
  AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_DEPLOYMENT_NAME,
  AZURE_OPENAI_API_VERSION,
  PORT = "3000",
} = process.env;

const missingVars = [
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_DEPLOYMENT_NAME",
  "AZURE_OPENAI_API_VERSION",
].filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
  console.error("Copy .env.example to .env and fill in your values.");
  process.exit(1);
}

const openaiClient = new AzureOpenAI({
  apiKey: AZURE_OPENAI_API_KEY,
  apiVersion: AZURE_OPENAI_API_VERSION,
  endpoint: AZURE_OPENAI_ENDPOINT,
});

const app = express();
app.use(express.json());
app.use(express.static("public"));

/**
 * POST /api/chat
 * Body: { messages: Array<{ role: string, content: string }> }
 * Returns: { reply: string }
 */
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages must be a non-empty array" });
  }

  // Validate each message has role and content
  for (const msg of messages) {
    if (!msg.role || typeof msg.content !== "string") {
      return res
        .status(400)
        .json({ error: "Each message must have a role and string content" });
    }
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: AZURE_OPENAI_DEPLOYMENT_NAME,
      messages,
    });

    const reply = completion.choices[0]?.message?.content ?? "";
    res.json({ reply });
  } catch (err) {
    console.error("Azure OpenAI error:", err?.message ?? err);
    const status = err?.status ?? 500;
    const message = err?.message ?? "An error occurred calling Azure OpenAI";
    res.status(status).json({ error: message });
  }
});

app.listen(Number(PORT), () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Using deployment: ${AZURE_OPENAI_DEPLOYMENT_NAME}`);
});

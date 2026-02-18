import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

function parseAllowedOrigins(env: string | undefined): Set<string> {
  return new Set(
    (env ?? "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
  );
}

app.http("hello", {
  methods: ["GET", "OPTIONS"],
  authLevel: "anonymous",
  handler: async (req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> => {
    const origin = req.headers.get("origin") ?? "";
    const allowed = parseAllowedOrigins(process.env.CORS_ALLOWED_ORIGINS);

    // Minimal, explicit CORS: allow only known dev origins.
    const corsHeaders: Record<string, string> = {};
    if (origin && allowed.has(origin)) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
      corsHeaders["Vary"] = "Origin";
      corsHeaders["Access-Control-Allow-Methods"] = "GET,OPTIONS";
      corsHeaders["Access-Control-Allow-Headers"] = "Content-Type,Authorization";
    }

    if (req.method === "OPTIONS") {
      return { status: 204, headers: corsHeaders };
    }

    // No secrets, no PII, dev-safe payload
    return {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      jsonBody: {
        message: "Hello from Azure Functions (dev starter)."
      }
    };
  }
});

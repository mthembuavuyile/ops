// ================= AI API ROUTE (OpenRouter Proxy) =================
// Server-side route handler — keeps OPENROUTER_API_KEY secure.
// Accepts { action, payload } and routes to the correct prompt.

import { type NextRequest } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

type AiAction = "parse-items" | "refine-description" | "draft-reminder";

interface AiRequestBody {
  action: AiAction;
  payload: Record<string, unknown>;
}

// ——— Prompt builders ———

function buildParseItemsMessages(text: string, currency: string) {
  return [
    {
      role: "system" as const,
      content: `You are a structured data extraction assistant for a South African invoicing app. 
Extract line items from the user's raw text. Return ONLY valid JSON — no markdown fences, no explanation.

Output format:
{
  "line_items": [
    { "description": "string", "qty": number, "rate": number }
  ],
  "notes": "string or empty"
}

Rules:
- qty and rate must be numbers, never strings
- If a quantity is not specified, default to 1
- If a rate/price is not clear, set rate to 0
- Currency is ${currency} — strip currency symbols from rates
- Keep descriptions concise and professional
- "notes" captures any extra context that isn't a line item (e.g. "50% deposit required")
- Return valid JSON only. No code fences. No preamble.`,
    },
    {
      role: "user" as const,
      content: text,
    },
  ];
}

function buildRefineDescriptionMessages(description: string, industry?: string) {
  return [
    {
      role: "system" as const,
      content: `You are a professional scope-of-work writer for quotes and invoices.
Take the user's vague line item description and expand it into a clear, professional description with specific scope bullet points.

Output format — plain text, first line is the main description, following lines are bullet points prefixed with "- ":

Main Description Title
- Specific deliverable or task 1
- Specific deliverable or task 2
- Specific deliverable or task 3

Rules:
- Keep it realistic and practical — don't pad with filler
- 2-5 bullet points maximum
- Match the ${industry || "general business"} industry tone
- Do NOT include pricing, quantities, or totals
- Return ONLY the formatted text, no explanations or preamble`,
    },
    {
      role: "user" as const,
      content: description,
    },
  ];
}

function buildDraftReminderMessages(payload: {
  clientName: string;
  amount: string;
  currency: string;
  invoiceNumber: string;
  dueDate: string;
  daysOverdue: number;
  tone: string;
  bankName?: string;
  accountNumber?: string;
  branchCode?: string;
  customContext?: string;
}) {
  const toneGuide =
    payload.tone === "gentle"
      ? "warm, friendly, non-confrontational — assume it was an honest oversight"
      : payload.tone === "due"
        ? "professional and direct — politely firm that payment is due today"
        : "urgent and serious — the invoice is overdue and needs immediate attention, but stay professional";

  return [
    {
      role: "system" as const,
      content: `You are a South African business communication writer. Draft a WhatsApp payment reminder message.

Tone: ${toneGuide}

Context:
- Client: ${payload.clientName || "Client"}
- Invoice: ${payload.invoiceNumber || "INV-001"}
- Amount: ${payload.currency}${payload.amount}
- Due date: ${payload.dueDate}
- Days overdue: ${payload.daysOverdue}
${payload.bankName ? `- Bank: ${payload.bankName}` : ""}
${payload.accountNumber ? `- Account: ${payload.accountNumber}` : ""}
${payload.branchCode ? `- Branch: ${payload.branchCode}` : ""}
${payload.customContext ? `- Additional context: ${payload.customContext}` : ""}

Rules:
- Write in a natural, human tone — not robotic
- Include banking details if provided
- Use the invoice number as payment reference
- Keep it under 200 words
- Use appropriate emojis sparingly (1-3 max)
- Return ONLY the message text, no explanations`,
    },
    {
      role: "user" as const,
      content: `Draft the ${payload.tone} payment reminder now.`,
    },
  ];
}

// ——— Main handler ———

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat:free";

  if (!apiKey) {
    return Response.json(
      { error: "OpenRouter API key not configured. Add OPENROUTER_API_KEY to .env" },
      { status: 500 }
    );
  }

  let body: AiRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { action, payload } = body;

  if (!action || !payload) {
    return Response.json({ error: "Missing action or payload" }, { status: 400 });
  }

  // Build messages based on action
  let messages;
  let maxTokens = 800;

  switch (action) {
    case "parse-items":
      if (!payload.text || typeof payload.text !== "string") {
        return Response.json({ error: "Missing text in payload" }, { status: 400 });
      }
      messages = buildParseItemsMessages(payload.text as string, (payload.currency as string) || "R");
      maxTokens = 1200;
      break;

    case "refine-description":
      if (!payload.description || typeof payload.description !== "string") {
        return Response.json({ error: "Missing description in payload" }, { status: 400 });
      }
      messages = buildRefineDescriptionMessages(
        payload.description as string,
        payload.industry as string | undefined
      );
      maxTokens = 500;
      break;

    case "draft-reminder":
      messages = buildDraftReminderMessages(payload as Parameters<typeof buildDraftReminderMessages>[0]);
      maxTokens = 600;
      break;

    default:
      return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }

  // Call OpenRouter
  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ops.vylex.co.za",
        "X-Title": "VylexOps",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[AI Route] OpenRouter error:", response.status, errText);
      return Response.json(
        { error: `AI service error (${response.status}). Try again shortly.` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    // For parse-items, attempt to extract JSON from the response
    if (action === "parse-items") {
      try {
        // Strip markdown code fences if the model included them
        let cleaned = content.trim();
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
        }
        const parsed = JSON.parse(cleaned);
        return Response.json({ result: parsed });
      } catch {
        // If JSON parsing fails, return the raw text for client-side handling
        return Response.json({
          result: null,
          raw: content,
          error: "AI returned non-JSON. Could not parse line items automatically.",
        });
      }
    }

    // For text-based actions, return raw content
    return Response.json({ result: content.trim() });
  } catch (err) {
    console.error("[AI Route] Fetch error:", err);
    return Response.json(
      { error: "Failed to reach AI service. Check your internet connection." },
      { status: 503 }
    );
  }
}

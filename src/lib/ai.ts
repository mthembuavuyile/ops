// ================= AI CLIENT HELPERS =================
// Typed client-side functions that call /api/ai.
// All math stays in calculations.ts — AI only returns text/descriptions.

export interface ParsedLineItem {
  description: string;
  qty: number;
  rate: number;
}

export interface ParseItemsResult {
  line_items: ParsedLineItem[];
  notes: string;
}

interface AiResponse<T> {
  result: T | null;
  raw?: string;
  error?: string;
}

// ——— Generic caller ———

async function callAi<T>(action: string, payload: Record<string, unknown>): Promise<AiResponse<T>> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        result: null,
        error: errData.error || `Request failed (${res.status})`,
      };
    }

    return await res.json();
  } catch (err) {
    return {
      result: null,
      error: err instanceof Error ? err.message : "Network error — could not reach AI service.",
    };
  }
}

// ——— Feature: Parse raw text into line items ———

export async function parseItemsFromText(
  text: string,
  currency: string = "R"
): Promise<AiResponse<ParseItemsResult>> {
  return callAi<ParseItemsResult>("parse-items", { text, currency });
}

// ——— Feature: Refine a vague description into professional scope bullets ———

export async function refineDescription(
  description: string,
  industry?: string
): Promise<AiResponse<string>> {
  return callAi<string>("refine-description", { description, industry });
}

// ——— Feature: Draft a context-aware payment reminder ———

export interface DraftReminderPayload {
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
}

export async function draftReminder(
  payload: DraftReminderPayload
): Promise<AiResponse<string>> {
  return callAi<string>("draft-reminder", payload as unknown as Record<string, unknown>);
}

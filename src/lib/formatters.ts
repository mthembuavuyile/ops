// ================= FORMATTING UTILITIES =================

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/**
 * Format a number as currency with the given symbol.
 * e.g. formatCurrency(1285.50, "R") => "R 1,285.50"
 */
export function formatCurrency(value: number, symbol: string = "R"): string {
  return `${symbol} ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format an ISO date string (YYYY-MM-DD) to a human-readable label.
 * e.g. "2026-07-23" => "23 July 2026"
 */
export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const year = parts[0];
  const monthIdx = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);
  return `${day} ${MONTH_NAMES[monthIdx]} ${year}`;
}

/**
 * Get today's date as YYYY-MM-DD.
 */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Get a future date as YYYY-MM-DD.
 */
export function futureDateISO(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

/**
 * Clean a phone number for WhatsApp use.
 * Strips non-digits, converts leading 0 to 27 (SA default).
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return "";
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "27" + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * Get a currency label from its symbol.
 */
export function currencyLabel(symbol: string): string {
  switch (symbol) {
    case "$": return "USD ($)";
    case "£": return "GBP (£)";
    case "€": return "EUR (€)";
    default: return "ZAR (R)";
  }
}

/**
 * Get short currency name from symbol.
 */
export function currencyName(symbol: string): string {
  switch (symbol) {
    case "$": return "USD";
    case "£": return "GBP";
    case "€": return "EUR";
    default: return "ZAR";
  }
}

/**
 * Escape HTML entities to prevent XSS.
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

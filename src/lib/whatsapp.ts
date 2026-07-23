// ================= WHATSAPP INTEGRATION =================

import type { Settings, DebtorReminder, LineItem } from "./types";
import { formatCurrency, cleanPhoneNumber } from "./formatters";

/**
 * Build a WhatsApp deep link URL.
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}

/**
 * Generate a formatted WhatsApp message for sharing a quote or invoice.
 */
export function generateShareMessage(
  type: "quote" | "invoice",
  docNumber: string,
  clientContactName: string,
  total: number,
  settings: Settings
): string {
  const formatted = formatCurrency(total, settings.currency);
  const cleanDocNum = docNumber.replace(/[^a-zA-Z0-9-]/g, "");
  const portalUrl = `https://ops.vylex.co.za/portal/${type}/${cleanDocNum}`;
  const companyName = settings.company_name || "Our Company";

  return `Hi ${clientContactName},\n\nHere is the link to review your ${type} ${docNumber} (total: ${formatted}) from ${companyName}:\n\n${portalUrl}\n\nKind regards,\n${companyName}`;
}

/**
 * Generate a formatted WhatsApp invoice/quotation message with full line items.
 */
export function generateInvoiceMessage(
  docType: string,
  docNumber: string,
  bizName: string,
  clientName: string,
  issueDate: string,
  dueDate: string,
  items: LineItem[],
  currency: string,
  subtotal: number,
  taxRate: number,
  taxAmount: number,
  discountPercent: number,
  discountAmount: number,
  grandTotal: number,
  bankName?: string,
  accountNo?: string,
  branchCode?: string
): string {
  let msg = `🧾 *${docType.toUpperCase()} #${docNumber}*\n`;
  msg += `From: *${bizName}*\n`;
  msg += `To: *${clientName}*\n`;
  msg += `Date: ${issueDate} | Due: ${dueDate}\n`;
  msg += `--------------------------------\n`;
  msg += `📦 *ITEMS:*\n`;

  items.forEach((item) => {
    const itemTotal = (item.qty * item.rate).toFixed(2);
    msg += `• ${item.qty}x ${item.description} @ ${currency}${item.rate.toFixed(2)} = *${currency}${itemTotal}*\n`;
  });

  msg += `--------------------------------\n`;
  msg += `💰 Subtotal: ${currency}${subtotal.toFixed(2)}\n`;
  if (discountPercent > 0)
    msg += `🏷️ Discount (${discountPercent}%): -${currency}${discountAmount.toFixed(2)}\n`;
  if (taxRate > 0)
    msg += `🏛️ Tax (${taxRate}%): ${currency}${taxAmount.toFixed(2)}\n`;
  msg += `💵 *TOTAL DUE: ${currency}${grandTotal.toFixed(2)}*\n`;
  msg += `--------------------------------\n`;

  if (bankName && accountNo) {
    msg += `🏦 *BANKING DETAILS:*\n`;
    msg += `Bank: ${bankName}\n`;
    msg += `Acc: ${accountNo}\n`;
    if (branchCode) msg += `Branch: ${branchCode}\n`;
    msg += `Ref: ${docNumber}\n\n`;
  }

  msg += `📲 *Please reply to confirm payment or receipt.*`;
  return msg;
}

/**
 * Generate a tone-adjusted debtor payment reminder message.
 */
export function generateReminderMessage(
  reminder: DebtorReminder,
  currency: string,
  bankName: string,
  accountNo: string,
  invNo: string
): string {
  const { name, amount, dueDate, tone } = reminder;

  if (tone === "gentle") {
    return `Hi ${name || "there"}! 👋 Hope you are having a great week.\n\nJust a gentle reminder regarding unpaid invoice *#${invNo || "INV-1001"}* for *${currency}${amount || "0.00"}* which was due on ${dueDate}.\n\nBanking details:\nBank: ${bankName}\nAcc: ${accountNo}\nRef: ${invNo}\n\nLet us know if you have any questions! Thanks.`;
  } else if (tone === "due") {
    return `Hi ${name || "there"}, invoice *#${invNo || "INV-1001"}* for *${currency}${amount || "0.00"}* is due today (${dueDate}).\n\nPlease find payment details below:\nBank: ${bankName}\nAcc: ${accountNo}\nRef: ${invNo}\n\nPlease reply with POP once transferred. Thank you!`;
  } else {
    return `⚠️ *URGENT OVERDUE NOTICE*\n\nDear ${name || "Client"},\nInvoice *#${invNo || "INV-1001"}* for *${currency}${amount || "0.00"}* was due on ${dueDate} and is now past due.\n\nPlease settle this account at your earliest convenience to avoid service suspension.\n\nBank: ${bankName}\nAcc: ${accountNo}\nRef: ${invNo}\n\nThank you.`;
  }
}

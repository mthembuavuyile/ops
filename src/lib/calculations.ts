// ================= FINANCIAL CALCULATIONS =================

import type { LineItem } from "./types";

export interface TotalBreakdown {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
}

/**
 * Calculate subtotal from line items.
 */
export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.rate, 0);
}

/**
 * Calculate full breakdown with optional discount and tax.
 */
export function calculateTotals(
  items: LineItem[],
  taxRate: number = 0,
  discountPercent: number = 0
): TotalBreakdown {
  const subtotal = calculateSubtotal(items);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + taxAmount;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
  };
}

/**
 * Simple total for line items without tax/discount (used in quote builder).
 */
export function calculateSimpleTotal(items: { qty: number; rate: number }[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.rate, 0);
}

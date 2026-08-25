"use client";

import React, { useState, useCallback } from "react";
import type { DebtorReminder, ReminderTone, Settings } from "@/lib/types";
import { generateReminderMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { draftReminder } from "@/lib/ai";
import AiButton from "@/components/shared/AiButton";

interface PaymentReminderFormProps {
  reminder: DebtorReminder;
  setReminder: (r: DebtorReminder) => void;
  settings: Settings;
  showToast: (msg: string, type?: "info" | "success" | "warning" | "error") => void;
}

const TONES: { id: ReminderTone; label: string; emoji: string }[] = [
  { id: "gentle", label: "Friendly Reminder", emoji: "🟢" },
  { id: "due", label: "Due Today", emoji: "🟡" },
  { id: "overdue", label: "Overdue / Firm", emoji: "🔴" },
];

export default function PaymentReminderForm({ reminder, setReminder, settings, showToast }: PaymentReminderFormProps) {
  // AI draft state
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [customContext, setCustomContext] = useState("");

  const update = (field: keyof DebtorReminder, value: string) => {
    setReminder({ ...reminder, [field]: value });
    // Clear AI message when user changes fields so they can re-draft
    if (aiMessage) setAiMessage(null);
  };

  // Standard template message (existing behavior)
  const templateMessage = generateReminderMessage(
    reminder,
    settings.currency || "R",
    settings.bank_name || "",
    settings.account_number || "",
    reminder.invNo
  );

  // Use AI message if available, otherwise use template
  const message = aiMessage || templateMessage;

  // Calculate days overdue
  const daysOverdue = reminder.dueDate
    ? Math.max(0, Math.floor((Date.now() - new Date(reminder.dueDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // ——— AI: Draft a context-aware reminder ———
  const handleAiDraft = useCallback(async () => {
    if (!reminder.name && !reminder.amount) {
      showToast("Fill in client name and amount first.", "warning");
      return;
    }

    setAiLoading(true);
    const res = await draftReminder({
      clientName: reminder.name,
      amount: reminder.amount,
      currency: settings.currency || "R",
      invoiceNumber: reminder.invNo,
      dueDate: reminder.dueDate,
      daysOverdue,
      tone: reminder.tone,
      bankName: settings.bank_name,
      accountNumber: settings.account_number,
      branchCode: settings.branch_code,
      customContext: customContext || undefined,
    });

    if (res.result) {
      setAiMessage(res.result);
      showToast("✨ AI draft generated — review before sending.", "success");
    } else {
      showToast(res.error || "AI drafting failed. Using template instead.", "warning");
    }

    setAiLoading(false);
  }, [reminder, settings, daysOverdue, customContext, showToast]);

  const handleClearAiDraft = () => {
    setAiMessage(null);
  };

  const handleSend = () => {
    const url = buildWhatsAppUrl(reminder.phone, message);
    window.open(url, "_blank");
    showToast("💬 WhatsApp reminder link opened!", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Payment Reminders</h1>
        <p className="text-slate-500 text-sm mt-1">Send professional, tone-adjusted WhatsApp payment reminders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="ops-card-padded space-y-5">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <i className="fa-solid fa-clock text-amber-500" /> Reminder Builder
          </div>

          <div>
            <label className="ops-label">Client Name</label>
            <input type="text" value={reminder.name} onChange={(e) => update("name", e.target.value)} className="ops-input" placeholder="e.g. Avuyile Enterprises" />
          </div>
          <div>
            <label className="ops-label">Client WhatsApp Number</label>
            <input type="text" value={reminder.phone} onChange={(e) => update("phone", e.target.value)} className="ops-input" placeholder="e.g. 27719876543" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="ops-label">Amount Owed ({settings.currency})</label>
              <input type="text" value={reminder.amount} onChange={(e) => update("amount", e.target.value)} className="ops-input font-mono" placeholder="1285.00" />
            </div>
            <div>
              <label className="ops-label">Invoice Number</label>
              <input type="text" value={reminder.invNo} onChange={(e) => update("invNo", e.target.value)} className="ops-input font-mono" placeholder="INV-1001" />
            </div>
          </div>
          <div>
            <label className="ops-label">Original Due Date</label>
            <input type="date" value={reminder.dueDate} onChange={(e) => update("dueDate", e.target.value)} className="ops-input" />
          </div>

          {/* Tone Selector */}
          <div>
            <label className="ops-label">Message Tone</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {TONES.map((t) => {
                const isActive = reminder.tone === t.id;
                const activeClass = isActive
                  ? t.id === "gentle" ? "active-gentle" : t.id === "due" ? "active-due" : "active-overdue"
                  : "";
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update("tone", t.id)}
                    className={`ops-tone-pill ${activeClass}`}
                  >
                    {t.emoji} {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Draft Section */}
          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="ops-label mb-0">AI Custom Draft (Optional)</label>
              <AiButton
                onClick={handleAiDraft}
                loading={aiLoading}
                label="AI Draft"
                title="Generate a context-aware message using AI"
              />
            </div>
            <input
              type="text"
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              className="ops-input !text-xs"
              placeholder="e.g. Client made 50% deposit, offer split payment for balance..."
            />
            <p className="text-[10px] text-slate-400">
              Optional: Add extra context for the AI to craft a more specific message.
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="ops-card-padded space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <i className="fa-brands fa-whatsapp text-whatsapp" /> Live WhatsApp Preview
            </div>
            {aiMessage && (
              <button
                type="button"
                onClick={handleClearAiDraft}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-medium flex items-center gap-1 transition-colors"
                title="Revert to template message"
              >
                <i className="fa-solid fa-arrow-rotate-left text-[9px]" /> Use Template
              </button>
            )}
          </div>

          {aiMessage && (
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5">
              <i className="fa-solid fa-wand-magic-sparkles text-[9px]" /> AI-generated draft — review before sending
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="ops-wa-bubble">{message}</div>
            <div className="text-right text-xs text-slate-400 mt-2 font-mono">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓
            </div>
          </div>

          <button onClick={handleSend} className="ops-btn-whatsapp w-full !py-3">
            <i className="fa-brands fa-whatsapp text-lg" /> Send Reminder on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

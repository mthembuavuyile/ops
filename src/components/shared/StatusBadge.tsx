"use client";

import React from "react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<string, string> = {
  draft: "ops-badge-draft",
  sent: "ops-badge-sent",
  accepted: "ops-badge-accepted",
  declined: "ops-badge-declined",
  paid: "ops-badge-paid",
  unpaid: "ops-badge-unpaid",
  overdue: "ops-badge-overdue",
  credit: "ops-badge-credit",
  Credit: "ops-badge-credit",
  Paid: "ops-badge-paid",
  Quote: "ops-badge-quote",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cls = STATUS_MAP[status] || "ops-badge-draft";
  return <span className={`ops-badge ${cls}`}>{status}</span>;
}

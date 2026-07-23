// ================= CSV EXPORT =================

import type { HistoryRecord } from "./types";

/**
 * Export history records to a CSV file download.
 */
export function exportHistoryToCsv(records: HistoryRecord[]): void {
  if (records.length === 0) {
    alert("No data to export.");
    return;
  }

  let csv = "Doc Number,Client Name,Phone,Total,Date,Due Date,Status\n";
  records.forEach((r) => {
    csv += `"${r.docNumber}","${r.clientName}","${r.clientPhone}","${r.total}","${r.date}","${r.dueDate}","${r.status}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", `vylex_ops_export_${Date.now()}.csv`);
  a.click();
  window.URL.revokeObjectURL(url);
}

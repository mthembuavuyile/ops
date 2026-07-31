"use client";

import React, { useState, useEffect } from "react";
import type { Settings } from "@/lib/types";

interface SettingsFormProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onCancel: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (jsonStr: string) => void;
}

export default function SettingsForm({
  settings,
  onSave,
  onCancel,
  onExportBackup,
  onImportBackup,
}: SettingsFormProps) {
  const [form, setForm] = useState<Settings>({
    company_name: settings?.company_name || "",
    contact_name: settings?.contact_name || "",
    email: settings?.email || "",
    phone: settings?.phone || "",
    website: settings?.website || "",
    company_address: settings?.company_address || "",
    bank_name: settings?.bank_name || "",
    account_name: settings?.account_name || "",
    account_number: settings?.account_number || "",
    branch_code: settings?.branch_code || "",
    payshap_id: settings?.payshap_id || "",
    accent_color: settings?.accent_color || "#051b38",
    currency: settings?.currency || "R",
    show_verified_badge: settings?.show_verified_badge ?? true,
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) {
      setForm({
        company_name: settings?.company_name || "",
        contact_name: settings?.contact_name || "",
        email: settings?.email || "",
        phone: settings?.phone || "",
        website: settings?.website || "",
        company_address: settings?.company_address || "",
        bank_name: settings?.bank_name || "",
        account_name: settings?.account_name || "",
        account_number: settings?.account_number || "",
        branch_code: settings?.branch_code || "",
        payshap_id: settings?.payshap_id || "",
        accent_color: settings?.accent_color || "#051b38",
        currency: settings?.currency || "R",
        show_verified_badge: settings?.show_verified_badge ?? true,
      });
    }
  }, [settings, isDirty]);

  const update = (field: keyof Settings, value: string | boolean) => {
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDirty(false);
    onSave(form);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportBackup) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings & Branding</h1>
        <p className="text-slate-500 text-sm mt-1">Configure your business profile, banking details, verified badge, and data backups.</p>
      </div>

      <div className="ops-card-padded">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Profile */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              <i className="fa-solid fa-briefcase text-slate-300 mr-2" />Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="ops-label">Company / Trading Name *</label><input type="text" value={form.company_name || ""} onChange={(e) => update("company_name", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Contact Person *</label><input type="text" value={form.contact_name || ""} onChange={(e) => update("contact_name", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Contact Email *</label><input type="email" value={form.email || ""} onChange={(e) => update("email", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Phone Number *</label><input type="text" value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Website Domain</label><input type="text" value={form.website || ""} onChange={(e) => update("website", e.target.value)} className="ops-input" placeholder="e.g. vylex.co.za" /></div>
              <div><label className="ops-label">Physical Address</label><textarea value={form.company_address || ""} onChange={(e) => update("company_address", e.target.value)} className="ops-input" rows={2} /></div>
            </div>
          </div>

          {/* Banking */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              <i className="fa-solid fa-building-columns text-slate-300 mr-2" />Banking Details (EFT & PayShap)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className="ops-label">Bank Name</label><input type="text" value={form.bank_name || ""} onChange={(e) => update("bank_name", e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Account Holder</label><input type="text" value={form.account_name || ""} onChange={(e) => update("account_name", e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Account Number</label><input type="text" value={form.account_number || ""} onChange={(e) => update("account_number", e.target.value)} className="ops-input font-mono" /></div>
              <div><label className="ops-label">Branch Code</label><input type="text" value={form.branch_code || ""} onChange={(e) => update("branch_code", e.target.value)} className="ops-input font-mono" /></div>
              <div><label className="ops-label">PayShap ID / Cell</label><input type="text" value={form.payshap_id || ""} onChange={(e) => update("payshap_id", e.target.value)} className="ops-input" /></div>
            </div>
          </div>

          {/* Branding & Account Badges */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              <i className="fa-solid fa-palette text-slate-300 mr-2" />Branding & Account Badges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="ops-label">Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.accent_color || "#051b38"} onChange={(e) => update("accent_color", e.target.value)} className="h-10 w-20 border border-slate-200 rounded-lg cursor-pointer" />
                  <span className="text-xs text-slate-400 font-mono">{form.accent_color || "#051b38"}</span>
                </div>
              </div>
              <div>
                <label className="ops-label">Primary Currency</label>
                <select value={form.currency || "R"} onChange={(e) => update("currency", e.target.value)} className="ops-input">
                  <option value="R">R (ZAR - South African Rand)</option>
                  <option value="$">$ (USD - United States Dollar)</option>
                  <option value="£">£ (GBP - British Pound)</option>
                  <option value="€">€ (EUR - Euro)</option>
                </select>
              </div>

              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <i className="fa-solid fa-shield-check text-emerald-500" />
                    Display Verified Business Badge on Documents
                  </div>
                  <p className="text-xs text-slate-500">
                    Stamps PDF invoices and quotes with an official business authentication badge.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.show_verified_badge ?? true}
                    onChange={(e) => update("show_verified_badge", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Backup & Export Section */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
              <i className="fa-solid fa-database text-slate-400" /> Data Backup & Security
            </h3>
            <p className="text-xs text-slate-500 mb-4">Export a complete JSON backup of all your clients, quotes, invoices, and settings or restore from a file.</p>
            
            <div className="flex flex-wrap gap-3">
              {onExportBackup && (
                <button
                  type="button"
                  onClick={onExportBackup}
                  className="ops-btn-secondary !text-xs flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-download" /> Export JSON Backup
                </button>
              )}
              {onImportBackup && (
                <label className="ops-btn-secondary !text-xs cursor-pointer flex items-center gap-1.5">
                  <i className="fa-solid fa-upload" /> Import JSON Backup
                  <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <button type="button" onClick={onCancel} className="ops-btn-secondary">Cancel</button>
            <button type="submit" className="ops-btn-primary !py-3">
              <i className="fa-solid fa-floppy-disk" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

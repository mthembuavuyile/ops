"use client";

import React, { useState, useEffect } from "react";
import type { Settings } from "@/lib/types";

interface SettingsFormProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onCancel: () => void;
}

export default function SettingsForm({ settings, onSave, onCancel }: SettingsFormProps) {
  const [form, setForm] = useState<Settings>({ ...settings });

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const update = (field: keyof Settings, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings & Branding</h1>
        <p className="text-slate-500 text-sm mt-1">Configure your business profile, banking details, and invoice template styles.</p>
      </div>

      <div className="ops-card-padded">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Profile */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              <i className="fa-solid fa-briefcase text-slate-300 mr-2" />Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><label className="ops-label">Company / Trading Name *</label><input type="text" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Contact Person *</label><input type="text" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Contact Email *</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Phone Number *</label><input type="text" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Website Domain</label><input type="text" value={form.website} onChange={(e) => update("website", e.target.value)} className="ops-input" placeholder="e.g. vylex.co.za" /></div>
              <div><label className="ops-label">Physical Address</label><textarea value={form.company_address} onChange={(e) => update("company_address", e.target.value)} className="ops-input" rows={2} /></div>
            </div>
          </div>

          {/* Banking */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              <i className="fa-solid fa-building-columns text-slate-300 mr-2" />Banking Details (EFT & PayShap)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className="ops-label">Bank Name</label><input type="text" value={form.bank_name} onChange={(e) => update("bank_name", e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Account Holder</label><input type="text" value={form.account_name} onChange={(e) => update("account_name", e.target.value)} className="ops-input" /></div>
              <div><label className="ops-label">Account Number</label><input type="text" value={form.account_number} onChange={(e) => update("account_number", e.target.value)} className="ops-input font-mono" /></div>
              <div><label className="ops-label">Branch Code</label><input type="text" value={form.branch_code} onChange={(e) => update("branch_code", e.target.value)} className="ops-input font-mono" /></div>
              <div><label className="ops-label">PayShap ID / Cell</label><input type="text" value={form.payshap_id} onChange={(e) => update("payshap_id", e.target.value)} className="ops-input" /></div>
            </div>
          </div>

          {/* Branding */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              <i className="fa-solid fa-palette text-slate-300 mr-2" />Branding & Customisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="ops-label">Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.accent_color} onChange={(e) => update("accent_color", e.target.value)} className="h-10 w-20 border border-slate-200 rounded-lg cursor-pointer" />
                  <span className="text-xs text-slate-400 font-mono">{form.accent_color}</span>
                </div>
              </div>
              <div>
                <label className="ops-label">Primary Currency</label>
                <select value={form.currency} onChange={(e) => update("currency", e.target.value)} className="ops-input">
                  <option value="R">R (ZAR - South African Rand)</option>
                  <option value="$">$ (USD - United States Dollar)</option>
                  <option value="£">£ (GBP - British Pound)</option>
                  <option value="€">€ (EUR - Euro)</option>
                </select>
              </div>
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

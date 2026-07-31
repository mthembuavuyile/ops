"use client";

import React, { useState, useEffect } from "react";
import type { Settings, BusinessAddress, BankAccount } from "@/lib/types";

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
    business_addresses: settings?.business_addresses || [],
    bank_name: settings?.bank_name || "",
    account_name: settings?.account_name || "",
    account_number: settings?.account_number || "",
    branch_code: settings?.branch_code || "",
    payshap_id: settings?.payshap_id || "",
    bank_accounts: settings?.bank_accounts || [],
    accent_color: settings?.accent_color || "#051b38",
    currency: settings?.currency || "R",
    show_verified_badge: settings?.show_verified_badge ?? true,
  });

  const [isDirty, setIsDirty] = useState(false);

  // Initialise lists from props if needed
  useEffect(() => {
    if (!isDirty) {
      const addresses = settings?.business_addresses?.length
        ? settings.business_addresses
        : settings?.company_address
        ? [{ id: "addr-1", label: "Primary Address", address: settings.company_address, is_default: true }]
        : [];
      
      const banks = settings?.bank_accounts?.length
        ? settings.bank_accounts
        : (settings?.bank_name || settings?.account_number)
        ? [{
            id: "bank-1",
            label: "Primary Bank Account",
            bank_name: settings.bank_name || "",
            account_name: settings.account_name || "",
            account_number: settings.account_number || "",
            branch_code: settings.branch_code || "",
            payshap_id: settings.payshap_id || "",
            is_default: true,
          }]
        : [];

      setForm({
        company_name: settings?.company_name || "",
        contact_name: settings?.contact_name || "",
        email: settings?.email || "",
        phone: settings?.phone || "",
        website: settings?.website || "",
        company_address: settings?.company_address || "",
        business_addresses: addresses,
        bank_name: settings?.bank_name || "",
        account_name: settings?.account_name || "",
        account_number: settings?.account_number || "",
        branch_code: settings?.branch_code || "",
        payshap_id: settings?.payshap_id || "",
        bank_accounts: banks,
        accent_color: settings?.accent_color || "#051b38",
        currency: settings?.currency || "R",
        show_verified_badge: settings?.show_verified_badge ?? true,
      });
    }
  }, [settings, isDirty]);

  const update = (field: keyof Settings, value: unknown) => {
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Address Handlers
  const addAddress = () => {
    setIsDirty(true);
    const newAddr: BusinessAddress = {
      id: `addr-${Date.now()}`,
      label: `Branch ${((form.business_addresses?.length || 0) + 1)}`,
      address: "",
      is_default: form.business_addresses?.length === 0,
    };
    const updated = [...(form.business_addresses || []), newAddr];
    setForm((prev) => ({ ...prev, business_addresses: updated }));
  };

  const updateAddress = (id: string, field: keyof BusinessAddress, val: string | boolean) => {
    setIsDirty(true);
    const updated = (form.business_addresses || []).map((a) => {
      if (a.id === id) {
        return { ...a, [field]: val };
      }
      return a;
    });
    setForm((prev) => {
      const def = updated.find((a) => a.is_default) || updated[0];
      return {
        ...prev,
        business_addresses: updated,
        company_address: def ? def.address : prev.company_address,
      };
    });
  };

  const setDefaultAddress = (id: string) => {
    setIsDirty(true);
    const updated = (form.business_addresses || []).map((a) => ({
      ...a,
      is_default: a.id === id,
    }));
    const target = updated.find((a) => a.id === id);
    setForm((prev) => ({
      ...prev,
      business_addresses: updated,
      company_address: target ? target.address : prev.company_address,
    }));
  };

  const removeAddress = (id: string) => {
    setIsDirty(true);
    const updated = (form.business_addresses || []).filter((a) => a.id !== id);
    setForm((prev) => ({
      ...prev,
      business_addresses: updated,
      company_address: updated.length > 0 ? updated[0].address : "",
    }));
  };

  // Bank Handlers
  const addBank = () => {
    setIsDirty(true);
    const newBank: BankAccount = {
      id: `bank-${Date.now()}`,
      label: `Account ${((form.bank_accounts?.length || 0) + 1)}`,
      bank_name: "",
      account_name: "",
      account_number: "",
      branch_code: "",
      payshap_id: "",
      is_default: form.bank_accounts?.length === 0,
    };
    const updated = [...(form.bank_accounts || []), newBank];
    setForm((prev) => ({ ...prev, bank_accounts: updated }));
  };

  const updateBank = (id: string, field: keyof BankAccount, val: string | boolean) => {
    setIsDirty(true);
    const updated = (form.bank_accounts || []).map((b) => {
      if (b.id === id) {
        return { ...b, [field]: val };
      }
      return b;
    });
    setForm((prev) => {
      const def = updated.find((b) => b.is_default) || updated[0];
      return {
        ...prev,
        bank_accounts: updated,
        bank_name: def ? def.bank_name : prev.bank_name,
        account_name: def ? def.account_name : prev.account_name,
        account_number: def ? def.account_number : prev.account_number,
        branch_code: def ? def.branch_code : prev.branch_code,
        payshap_id: def?.payshap_id || prev.payshap_id || "",
      };
    });
  };

  const setDefaultBank = (id: string) => {
    setIsDirty(true);
    const updated = (form.bank_accounts || []).map((b) => ({
      ...b,
      is_default: b.id === id,
    }));
    const target = updated.find((b) => b.id === id);
    setForm((prev) => ({
      ...prev,
      bank_accounts: updated,
      bank_name: target ? target.bank_name : prev.bank_name,
      account_name: target ? target.account_name : prev.account_name,
      account_number: target ? target.account_number : prev.account_number,
      branch_code: target ? target.branch_code : prev.branch_code,
      payshap_id: target?.payshap_id || prev.payshap_id || "",
    }));
  };

  const removeBank = (id: string) => {
    setIsDirty(true);
    const updated = (form.bank_accounts || []).filter((b) => b.id !== id);
    setForm((prev) => ({
      ...prev,
      bank_accounts: updated,
    }));
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
        <p className="text-slate-500 text-sm mt-1">Configure your business profile, multiple addresses, saved bank accounts, and data backups.</p>
      </div>

      <div className="ops-card-padded">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Profile */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              <i className="fa-solid fa-briefcase text-slate-300 mr-2" />Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div><label className="ops-label">Company / Trading Name *</label><input type="text" value={form.company_name || ""} onChange={(e) => update("company_name", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Contact Person *</label><input type="text" value={form.contact_name || ""} onChange={(e) => update("contact_name", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Contact Email *</label><input type="email" value={form.email || ""} onChange={(e) => update("email", e.target.value)} className="ops-input" required /></div>
              <div><label className="ops-label">Phone Number *</label><input type="text" value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} className="ops-input" required /></div>
              <div className="md:col-span-2"><label className="ops-label">Website Domain</label><input type="text" value={form.website || ""} onChange={(e) => update("website", e.target.value)} className="ops-input" placeholder="e.g. vylex.co.za" /></div>
            </div>

            {/* Saved Business Addresses */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="ops-label mb-0 text-slate-800">Saved Business Addresses</label>
                  <p className="text-xs text-slate-500">Save multiple office locations or addresses to easily pick on invoices.</p>
                </div>
                <button type="button" onClick={addAddress} className="ops-btn-secondary !py-1.5 !px-3 !text-xs">
                  <i className="fa-solid fa-plus mr-1" /> Add Address
                </button>
              </div>

              {(form.business_addresses || []).length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-500">
                  No saved addresses. Click &quot;Add Address&quot; above to create your first saved location.
                </div>
              ) : (
                <div className="space-y-3">
                  {(form.business_addresses || []).map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative p-4 rounded-2xl transition-all space-y-3 ${
                        addr.is_default
                          ? "bg-emerald-50/40 border-2 border-emerald-400 shadow-sm"
                          : "bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${addr.is_default ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <input
                            type="text"
                            value={addr.label}
                            onChange={(e) => updateAddress(addr.id, "label", e.target.value)}
                            placeholder="Address Label (e.g. Midrand HQ)"
                            className="ops-input !py-1.5 !px-2.5 !text-xs font-bold text-slate-900 flex-1 max-w-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {addr.is_default ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs tracking-wide">
                              <i className="fa-solid fa-star text-amber-300 text-[10px]" />
                              Primary Default
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDefaultAddress(addr.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
                            >
                              <i className="fa-regular fa-star text-slate-400 text-[10px]" />
                              Set Default
                            </button>
                          )}

                          {(form.business_addresses || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAddress(addr.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                              title="Remove Address"
                            >
                              <i className="fa-solid fa-trash-can text-xs" />
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        value={addr.address}
                        onChange={(e) => updateAddress(addr.id, "address", e.target.value)}
                        placeholder="e.g. 082 Vodacom Boulevard, Vodavalley, Midrand, 1685, South Africa"
                        className="ops-input !text-xs"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Banking */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
              <span>
                <i className="fa-solid fa-building-columns text-slate-300 mr-2" />
                Banking Details & Accounts
              </span>
              <button type="button" onClick={addBank} className="ops-btn-secondary !py-1.5 !px-3 !text-xs">
                <i className="fa-solid fa-plus mr-1" /> Add Bank Account
              </button>
            </h3>

            {(form.bank_accounts || []).length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-500">
                No bank accounts saved. Click &quot;Add Bank Account&quot; above to add your primary or secondary accounts.
              </div>
            ) : (
              <div className="space-y-4">
                {(form.bank_accounts || []).map((bank) => (
                  <div
                    key={bank.id}
                    className={`relative p-4 rounded-2xl transition-all space-y-3 ${
                      bank.is_default
                        ? "bg-emerald-50/40 border-2 border-emerald-400 shadow-sm"
                        : "bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-2 flex-1">
                        <i className="fa-solid fa-building-columns text-emerald-600 text-xs shrink-0" />
                        <input
                          type="text"
                          value={bank.label}
                          onChange={(e) => updateBank(bank.id, "label", e.target.value)}
                          placeholder="Account Label (e.g. FNB Main Cheque, Capitec Savings)"
                          className="ops-input !py-1.5 !px-2.5 !text-xs font-bold text-slate-900 flex-1 max-w-xs"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {bank.is_default ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs tracking-wide">
                            <i className="fa-solid fa-star text-amber-300 text-[10px]" />
                            Default Account
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDefaultBank(bank.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
                          >
                            <i className="fa-regular fa-star text-slate-400 text-[10px]" />
                            Set Default
                          </button>
                        )}

                        {(form.bank_accounts || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBank(bank.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                            title="Remove Account"
                          >
                            <i className="fa-solid fa-trash-can text-xs" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="ops-label !text-[10px]">Bank Name</label>
                        <input
                          type="text"
                          value={bank.bank_name}
                          onChange={(e) => updateBank(bank.id, "bank_name", e.target.value)}
                          className="ops-input !text-xs"
                          placeholder="e.g. FNB / Capitec"
                        />
                      </div>
                      <div>
                        <label className="ops-label !text-[10px]">Account Holder</label>
                        <input
                          type="text"
                          value={bank.account_name}
                          onChange={(e) => updateBank(bank.id, "account_name", e.target.value)}
                          className="ops-input !text-xs"
                          placeholder="Company or Personal Name"
                        />
                      </div>
                      <div>
                        <label className="ops-label !text-[10px]">Account Number</label>
                        <input
                          type="text"
                          value={bank.account_number}
                          onChange={(e) => updateBank(bank.id, "account_number", e.target.value)}
                          className="ops-input !text-xs font-mono"
                          placeholder="62000000000"
                        />
                      </div>
                      <div>
                        <label className="ops-label !text-[10px]">Branch Code</label>
                        <input
                          type="text"
                          value={bank.branch_code}
                          onChange={(e) => updateBank(bank.id, "branch_code", e.target.value)}
                          className="ops-input !text-xs font-mono"
                          placeholder="250655"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="ops-label !text-[10px]">PayShap ID / Cell Number</label>
                        <input
                          type="text"
                          value={bank.payshap_id || ""}
                          onChange={(e) => updateBank(bank.id, "payshap_id", e.target.value)}
                          className="ops-input !text-xs"
                          placeholder="e.g. 0820000000@payshap"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

"use client";

import React, { useState } from "react";
import type { Client } from "@/lib/types";

interface ClientManagerProps {
  clients: Client[];
  onSaveClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export default function ClientManager({ clients, onSaveClient, onDeleteClient }: ClientManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenNew = () => {
    setEditingId(null);
    setName("");
    setPrefix("");
    setEmail("");
    setContactName("");
    setPhone("");
    setAddress("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setEditingId(c.id);
    setName(c.name);
    setPrefix(c.prefix);
    setEmail(c.email);
    setContactName(c.contact_name);
    setPhone(c.phone);
    setAddress(c.address);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      id: editingId || `c-${Date.now()}`,
      name,
      prefix,
      email,
      contact_name: contactName,
      phone,
      address,
    };
    onSaveClient(client);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Clients</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your business clients and billing profiles.</p>
        </div>
        <button onClick={handleOpenNew} className="ops-btn-primary">
          <i className="fa-solid fa-plus" /> New Client
        </button>
      </div>

      <div className="ops-card">
        <div className="overflow-x-auto">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Prefix</th>
                <th>Contact Person</th>
                <th>Email & Phone</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-slate-400 py-8">No clients found. Add one to get started.</td></tr>
              ) : (
                clients.map((c) => (
                  <tr key={c.id}>
                    <td className="font-bold text-slate-900">{c.name}</td>
                    <td>
                      <span className="text-xs bg-amber-50 text-amber-700 font-mono font-bold px-2 py-0.5 rounded border border-amber-200/60">
                        {c.prefix}
                      </span>
                    </td>
                    <td className="text-slate-700">{c.contact_name}</td>
                    <td className="text-slate-500 text-xs font-mono">
                      {c.email}<br />
                      {c.phone}
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEdit(c)} className="ops-btn-secondary !py-1 !px-2 !text-xs !rounded-md" title="Edit Client">
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button onClick={() => onDeleteClient(c.id)} className="ops-btn-danger !py-1 !px-2 !text-xs !rounded-md" title="Delete Client">
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">
                {editingId ? "Edit Client" : "New Client"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-xmark text-xl" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="client-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="ops-label">Business / Company Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="ops-input" required placeholder="e.g. Acme Corp" />
                  </div>
                  <div>
                    <label className="ops-label">Billing Prefix *</label>
                    <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} className="ops-input font-mono uppercase" required placeholder="e.g. ACM" maxLength={5} />
                  </div>
                  <div>
                    <label className="ops-label">Contact Person *</label>
                    <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="ops-input" required placeholder="e.g. Jane Doe" />
                  </div>
                  <div>
                    <label className="ops-label">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ops-input" placeholder="jane@acme.com" />
                  </div>
                  <div>
                    <label className="ops-label">Phone Number</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="ops-input" placeholder="+27 82 000 0000" />
                  </div>
                  <div className="col-span-2">
                    <label className="ops-label">Physical Address</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="ops-input" rows={2} placeholder="123 Example Street" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="ops-btn-secondary">Cancel</button>
              <button type="submit" form="client-form" className="ops-btn-primary">
                <i className="fa-solid fa-floppy-disk" /> Save Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

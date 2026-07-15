"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// ================= TYPES & TYPESCRIPT INTERFACES =================
interface Client {
  id: string;
  name: string;
  prefix: string;
  email: string;
  contact_name: string;
  phone: string;
  address: string;
}

interface LineItem {
  description: string;
  qty: number;
  rate: number;
  details?: string[];
}

interface Quote {
  id: string;
  client_id: string;
  quote_number: string;
  status: "draft" | "sent" | "accepted" | "declined";
  issued_at: string;
  expires_at: string;
  line_items: LineItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
}

interface Invoice {
  id: string;
  client_id: string;
  quote_id: string | null;
  invoice_number: string;
  status: "unpaid" | "paid" | "overdue" | "cancelled";
  issued_at: string;
  due_at: string;
  line_items: LineItem[];
  subtotal: number;
  vat: number;
  total: number;
  notes: string;
  paid_at?: string | null;
}

interface Settings {
  company_name: string;
  company_address: string;
  contact_name: string;
  phone: string;
  email: string;
  website: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch_code: string;
  payshap_id: string;
  accent_color: string;
  currency: string;
}

// ================= INITIAL SEED DATA =================
const DEFAULT_CLIENTS: Client[] = [
  { id: "c-1", name: "Makhaswa Holdings", prefix: "MH", email: "lucas@makhaswa.co.za", contact_name: "Lucas (Owner)", phone: "+27 64 878 4287", address: "12 Marine Drive, Durban, 4001" },
  { id: "c-2", name: "Luxury Shutters & Blinds", prefix: "LSB", email: "info@luxuryshuttersandblinds.co.za", contact_name: "Sicelo Meyiwa (Owner)", phone: "+27 71 926 8316", address: "42 Bank Terrace, Westridge, Durban, 4091" },
  { id: "c-3", name: "Tokyo Creative Studio", prefix: "TC", email: "hello@tokyocreative.co.za", contact_name: "Kenji Tokyo (Director)", phone: "+27 83 222 1111", address: "44 Sandton Drive, Sandton, Johannesburg, 2196" }
];

const DEFAULT_QUOTES: Quote[] = [
  {
    id: "q-1",
    client_id: "c-3",
    quote_number: "Q-2026-001",
    status: "draft",
    issued_at: "2026-07-10",
    expires_at: "2026-07-24",
    line_items: [
      { 
        description: "Homepage UI/UX Redesign - Tokyo Creative Portal", 
        qty: 1, 
        rate: 9500.00,
        details: [
          "Modernised interface using Inter typography & custom grid layouts",
          "Centralised, dynamic banner management",
          "Dynamic filter engine for creative portfolio projects",
          "SEO preserved via metadata & clean semantic HTML"
        ]
      }
    ],
    subtotal: 9500.00,
    vat: 0,
    total: 9500.00,
    notes: "Requires assets to be delivered by Tokyo team."
  },
  {
    id: "q-2",
    client_id: "c-2",
    quote_number: "Q-2026-002",
    status: "accepted",
    issued_at: "2026-07-11",
    expires_at: "2026-07-25",
    line_items: [
      { 
        description: "Website V2 Redesign & Code Architecture Refactoring", 
        qty: 1, 
        rate: 800.00,
        details: [
          "Modernised site using Montserrat typography and custom grid layouts",
          "Centralised, dynamic header/footer component loading",
          "Dynamic product engine with category filtering and image lightbox",
          "SEO preserved via canonical URLs, schema markup, and custom metadata"
        ]
      }
    ],
    subtotal: 800.00,
    vat: 0,
    total: 800.00,
    notes: "Enhancements for print-ready invoice layouts."
  },
  {
    id: "q-3",
    client_id: "c-1",
    quote_number: "Q-2026-003",
    status: "sent",
    issued_at: "2026-07-15",
    expires_at: "2026-07-29",
    line_items: [
      { 
        description: "Update gallery page & optimize construction project images", 
        qty: 1, 
        rate: 1500.00,
        details: [
          "Optimized 50+ high-res portfolio images for fast web delivery",
          "Integrated smooth lightbox viewer gallery component"
        ]
      },
      { 
        description: "Develop custom operational team portal login", 
        qty: 1, 
        rate: 12000.00,
        details: [
          "Secure single-tenant auth gate with role-based access",
          "Connected database schemas for real-time client records"
        ]
      }
    ],
    subtotal: 13500.00,
    vat: 0,
    total: 13500.00,
    notes: "Direct integration with client's live staging portal."
  }
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    client_id: "c-2",
    quote_id: "q-2",
    invoice_number: "LSB-2026-001",
    status: "paid",
    issued_at: "2026-07-11",
    due_at: "2026-07-18",
    line_items: [
      { 
        description: "Website V2 Redesign & Code Architecture Refactoring", 
        qty: 1, 
        rate: 800.00,
        details: [
          "Modernised site using Montserrat typography and custom grid layouts",
          "Centralised, dynamic header/footer component loading",
          "Dynamic product engine with category filtering and image lightbox",
          "SEO preserved via canonical URLs, schema markup, and custom metadata"
        ]
      }
    ],
    subtotal: 800.00,
    vat: 0,
    total: 800.00,
    notes: "Settled via EFT on 2026-07-12.",
    paid_at: "2026-07-12"
  },
  {
    id: "inv-2",
    client_id: "c-1",
    quote_id: null,
    invoice_number: "MH-2026-001",
    status: "unpaid",
    issued_at: "2026-07-01",
    due_at: "2026-07-15",
    line_items: [
      { 
        description: "Emergency server repair & DNS routing recovery", 
        qty: 1, 
        rate: 8500.00,
        details: [
          "Investigated core VM failure on cloud hosting platform",
          "Restored standard database backups and verified schema integrity",
          "Reconfigured Cloudflare proxy routing for fast SSL recovery"
        ]
      }
    ],
    subtotal: 8500.00,
    vat: 0,
    total: 8500.00,
    notes: "Overdue support intervention.",
    paid_at: null
  }
];

const DEFAULT_SETTINGS: Settings = {
  company_name: "Vylex",
  company_address: "Durban, South Africa",
  contact_name: "Avuyile Mthembu",
  phone: "+27 64 878 4287",
  email: "info@vylex.co.za",
  website: "vylex.co.za",
  bank_name: "Standard Bank",
  account_name: "Vylex",
  account_number: "1017 126 3314",
  branch_code: "7654",
  payshap_id: "064 878 4287",
  accent_color: "#051b38",
  currency: "R"
};

export default function Home() {
  const router = useRouter();

  // ================= STATE HOOKS =================
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState<boolean>(true);

  // Core Data Lists
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  
  // Navigation / Simulator Helpers
  const [activeClientSimQuoteId, setActiveClientSimQuoteId] = useState<string>("q-3");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  // Form State: Quote Builder
  const [builderClientId, setBuilderClientId] = useState<string>("c-1");
  const [builderExpiryDays, setBuilderExpiryDays] = useState<number>(14);
  const [builderNotes, setBuilderNotes] = useState<string>("");
  const [builderRows, setBuilderRows] = useState<Array<{ description: string; qty: number; rate: number }>>([
    { description: "", qty: 1, rate: 0 }
  ]);

  // Form State: Quick Invoice Maker (Standalone to match old prototype)
  const [makerCompany, setMakerCompany] = useState<string>("Vylex");
  const [makerAddress, setMakerAddress] = useState<string>("Gauteng, 2000\nSouth Africa");
  const [makerClient, setMakerClient] = useState<string>("Avuyile Mthembu");
  const [makerClientAddress, setMakerClientAddress] = useState<string>("456 Client Avenue\nDurban, KZN, 4001");
  const [makerInvNumber, setMakerInvNumber] = useState<string>("INV-2026-001");
  const [makerDate, setMakerDate] = useState<string>("2026-07-15");
  const [makerDueDate, setMakerDueDate] = useState<string>("2026-07-29");
  const [makerBank, setMakerBank] = useState<string>("Standard Bank");
  const [makerAccount, setMakerAccount] = useState<string>("Vylex");
  const [makerAccountNumber, setMakerAccountNumber] = useState<string>("1017 126 3314");
  const [makerBranch, setMakerBranch] = useState<string>("7654");
  const [makerAccentColor, setMakerAccentColor] = useState<string>("#051b38");
  const [makerCurrency, setMakerCurrency] = useState<string>("R");
  const [makerRows, setMakerRows] = useState<Array<{ description: string; rate: number }>>([
    { description: "Mobile App Development (Android)", rate: 6500 }
  ]);

  // Form State: Settings
  const [settingsForm, setSettingsForm] = useState<Settings>(DEFAULT_SETTINGS);

  // Simulation Digital Signature States
  const [simSignedName, setSimSignedName] = useState<string>("");
  const [simSignedCheckbox, setSimSignedCheckbox] = useState<boolean>(false);

  // Form State: Create Client
  const [showBuilderAddClientModal, setShowBuilderAddClientModal] = useState<boolean>(false);
  const [showAddClientForm, setShowAddClientForm] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState<string>("");
  const [newClientPrefix, setNewClientPrefix] = useState<string>("");
  const [newClientEmail, setNewClientEmail] = useState<string>("");
  const [newClientContactName, setNewClientContactName] = useState<string>("");
  const [newClientPhone, setNewClientPhone] = useState<string>("");
  const [newClientAddress, setNewClientAddress] = useState<string>("");

  // ================= LOAD / SYNC DATA & AUTH CHECK =================
  useEffect(() => {
    checkUserSessionAndLoad();
  }, []);

  const checkUserSessionAndLoad = async () => {
    setLoadingSession(true);
    let userHasSession = false;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSession(data.session);
          userHasSession = true;
        }
      } catch (err) {
        console.error("Auth session fetch error", err);
      }
    } else {
      const mockSessionStr = localStorage.getItem("vylex_mock_session");
      if (mockSessionStr) {
        const mockObj = JSON.parse(mockSessionStr);
        setSession(mockObj);
        userHasSession = true;
      }
    }

    if (!userHasSession) {
      router.push("/login");
      return;
    }

    loadBillingData();
    setLoadingSession(false);
  };

  const loadBillingData = async () => {
    let finalSettings = DEFAULT_SETTINGS;
    const localSettings = localStorage.getItem("vylex_ops_settings");
    if (localSettings) {
      finalSettings = JSON.parse(localSettings);
      setSettings(finalSettings);
      setSettingsForm(finalSettings);
      document.documentElement.style.setProperty('--doc-accent-color', finalSettings.accent_color);
    } else {
      localStorage.setItem("vylex_ops_settings", JSON.stringify(DEFAULT_SETTINGS));
      setSettings(DEFAULT_SETTINGS);
      setSettingsForm(DEFAULT_SETTINGS);
      document.documentElement.style.setProperty('--doc-accent-color', DEFAULT_SETTINGS.accent_color);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: clientsDB } = await supabase.from("clients").select("*");
        const { data: quotesDB } = await supabase.from("quotes").select("*");
        const { data: invoicesDB } = await supabase.from("invoices").select("*");

        if (clientsDB) setClients(clientsDB);
        if (quotesDB) setQuotes(quotesDB);
        if (invoicesDB) setInvoices(invoicesDB);
      } catch (err) {
        console.error("Supabase data loading failed, using defaults", err);
      }
    } else {
      const localClients = localStorage.getItem("vylex_ops_clients");
      const localQuotes = localStorage.getItem("vylex_ops_quotes");
      const localInvoices = localStorage.getItem("vylex_ops_invoices");

      if (localClients && localQuotes && localInvoices) {
        setClients(JSON.parse(localClients));
        setQuotes(JSON.parse(localQuotes));
        setInvoices(JSON.parse(localInvoices));
      } else {
        localStorage.setItem("vylex_ops_clients", JSON.stringify(DEFAULT_CLIENTS));
        localStorage.setItem("vylex_ops_quotes", JSON.stringify(DEFAULT_QUOTES));
        localStorage.setItem("vylex_ops_invoices", JSON.stringify(DEFAULT_INVOICES));
        setClients(DEFAULT_CLIENTS);
        setQuotes(DEFAULT_QUOTES);
        setInvoices(DEFAULT_INVOICES);
      }
    }
  };

  const syncState = (updatedClients: Client[], updatedQuotes: Quote[], updatedInvoices: Invoice[]) => {
    localStorage.setItem("vylex_ops_clients", JSON.stringify(updatedClients));
    localStorage.setItem("vylex_ops_quotes", JSON.stringify(updatedQuotes));
    localStorage.setItem("vylex_ops_invoices", JSON.stringify(updatedInvoices));
    setClients(updatedClients);
    setQuotes(updatedQuotes);
    setInvoices(updatedInvoices);
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("vylex_mock_session");
    }
    router.push("/login");
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  // Dynamic builderClientId Selector Effect
  useEffect(() => {
    if (clients.length > 0) {
      const clientExists = clients.some(c => c.id === builderClientId);
      if (!clientExists) {
        setBuilderClientId(clients[0].id);
      }
    } else {
      setBuilderClientId("");
    }
  }, [clients, builderClientId]);

  // Client Management Handlers
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      showToast("Client name is required.");
      return;
    }

    // Generate prefix automatically if empty
    let prefix = newClientPrefix.trim().toUpperCase();
    if (!prefix) {
      prefix = newClientName
        .split(" ")
        .map(word => word[0])
        .filter(char => /[a-zA-Z]/.test(char))
        .join("")
        .substring(0, 3)
        .toUpperCase();
    }
    if (!prefix) prefix = "CLI";

    const newClientObj = {
      name: newClientName.trim(),
      prefix,
      email: newClientEmail.trim(),
      contact_name: newClientContactName.trim(),
      phone: newClientPhone.trim(),
      address: newClientAddress.trim(),
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("clients")
          .insert(newClientObj)
          .select();

        if (error) throw error;
        showToast(`Created client "${newClientObj.name}" in database.`);
        
        if (data && data[0]) {
          const insertedClient = data[0];
          setClients(prev => [...prev, insertedClient]);
          if (showBuilderAddClientModal) {
            setBuilderClientId(insertedClient.id);
          }
        }
        loadBillingData();
      } catch (err: any) {
        console.error(err);
        showToast(`Database error: ${err.message || "Failed to create client"}`);
      }
    } else {
      const mockClient: Client = {
        id: `c-${Date.now()}`,
        ...newClientObj
      };
      const updatedClients = [...clients, mockClient];
      syncState(updatedClients, quotes, invoices);
      showToast(`Created client "${newClientObj.name}" locally.`);
      if (showBuilderAddClientModal) {
        setBuilderClientId(mockClient.id);
      }
    }

    // Reset Form
    setNewClientName("");
    setNewClientPrefix("");
    setNewClientEmail("");
    setNewClientContactName("");
    setNewClientPhone("");
    setNewClientAddress("");
    setShowAddClientForm(false);
    setShowBuilderAddClientModal(false);
  };

  const handleDeleteClient = async (clientId: string) => {
    // Check if client has active quotes or invoices associated
    const hasQuotes = quotes.some(q => q.client_id === clientId);
    const hasInvoices = invoices.some(i => i.client_id === clientId);
    if (hasQuotes || hasInvoices) {
      showToast("Cannot delete client with active quotes or invoices.");
      return;
    }

    const clientToDelete = clients.find(c => c.id === clientId);
    if (!clientToDelete) return;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("clients")
          .delete()
          .eq("id", clientId);

        if (error) throw error;
        showToast(`Deleted client "${clientToDelete.name}" from database.`);
        loadBillingData();
      } catch (err: any) {
        console.error(err);
        showToast(`Database error: ${err.message || "Failed to delete client"}`);
      }
    } else {
      const updatedClients = clients.filter(c => c.id !== clientId);
      syncState(updatedClients, quotes, invoices);
      showToast(`Deleted client "${clientToDelete.name}" locally.`);
    }
  };

  // Reset Prototype
  const resetPrototypeData = () => {
    localStorage.removeItem("vylex_ops_clients");
    localStorage.removeItem("vylex_ops_quotes");
    localStorage.removeItem("vylex_ops_invoices");
    localStorage.removeItem("vylex_ops_settings");
    
    setClients(DEFAULT_CLIENTS);
    setQuotes(DEFAULT_QUOTES);
    setInvoices(DEFAULT_INVOICES);
    setSettings(DEFAULT_SETTINGS);
    setSettingsForm(DEFAULT_SETTINGS);
    document.documentElement.style.setProperty('--doc-accent-color', DEFAULT_SETTINGS.accent_color);
    setBuilderRows([{ description: "", qty: 1, rate: 0 }]);
    setBuilderNotes("");
    
    showToast("Prototype state reset to defaults.");
    setActiveView("dashboard");
  };

  // ================= CALCULATED STATS =================
  const todayStr = "2026-07-15"; // Simulated context date

  let collectedZar = 0;
  let pendingZar = 0;
  let overdueZar = 0;
  let activeQuotesCount = 0;

  let collectedCount = 0;
  let pendingCount = 0;
  let overdueCount = 0;

  invoices.forEach(inv => {
    if (inv.status === "paid") {
      collectedZar += inv.total;
      collectedCount++;
    } else if (inv.status === "unpaid") {
      pendingZar += inv.total;
      pendingCount++;
      if (inv.due_at < todayStr) {
        overdueZar += inv.total;
        overdueCount++;
      }
    }
  });

  quotes.forEach(q => {
    if (q.status === "sent") {
      activeQuotesCount++;
    }
  });

  const formatZAR = (amount: number) => {
    return `${settings.currency} ${amount.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIdx = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${day} ${months[monthIdx]} ${year}`;
  };

  // ================= DATA MUTATIONS =================

  const handleMarkPaid = async (invId: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("invoices")
          .update({ status: "paid", paid_at: todayStr })
          .eq("id", invId);
        showToast("Invoice status updated to Paid in database.");
        loadBillingData();
      } catch (err) {
        console.error(err);
      }
    } else {
      const updated = invoices.map(inv => {
        if (inv.id === invId) {
          return { ...inv, status: "paid" as const, paid_at: todayStr };
        }
        return inv;
      });
      syncState(clients, quotes, updated);
      showToast("Invoice marked paid.");
    }
  };

  const handleAddBuilderRow = () => {
    setBuilderRows([...builderRows, { description: "", qty: 1, rate: 0 }]);
  };

  const handleRemoveBuilderRow = (index: number) => {
    if (builderRows.length === 1) return;
    setBuilderRows(builderRows.filter((_, idx) => idx !== index));
  };

  const handleBuilderRowChange = (index: number, field: string, value: any) => {
    const updated = builderRows.map((row, idx) => {
      if (idx === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setBuilderRows(updated);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let subtotal = 0;
    const items = builderRows.map(row => {
      subtotal += row.qty * row.rate;
      return {
        description: row.description || "Custom Scope",
        qty: row.qty,
        rate: row.rate,
        details: []
      };
    });

    const nextIndex = quotes.length + 1;
    const quoteNum = `Q-2026-${String(nextIndex).padStart(3, "0")}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + builderExpiryDays);
    const expiresStr = expiryDate.toISOString().split("T")[0];

    const newQuoteObj = {
      client_id: builderClientId,
      quote_number: quoteNum,
      status: "sent" as const,
      issued_at: todayStr,
      expires_at: expiresStr,
      line_items: items,
      subtotal: subtotal,
      vat: 0,
      total: subtotal,
      notes: builderNotes
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("quotes").insert(newQuoteObj);
        showToast(`Created Quote ${quoteNum} in database.`);
        loadBillingData();
      } catch (err) {
        console.error(err);
      }
    } else {
      const fullQuote: Quote = {
        id: `q-${Date.now()}`,
        ...newQuoteObj
      };
      const updatedQuotes = [...quotes, fullQuote];
      syncState(clients, updatedQuotes, invoices);
      showToast(`Created Quote ${quoteNum} locally.`);

      // Auto-navigate to client simulator with the new quote pre-selected
      setActiveClientSimQuoteId(fullQuote.id);
      setSimSignedName("");
      setSimSignedCheckbox(false);
    }

    setBuilderRows([{ description: "", qty: 1, rate: 0 }]);
    setBuilderNotes("");
    setActiveView("client");
  };

  const convertQuoteToInvoice = async (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const client = clients.find(c => c.id === quote.client_id);
    const clientPrefix = client ? client.prefix : "INV";
    const nextIndex = invoices.length + 1;
    const invNum = `${clientPrefix}-2026-${String(nextIndex).padStart(3, "0")}`;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("quotes").update({ status: "accepted" }).eq("id", quoteId);
        await supabase.from("invoices").insert({
          client_id: quote.client_id,
          quote_id: quote.id,
          invoice_number: invNum,
          status: "unpaid",
          issued_at: todayStr,
          due_at: "2026-07-29",
          line_items: quote.line_items,
          subtotal: quote.subtotal,
          vat: quote.vat,
          total: quote.total,
          notes: quote.notes || "Converted from quote."
        });

        showToast(`Converted to Invoice ${invNum} in database.`);
        loadBillingData();
      } catch (err) {
        console.error(err);
      }
    } else {
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        client_id: quote.client_id,
        quote_id: quote.id,
        invoice_number: invNum,
        status: "unpaid",
        issued_at: todayStr,
        due_at: "2026-07-29",
        line_items: quote.line_items,
        subtotal: quote.subtotal,
        vat: quote.vat,
        total: quote.total,
        notes: quote.notes || "Converted from quote.",
        paid_at: null
      };

      const updatedQuotes = quotes.map(q => {
        if (q.id === quoteId) return { ...q, status: "accepted" as const };
        return q;
      });

      syncState(clients, updatedQuotes, [...invoices, newInvoice]);
      showToast(`Converted Quote to Invoice ${invNum} locally.`);
    }
  };

  // WhatsApp Link Dispatch
  const triggerWhatsAppShare = (type: "quote" | "invoice", id: string) => {
    let docNum = "";
    let clientName = "";
    let totalAmt = 0;
    let clientPhone = "";

    if (type === "quote") {
      const quote = quotes.find(q => q.id === id);
      if (!quote) return;
      const client = clients.find(c => c.id === quote.client_id) || { name: "Client", phone: "", contact_name: "" };
      docNum = quote.quote_number;
      clientName = client.contact_name || client.name;
      totalAmt = quote.total;
      clientPhone = client.phone;
    } else {
      const inv = invoices.find(i => i.id === id);
      if (!inv) return;
      const client = clients.find(c => c.id === inv.client_id) || { name: "Client", phone: "", contact_name: "" };
      docNum = inv.invoice_number;
      clientName = client.contact_name || client.name;
      totalAmt = inv.total;
      clientPhone = client.phone;
    }

    const formattedAmount = `${settings.currency} ${totalAmt.toFixed(2)}`;
    const portalUrl = `https://ops.vylex.co.za/portal/${type}/${docNum.replace(/[^a-zA-Z0-9-]/g, "")}`;
    const textMsg = `Hi ${clientName},\n\nHere is the link to review your ${type} ${docNum} (${formattedAmount}) from ${settings.company_name}:\n\n${portalUrl}\n\nKind regards,\n${settings.company_name}`;
    const waUrl = `https://wa.me/${clientPhone.replace(/[^\d+]/g, "")}?text=${encodeURIComponent(textMsg)}`;
    
    window.open(waUrl, "_blank");
    showToast(`Generated WhatsApp share link for ${docNum}`);
  };

  // Client Simulation: Accept and Sign Proposal
  const handleClientAcceptQuote = () => {
    if (!simSignedCheckbox || !simSignedName.trim()) {
      showToast("Complete signature terms to approve.");
      return;
    }

    const quoteId = activeClientSimQuoteId;
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    const client = clients.find(c => c.id === quote.client_id);
    const clientPrefix = client ? client.prefix : "INV";
    const nextIndex = invoices.length + 1;
    const invNum = `${clientPrefix}-2026-${String(nextIndex).padStart(3, "0")}`;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      client_id: quote.client_id,
      quote_id: quote.id,
      invoice_number: invNum,
      status: "unpaid",
      issued_at: todayStr,
      due_at: "2026-07-29",
      line_items: quote.line_items,
      subtotal: quote.subtotal,
      vat: quote.vat,
      total: quote.total,
      notes: `Signed by ${simSignedName} on client workspace.`,
      paid_at: null
    };

    const updatedQuotes = quotes.map(q => {
      if (q.id === quoteId) return { ...q, status: "accepted" as const };
      return q;
    });

    syncState(clients, updatedQuotes, [...invoices, newInvoice]);
    showToast(`Proposal accepted. Invoice ${invNum} compiled. PDF download initiated.`);
    
    setSimSignedName("");
    setSimSignedCheckbox(false);

    // Auto-generate and download PDF after the state renders (matching old prototype behavior)
    setTimeout(() => {
      generateOpsPdf();
    }, 1200);
  };

  // Client Simulation: Decline Proposal
  const handleClientDeclineQuote = async () => {
    const quoteId = activeClientSimQuoteId;
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    if (quote.status === "accepted") {
      showToast("This quote has already been accepted.");
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("quotes")
          .update({ status: "declined" })
          .eq("id", quoteId);
        showToast("Quote status updated to DECLINED.");
        loadBillingData();
      } catch (err) {
        console.error(err);
        showToast("Failed to decline proposal.");
      }
    } else {
      const updatedQuotes = quotes.map(q => {
        if (q.id === quoteId) return { ...q, status: "declined" as const };
        return q;
      });
      syncState(clients, updatedQuotes, invoices);
      showToast("Quote status updated to DECLINED.");
    }
  };

  // Client Simulation: Re-open Proposal
  const handleClientReopenQuote = async () => {
    const quoteId = activeClientSimQuoteId;
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("quotes")
          .update({ status: "sent" })
          .eq("id", quoteId);
        showToast("Quote status updated to SENT.");
        loadBillingData();
      } catch (err) {
        console.error(err);
        showToast("Failed to re-open proposal.");
      }
    } else {
      const updatedQuotes = quotes.map(q => {
        if (q.id === quoteId) return { ...q, status: "sent" as const };
        return q;
      });
      syncState(clients, updatedQuotes, invoices);
      showToast("Quote status updated to SENT.");
    }
  };

  // Generate High-Fidelity PDF for Client simulator card
  const generateOpsPdf = async () => {
    const el = document.getElementById("client-invoice-card");
    if (!el) return;

    showToast("Generating PDF... Please wait.");
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      // Temporarily hide elements with 'print-hide' class for the PDF capture
      const hiddenElements = el.querySelectorAll(".print-hide") as NodeListOf<HTMLElement>;
      hiddenElements.forEach(element => {
        element.style.display = "none";
      });

      // We need to wait for a tick so the display:none is applied before html2canvas runs
      setTimeout(() => {
        html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
          .then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const w = 210;
            const h = (canvas.height * w) / canvas.width;
            
            // Use dynamic height to prevent content cutoff if it exceeds A4 height (297mm)
            const pdf = new jsPDF("p", "mm", [w, Math.max(297, h)]);
            pdf.addImage(imgData, "PNG", 0, 0, w, h);
            
            // Determine file name from document number
            const quote = quotes.find(q => q.id === activeClientSimQuoteId);
            const invoice = invoices.find(inv => inv.quote_id === activeClientSimQuoteId);
            const isAccepted = quote ? quote.status === "accepted" : false;
            const docNumStr = quote 
              ? (isAccepted && invoice ? invoice.invoice_number : quote.quote_number)
              : "document";

            pdf.save(`${docNumStr}.pdf`);
            
            // Restore hidden elements
            hiddenElements.forEach(element => {
              element.style.display = "";
            });
            showToast(`PDF generated successfully for ${docNumStr}.`);
          })
          .catch(err => {
            console.error("PDF generation failed:", err);
            showToast("Failed to generate PDF.");
            hiddenElements.forEach(element => {
              element.style.display = "";
            });
          });
      }, 100);
    } catch (err) {
      console.error("Failed to load PDF libraries dynamically:", err);
      showToast("Failed to generate PDF.");
    }
  };

  // Generate High-Fidelity PDF for Standalone Quick Invoice Maker
  const generateMakerPdf = async () => {
    const el = document.getElementById("maker-print-template");
    if (!el) return;

    showToast("Generating PDF... Please wait.");
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      // Temporarily hide elements with 'print-hide' class for the PDF capture
      const hiddenElements = el.querySelectorAll(".print-hide") as NodeListOf<HTMLElement>;
      hiddenElements.forEach(element => {
        element.style.display = "none";
      });

      setTimeout(() => {
        html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" })
          .then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const w = 210;
            const h = (canvas.height * w) / canvas.width;
            
            const pdf = new jsPDF("p", "mm", [w, Math.max(297, h)]);
            pdf.addImage(imgData, "PNG", 0, 0, w, h);
            
            const fileNum = makerInvNumber || "Invoice";
            pdf.save(`${fileNum}.pdf`);
            
            hiddenElements.forEach(element => {
              element.style.display = "";
            });
            showToast(`PDF generated successfully for ${fileNum}.`);
          })
          .catch(err => {
            console.error("PDF generation failed:", err);
            showToast("Failed to generate PDF.");
            hiddenElements.forEach(element => {
              element.style.display = "";
            });
          });
      }, 100);
    } catch (err) {
      console.error("Failed to load PDF libraries dynamically:", err);
      showToast("Failed to generate PDF.");
    }
  };

  // Quick Standalone Invoice Maker actions
  const handleAddMakerRow = () => {
    setMakerRows([...makerRows, { description: "", rate: 0 }]);
  };

  const handleRemoveMakerRow = (index: number) => {
    if (makerRows.length === 1) return;
    setMakerRows(makerRows.filter((_, idx) => idx !== index));
  };

  const handleMakerRowChange = (index: number, field: string, value: any) => {
    const updated = makerRows.map((row, idx) => {
      if (idx === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setMakerRows(updated);
  };

  const getMakerTotalsVal = () => {
    let subtotal = 0;
    makerRows.forEach(row => {
      subtotal += row.rate;
    });
    return { subtotal, total: subtotal };
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center font-sans text-slate-400">
        <div className="text-center space-y-2">
          <i className="fa-solid fa-spinner animate-spin text-2xl text-amber-500"></i>
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row md:overflow-hidden bg-ui-lightGray text-ui-darkSlate font-sans">
      
      {/* ================= TOAST BANNER (Flat, Sharp, Editorial) ================= */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 p-4 font-mono font-bold text-xs transition-all duration-300 text-center uppercase tracking-wider border-b ${
          toastVisible 
            ? "translate-y-0 opacity-100 bg-brand-navy text-[#FAF9F5] border-slate-700" 
            : "-translate-y-full opacity-0 pointer-events-none bg-brand-navy text-[#FAF9F5] border-slate-700"
        }`}
      >
        <span>{toastMsg}</span>
      </div>

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden flex items-center justify-between bg-brand-navy p-4 border-b border-brand-lightNavy shrink-0">
        <span className="text-xl font-bold tracking-widest text-[#FAF9F5]">
          VYLEX <span className="text-brand-orange">OPS</span>
        </span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-ui-lightSlate text-2xl focus:outline-none px-2 py-1">
          <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* ================= MOBILE OVERLAY ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR / NAVIGATION (Sharp, Natural Slate/Charcoal) ================= */}
      <aside className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64 bg-brand-navy text-ui-lightSlate flex flex-col justify-between shrink-0 border-r border-brand-lightNavy rounded-none ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div>
          {/* Header */}
          <div className="p-6 flex items-center justify-between border-b border-brand-lightNavy rounded-none">
            <span className="text-xl font-bold tracking-widest text-[#FAF9F5]">
              VYLEX <span className="text-brand-orange">OPS</span>
            </span>
            <span className="border border-[#4A483E] text-[#FAF9F5] text-[9px] uppercase font-mono font-bold px-2.5 py-0.5 rounded-none">
              SAAS L2
            </span>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1">
            <div className="text-[#6E6C5F] text-[9px] uppercase font-mono font-bold tracking-wider px-3 mb-2 pt-2">
              Studio Workspace
            </div>
            
            <button 
              onClick={() => { setActiveView("dashboard"); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 rounded-none ${
                activeView === "dashboard" 
                  ? "bg-brand-lightNavy text-[#FAF9F5] border-l-2 border-brand-orange" 
                  : "hover:bg-brand-lightNavy hover:text-[#FAF9F5]"
              }`}
            >
              <i className="fa-solid fa-chart-line w-4 text-center"></i>
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => { setActiveView("billing"); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 rounded-none ${
                activeView === "billing" 
                  ? "bg-brand-lightNavy text-[#FAF9F5] border-l-2 border-brand-orange" 
                  : "hover:bg-brand-lightNavy hover:text-[#FAF9F5]"
              }`}
            >
              <i className="fa-solid fa-file-invoice-dollar w-4 text-center"></i>
              <span>Quotes & Invoices</span>
            </button>

            <button 
              onClick={() => { setActiveView("builder"); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 rounded-none ${
                activeView === "builder" 
                  ? "bg-brand-lightNavy text-[#FAF9F5] border-l-2 border-brand-orange" 
                  : "hover:bg-brand-lightNavy hover:text-[#FAF9F5]"
              }`}
            >
              <i className="fa-solid fa-file-signature w-4 text-center"></i>
              <span>Create a Quote</span>
            </button>

            <button 
              onClick={() => { setActiveView("invoice-maker"); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 rounded-none ${
                activeView === "invoice-maker" 
                  ? "bg-brand-lightNavy text-[#FAF9F5] border-l-2 border-brand-orange" 
                  : "hover:bg-brand-lightNavy hover:text-[#FAF9F5]"
              }`}
            >
              <i className="fa-solid fa-file-invoice w-4 text-center"></i>
              <span>Invoice Maker</span>
            </button>

            <button 
              onClick={() => { setActiveView("settings"); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-150 rounded-none ${
                activeView === "settings" 
                  ? "bg-brand-lightNavy text-[#FAF9F5] border-l-2 border-brand-orange" 
                  : "hover:bg-brand-lightNavy hover:text-[#FAF9F5]"
              }`}
            >
              <i className="fa-solid fa-gears w-4 text-center"></i>
              <span>Settings</span>
            </button>

            <div className="text-[#6E6C5F] text-[9px] uppercase font-mono font-bold tracking-wider px-3 mb-2 pt-6">
              Simulation Sandbox
            </div>

            <button 
              onClick={() => { setActiveView("client"); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-3.5 text-xs font-mono font-bold uppercase tracking-wider bg-brand-lightNavy text-amber-400 border border-dashed border-amber-500/20 hover:bg-[#38362E] rounded-none"
            >
              <i className="fa-solid fa-link w-4 text-center"></i>
              <span>Client Portal Link</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-brand-lightNavy bg-[#171613] space-y-3 rounded-none">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-none"></div>
              <span className="text-[#8E8C82]">{settings.contact_name.split(" ")[0]}</span>
            </div>
            <button 
              onClick={resetPrototypeData} 
              className="text-[#6E6C5F] hover:text-amber-400 transition-colors flex items-center gap-1 font-bold"
              title="Reset Sandbox Data"
            >
              Reset
            </button>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full bg-brand-lightNavy hover:bg-rose-950/20 hover:text-rose-400 border border-[#3C3A33] py-2 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-full">
        
        {/* ================= VIEW 1: ADMIN DASHBOARD ================= */}
        {activeView === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-b border-ui-lightSlate pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#111111] uppercase font-sans">Operations Dashboard</h1>
                <p className="text-[#6E6C5F] text-xs font-medium mt-1">Real-time tracking of B2B payment schedules.</p>
              </div>
              <button 
                onClick={() => { setActiveView("builder"); setIsMobileMenuOpen(false); }} 
                className="bg-[#111111] hover:bg-[#252525] text-white text-xs font-mono font-bold uppercase tracking-wider px-5 py-3 rounded-none transition-all shadow-none flex items-center gap-2"
              >
                New Quote
              </button>
            </div>

            {/* Database Banner */}
            {isSupabaseConfigured ? (
              <div className="border border-sky-200 bg-sky-50 text-sky-900 text-xs font-mono px-4 py-3 rounded-none flex items-center gap-2">
                <span>Active Server Connection: PostgreSQL Database Enabled.</span>
              </div>
            ) : (
              <div className="border border-ui-lightSlate bg-ui-white text-ui-darkGray text-xs font-mono px-4 py-3 rounded-none flex items-center gap-2">
                <span>Local Sandbox Mode Active (Local Storage database). Complete `.env.local` to go live.</span>
              </div>
            )}

            {/* Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-ui-lightSlate p-6 rounded-none shadow-none hover:border-[#BEBDAD] transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6C5F]">Pending Collection</span>
                <div className="text-2xl font-bold text-[#111111] mt-2 font-mono">{formatZAR(pendingZar)}</div>
                <p className="text-[#8E8C82] text-[10px] font-mono mt-1">{pendingCount} unpaid invoices</p>
              </div>

              <div className="bg-white border border-ui-lightSlate p-6 rounded-none shadow-none hover:border-rose-400 transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6C5F]">Overdue Balances</span>
                <div className="text-2xl font-bold text-rose-600 mt-2 font-mono">{formatZAR(overdueZar)}</div>
                <p className="text-rose-500/80 text-[10px] font-mono mt-1">{overdueCount} accounts past due</p>
              </div>

              <div className="bg-white border border-ui-lightSlate p-6 rounded-none shadow-none hover:border-emerald-400 transition-all">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6C5F]">Collected (MTD)</span>
                <div className="text-2xl font-bold text-emerald-700 mt-2 font-mono">{formatZAR(collectedZar)}</div>
                <p className="text-emerald-600/80 text-[10px] font-mono mt-1">{collectedCount} accounts settled</p>
              </div>

              <div className="bg-brand-navy border border-brand-lightNavy p-6 rounded-none shadow-none text-white">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8C82]">Active Proposals</span>
                <div className="text-2xl font-bold text-sky-400 mt-2 font-mono">{activeQuotesCount}</div>
                <p className="text-slate-400 text-[10px] font-mono mt-1">Awaiting client signature</p>
              </div>
            </div>

            {/* Tables Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="bg-white border border-ui-lightSlate rounded-none shadow-none overflow-hidden lg:col-span-2">
                <div className="p-5 border-b border-ui-lightSlate flex justify-between items-center bg-ui-lightGray">
                  <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Invoices Awaiting Collection</h3>
                  <span className="text-[9px] border border-amber-300 bg-amber-50 text-amber-800 font-mono font-bold px-2 py-0.5 rounded-none uppercase tracking-wider">
                    Attention
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-ui-lightSlate text-[9px] text-[#6E6C5F] font-mono font-bold uppercase tracking-wider bg-ui-lightGray/50">
                        <th className="p-4">Invoice #</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4 text-right">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE9E2] font-medium text-slate-700">
                      {invoices.filter(inv => inv.status === "unpaid").length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[#8E8C82] text-xs font-mono">
                            No active invoices outstanding. Ledger reconciled.
                          </td>
                        </tr>
                      ) : (
                        invoices.filter(inv => inv.status === "unpaid").map(inv => {
                          const client = clients.find(c => c.id === inv.client_id);
                          const isOverdue = inv.due_at < todayStr;
                          return (
                            <tr key={inv.id} className="hover:bg-ui-lightGray/40 transition-colors">
                              <td className="p-4 font-mono font-bold text-[#111111]">{inv.invoice_number}</td>
                              <td className="p-4 text-slate-900 font-semibold">{client ? client.name : "Unknown"}</td>
                              <td className="p-4 font-mono text-slate-500">{formatDateLabel(inv.due_at)}</td>
                              <td className="p-4 text-right font-mono font-bold text-[#111111]">{formatZAR(inv.total)}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-mono font-bold uppercase rounded-none ${
                                  isOverdue 
                                    ? "bg-rose-50 text-rose-800 border-rose-200" 
                                    : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}>
                                  {isOverdue ? "Overdue" : "Unpaid"}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <button 
                                  onClick={() => handleMarkPaid(inv.id)}
                                  className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-none transition-colors"
                                >
                                  Mark Settled
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-ui-lightSlate rounded-none p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-[#FAF9F5] pb-2">
                    <div>
                      <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">Client Accounts</h3>
                      <p className="text-[#8E8C82] text-[10px] font-mono mt-1">Manage profiles for quoting & invoicing.</p>
                    </div>
                    <button
                      onClick={() => setShowAddClientForm(!showAddClientForm)}
                      className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black hover:bg-[#222222] text-white px-2.5 py-1.5 rounded-none transition-colors"
                    >
                      {showAddClientForm ? "Cancel" : "+ Add Client"}
                    </button>
                  </div>

                  {showAddClientForm && (
                    <form onSubmit={handleCreateClient} className="mt-4 p-4 border border-ui-lightSlate bg-ui-lightGray/60 space-y-3 animate-fadeIn">
                      <h4 className="font-bold text-[#111111] text-[10px] font-mono uppercase tracking-wider border-b border-ui-lightSlate pb-1.5">
                        New Client Profile
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Client Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Acme Corp" 
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            className="w-full bg-white border border-ui-lightSlate p-2 text-xs focus:outline-none focus:border-black font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Invoice Prefix</label>
                          <input 
                            type="text" 
                            placeholder="e.g. AC (Auto if blank)" 
                            value={newClientPrefix}
                            onChange={(e) => setNewClientPrefix(e.target.value)}
                            className="w-full bg-white border border-ui-lightSlate p-2 text-xs focus:outline-none focus:border-black font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Contact Person</label>
                          <input 
                            type="text" 
                            placeholder="e.g. John Doe" 
                            value={newClientContactName}
                            onChange={(e) => setNewClientContactName(e.target.value)}
                            className="w-full bg-white border border-ui-lightSlate p-2 text-xs focus:outline-none focus:border-black font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="e.g. john@acme.com" 
                            value={newClientEmail}
                            onChange={(e) => setNewClientEmail(e.target.value)}
                            className="w-full bg-white border border-ui-lightSlate p-2 text-xs focus:outline-none focus:border-black font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Phone Number</label>
                        <input 
                          type="text" 
                          placeholder="e.g. +27 82 123 4567" 
                          value={newClientPhone}
                          onChange={(e) => setNewClientPhone(e.target.value)}
                          className="w-full bg-white border border-ui-lightSlate p-2 text-xs focus:outline-none focus:border-black font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Physical/Billing Address</label>
                        <textarea 
                          rows={2}
                          placeholder="e.g. 123 Main Rd, Cape Town, 8001" 
                          value={newClientAddress}
                          onChange={(e) => setNewClientAddress(e.target.value)}
                          className="w-full bg-white border border-ui-lightSlate p-2 text-xs focus:outline-none focus:border-black resize-none font-semibold"
                        />
                      </div>

                      <div className="pt-1">
                        <button 
                          type="submit"
                          className="w-full bg-[#111111] hover:bg-black text-white text-[9px] font-mono font-bold uppercase tracking-wider py-2 transition-colors rounded-none"
                        >
                          Save Client
                        </button>
                      </div>
                    </form>
                  )}
                  
                  <div className="mt-5 space-y-4">
                    {clients.map(client => (
                      <div key={client.id} className="p-4 rounded-none border border-ui-lightSlate bg-ui-lightGray/30 hover:bg-ui-lightGray/60 transition-all duration-150">
                        <div className="flex justify-between items-baseline">
                          <h4 className="font-bold text-[#111111] text-xs uppercase tracking-wide">{client.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                              Prefix: {client.prefix}
                            </span>
                            {/* Check if deletable (no quotes or invoices associated) */}
                            {(!quotes.some(q => q.client_id === client.id) && !invoices.some(i => i.client_id === client.id)) && (
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                title="Delete client"
                                className="text-slate-400 hover:text-red-600 transition-colors text-[10px] ml-1 p-0.5"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="text-[11px] text-[#6E6C5F] mt-2 space-y-1 font-mono">
                          {client.contact_name && <div><span className="text-slate-400">Contact:</span> {client.contact_name}</div>}
                          <div><span className="text-slate-400">Mail:</span> {client.email}</div>
                          {client.phone && <div><span className="text-slate-400">Phone:</span> {client.phone}</div>}
                          {client.address && <div className="text-[10px] text-slate-400 truncate" title={client.address}>{client.address}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= VIEW 2: BILLING MANAGER ================= */}
        {activeView === "billing" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-ui-lightSlate pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#111111] uppercase">Billing Ledger</h1>
              <p className="text-[#6E6C5F] text-xs font-medium mt-1">Audit status of proposal pipelines and tax entries.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white border border-ui-lightSlate rounded-none shadow-none overflow-hidden">
                <div className="p-5 border-b border-ui-lightSlate bg-ui-lightGray">
                  <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-file-lines text-slate-400"></i>
                    <span>Proposal Log</span>
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-ui-lightSlate text-[9px] text-[#6E6C5F] font-mono font-bold uppercase tracking-wider bg-ui-lightGray/50">
                        <th className="p-4">Quote #</th>
                        <th className="p-4">Client</th>
                        <th className="p-4 text-right">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE9E2] font-medium text-slate-700">
                      {quotes.map(q => {
                        const client = clients.find(c => c.id === q.client_id);
                        return (
                          <tr key={q.id} className="hover:bg-ui-lightGray/30 transition-colors">
                            <td className="p-4 font-mono font-bold text-[#111111]">{q.quote_number}</td>
                            <td className="p-4 font-semibold text-slate-900">{client ? client.name : "Unknown"}</td>
                            <td className="p-4 text-right font-mono font-bold text-[#111111]">{formatZAR(q.total)}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[9px] font-mono font-bold uppercase rounded-none ${
                                q.status === "accepted" 
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                  : q.status === "sent"
                                  ? "bg-sky-50 text-sky-800 border-sky-200"
                                  : q.status === "declined"
                                  ? "bg-rose-50 text-rose-800 border-rose-200"
                                  : "bg-slate-100 text-slate-700 border-slate-300"
                              }`}>
                                {q.status}
                              </span>
                            </td>
                            <td className="p-4 text-center space-x-2">
                              {q.status === "sent" && (
                                <button 
                                  onClick={() => convertQuoteToInvoice(q.id)}
                                  className="text-[10px] font-mono font-bold uppercase bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-1 transition-colors"
                                >
                                  Convert
                                </button>
                              )}
                              <button 
                                onClick={() => triggerWhatsAppShare("quote", q.id)}
                                className="text-[10px] font-mono font-bold uppercase bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 px-2 py-1 transition-colors"
                                title="Share via WhatsApp"
                              >
                                <i className="fa-brands fa-whatsapp text-sm"></i>
                              </button>
                              <button 
                                onClick={() => { setActiveClientSimQuoteId(q.id); setActiveView("client"); }}
                                className="text-[10px] font-mono font-bold uppercase bg-white hover:bg-slate-100 text-slate-700 border border-ui-lightSlate px-2 py-1 transition-colors"
                              >
                                Simulate
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-ui-lightSlate rounded-none shadow-none overflow-hidden">
                <div className="p-5 border-b border-ui-lightSlate bg-ui-lightGray">
                  <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider flex items-center gap-2">
                    <i className="fa-solid fa-file-invoice text-slate-400"></i>
                    <span>Tax Invoices Log</span>
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-ui-lightSlate text-[9px] text-[#6E6C5F] font-mono font-bold uppercase tracking-wider bg-ui-lightGray/50">
                        <th className="p-4">Invoice #</th>
                        <th className="p-4">Client</th>
                        <th className="p-4 text-right">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAE9E2] font-medium text-slate-700">
                      {invoices.map(inv => {
                        const client = clients.find(c => c.id === inv.client_id);
                        return (
                          <tr key={inv.id} className="hover:bg-ui-lightGray/30 transition-colors">
                            <td className="p-4 font-mono font-bold text-[#111111]">{inv.invoice_number}</td>
                            <td className="p-4 font-semibold text-slate-900">{client ? client.name : "Unknown"}</td>
                            <td className="p-4 text-right font-mono font-bold text-[#111111]">{formatZAR(inv.total)}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[9px] font-mono font-bold uppercase rounded-none ${
                                inv.status === "paid" 
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="p-4 text-center space-x-2">
                              {inv.status === "unpaid" ? (
                                <>
                                  <button 
                                    onClick={() => handleMarkPaid(inv.id)}
                                    className="text-[10px] font-mono font-bold uppercase bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-1 transition-colors"
                                  >
                                    Paid
                                  </button>
                                  <button 
                                    onClick={() => triggerWhatsAppShare("invoice", inv.id)}
                                    className="text-[10px] font-mono font-bold uppercase bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 px-2 py-1 transition-colors"
                                    title="Share via WhatsApp"
                                  >
                                    <i className="fa-brands fa-whatsapp text-sm mr-1"></i>Send
                                  </button>
                                </>
                              ) : (
                                <span className="text-emerald-700 text-[10px] font-mono font-bold uppercase"><i className="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i>Settled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= VIEW 3: QUOTE BUILDER ================= */}
        {activeView === "builder" && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div className="border-b border-ui-lightSlate pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#111111] uppercase">Create a Quote</h1>
              <p className="text-[#6E6C5F] text-xs font-medium mt-1">Compile service scope list with live-calculating ledger rows.</p>
            </div>

            <div className="bg-white border border-ui-lightSlate p-6 md:p-8 rounded-none">
              <form onSubmit={handleQuoteSubmit} className="space-y-8">
                
                {/* Header Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between items-baseline mb-2">
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Select Client</label>
                      <button 
                        type="button"
                        onClick={() => setShowBuilderAddClientModal(true)}
                        className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 transition-colors font-bold"
                      >
                        + Add Client
                      </button>
                    </div>
                    <select 
                      value={builderClientId}
                      onChange={(e) => {
                        if (e.target.value === "new") {
                          setShowBuilderAddClientModal(true);
                        } else {
                          setBuilderClientId(e.target.value);
                        }
                      }}
                      className="w-full border border-ui-lightSlate bg-ui-lightGray/40 rounded-none p-3 text-xs font-mono font-bold focus:outline-none focus:border-black"
                      required
                    >
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      <option value="new" className="text-amber-600 font-bold">+ Add New Client...</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">Expiry Period</label>
                    <select 
                      value={builderExpiryDays}
                      onChange={(e) => setBuilderExpiryDays(parseInt(e.target.value))}
                      className="w-full border border-ui-lightSlate bg-ui-lightGray/40 rounded-none p-3 text-xs font-mono font-bold focus:outline-none focus:border-black"
                      required
                    >
                      <option value={7}>Valid for 7 Days</option>
                      <option value={14}>Valid for 14 Days</option>
                      <option value={30}>Valid for 30 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">Quote Number</label>
                    <div className="border border-ui-lightSlate bg-ui-lightGray text-slate-800 font-mono font-bold p-3 text-xs flex justify-between rounded-none">
                      <span>Q-2026-{String(quotes.length + 1).padStart(3, "0")}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">System generated</span>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-ui-lightSlate pb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6C5F]">Line Items</span>
                    <button 
                      type="button" 
                      onClick={handleAddBuilderRow}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#111111] hover:bg-[#252525] text-white px-3 py-2 rounded-none transition-colors"
                    >
                      Add Row
                    </button>
                  </div>

                  <div className="hidden md:grid grid-cols-12 gap-4 text-[9px] font-mono font-bold uppercase text-slate-400 px-2">
                    <div className="col-span-7">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Unit Rate ({settings.currency})</div>
                    <div className="col-span-1 text-center">Actions</div>
                  </div>

                  <div className="space-y-3">
                    {builderRows.map((row, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center bg-ui-lightGray/20 p-3 md:p-0 border md:border-0 border-ui-lightSlate rounded-none">
                        <div className="col-span-7">
                          <input 
                            type="text" 
                            placeholder="Item description / Service scope..."
                            value={row.description}
                            onChange={(e) => handleBuilderRowChange(index, "description", e.target.value)}
                            className="w-full border border-ui-lightSlate bg-white rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input 
                            type="number" 
                            min="1"
                            value={row.qty}
                            onChange={(e) => handleBuilderRowChange(index, "qty", parseInt(e.target.value) || 1)}
                            className="w-full border border-ui-lightSlate bg-white rounded-none p-3 text-xs text-center font-mono font-bold focus:outline-none"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <input 
                            type="number" 
                            min="0"
                            step="any"
                            placeholder="0.00"
                            value={row.rate || ""}
                            onChange={(e) => handleBuilderRowChange(index, "rate", parseFloat(e.target.value) || 0)}
                            className="w-full border border-ui-lightSlate bg-white rounded-none p-3 text-xs text-right font-mono font-bold focus:outline-none"
                            required
                          />
                        </div>
                        <div className="col-span-1 text-center">
                          <button 
                            type="button" 
                            onClick={() => handleRemoveBuilderRow(index)}
                            disabled={builderRows.length === 1}
                            className="text-slate-400 hover:text-rose-600 disabled:opacity-30 p-2"
                          >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtotals & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-ui-lightSlate">
                  <div className="md:col-span-8 space-y-2">
                    <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">Terms & Notes</label>
                    <textarea 
                      placeholder="Add custom notes..."
                      value={builderNotes}
                      onChange={(e) => setBuilderNotes(e.target.value)}
                      rows={3}
                      className="w-full border border-ui-lightSlate rounded-none p-3 text-xs focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="md:col-span-4 bg-ui-lightGray p-6 border border-ui-lightSlate space-y-3 font-medium rounded-none">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Subtotal:</span>
                      <span className="font-bold font-mono text-slate-700">
                        {settings.currency} {builderRows.reduce((a, b) => a + (b.qty * b.rate), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>VAT (VAT Exempt):</span>
                      <span className="font-bold font-mono text-slate-400">R 0.00</span>
                    </div>
                    <div className="flex justify-between border-t border-ui-lightSlate pt-3 text-sm text-slate-900 font-extrabold">
                      <span>Total Value:</span>
                      <span className="font-mono text-base text-slate-900">
                        {settings.currency} {builderRows.reduce((a, b) => a + (b.qty * b.rate), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-end">
                  <button 
                    type="button" 
                    onClick={() => { setActiveView("dashboard"); setIsMobileMenuOpen(false); }}
                    className="border border-ui-lightSlate hover:bg-ui-lightGray text-slate-700 font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-none transition text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#111111] hover:bg-[#252525] text-white font-mono font-bold uppercase tracking-wider px-8 py-3 rounded-none transition text-xs"
                  >
                    Publish Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: INVOICE MAKER (RE-DESIGNED TO MATCH PROTOTYPE) ================= */}
        {activeView === "invoice-maker" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="border-b border-ui-lightSlate pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#111111] uppercase">Quick Invoice Maker</h1>
              <p className="text-[#6E6C5F] text-xs font-medium mt-1">Generate a quick PDF invoice on-the-fly without saving to CRM database.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Input Editor (Exact fields from prototype layout) */}
              <div className="bg-white border border-ui-lightSlate p-6 rounded-none lg:col-span-5 space-y-6">
                
                {/* 1. Style & Brand */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-[#FAF9F5] pb-1">Style & Brand</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Accent Color</label>
                      <input 
                        type="color" 
                        value={makerAccentColor}
                        onChange={(e) => setMakerAccentColor(e.target.value)}
                        className="w-full h-10 border border-ui-lightSlate rounded-none cursor-pointer p-0.5 bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Currency</label>
                      <select 
                        value={makerCurrency}
                        onChange={(e) => setMakerCurrency(e.target.value)}
                        className="w-full border border-ui-lightSlate bg-ui-lightGray/40 rounded-none p-3 text-xs font-mono font-bold focus:outline-none"
                      >
                        <option value="R">R (ZAR)</option>
                        <option value="$">$ (USD)</option>
                        <option value="€">€ (EUR)</option>
                        <option value="£">£ (GBP)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Your Details */}
                <div className="space-y-4 border-t border-[#EAE9E2] pt-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1">Your Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Company / Name</label>
                      <input 
                        type="text" 
                        value={makerCompany}
                        onChange={(e) => setMakerCompany(e.target.value)}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Address</label>
                      <textarea 
                        value={makerAddress}
                        onChange={(e) => setMakerAddress(e.target.value)}
                        rows={2}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Client Details */}
                <div className="space-y-4 border-t border-[#EAE9E2] pt-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1">Client Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Client Name</label>
                      <input 
                        type="text" 
                        value={makerClient}
                        onChange={(e) => setMakerClient(e.target.value)}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Client Address</label>
                      <textarea 
                        value={makerClientAddress}
                        onChange={(e) => setMakerClientAddress(e.target.value)}
                        rows={2}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Invoice Details */}
                <div className="space-y-4 border-t border-[#EAE9E2] pt-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1">Invoice Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Invoice Number</label>
                      <input 
                        type="text" 
                        value={makerInvNumber}
                        onChange={(e) => setMakerInvNumber(e.target.value)}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Invoice Date</label>
                        <input 
                          type="date" 
                          value={makerDate}
                          onChange={(e) => setMakerDate(e.target.value)}
                          className="w-full border border-ui-lightSlate rounded-none p-2.5 text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5">Due Date</label>
                        <input 
                          type="date" 
                          value={makerDueDate}
                          onChange={(e) => setMakerDueDate(e.target.value)}
                          className="w-full border border-ui-lightSlate rounded-none p-2.5 text-xs font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Payment details */}
                <div className="space-y-4 border-t border-[#EAE9E2] pt-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 pb-1">Payment Instructions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      placeholder="Bank Name"
                      value={makerBank}
                      onChange={(e) => setMakerBank(e.target.value)}
                      className="w-full border border-ui-lightSlate rounded-none p-2.5 text-xs focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Account Name"
                      value={makerAccount}
                      onChange={(e) => setMakerAccount(e.target.value)}
                      className="w-full border border-ui-lightSlate rounded-none p-2.5 text-xs focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Account Number"
                      value={makerAccountNumber}
                      onChange={(e) => setMakerAccountNumber(e.target.value)}
                      className="w-full border border-ui-lightSlate rounded-none p-2.5 text-xs font-mono focus:outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Branch Code"
                      value={makerBranch}
                      onChange={(e) => setMakerBranch(e.target.value)}
                      className="w-full border border-ui-lightSlate rounded-none p-2.5 text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* 6. Line Items (Description and Rate only, matching prototype screenshots) */}
                <div className="space-y-4 border-t border-[#EAE9E2] pt-4">
                  <div className="flex justify-between items-center pb-2">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Line Items</h3>
                    <button 
                      type="button" 
                      onClick={handleAddMakerRow}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#111111] hover:bg-[#252525] text-white px-2 py-1 rounded-none transition-colors"
                    >
                      + Add Row
                    </button>
                  </div>

                  <div className="space-y-3">
                    {makerRows.map((row, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          placeholder="Description"
                          value={row.description}
                          onChange={(e) => handleMakerRowChange(idx, "description", e.target.value)}
                          className="flex-grow border border-ui-lightSlate rounded-none p-2.5 text-xs font-semibold focus:outline-none"
                        />
                        <input 
                          type="number" 
                          min="0"
                          placeholder="Amount"
                          value={row.rate || ""}
                          onChange={(e) => handleMakerRowChange(idx, "rate", parseFloat(e.target.value) || 0)}
                          className="w-28 border border-ui-lightSlate rounded-none p-2.5 text-xs text-right font-mono font-semibold focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveMakerRow(idx)}
                          disabled={makerRows.length === 1}
                          className="text-slate-300 hover:text-rose-600 disabled:opacity-20 p-2"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAE9E2] print-hide">
                  <button 
                    type="button" 
                    onClick={generateMakerPdf}
                    className="w-full bg-brand-orange hover:bg-[#B38E45] text-slate-955 text-xs font-mono font-bold uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 rounded-none transition"
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>Download PDF Invoice</span>
                  </button>
                </div>

              </div>

              {/* Dynamic Live Print Preview */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-brand-navy text-white rounded-none p-4 border border-brand-lightNavy print-hide">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">A4 Live Print Sheet</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.print()}
                      className="bg-brand-lightNavy hover:bg-[#3C3A33] border border-[#3C3A33] text-white text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-none flex items-center gap-1.5 shadow-none"
                    >
                      <i className="fa-solid fa-print"></i>
                      <span>Print Page</span>
                    </button>
                    <button 
                      onClick={generateMakerPdf}
                      className="bg-brand-orange hover:bg-[#B38E45] text-slate-950 text-xs font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-none flex items-center gap-1.5 shadow-none"
                    >
                      <i className="fa-solid fa-file-pdf"></i>
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                <div 
                  id="maker-print-template" 
                  className="bg-white border border-ui-lightSlate rounded-none p-8 md:p-12 shadow-none relative font-sans print:border-none print:shadow-none"
                  style={{ borderTop: `6px solid ${makerAccentColor}` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight uppercase font-sans">{makerCompany}</h2>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xs whitespace-pre-wrap">{makerAddress}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">TAX INVOICE</h3>
                      <span className="font-mono text-xs font-bold text-slate-400">{makerInvNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-12 border-t border-[#FAF9F5] pt-8">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Billed To:</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{makerClient}</h4>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed whitespace-pre-wrap">{makerClientAddress}</p>
                    </div>
                    <div className="text-right space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Invoice Date:</span>
                        <span className="font-bold text-slate-700">{formatDateLabel(makerDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Payment Due:</span>
                        <span className="font-bold text-slate-700">{formatDateLabel(makerDueDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full text-left mt-12 text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-mono font-bold uppercase tracking-wider pb-2">
                        <th className="py-2">Description</th>
                        <th className="py-2 text-right w-28">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {makerRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/10">
                          <td className="py-3 font-semibold text-slate-900">{row.description || "Custom Service"}</td>
                          <td className="py-3 text-right font-mono font-bold text-slate-900">{makerCurrency} {row.rate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
                    <div className="w-64 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal:</span>
                        <span className="font-bold text-slate-700">{makerCurrency} {getMakerTotalsVal().subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Tax (VAT Exempt):</span>
                        <span className="font-bold text-slate-400">0.00</span>
                      </div>
                      <div 
                        className="flex justify-between border-t pt-2 text-sm text-slate-900 font-extrabold mt-2"
                        style={{ borderTop: `1px solid ${makerAccentColor}` }}
                      >
                        <span>Total Due:</span>
                        <span className="text-base">{makerCurrency} {getMakerTotalsVal().total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank EFT Instructions */}
                  <div className="mt-12 bg-ui-lightGray p-6 rounded-none border border-ui-lightSlate space-y-2 text-xs">
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">EFT PAYMENT INSTRUCTIONS</span>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-medium text-slate-500 font-mono">
                      <div>Bank Name: <span className="font-bold text-slate-700">{makerBank}</span></div>
                      <div>Account Holder: <span className="font-bold text-slate-700">{makerAccount}</span></div>
                      <div>Account Number: <span className="font-bold text-slate-700">{makerAccountNumber}</span></div>
                      <div>Branch Code: <span className="font-bold text-slate-700">{makerBranch}</span></div>
                    </div>
                  </div>

                  <p className="text-[9px] font-mono text-center text-slate-400 mt-12 tracking-wide">
                    Thank you for your business. For any invoice queries, contact {settings.email}.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= VIEW 5: SETTINGS ================= */}
        {activeView === "settings" && (
          <div className="space-y-8 animate-fadeIn max-w-3xl">
            <div className="border-b border-ui-lightSlate pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#111111] uppercase">System Settings</h1>
              <p className="text-[#6E6C5F] text-xs font-medium mt-1">Configure corporate branding metadata and banking targets.</p>
            </div>

            <div className="bg-white border border-ui-lightSlate p-6 md:p-8 rounded-none">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  if (isSupabaseConfigured && supabase) {
                    try {
                      localStorage.setItem("vylex_ops_settings", JSON.stringify(settingsForm));
                      setSettings(settingsForm);
                      document.documentElement.style.setProperty('--doc-accent-color', settingsForm.accent_color);
                      showToast("Settings saved in session.");
                    } catch (err) {
                      console.error(err);
                    }
                  } else {
                    localStorage.setItem("vylex_ops_settings", JSON.stringify(settingsForm));
                    setSettings(settingsForm);
                    document.documentElement.style.setProperty('--doc-accent-color', settingsForm.accent_color);
                    showToast("Settings saved locally.");
                  }
                  setActiveView("dashboard");
                }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-[10px] font-mono font-bold uppercase text-brand-orange tracking-wider border-b border-[#FAF9F5] pb-2 mb-4">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Company Name</label>
                      <input 
                        type="text" 
                        value={settingsForm.company_name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Owner / Contact Name</label>
                      <input 
                        type="text" 
                        value={settingsForm.contact_name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, contact_name: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Company Address</label>
                      <input 
                        type="text" 
                        value={settingsForm.company_address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, company_address: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Company Email</label>
                      <input 
                        type="email" 
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Contact Phone Number</label>
                      <input 
                        type="text" 
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono font-bold uppercase text-brand-orange tracking-wider border-b border-[#FAF9F5] pb-2 mb-4">EFT & PayShap Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Bank Name</label>
                      <input 
                        type="text" 
                        value={settingsForm.bank_name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bank_name: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Account Holder Name</label>
                      <input 
                        type="text" 
                        value={settingsForm.account_name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, account_name: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Account Number</label>
                      <input 
                        type="text" 
                        value={settingsForm.account_number}
                        onChange={(e) => setSettingsForm({ ...settingsForm, account_number: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-mono font-bold focus:outline-none bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Branch Code</label>
                      <input 
                        type="text" 
                        value={settingsForm.branch_code}
                        onChange={(e) => setSettingsForm({ ...settingsForm, branch_code: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-mono font-bold focus:outline-none bg-white"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">PayShap Cell / ID</label>
                      <input 
                        type="text" 
                        value={settingsForm.payshap_id}
                        onChange={(e) => setSettingsForm({ ...settingsForm, payshap_id: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold focus:outline-none focus:border-black bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-mono font-bold uppercase text-brand-orange tracking-wider border-b border-[#FAF9F5] pb-2 mb-4">Localization & Theme Color</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Currency Prefix</label>
                      <input 
                        type="text" 
                        value={settingsForm.currency}
                        onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                        className="w-full border border-ui-lightSlate rounded-none p-3 text-xs font-semibold text-center focus:outline-none bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-1.5">Brand Accent Color</label>
                      <div className="flex gap-2 items-center">
                        <input 
                          type="color" 
                          value={settingsForm.accent_color}
                          onChange={(e) => setSettingsForm({ ...settingsForm, accent_color: e.target.value })}
                          className="h-10 w-16 border border-ui-lightSlate cursor-pointer rounded-none bg-white"
                        />
                        <span className="font-mono text-xs text-slate-500 font-bold">{settingsForm.accent_color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-ui-lightSlate pt-6">
                  <button 
                    type="button" 
                    onClick={() => { setActiveView("dashboard"); setIsMobileMenuOpen(false); }}
                    className="border border-ui-lightSlate hover:bg-ui-lightGray text-slate-700 font-mono font-bold uppercase tracking-wider px-6 py-2.5 rounded-none transition text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#111111] hover:bg-[#252525] text-white font-mono font-bold uppercase tracking-wider px-8 py-2.5 rounded-none transition text-xs"
                  >
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= VIEW 6: CLIENT SIMULATOR PORTAL ================= */}
        {activeView === "client" && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-ui-lightGray text-slate-900 p-5 rounded-none border border-ui-lightSlate flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print-hide">
              <div className="flex-grow">
                <h2 className="font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-display"></i> Sandbox Client View Mode
                </h2>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Simulating what your client sees when opening a WhatsApp link or proposal invitation.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center w-full md:w-auto text-xs font-mono mt-3 md:mt-0">
                <div className="flex gap-2 items-center">
                  <span className="text-[#6E6C5F] font-bold">Document:</span>
                  <select 
                    value={activeClientSimQuoteId}
                    onChange={(e) => {
                      setActiveClientSimQuoteId(e.target.value);
                      setSimSignedName("");
                      setSimSignedCheckbox(false);
                    }}
                    className="bg-white text-slate-900 font-bold text-xs p-2 border border-ui-lightSlate focus:outline-none rounded-none"
                  >
                    {quotes.map(q => {
                      const client = clients.find(c => c.id === q.client_id);
                      return (
                        <option key={q.id} value={q.id}>
                          {q.quote_number} - {client ? client.name : "Client"} ({q.status.toUpperCase()})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const quote = quotes.find(q => q.id === activeClientSimQuoteId);
                      const isAccepted = quote ? quote.status === "accepted" : false;
                      const invoice = invoices.find(inv => inv.quote_id === activeClientSimQuoteId);
                      if (quote) {
                        triggerWhatsAppShare(
                          isAccepted && invoice ? "invoice" : "quote",
                          isAccepted && invoice ? invoice.id : quote.id
                        );
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 rounded-none"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>Share WhatsApp</span>
                  </button>

                  <button 
                    onClick={generateOpsPdf}
                    className="bg-brand-orange hover:bg-[#B38E45] text-slate-950 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 rounded-none"
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>Download PDF</span>
                  </button>

                  <button 
                    onClick={() => { setActiveView("dashboard"); setIsMobileMenuOpen(false); }}
                    className="bg-slate-800 hover:bg-brand-lightNavy text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition flex items-center gap-1.5 rounded-none"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Exit Sandbox</span>
                  </button>
                </div>
              </div>
            </div>

            {(() => {
              const quote = quotes.find(q => q.id === activeClientSimQuoteId);
              if (!quote) return <div className="p-8 text-center text-slate-400 text-sm font-mono">Select a document to simulate.</div>;
              
              const client = clients.find(c => c.id === quote.client_id) || { name: "Client", address: "", contact_name: "", phone: "" };
              const invoice = invoices.find(inv => inv.quote_id === quote.id);
              const isAccepted = quote.status === "accepted";
              
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div 
                      id="client-invoice-card" 
                      className="bg-white border border-ui-lightSlate rounded-none p-8 md:p-12 relative font-sans shadow-none overflow-hidden"
                      style={{ borderTop: `8px solid ${settings.accent_color}` }}
                    >
                      {/* Floating Watermark/Badge for simulator status if quote is already converted */}
                      {isAccepted && (
                        <div className="absolute -right-16 -top-1 rotate-45 bg-emerald-600 text-white font-bold py-2 px-16 text-center text-[10px] uppercase tracking-widest shadow-md print-hide">
                          Accepted
                        </div>
                      )}
                      {quote.status === "declined" && (
                        <div className="absolute -right-16 -top-1 rotate-45 bg-rose-600 text-white font-bold py-2 px-16 text-center text-[10px] uppercase tracking-widest shadow-md print-hide">
                          Declined
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-2xl font-bold text-[#111111] tracking-tight uppercase font-sans">{settings.company_name}</h2>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xs">{settings.company_address}</p>
                        </div>
                        <div className="text-right flex items-start gap-4">
                          <div>
                            <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                              {isAccepted ? "TAX INVOICE" : "PROPOSAL & QUOTE"}
                            </h3>
                            <span className="font-mono text-xs font-bold text-slate-400 font-bold block text-right">
                              {isAccepted && invoice ? invoice.invoice_number : quote.quote_number}
                            </span>
                            <span className={`block mt-2 font-mono text-[9px] font-bold uppercase px-2.5 py-0.5 border rounded-none w-fit ml-auto ${
                              isAccepted 
                                ? (invoice?.status === "paid" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-850 border-amber-200")
                                : quote.status === "declined" ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-sky-50 text-sky-800 border-sky-200"
                            }`}>
                              {isAccepted ? (invoice?.status === "paid" ? "Paid" : "Awaiting EFT") : quote.status === "declined" ? "Declined" : "Proposal Active"}
                            </span>
                          </div>
                          {/* Print/Download button inside card (hidden on print) */}
                          <button 
                            onClick={generateOpsPdf} 
                            className="print-hide p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-none border border-slate-200/60 transition-all flex items-center justify-center w-8 h-8"
                            title="Download PDF"
                          >
                            <i className="fa-solid fa-download text-sm"></i>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mt-12 border-t border-[#FAF9F5] pt-8">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Client Details:</span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">{client.name}</h4>
                          <p className="text-slate-500 text-xs mt-1 leading-relaxed">{client.address}</p>
                        </div>
                        <div className="text-right space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Date Issued:</span>
                            <span className="font-bold text-slate-700">{formatDateLabel(quote.issued_at)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">{isAccepted ? "Payment Due:" : "Valid Until:"}</span>
                            <span className="font-bold text-slate-700">
                              {isAccepted && invoice ? formatDateLabel(invoice.due_at) : formatDateLabel(quote.expires_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <table className="w-full text-left mt-10 text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-[#FAF9F5] text-slate-400 font-mono font-bold uppercase tracking-wider pb-2">
                            <th className="py-2">Services scope</th>
                            <th className="py-2 text-center w-12">Qty</th>
                            <th className="py-2 text-right w-24">Rate</th>
                            <th className="py-2 text-right w-28">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE9E2] text-slate-700 font-medium">
                          {quote.line_items.map((row, idx) => (
                            <tr key={idx}>
                              <td className="py-4">
                                <span className="font-bold text-slate-900 text-sm">{row.description}</span>
                                {row.details && row.details.length > 0 && (
                                  <ul className="mt-1.5 space-y-1 list-disc pl-4 text-slate-500 text-[11px]">
                                    {row.details.map((d, dIdx) => <li key={dIdx}>{d}</li>)}
                                  </ul>
                                )}
                              </td>
                              <td className="py-4 text-center font-mono text-slate-600">{row.qty}</td>
                              <td className="py-4 text-right font-mono text-slate-600">{formatZAR(row.rate)}</td>
                              <td className="py-4 text-right font-mono font-bold text-slate-900">{formatZAR(row.qty * row.rate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
                        <div className="w-64 space-y-2 text-xs font-mono">
                          <div className="flex justify-between text-slate-500">
                            <span>Subtotal:</span>
                            <span className="font-bold text-slate-700">{formatZAR(quote.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span>VAT (VAT Exempt):</span>
                            <span className="font-bold text-slate-400">0.00</span>
                          </div>
                          <div 
                            className="flex justify-between border-t pt-2 text-sm text-slate-900 font-extrabold mt-2"
                            style={{ borderTop: `1px solid ${settings.accent_color}` }}
                          >
                            <span>{isAccepted ? "Total Due:" : "Proposal Value:"}</span>
                            <span className="text-base">{formatZAR(quote.total)}</span>
                          </div>
                        </div>
                      </div>

                      {isAccepted ? (
                        <div className="mt-10 bg-ui-lightGray border border-ui-lightSlate p-6 space-y-3 text-xs">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                            EFT BANKING INSTRUCTIONS
                          </span>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 font-medium text-[#6E6C5F] font-mono">
                            <div>Bank: <span className="font-bold text-slate-700">{settings.bank_name}</span></div>
                            <div>Holder: <span className="font-bold text-slate-700">{settings.account_name}</span></div>
                            <div>Account: <span className="font-bold text-slate-700">{settings.account_number}</span></div>
                            <div>Branch: <span className="font-bold text-slate-700">{settings.branch_code}</span></div>
                            <div className="col-span-2 mt-2 pt-2 border-t border-ui-lightSlate/60">
                              PayShap Cell / ID: <span className="font-bold text-slate-700">{settings.payshap_id}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        quote.notes && (
                          <div className="mt-8 bg-ui-lightGray p-4 border border-ui-lightSlate text-xs leading-relaxed text-slate-500 rounded-none font-medium">
                            <span className="font-bold text-slate-700 block mb-1">Terms & Notes:</span>
                            {quote.notes}
                          </div>
                        )
                      )}

                      <p className="text-[9px] font-mono text-center text-slate-400 mt-12 tracking-wide">
                        Reference ID: {quote.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-6">
                    {!isAccepted && quote.status !== "declined" ? (
                      <div className="bg-white border border-ui-lightSlate p-6 space-y-4 rounded-none">
                        <h3 className="font-bold text-[#111111] text-xs uppercase tracking-wide">Approve Proposal</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          Accepting this proposal generates a tax invoice dynamically in our backend ledger.
                        </p>
                        
                        <div className="space-y-3 pt-2">
                          <label className="block text-[9px] font-mono font-bold uppercase text-slate-400">Authorized Signature Name</label>
                          <input 
                            type="text" 
                            placeholder="Type full legal name..."
                            value={simSignedName}
                            onChange={(e) => setSimSignedName(e.target.value)}
                            className="w-full border border-ui-lightSlate p-2.5 text-xs font-semibold focus:outline-none rounded-none focus:border-black"
                          />
                        </div>

                        <label className="flex items-start gap-2.5 text-xs text-slate-500 select-none cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={simSignedCheckbox}
                            onChange={(e) => setSimSignedCheckbox(e.target.checked)}
                            className="mt-0.5 rounded-none text-slate-800 focus:ring-0"
                          />
                          <span className="font-medium leading-normal">
                            I accept the terms and authorize standard billing terms.
                          </span>
                        </label>

                        <button 
                          onClick={handleClientAcceptQuote}
                          className="w-full bg-[#111111] hover:bg-[#252525] text-white font-mono font-bold uppercase tracking-wider py-3.5 text-xs rounded-none transition mb-2"
                        >
                          Confirm Acceptance
                        </button>
                        
                        <button 
                          onClick={handleClientDeclineQuote}
                          className="w-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-mono font-bold uppercase tracking-wider py-2.5 text-[10px] rounded-none transition"
                        >
                          Decline Proposal
                        </button>
                      </div>
                    ) : quote.status === "declined" ? (
                      <div className="bg-white border border-ui-lightSlate p-6 text-center space-y-3 rounded-none">
                        <div className="w-12 h-12 rounded-none bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
                          <i className="fa-solid fa-circle-xmark"></i>
                        </div>
                        <h3 className="font-bold text-[#111111] text-xs uppercase tracking-wide">Proposal Declined</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium font-mono">
                          This proposal has been declined by the client.
                        </p>
                        
                        <div className="border-t border-slate-100 pt-4 mt-2">
                          <button 
                            onClick={handleClientReopenQuote}
                            className="w-full bg-[#111111] hover:bg-[#252525] text-amber-400 font-mono font-bold uppercase tracking-wider py-2.5 text-[10px] rounded-none transition"
                          >
                            Re-open Proposal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-ui-lightSlate p-6 text-center space-y-3 rounded-none">
                        <div className="w-12 h-12 rounded-none bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl border border-emerald-200">
                          <i className="fa-solid fa-circle-check"></i>
                        </div>
                        <h3 className="font-bold text-[#111111] text-xs uppercase tracking-wide">Proposal Approved</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium font-mono">
                          Converted to Invoice: {invoice?.invoice_number}.
                        </p>
                        
                        {invoice?.status === "unpaid" && (
                          <div className="border-t border-slate-100 pt-4 mt-2">
                            <button 
                              onClick={() => {
                                if (invoice) handleMarkPaid(invoice.id);
                              }}
                              className="w-full bg-[#111111] hover:bg-[#252525] text-amber-400 font-mono font-bold uppercase tracking-wider py-2.5 text-[10px] rounded-none transition"
                            >
                              Simulate Bank EFT Payment
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

      </main>

      {/* ================= MODAL: ADD CLIENT (For Quote Builder) ================= */}
      {showBuilderAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white border border-ui-lightSlate w-full max-w-lg rounded-none p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#FAF9F5] pb-3">
              <div>
                <h3 className="font-bold text-[#111111] text-sm uppercase tracking-wider">New Client Profile</h3>
                <p className="text-[#8E8C82] text-[10px] font-mono mt-1">Add a client profile to compile quote instantly.</p>
              </div>
              <button 
                onClick={() => setShowBuilderAddClientModal(false)}
                className="text-[#6E6C5F] hover:text-black transition-colors"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Client Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Acme Corp" 
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-white border border-ui-lightSlate p-2.5 text-xs focus:outline-none focus:border-black font-semibold rounded-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Invoice Prefix</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AC (Auto if blank)" 
                    value={newClientPrefix}
                    onChange={(e) => setNewClientPrefix(e.target.value)}
                    className="w-full bg-white border border-ui-lightSlate p-2.5 text-xs focus:outline-none focus:border-black font-mono font-bold rounded-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Contact Person</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    value={newClientContactName}
                    onChange={(e) => setNewClientContactName(e.target.value)}
                    className="w-full bg-white border border-ui-lightSlate p-2.5 text-xs focus:outline-none focus:border-black font-semibold rounded-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. john@acme.com" 
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    className="w-full bg-white border border-ui-lightSlate p-2.5 text-xs focus:outline-none focus:border-black font-semibold rounded-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +27 82 123 4567" 
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full bg-white border border-ui-lightSlate p-2.5 text-xs focus:outline-none focus:border-black font-semibold rounded-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[8px] font-mono font-bold uppercase text-slate-500">Physical/Billing Address</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. 123 Main Rd, Cape Town, 8001" 
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  className="w-full bg-white border border-ui-lightSlate p-2.5 text-xs focus:outline-none focus:border-black resize-none font-semibold rounded-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowBuilderAddClientModal(false)}
                  className="w-1/2 border border-ui-lightSlate hover:bg-ui-lightGray text-slate-700 font-mono font-bold uppercase tracking-wider py-3 text-xs transition rounded-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-[#111111] hover:bg-black text-white text-xs font-mono font-bold uppercase tracking-wider py-3 transition-colors rounded-none"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

-- ==========================================
-- VYLEX OPS: SUPABASE SCHEMA MIGRATION
-- ==========================================

-- 1. Create tables
CREATE TABLE public.settings (
    user_id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    company_name TEXT DEFAULT '',
    company_address TEXT DEFAULT '',
    contact_name TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    email TEXT DEFAULT '',
    website TEXT DEFAULT '',
    bank_name TEXT DEFAULT '',
    account_name TEXT DEFAULT '',
    account_number TEXT DEFAULT '',
    branch_code TEXT DEFAULT '',
    payshap_id TEXT DEFAULT '',
    accent_color TEXT DEFAULT '#051b38',
    currency TEXT DEFAULT 'R',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.clients (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    prefix TEXT NOT NULL,
    email TEXT,
    contact_name TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.quotes (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE,
    quote_number TEXT NOT NULL,
    status TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    vat NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.invoices (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
    quote_id TEXT REFERENCES public.quotes(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    status TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    due_at TEXT NOT NULL,
    line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    vat NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    notes TEXT,
    paid_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE public.history (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    docNumber TEXT NOT NULL,
    clientName TEXT,
    clientPhone TEXT,
    total TEXT,
    date TEXT,
    dueDate TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies

-- SETTINGS: Users can read and write their own settings
CREATE POLICY "Users can read own settings" ON public.settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.settings FOR UPDATE USING (auth.uid() = user_id);
-- Public access: Allow unauthenticated users to read settings
CREATE POLICY "Public can read settings" ON public.settings FOR SELECT USING (true);

-- CLIENTS: Users can read and write their own clients
CREATE POLICY "Users can read own clients" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON public.clients FOR DELETE USING (auth.uid() = user_id);
-- Public access: Allow public to read clients
CREATE POLICY "Public can read clients" ON public.clients FOR SELECT USING (true);

-- QUOTES: Users can do everything to their own quotes
CREATE POLICY "Users can read own quotes" ON public.quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes" ON public.quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON public.quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON public.quotes FOR DELETE USING (auth.uid() = user_id);
-- Public access: Anyone can read a quote by its share_token or ID
CREATE POLICY "Public can read quotes" ON public.quotes FOR SELECT USING (true);
-- Public access: Anyone can UPDATE a quote
CREATE POLICY "Public can update quotes" ON public.quotes FOR UPDATE USING (true);

-- INVOICES: Users can do everything to their own invoices
CREATE POLICY "Users can read own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invoices" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invoices" ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invoices" ON public.invoices FOR DELETE USING (auth.uid() = user_id);
-- Public access: Anyone can read an invoice by ID
CREATE POLICY "Public can read invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Public can insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);

-- HISTORY: Users can do everything to their own history
CREATE POLICY "Users can read own history" ON public.history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own history" ON public.history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON public.history FOR DELETE USING (auth.uid() = user_id);

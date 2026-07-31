-- ==========================================
-- VYLEX OPS: SUPABASE SCHEMA MIGRATION
-- ==========================================

-- 0. Drop existing tables (Clean slate for testing)
DROP TABLE IF EXISTS public.history CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.quotes CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;

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
    show_verified_badge BOOLEAN DEFAULT true,
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

-- 2. Grant basic access to the authenticated role for all tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.history TO authenticated;

-- 3. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies so users can only access their own data

-- Policies for 'clients'
CREATE POLICY "Users can manage their own clients" 
ON public.clients FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view clients for portal"
ON public.clients FOR SELECT TO anon, authenticated
USING (true);

-- Policies for 'quotes'
CREATE POLICY "Users can manage their own quotes" 
ON public.quotes FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view quotes with share token"
ON public.quotes FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Public can accept quotes"
ON public.quotes FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Policies for 'invoices'
CREATE POLICY "Users can manage their own invoices" 
ON public.invoices FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view invoices for portal"
ON public.invoices FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Public can create invoices on quote accept"
ON public.invoices FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Policies for 'settings'
CREATE POLICY "Users can manage their own settings" 
ON public.settings FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view business settings for portal"
ON public.settings FOR SELECT TO anon, authenticated
USING (true);

-- Policies for 'history'
CREATE POLICY "Users can manage their own history" 
ON public.history FOR ALL TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

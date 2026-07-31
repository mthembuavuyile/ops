import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Vylex Ops — Minimalist Business Billing & Operations",
  description: "Learn about Vylex Ops, a streamlined billing operations tool designed for freelancers and small businesses.",
  alternates: {
    canonical: "https://ops.vylex.co.za/about",
  },
  openGraph: {
    title: "About Vylex Ops — Minimalist Business Billing & Operations",
    description: "Learn about Vylex Ops, a streamlined billing operations tool designed for freelancers and small businesses.",
    url: "https://ops.vylex.co.za/about",
    siteName: "Vylex Ops",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-900 selection:text-white flex flex-col justify-between">
      <div>
        {/* HEADER */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/landing" className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
              VYLEX<span className="text-sky-600">OPS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <Link href="/landing#features" className="hover:text-slate-900 transition-colors">Features</Link>
              <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
              <Link href="/about" className="text-slate-900 font-bold border-b-2 border-sky-600 pb-0.5">About</Link>
              <Link href="/landing#faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="border-b border-slate-200 bg-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3">About Us</h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Practical software built for real business workflows.
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Vylex Ops was created to remove the unnecessary friction and bloat from daily business billing. Simple quotes, quick invoices, and direct client communication.
            </p>
          </div>
        </section>

        {/* CONTENT SECTION */}
        <section className="py-16 max-w-4xl mx-auto px-6 space-y-12">
          
          {/* Mission */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">Our Focus</h2>
            <h3 className="text-xl font-bold text-slate-900">Why Vylex Ops Exists</h3>
            <p className="mt-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              Many accounting systems are built for complex corporate finance teams with heavy feature sets, steep learning curves, and recurring subscription costs. 
              Small business owners, contractors, and freelancers often just need a fast, dependable tool to log client details, prepare professional quotes, issue invoices, and keep track of payment statuses.
            </p>
            <p className="mt-3 text-xs md:text-sm text-slate-600 leading-relaxed">
              Vylex Ops focuses strictly on core operational tasks: generating standardized billing documents, sharing client portal links, and sending instant WhatsApp reminders.
            </p>
          </div>

          {/* Core Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Principle 01</div>
              <h4 className="text-sm font-bold text-slate-900">Speed & Simplicity</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Generate quotes and invoices in under two minutes with auto-conversion and pre-saved client profiles.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Principle 02</div>
              <h4 className="text-sm font-bold text-slate-900">Direct Communication</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Integrate directly with WhatsApp messaging and shareable web links so clients can view and accept documents instantly.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Principle 03</div>
              <h4 className="text-sm font-bold text-slate-900">Reliable Cloud Sync</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your data is stored securely in the cloud, giving you access to your billing operations from your desktop or phone.
              </p>
            </div>
          </div>

          {/* Ecosystem CTA */}
          <div className="bg-slate-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold">Part of the Vylex Ecosystem</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                Vylex Ops is developed and maintained as part of Vylex digital solutions. Built with modern web technologies for maximum performance.
              </p>
            </div>
            <Link
              href="/register"
              className="text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              Get Started Free
            </Link>
          </div>

        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-12 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white tracking-tight uppercase">VYLEX OPS</span>
              <span className="text-[10px] text-slate-500 font-mono">by</span>
              <a
                href="https://vylex.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-sky-400 hover:underline"
              >
                vylex.co.za
              </a>
            </div>
            <p className="mt-1 text-slate-500">Free business billing and operations management system.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

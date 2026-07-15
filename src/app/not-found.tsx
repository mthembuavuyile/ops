import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Vylex Ops",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ui-lightGray flex items-center justify-center p-6 relative overflow-hidden font-sans text-slate-800">
      
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #111111 1px, transparent 1px),
            linear-gradient(to bottom, #111111 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px"
        }}
      />

      {/* Subtle diagonal accent stripe */}
      <div 
        className="absolute -right-40 top-0 w-96 h-full opacity-[0.015] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, transparent 30%, #C6A052 50%, transparent 70%)"
        }}
      />

      <div className="relative z-10 max-w-lg w-full text-center space-y-10">

        {/* Brand */}
        <Link 
          href="/" 
          className="text-xl font-bold tracking-widest text-[#111111] uppercase inline-block hover:opacity-80 transition-opacity"
        >
          VYLEX <span className="text-brand-orange">OPS</span>
        </Link>

        {/* Error Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-4 select-none">
            <span className="text-[120px] sm:text-[160px] font-black leading-none text-[#111111] tracking-tighter font-mono opacity-90">
              4
            </span>
            <span className="relative flex items-center justify-center">
              <span className="w-20 h-20 sm:w-28 sm:h-28 border-4 border-ui-lightSlate rounded-full flex items-center justify-center">
                <i className="fa-solid fa-link-slash text-3xl sm:text-4xl text-brand-orange opacity-70"></i>
              </span>
            </span>
            <span className="text-[120px] sm:text-[160px] font-black leading-none text-[#111111] tracking-tighter font-mono opacity-90">
              4
            </span>
          </div>

          <span className="inline-block font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#8E8C82] bg-[#EAE9E2] border border-ui-lightSlate px-3 py-1 rounded-none">
            Route Not Found
          </span>
        </div>

        {/* Message */}
        <div className="space-y-3 px-4">
          <h1 className="text-sm font-bold uppercase tracking-wider text-[#111111]">
            This page doesn&apos;t exist
          </h1>
          <p className="text-xs text-[#6E6C5F] leading-relaxed max-w-xs mx-auto font-medium">
            The route you requested could not be resolved. It may have been moved, deleted, or the URL may be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            href="/"
            className="bg-[#111111] hover:bg-[#252525] text-white text-xs font-mono font-bold uppercase tracking-wider px-6 py-3.5 rounded-none transition-all flex items-center gap-2.5 min-w-[180px] justify-center"
          >
            <i className="fa-solid fa-arrow-left text-[10px]"></i>
            <span>Back to Dashboard</span>
          </Link>

          <Link 
            href="/login"
            className="bg-white hover:bg-ui-lightGray text-[#111111] text-xs font-mono font-bold uppercase tracking-wider px-6 py-3.5 rounded-none border border-ui-lightSlate transition-all flex items-center gap-2.5 min-w-[180px] justify-center"
          >
            <i className="fa-solid fa-right-to-bracket text-[10px]"></i>
            <span>Go to Login</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-[#EAE9E2] space-y-2">
          <p className="text-[9px] font-mono font-bold text-[#8E8C82] uppercase tracking-widest">
            Vylex Ops — Business Billing Automation
          </p>
          <p className="text-[9px] font-mono text-[#BEBDAD]">
            If you believe this is an error, contact support at info@vylex.co.za
          </p>
        </div>

      </div>
    </main>
  );
}

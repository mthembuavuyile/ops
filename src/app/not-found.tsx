import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | Vylex Ops",
  description: "The requested page does not exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-slate-900 selection:text-white">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-8 text-center space-y-6 shadow-xs">
        <div>
          <Link href="/" className="text-base font-extrabold tracking-tight text-slate-900 uppercase inline-block">
            VYLEX<span className="text-sky-600">OPS</span>
          </Link>
        </div>

        <div className="py-4">
          <div className="text-6xl font-extrabold text-slate-900 tracking-tighter font-mono">
            404
          </div>
          <div className="inline-block mt-3 text-[10px] font-bold font-mono uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
            Route Not Found
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Page Does Not Exist
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            The route or document link you requested could not be found or may have been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 py-3 rounded-lg transition-colors text-center"
          >
            Return to Workspace
          </Link>
          <Link
            href="/landing"
            className="w-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 py-3 rounded-lg transition-colors text-center"
          >
            View Landing Page
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
          <span>Vylex Ops — by</span>
          <a href="https://vylex.co.za" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-semibold hover:underline">vylex.co.za</a>
        </div>
      </div>
    </main>
  );
}

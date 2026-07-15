import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vylex Ops | Business Billing & Client Workflow Automation",
  description: "The operations and billing wedge built for South African service businesses. Run your quoting, invoicing, and payment tracking on autopilot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className="scroll-smooth h-full bg-slate-50">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="h-full font-sans antialiased text-slate-700 bg-slate-50">
        {children}
      </body>
    </html>
  );
}

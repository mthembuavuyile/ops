import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ops.vylex.co.za"),
  title: {
    default: "Vylex Ops | Business Operations & Billing Software",
    template: "%s | Vylex Ops",
  },
  description:
    "Streamlined business operations and billing software for quotes, invoices, payment reminders, and client management.",
  keywords: [
    "Vylex Ops",
    "business billing software",
    "free invoicing tool",
    "quote generator",
    "payment reminders",
    "WhatsApp invoicing",
    "South Africa business software",
    "OTS operations",
  ],
  authors: [{ name: "Vylex", url: "https://vylex.co.za" }],
  creator: "Vylex",
  publisher: "Vylex",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://ops.vylex.co.za",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Vylex Ops | Business Operations & Billing Software",
    description:
      "Streamlined business operations and billing software for quotes, invoices, payment reminders, and client management.",
    url: "https://ops.vylex.co.za",
    siteName: "Vylex Ops",
    locale: "en_ZA",
    type: "website",
    images: [
      {
        url: "https://ops.vylex.co.za/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vylex Ops — Operations & Billing System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vylex Ops | Business Operations & Billing Software",
    description:
      "Streamlined business operations and billing software for quotes, invoices, payment reminders, and client management.",
    creator: "@vylex",
    images: ["https://ops.vylex.co.za/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Vylex Ops",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "ZAR",
  },
  "description":
    "Streamlined business operations, quoting, invoicing, and client management tool.",
  "url": "https://ops.vylex.co.za",
  "author": {
    "@type": "Organization",
    "name": "Vylex",
    "url": "https://vylex.co.za",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className="scroll-smooth h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full font-sans antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}


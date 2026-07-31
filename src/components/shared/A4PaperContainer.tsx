"use client";

import React from "react";

interface A4PaperContainerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A4PaperContainer
 * A standardized A4 paper container (210mm x 297mm aspect ratio).
 * Provides responsive scaling on mobile screens while maintaining pixel-perfect
 * standard paper layout for printing and HTML-to-PDF conversion.
 */
export default function A4PaperContainer({
  id,
  children,
  className = "",
  style = {},
}: A4PaperContainerProps) {
  return (
    <div className="w-full flex justify-center overflow-x-auto py-2 px-1 sm:px-4">
      <div
        id={id}
        className={`bg-white text-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 transition-all duration-200 print:shadow-none print:border-none print:rounded-none print:m-0 print:p-0 ${className}`}
        style={{
          width: "100%",
          maxWidth: "794px", // Standard A4 width at 96 DPI (210mm)
          minHeight: "1050px", // Standard A4 height ~ 297mm
          padding: "40px",
          margin: "0 auto",
          boxSizing: "border-box",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          position: "relative",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}

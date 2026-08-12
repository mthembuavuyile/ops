"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  mode?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export default function Logo({
  mode = "light",
  showTagline = false,
  size = "md",
  href,
  className = "",
}: LogoProps) {
  // Size mapping
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const taglineSizes = {
    sm: "text-[8px] tracking-[0.2em]",
    md: "text-[9px] tracking-[0.22em]",
    lg: "text-[10px] tracking-[0.25em]",
  };

  const vylexColor = mode === "dark" ? "text-white" : "text-slate-900";
  const opsColor = "text-sky-500";
  const taglineColor = mode === "dark" ? "text-slate-400" : "text-slate-500";

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* O-LOOP SVG MARK */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} shrink-0 overflow-visible`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyan to Sky Blue Gradient for Main Ring Body */}
          <linearGradient id="vylexOLoopBlue" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284C7" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Orange/Amber Gradient for Top Arc Accent */}
          <linearGradient id="vylexOLoopOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>

          {/* Clean 45-degree diagonal gap cut out at top-right */}
          <mask id="vylexOLoopMask">
            <rect width="100" height="100" fill="white" />
            {/* Wedge cutout at ~40deg to 55deg */}
            <polygon points="50,50 82,10 98,26 50,50" fill="black" />
          </mask>
        </defs>

        <g mask="url(#vylexOLoopMask)">
          {/* Main Blue Ring */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="url(#vylexOLoopBlue)"
            strokeWidth="16"
          />

          {/* Orange/Amber Top Arc (sweeps across top right before gap) */}
          <path
            d="M 50 15 A 35 35 0 0 1 76 27"
            stroke="url(#vylexOLoopOrange)"
            strokeWidth="16"
            strokeLinecap="butt"
          />
        </g>
      </svg>

      {/* TYPOGRAPHY */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-extrabold ${textSizes[size]} tracking-tight uppercase flex items-center gap-1.5`}>
          <span className={vylexColor}>VYLEX</span>
          <span className={opsColor}>OPS</span>
        </div>
        {showTagline && (
          <span className={`font-bold font-mono uppercase ${taglineColor} ${taglineSizes[size]} mt-1`}>
            OPERATIONS. SIMPLIFIED.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        {content}
      </Link>
    );
  }

  return content;
}

"use client";

import React from "react";

interface AiButtonProps {
  onClick: () => void;
  loading: boolean;
  label?: string;
  icon?: string;
  className?: string;
  title?: string;
  compact?: boolean;
}

/**
 * Small reusable AI action button with loading state.
 * Used across quote builder, invoice maker, and reminders.
 */
export default function AiButton({
  onClick,
  loading,
  label,
  icon = "fa-solid fa-wand-magic-sparkles",
  className = "",
  title = "AI Assist",
  compact = false,
}: AiButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title={title}
      className={`
        inline-flex items-center justify-center gap-1.5
        font-semibold rounded-lg border transition-all
        disabled:opacity-50 disabled:cursor-wait
        ${compact
          ? "text-[11px] px-2 py-1 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
          : "text-xs px-3 py-1.5 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:border-purple-300"
        }
        ${className}
      `}
    >
      {loading ? (
        <i className="fa-solid fa-spinner animate-spin text-[10px]" />
      ) : (
        <i className={`${icon} text-[10px]`} />
      )}
      {label && <span>{loading ? "Working..." : label}</span>}
    </button>
  );
}

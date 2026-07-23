"use client";

import React from "react";
import type { Toast } from "@/hooks/useToast";

interface ToastBannerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export default function ToastBanner({ toasts, onDismiss }: ToastBannerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md print-hide">
      {toasts.map((toast) => {
        const typeClass = {
          info: "ops-toast-info",
          success: "ops-toast-success",
          warning: "ops-toast-warning",
          error: "ops-toast-error",
        }[toast.type];

        return (
          <div key={toast.id} className={`ops-toast ${typeClass}`}>
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-60 hover:opacity-100 transition-opacity ml-2"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

"use client";
 
import { useEffect } from "react";
import { useUIStore, type Toast } from "@/src/stores/ui.store";
 
const toastStyles = {
  success: "border-green-300 bg-green-50 text-green-900",
  error: "border-red-300 bg-red-50 text-red-900",
  info: "border-blue-300 bg-blue-50 text-blue-900",
};
 
function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useUIStore((state) => state.removeToast);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000);
 
    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, removeToast]);
 
  return (
    <div
      role="status"
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 shadow-lg ${toastStyles[toast.variant]}`}
    >
      <p className="text-sm">{toast.message}</p>
      <button
        type="button"
        onClick={() => removeToast(toast.id)}
        className="text-lg leading-none opacity-70 hover:opacity-100"
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}
 
export function Toaster() {
  const toasts = useUIStore((state) => state.toasts);
 
  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

"use client";
 
import { useMemo } from "react";
import { useUIStore } from "@/src/stores/ui.store";
 
export function useToast() {
  const pushToast = useUIStore((state) => state.pushToast);
 
  return useMemo(
    () => ({
      success: (message: string) =>
        pushToast({ variant: "success", message }),
      error: (message: string) => pushToast({ variant: "error", message }),
      info: (message: string) => pushToast({ variant: "info", message }),
    }),
    [pushToast],
  );
}

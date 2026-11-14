"use client";
 
import { create } from "zustand";
import type { DeleteTarget } from "@/src/features/assets/types";
 
export type ToastVariant = "success" | "error" | "info";
 
export type Toast = {
  id: number;
  variant: ToastVariant;
  message: string;
};
 
type PushToastInput = {
  variant: ToastVariant;
  message: string;
};
 
type UIState = {
  toasts: Toast[];
  deleteTarget: DeleteTarget | null;
  pushToast: (toast: PushToastInput) => void;
  removeToast: (id: number) => void;
  openDeleteDialog: (asset: DeleteTarget) => void;
  closeDeleteDialog: () => void;
};
 
let nextToastId = 0;
 
export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  deleteTarget: null,
  pushToast: ({ variant, message }) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: ++nextToastId, variant, message },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  openDeleteDialog: (asset) => set({ deleteTarget: asset }),
  closeDeleteDialog: () => set({ deleteTarget: null }),
}));

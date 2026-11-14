"use client";
 
import { useEffect, useTransition } from "react";
import { deleteAssetAction } from "@/src/features/assets/actions/asset.actions";
import { useToast } from "@/src/hooks/useToast";
import { useUIStore } from "@/src/stores/ui.store";
 
export function DeleteAssetDialog() {
  const target = useUIStore((state) => state.deleteTarget);
  const closeDeleteDialog = useUIStore((state) => state.closeDeleteDialog);
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
 
  useEffect(() => {
    if (!target) return;
 
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) {
        closeDeleteDialog();
      }
    };
 
    window.addEventListener("keydown", handleKeyDown);
 
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [target, isPending, closeDeleteDialog]);
 
  if (!target) {
    return null;
  }
 
  const asset = target;
 
  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAssetAction(asset.id);
 
      if (result.status === "success") {
        toast.success(result.message ?? "Activo eliminado.");
        closeDeleteDialog();
        return;
      }
 
      toast.error(result.message ?? "No fue posible eliminar el activo.");
    });
  };
 
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) {
          closeDeleteDialog();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-asset-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2
          id="delete-asset-title"
          className="text-lg font-semibold text-gray-900"
        >
          Eliminar activo
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          ¿Seguro que deseas eliminar el activo{" "}
          <strong>{asset.code}</strong> — {asset.name}? Esta acción no se puede
          deshacer.
        </p>
        <p className="mt-2 text-xs text-amber-700">
          Regla de negocio: un activo prestado no puede eliminarse.
        </p>
 
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={closeDeleteDialog}
            disabled={isPending}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
 
import Link from "next/link";
import { useUIStore } from "@/src/stores/ui.store";
import type { DeleteTarget } from "@/src/features/assets/types";
 
type AssetRowActionsProps = {
  asset: DeleteTarget;
  canEdit: boolean;
  canDelete: boolean;
};
 
export function AssetRowActions({
  asset,
  canEdit,
  canDelete,
}: AssetRowActionsProps) {
  const openDeleteDialog = useUIStore((state) => state.openDeleteDialog);
 
  if (!canEdit && !canDelete) {
    return null;
  }
 
  return (
    <div className="flex items-center gap-3 text-sm">
      {canEdit && (
        <Link
          href={`/assets/${asset.id}/edit`}
          className="font-medium text-blue-600 hover:underline"
        >
          Editar
        </Link>
      )}
      {canDelete && (
        <button
          type="button"
          onClick={() => openDeleteDialog(asset)}
          className="font-medium text-red-600 hover:underline"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}

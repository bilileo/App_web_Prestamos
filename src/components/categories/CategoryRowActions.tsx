"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCategoryAction } from "@/src/features/categories/actions/category.actions";
import { useToast } from "@/src/hooks/useToast";

type CategoryRowActionsProps = {
  category: {
    id: number;
    name: string;
    assetCount: number;
  };
};

export function CategoryRowActions({
  category,
}: CategoryRowActionsProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);

      if (result.status === "success") {
        toast.success(result.message ?? "Categoría eliminada.");
        setIsConfirming(false);
        router.refresh();
        return;
      }

      toast.error(result.message ?? "No fue posible eliminar la categoría.");
    });
  };

  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <Link
        href={`/categories/${category.id}/edit`}
        className="font-medium text-blue-600 hover:underline"
      >
        Editar
      </Link>
      {isConfirming ? (
        <>
          <button
            type="button"
            onClick={() => setIsConfirming(false)}
            disabled={isPending}
            className="font-medium text-gray-600 hover:underline disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending || category.assetCount > 0}
            className="font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            title={
              category.assetCount > 0
                ? "La categoría tiene activos asociados."
                : undefined
            }
          >
            {isPending ? "Eliminando..." : "Confirmar"}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="font-medium text-red-600 hover:underline"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}

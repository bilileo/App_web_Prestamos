"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteUserAction } from "@/src/features/auth/actions/user.actions";
import { useToast } from "@/src/hooks/useToast";

type UserRowActionsProps = {
  user: {
    id: number;
    name: string;
  };
};

export function UserRowActions({ user }: UserRowActionsProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUserAction(user.id);

      if (result.status === "success") {
        toast.success(result.message ?? "Usuario eliminado.");
        setIsConfirming(false);
        router.refresh();
        return;
      }

      toast.error(result.message ?? "No fue posible eliminar el usuario.");
    });
  };

  return (
    <div className="flex items-center justify-end gap-3 text-sm">
      <Link
        href={`/users/${user.id}/edit`}
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
            disabled={isPending}
            className="font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
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

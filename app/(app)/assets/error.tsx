"use client";
 
import Link from "next/link";
import { useEffect } from "react";
 
export default function AssetsError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        No fue posible cargar los activos
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        Ocurrió un error al consultar la información. Puedes reintentar o volver
        al listado.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-gray-400">
          Código: {error.digest}
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Reintentar
        </button>
        <Link
          href="/assets"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Volver al listado
        </Link>
      </div>
    </main>
  );
}

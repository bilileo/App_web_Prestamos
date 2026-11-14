import Link from "next/link";
 
export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
        Error 403
      </p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        No tienes permiso para esta sección
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Tu cuenta está autenticada, pero su rol no incluye esta operación. Si
        crees que es un error, solicita a un administrador que revise tu rol.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ir al dashboard
        </Link>
        <Link
          href="/assets"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Ver activos
        </Link>
      </div>
    </main>
  );
}

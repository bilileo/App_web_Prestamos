import type { Metadata } from "next";
import Link from "next/link";
import { UserRowActions } from "@/src/components/auth/UserRowActions";
import { ROLE_LABELS, isRole } from "@/src/features/auth/constants";
import { UserService } from "@/src/features/auth/services/user.service";
import { requirePermission } from "@/src/lib/authorization";

export const metadata: Metadata = {
  title: "Usuarios | Gestión de Activos",
};

export default async function UsersPage() {
  await requirePermission("users:read", "/users");
  const users = await UserService.getUsers();

  return (
    <main className="space-y-5 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las cuentas y roles de acceso al sistema.
          </p>
        </div>
        <Link
          href="/users/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nuevo usuario
        </Link>
      </header>

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            {users.length} usuario{users.length === 1 ? "" : "s"}
          </h2>
        </div>

        {users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              No hay usuarios registrados
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Registra un usuario para habilitar el acceso al sistema.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Correo</th>
                  <th className="px-5 py-3">Rol</th>
                  <th className="px-5 py-3">Registro</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const role = isRole(user.role) ? user.role : "USER";

                  return (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{user.email}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {ROLE_LABELS[role]}
                      </td>
                      <td className="px-5 py-3 text-gray-600">
                        {user.createdAt.toLocaleDateString("es-MX")}
                      </td>
                      <td className="px-5 py-3">
                        <UserRowActions user={{ id: user.id, name: user.name }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

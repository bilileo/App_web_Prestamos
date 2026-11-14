import type { Metadata } from "next";
import UserForm from "@/src/components/auth/UserForm";
import { requirePermission } from "@/src/lib/authorization";

export const metadata: Metadata = {
  title: "Registrar usuario | Gestión de Activos",
};

export default async function NewUserPage() {
  await requirePermission("users:create", "/users/new");

  return (
    <main className="mx-auto max-w-2xl space-y-5 p-6">
      <header>
        <h1 className="text-2xl font-bold">Registrar usuario</h1>
        <p className="mt-1 text-sm text-gray-500">
          Crea una cuenta y asigna su rol de acceso.
        </p>
      </header>
      <UserForm />
    </main>
  );
}

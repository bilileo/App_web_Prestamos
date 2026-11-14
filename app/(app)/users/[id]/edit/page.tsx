import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UserForm from "@/src/components/auth/UserForm";
import { UserService } from "@/src/features/auth/services/user.service";
import { requirePermission } from "@/src/lib/authorization";

export const metadata: Metadata = {
  title: "Editar usuario | Gestión de Activos",
};

type EditUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: EditUserPageProps) {
  await requirePermission("users:update", "/users");

  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    notFound();
  }

  const user = await UserService.getUserById(userId);

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-5 p-6">
      <header>
        <h1 className="text-2xl font-bold">Editar usuario</h1>
        <p className="mt-1 text-sm text-gray-500">
          Actualiza los datos y permisos de <strong>{user.name}</strong>.
        </p>
      </header>
      <UserForm
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />
    </main>
  );
}

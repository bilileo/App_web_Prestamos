import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryForm from "@/src/components/CategoryForm";
import { CategoryService } from "@/src/features/categories/services/category.service";

export const metadata: Metadata = {
  title: "Editar categoría | Gestión de Activos",
};

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    notFound();
  }

  const category = await CategoryService.getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-5 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Editar categoría</h1>
          <p className="mt-1 text-sm text-gray-500">
            Actualiza el nombre de <strong>{category.name}</strong>.
          </p>
        </div>
        <Link
          href="/categories"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Volver al listado
        </Link>
      </header>

      <CategoryForm category={category} />
    </main>
  );
}

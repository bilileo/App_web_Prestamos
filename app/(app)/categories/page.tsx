import type { Metadata } from "next";
import Link from "next/link";
import { CategoryRowActions } from "@/src/components/categories/CategoryRowActions";
import { CategoryService } from "@/src/features/categories/services/category.service";

export const metadata: Metadata = {
  title: "Categorías | Gestión de Activos",
};

export default async function CategoriesPage() {
  const categories = await CategoryService.getCategoriesWithAssetCounts();

  return (
    <main className="space-y-5 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las categorías disponibles para los activos.
          </p>
        </div>
        <Link
          href="/categories/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nueva categoría
        </Link>
      </header>

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            {categories.length} categoría{categories.length === 1 ? "" : "s"}
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              No hay categorías registradas
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Crea una categoría para poder registrar activos.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Activos asociados</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {category._count.assets}
                    </td>
                    <td className="px-5 py-3">
                      <CategoryRowActions
                        category={{
                          id: category.id,
                          name: category.name,
                          assetCount: category._count.assets,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

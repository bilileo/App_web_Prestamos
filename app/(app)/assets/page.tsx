import type { Metadata } from "next";
import Link from "next/link";
import { AssetFiltersBar } from "@/src/components/assets/AssetFilters";
import { AssetRowActions } from "@/src/components/assets/AssetRowActions";
import { AssetStatusBadge } from "@/src/components/assets/AssetStatusBadge";
import { DeleteAssetDialog } from "@/src/components/assets/DeleteAssetDialog";
import { Can } from "@/src/components/auth/Can";
import { ASSETS_PAGE_SIZE } from "@/src/features/assets/constants";
import { AssetService } from "@/src/features/assets/services/asset.service";
import {
  parseAssetFilters,
  type AssetFilters,
} from "@/src/features/assets/validations/assetFilters";
import { CategoryService } from "@/src/features/categories/services/category.service";
import { can, requirePermission } from "@/src/lib/authorization";
 
export const metadata: Metadata = {
  title: "Activos | Gestión de Activos",
};
 
interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
 
function buildPageHref(page: number, filters: AssetFilters) {
  const params = new URLSearchParams();
 
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.categoryId) {
    params.set("categoryId", String(filters.categoryId));
  }
 
  params.set("page", String(page));
 
  return `/assets?${params.toString()}`;
}
 
export default async function AssetsPage({ searchParams }: PageProps) {
  const user = await requirePermission("assets:read", "/assets");
 
  const canCreate = can(user.role, "assets:create");
  const canUpdate = can(user.role, "assets:update");
  const canDelete = can(user.role, "assets:delete");
  const canManage = canUpdate || canDelete;
 
  const rawParams = await searchParams;
  const filters = parseAssetFilters(rawParams);
 
  const [{ items: assets, meta }, categories] = await Promise.all([
    AssetService.getAssets({
      page: filters.page,
      pageSize: ASSETS_PAGE_SIZE,
      search: filters.search,
      status: filters.status,
      categoryId: filters.categoryId,
    }),
    CategoryService.getCategories(),
  ]);
 
  const hasFilters = Boolean(
    filters.search || filters.status || filters.categoryId,
  );
 
  const rangeStart =
    meta.total === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1;
  const rangeEnd = Math.min(meta.page * meta.pageSize, meta.total);
 
  return (
    <main className="space-y-5 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Gestión de Activos Tecnológicos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta, filtra y administra los activos registrados.
          </p>
        </div>
        <Can role={user.role} permission="assets:create">
          <Link
            href="/assets/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Nuevo activo
          </Link>
        </Can>
      </header>
 
      <AssetFiltersBar initialFilters={filters} categories={categories} />
 
      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">Resultados</h2>
          <p className="text-sm text-gray-500">
            {meta.total} activo{meta.total === 1 ? "" : "s"} encontrado
            {meta.total === 1 ? "" : "s"}
          </p>
        </div>
 
        {assets.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              No se encontraron activos
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {hasFilters
                ? "Prueba con otros filtros o limpia la búsqueda."
                : canCreate
                  ? "Registra el primer activo para comenzar."
                  : "Todavía no hay activos registrados."}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              {hasFilters && (
                <Link
                  href="/assets"
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Limpiar filtros
                </Link>
              )}
              {canCreate && (
                <Link
                  href="/assets/new"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Registrar activo
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Serie</th>
                  <th className="px-5 py-3">Categoría</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Registrado por</th>
                  {canManage && <th className="px-5 py-3 text-right">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-t hover:bg-gray-50">
                    <td className="px-5 py-3 font-mono text-xs">{asset.code}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {asset.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {asset.serialNumber ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {asset.category.name}
                    </td>
                    <td className="px-5 py-3">
                      <AssetStatusBadge status={asset.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {asset.createdBy.name}
                    </td>
                    {canManage && (
                      <td className="px-5 py-3 text-right">
                        <AssetRowActions
                          asset={{
                            id: asset.id,
                            code: asset.code,
                            name: asset.name,
                          }}
                          canEdit={canUpdate}
                          canDelete={canDelete}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
 
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 text-sm">
          <p className="text-gray-500">
            Mostrando {rangeStart}–{rangeEnd} de {meta.total}
          </p>
          <div className="flex items-center gap-2">
            {meta.page > 1 ? (
              <Link
                href={buildPageHref(meta.page - 1, filters)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                Anterior
              </Link>
            ) : (
              <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-400">
                Anterior
              </span>
            )}
            <span className="px-2 text-gray-600">
              Página {meta.page} de {meta.totalPages}
            </span>
            {meta.page < meta.totalPages ? (
              <Link
                href={buildPageHref(meta.page + 1, filters)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
              >
                Siguiente
              </Link>
            ) : (
              <span className="rounded-md border border-gray-200 px-3 py-1.5 text-gray-400">
                Siguiente
              </span>
            )}
          </div>
        </div>
      </section>
 
      {canDelete && <DeleteAssetDialog />}
    </main>
  );
}

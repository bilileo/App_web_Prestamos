"use client";
 
import { ASSET_STATUS_OPTIONS } from "@/src/features/assets/constants";
import type { AssetStatus } from "@/src/features/assets/constants";
import type { AssetFilters } from "@/src/features/assets/validations/assetFilters";
import { useAssetFilters } from "@/src/hooks/useAssetFilters";
 
type Category = {
  id: number;
  name: string;
};
 
type AssetFiltersProps = {
  initialFilters: AssetFilters;
  categories: Category[];
};
 
export function AssetFiltersBar({
  initialFilters,
  categories,
}: AssetFiltersProps) {
  const {
    search,
    status,
    categoryId,
    setSearch,
    setStatus,
    setCategoryId,
    clearFilters,
  } = useAssetFilters(initialFilters);
 
  const hasActiveFilters = Boolean(search || status || categoryId);
 
  return (
    <section
      aria-label="Filtros de activos"
      className="grid gap-4 rounded-lg border bg-white p-4 md:grid-cols-4"
    >
      <div className="md:col-span-2">
        <label
          htmlFor="asset-search"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Buscar
        </label>
        <input
          id="asset-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Código, nombre o número de serie"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>
 
      <div>
        <label
          htmlFor="asset-status"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Estado
        </label>
        <select
          id="asset-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as AssetStatus | "")
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Todos</option>
          {ASSET_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
 
      <div>
        <label
          htmlFor="asset-category"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Categoría
        </label>
        <select
          id="asset-category"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
 
      <div className="md:col-span-4">
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}

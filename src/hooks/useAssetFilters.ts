"use client";
 
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "./useDebounce";
import type { AssetStatus } from "@/src/features/assets/constants";
import type { AssetFilters } from "@/src/features/assets/validations/assetFilters";
 
function buildFilterQuery(filters: {
  search?: string;
  status?: string;
  categoryId?: string;
}) {
  const params = new URLSearchParams();
  const search = filters.search?.trim();
 
  if (search) params.set("search", search);
  if (filters.status) params.set("status", filters.status);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
 
  return params.toString();
}
 
export function useAssetFilters(initialFilters: AssetFilters) {
  const router = useRouter();
  const [search, setSearch] = useState(initialFilters.search);
  const [status, setStatus] = useState<AssetStatus | "">(
    initialFilters.status ?? "",
  );
  const [categoryId, setCategoryId] = useState(
    initialFilters.categoryId?.toString() ?? "",
  );
  const debouncedSearch = useDebounce(search, 400);
 
  const appliedQuery = useRef(
    buildFilterQuery({
      search: initialFilters.search,
      status: initialFilters.status,
      categoryId: initialFilters.categoryId?.toString(),
    }),
  );
 
  useEffect(() => {
    const nextQuery = buildFilterQuery({
      search: debouncedSearch,
      status,
      categoryId,
    });
 
    if (nextQuery === appliedQuery.current) {
      return;
    }
 
    appliedQuery.current = nextQuery;
    router.replace(nextQuery ? `/assets?${nextQuery}` : "/assets", {
      scroll: false,
    });
  }, [debouncedSearch, status, categoryId, router]);
 
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setCategoryId("");
  };
 
  return {
    search,
    status,
    categoryId,
    setSearch,
    setStatus,
    setCategoryId,
    clearFilters,
  };
}

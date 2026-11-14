import { z } from "zod";
import { ASSET_STATUSES } from "../constants";
 
export const assetFilterSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().trim().max(100).catch(""),
  status: z.enum(ASSET_STATUSES).optional().catch(undefined),
  categoryId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .catch(undefined),
});
 
export type AssetFilters = z.infer<typeof assetFilterSchema>;
 
type RawSearchParams = Record<string, string | string[] | undefined>;
 
function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
 
export function parseAssetFilters(raw: RawSearchParams): AssetFilters {
  return assetFilterSchema.parse({
    page: first(raw.page) ?? 1,
    search: first(raw.search) ?? "",
    status: first(raw.status) || undefined,
    categoryId: first(raw.categoryId) || undefined,
  });
}

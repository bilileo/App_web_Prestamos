export const ASSET_STATUSES = [
  "AVAILABLE",
  "LOANED",
  "MAINTENANCE",
  "RETIRED",
] as const;
 
export type AssetStatus = (typeof ASSET_STATUSES)[number];
 
export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  AVAILABLE: "Disponible",
  LOANED: "Prestado",
  MAINTENANCE: "Mantenimiento",
  RETIRED: "Retirado",
};
 
export const ASSET_STATUS_OPTIONS = ASSET_STATUSES.map((value) => ({
  value,
  label: ASSET_STATUS_LABELS[value],
}));
 
export const ASSETS_PAGE_SIZE = 8;

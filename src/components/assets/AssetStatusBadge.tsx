import { Badge } from "@/components/ui/Badge";
import {
  ASSET_STATUSES,
  ASSET_STATUS_LABELS,
  type AssetStatus,
} from "@/src/features/assets/constants";
 
const badgeVariants: Record<
  AssetStatus,
  "success" | "warning" | "danger"
> = {
  AVAILABLE: "success",
  LOANED: "warning",
  MAINTENANCE: "warning",
  RETIRED: "danger",
};
 
export function AssetStatusBadge({ status }: { status: string }) {
  if (!ASSET_STATUSES.includes(status as AssetStatus)) {
    return <Badge text={status} status="warning" />;
  }
 
  const value = status as AssetStatus;
 
  return (
    <Badge text={ASSET_STATUS_LABELS[value]} status={badgeVariants[value]} />
  );
}

import type { ReactNode } from "react";
import type { Role } from "@/src/features/auth/constants";
import {
  hasPermission,
  type Permission,
} from "@/src/features/auth/permissions";
 
type CanProps = {
  role: Role;
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
};
 
export function Can({
  role,
  permission,
  children,
  fallback = null,
}: CanProps) {
  return hasPermission(role, permission) ? <>{children}</> : <>{fallback}</>;
}

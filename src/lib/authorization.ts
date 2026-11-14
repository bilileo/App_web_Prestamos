import { forbidden } from "next/navigation";
import type { Role } from "../features/auth/constants";
import { hasPermission, type Permission } from "../features/auth/permissions";
import { requireUser, type SessionUser } from "./session";
 
export function can(role: Role, permission: Permission): boolean {
  return hasPermission(role, permission);
}
 
export async function requirePermission(
  permission: Permission,
  callbackUrl = "/dashboard",
): Promise<SessionUser> {
  const user = await requireUser(callbackUrl);
 
  if (!hasPermission(user.role, permission)) {
    forbidden();
  }
 
  return user;
}

import type { Role } from "./constants";
 
export const PERMISSIONS = [
  "dashboard:read",
  "assets:read",
  "assets:create",
  "assets:update",
  "assets:delete",
  "categories:read",
  "categories:create",
  "categories:update",
  "categories:delete",
  "users:read",
  "users:create",
  "users:update",
  "users:delete",
] as const;
 
export type Permission = (typeof PERMISSIONS)[number];
 
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  ADMIN: PERMISSIONS,
  USER: ["dashboard:read", "assets:read", "categories:read"],
};
 
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
 
export function permissionsFor(role: Role): readonly Permission[] {
  return ROLE_PERMISSIONS[role];
}

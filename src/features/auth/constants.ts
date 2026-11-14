export const ROLES = ["ADMIN", "USER"] as const;
 
export type Role = (typeof ROLES)[number];
 
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  USER: "Usuario",
};
 
export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}
 
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

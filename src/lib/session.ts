import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import { isRole, type Role } from "../features/auth/constants";
 
export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};
 
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
 
  if (!session?.user) {
    return null;
  }
 
  const id = Number(session.user.id);
 
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
 
  return {
    id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    role: isRole(session.user.role) ? session.user.role : "USER",
  };
}
 
export async function requireUser(
  callbackUrl = "/dashboard",
): Promise<SessionUser> {
  const user = await getCurrentUser();
 
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
 
  return user;
}

"use client";
 
import { signOut } from "next-auth/react";
import { ROLE_LABELS, type Role } from "@/src/features/auth/constants";
 
type UserMenuProps = {
  name: string;
  role: Role;
};
 
export function UserMenu({ name, role }: UserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right leading-tight">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-slate-400">{ROLE_LABELS[role]}</p>
      </div>
      <button
        type="button"
        onClick={() => void signOut({ callbackUrl: "/login" })}
        className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-800"
      >
        Salir
      </button>
    </div>
  );
}

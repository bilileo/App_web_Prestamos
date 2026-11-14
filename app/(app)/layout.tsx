import { Navbar } from "@/components/layout/Navbar";
import {
  Sidebar,
  type SidebarItem,
} from "@/components/layout/Sidebar";
import { UserMenu } from "@/src/components/auth/UserMenu";
import { hasPermission } from "@/src/features/auth/permissions";
import { requireUser } from "@/src/lib/session";
 
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
 
  const items: SidebarItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Activos", href: "/assets" },
  ];
 
  if (hasPermission(user.role, "categories:create")) {
    items.push({ label: "Categorías", href: "/categories/new" });
  }

  if (hasPermission(user.role, "users:read")) {
    items.push({ label: "Usuarios", href: "/users" });
  }
 
  return (
    <>
      <Navbar action={<UserMenu name={user.name} role={user.role} />} />
      <div className="flex">
        <Sidebar items={items} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}

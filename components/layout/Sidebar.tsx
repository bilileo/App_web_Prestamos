"use client";
 
import Link from "next/link";
import { usePathname } from "next/navigation";
 
export type SidebarItem = {
  label: string;
  href: string;
};
 
export function Sidebar({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();
 
  return (
    <aside className="w-52 border-r p-4 space-y-2">
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
 
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block ${
              isActive ? "text-blue-600 font-semibold" : "text-gray-600"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}

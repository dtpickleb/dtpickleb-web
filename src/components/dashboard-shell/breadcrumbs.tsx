"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const label = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase());

export function DashboardBreadcrumbs() {
  const pathname = usePathname();
  const parts = (pathname || "/").split("/").filter(Boolean);
  const crumbs = parts.map((p, i) => ({
    href: "/" + parts.slice(0, i + 1).join("/"),
    name: label(p),
    last: i === parts.length - 1,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center">
            {c.last ? (
              <BreadcrumbItem><BreadcrumbPage>{c.name}</BreadcrumbPage></BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link href={c.href}>{c.name}</Link></BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {i < crumbs.length - 1 && <BreadcrumbSeparator className="mt-1 ml-2.5" />}
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

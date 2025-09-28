"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Calendar, Plus, Edit } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  // Extract language from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  const lang = pathSegments[0] || "en";
  const adminPath = `/${lang}/admin`;

  // Build breadcrumb items based on current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: "Admin",
        href: adminPath,
        icon: <Home className="h-4 w-4" />,
      },
    ];

    // Check if we're on event-related pages
    if (pathname.includes("/admin/event")) {
      items.push({
        label: "Events",
        href: `${adminPath}/event`,
        icon: <Calendar className="h-4 w-4" />,
      });

      // Check for specific event actions
      if (pathname.includes("/admin/event/new")) {
        items.push({
          label: "New Event",
          icon: <Plus className="h-4 w-4" />,
        });
      } else if (pathname.includes("/admin/event/edit/")) {
        const eventId = pathname.split("/admin/event/edit/")[1];
        items.push({
          label: `Edit Event`,
          icon: <Edit className="h-4 w-4" />,
        });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base">
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="flex items-center gap-2 text-foreground font-semibold">
                  {item.icon}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href!}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 font-medium hover:underline underline-offset-4"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator className="text-muted-foreground/50 mx-1" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

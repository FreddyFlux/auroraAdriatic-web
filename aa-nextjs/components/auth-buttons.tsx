"use client";

import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface AuthButtonsProps {
  currentLang?: string;
  isActive?: (path: string) => boolean;
  authRoutes?: Array<{ label: string; href: string; path: string }>;
}

export default function AuthButtons({
  currentLang = "en",
  isActive,
  authRoutes = [],
}: AuthButtonsProps) {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state during hydration - always use outline variant
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        {authRoutes.map((route) => (
          <Button
            key={route.label}
            variant="outline"
            asChild
            className="transition-all duration-200"
          >
            <Link href={route.href} className="no-underline">
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    );
  }

  if (!auth?.currentUser) {
    return (
      <div className="flex items-center gap-2">
        {authRoutes.map((route) => (
          <Button
            key={route.label}
            variant={
              mounted && isActive && isActive(route.path)
                ? "default"
                : "outline"
            }
            asChild
            className="transition-all duration-200"
          >
            <Link href={route.href} className="no-underline">
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {auth.currentUser.displayName || auth.currentUser.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link
              href={`/${currentLang}/account`}
              className={`flex items-center gap-2 transition-all duration-200 ${
                mounted &&
                isActive &&
                isActive(`/${currentLang}/account`) &&
                hoveredItem !== "admin" &&
                hoveredItem !== "logout"
                  ? "bg-primary text-primary-foreground"
                  : hoveredItem === "account"
                    ? "bg-primary text-primary-foreground"
                    : ""
              }`}
              onMouseEnter={() => setHoveredItem("account")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          {auth.customClaims?.admin === true && (
            <DropdownMenuItem asChild>
              <Link
                href={`/${currentLang}/admin`}
                className={`flex items-center gap-2 transition-all duration-200 ${
                  mounted &&
                  isActive &&
                  isActive(`/${currentLang}/admin`) &&
                  hoveredItem !== "account" &&
                  hoveredItem !== "logout"
                    ? "bg-primary text-primary-foreground"
                    : hoveredItem === "admin"
                      ? "bg-primary text-primary-foreground"
                      : ""
                }`}
                onMouseEnter={() => setHoveredItem("admin")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Settings className="h-4 w-4" />
                Admin Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className={`flex items-center gap-2 transition-all duration-200 ${
              hoveredItem === "logout"
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LogoSwitcher } from "./logo-switcher";
import { Button } from "./ui/button";
import LanguageSwitcher from "./language-switcher";
import AuthButtons from "./auth-buttons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavBarProps {
  currentLang?: string;
  currentPath?: string;
}

export default function NavBar({
  currentLang = "en",
  currentPath = "",
}: NavBarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Ensure we have a valid language, fallback to 'en'
  const validLang =
    currentLang && ["en", "no", "hr"].includes(currentLang)
      ? currentLang
      : "en";

  const homeHref = `/${validLang}`;
  const aboutHref = `/${validLang}/about`;
  const contactHref = `/${validLang}/contact`;

  // Navigation items with their paths
  const navItems = [
    { label: "Home", href: homeHref, path: `/${validLang}` },
    { label: "About", href: aboutHref, path: `/${validLang}/about` },
    { label: "Contact", href: contactHref, path: `/${validLang}/contact` },
  ];

  // Auth routes for active state detection
  const authRoutes = [
    {
      label: "Login",
      href: `/${validLang}/login`,
      path: `/${validLang}/login`,
    },
    {
      label: "Register",
      href: `/${validLang}/register`,
      path: `/${validLang}/register`,
    },
  ];

  // Use client-side pathname for active state detection
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if a path is active - handle 404 and invalid paths gracefully
  const isActive = (path: string) => {
    if (!mounted) return false;

    const currentPathToCheck = pathname || currentPath;

    // If currentPath is empty or invalid, don't mark anything as active
    if (!currentPathToCheck || currentPathToCheck === "/") {
      return false;
    }

    // For home path, check exact match or trailing slash
    if (path === `/${validLang}`) {
      return (
        currentPathToCheck === `/${validLang}` ||
        currentPathToCheck === `/${validLang}/` ||
        (currentPathToCheck.startsWith(`/${validLang}/`) &&
          !currentPathToCheck.startsWith(`/${validLang}/about`) &&
          !currentPathToCheck.startsWith(`/${validLang}/contact`) &&
          !currentPathToCheck.startsWith(`/${validLang}/login`) &&
          !currentPathToCheck.startsWith(`/${validLang}/register`) &&
          !currentPathToCheck.startsWith(`/${validLang}/account`) &&
          !currentPathToCheck.startsWith(`/${validLang}/admin`))
      );
    }

    // For other paths, check if current path starts with the navigation path
    return currentPathToCheck.startsWith(path);
  };

  return (
    <nav className="flex justify-between items-center py-6 px-10">
      <Link href={homeHref}>
        <LogoSwitcher />
      </Link>
      <div className="flex items-center gap-4">
        <LanguageSwitcher currentLang={currentLang} />
        <ThemeToggle />
        <ul className="flex gap-4 items-center">
          {navItems.map((item) => (
            <li key={item.label}>
              <Button
                variant={isActive(item.path) ? "default" : "outline"}
                asChild
                className="transition-all duration-200"
              >
                <Link href={item.href} className="no-underline">
                  {item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
        <AuthButtons
          currentLang={currentLang}
          isActive={isActive}
          authRoutes={authRoutes}
        />
      </div>
    </nav>
  );
}

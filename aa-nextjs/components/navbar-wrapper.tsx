"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Extract language from pathname with better error handling
  const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  const currentLang = langMatch ? langMatch[1] : "en";

  // Ensure we always have a valid pathname for the navbar
  const safePathname = pathname || "/";

  return <NavBar currentLang={currentLang} currentPath={safePathname} />;
}

"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Extract language from pathname
  const langMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);
  const currentLang = langMatch ? langMatch[1] : "en";

  return <NavBar currentLang={currentLang} />;
}

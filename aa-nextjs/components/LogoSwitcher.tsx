"use client";

import LMLogo from "@/public/WM-Aurora-Adriatic.png";
import DMLogo from "@/public/DM-Aurora-Adriatic.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function LogoSwitcher() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image src={LMLogo} alt="Aurora Adriatic Logo" width={300} height={300} />
    );
  }

  return (
    <Image
      src={theme === "dark" ? DMLogo : LMLogo}
      alt="Aurora Adriatic Logo"
      width={300}
      height={300}
    />
  );
}

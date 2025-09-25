"use client";

import { useEffect } from "react";

interface LanguageProviderProps {
  children: React.ReactNode;
  lang: string;
}

export default function LanguageProvider({
  children,
  lang,
}: LanguageProviderProps) {
  useEffect(() => {
    // Set the html lang attribute based on the current locale
    document.documentElement.lang = lang;
  }, [lang]);

  return <>{children}</>;
}

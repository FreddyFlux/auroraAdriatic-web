"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface LanguageSwitcherProps {
  currentLang: string;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "hr", name: "Hrvatski", flag: "🇭🇷" },
];

export default function LanguageSwitcher({
  currentLang,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: string) => {
    // Replace the current language in the pathname
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPath);
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/20 dark:hover:text-primary transition-colors"
        >
          <span>{currentLanguage?.flag}</span>
          <span className="hidden sm:inline">{currentLanguage?.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover shadow-lg">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center space-x-2 cursor-pointer hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary/20 dark:hover:text-primary focus:bg-primary focus:text-primary-foreground dark:focus:bg-primary/20 dark:focus:text-primary transition-colors"
          >
            <span>{lang.flag}</span>
            <span className={currentLang === lang.code ? "font-medium" : ""}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LogoSwitcher } from "./logo-switcher";
import { Button } from "./ui/button";
import LanguageSwitcher from "./language-switcher";

interface NavBarProps {
  currentLang?: string;
}

export default function NavBar({ currentLang = "en" }: NavBarProps) {
  const homeHref = currentLang ? `/${currentLang}` : "/en";

  return (
    <nav className="flex justify-between items-center py-6 px-10">
      <Link href={homeHref}>
        <LogoSwitcher />
      </Link>
      <div className="flex items-center gap-4">
        <LanguageSwitcher currentLang={currentLang} />
        <ThemeToggle />
        <ul className="flex gap-4 items-center">
          <li>
            <Link href={homeHref}>Home</Link>
          </li>
          <li>
            <Link href={homeHref}>About</Link>
          </li>
          <li>
            <Button>Contact</Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

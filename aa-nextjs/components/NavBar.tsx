import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LogoSwitcher } from "./LogoSwitcher";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center py-6 px-10">
      <Link href="/">
        <LogoSwitcher />
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ul className="flex gap-4 items-center">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/">About</Link>
          </li>
          <li>
            <Button>Contact</Button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

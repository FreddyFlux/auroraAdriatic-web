import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="text-muted-foreground max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/en">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/en/about">About Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

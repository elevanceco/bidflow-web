import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-primary" />
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-primary"
          >
            BidFlow
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground">
          <Link
            href="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            Workflow
          </Link>
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Sign In
          </Link>
          <Button className="bg-primary text-primary-foreground rounded-none hover:bg-primary/90">
            Start Free
          </Button>
        </div>
      </div>
    </header>
  );
}

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-primary-foreground/20 pb-12 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to graduate from Excel?
            </h2>
            <p className="text-primary-foreground/80 max-w-md mb-6">
              Start your first structured sourcing event today. No public
              marketplaces, just your trusted vendors in a secure, auditable
              environment.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-slate-100 rounded-none"
          >
            Start Your Free Event
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-80 gap-6">
          <div className="flex items-center gap-2 font-bold">
            <Briefcase className="w-5 h-5" />
            BidFlow
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#how-it-works" className="hover:underline">
              Product
            </Link>
            <Link href="#pricing" className="hover:underline">
              Pricing
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms & Privacy
            </Link>
          </div>
        </div>

        <div className="mt-8 text-xs opacity-50 max-w-4xl">
          *BidFlow operates strictly as a B2B sourcing facilitation
          platform[cite: 2, 3]. We are not a public supplier marketplace,
          contracting party, payment intermediary, escrow service, or guarantor
          of supplier performance[cite: 2, 3]. Buyers are solely responsible for
          final award decisions and supplier verification[cite: 2].
        </div>
      </div>
    </footer>
  );
}

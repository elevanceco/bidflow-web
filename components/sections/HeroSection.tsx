import { Button } from "@/components/ui/button";
import { Clock, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import HeroMockup from "../ui/HeroMockup";

export default function HeroSection() {
  return (
    <section className="border-b border-border bg-background pt-20 pb-16 lg:pt-28 lg:pb-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
            Turn your Excel-based vendor quotation process into an auditable
            sourcing event in minutes.
          </h1>
          <p className="text-lg text-foreground/80 max-w-xl leading-relaxed">
            Replace scattered supplier quotations across Excel, email, and
            WhatsApp with structured RFQs, competitive bidding, and an auditable
            sourcing workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none"
            >
              Start Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-slate-50 rounded-none"
            >
              See How It Works
            </Button>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}

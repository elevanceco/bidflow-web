import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-background px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Transparent Pricing
        </h2>
        <p className="text-foreground/80 mb-12 max-w-2xl mx-auto">
          No percentage-of-savings fees. Just flat, predictable pricing for
          growing procurement teams.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="border border-border p-8 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-2">Free Tier</h3>
            <div className="text-2xl font-bold text-primary tabular-nums mb-4">
              Rp 0
            </div>
            <p className="text-sm text-foreground/80 mb-6 min-h-[40px]">
              1 full sourcing event to test the platform capabilities with your
              team.
            </p>
            <Button
              className="w-full bg-primary rounded-none"
              variant="default"
            >
              Start Free
            </Button>
          </div>
          <div className="border-2 border-primary p-8 bg-white relative shadow-sm">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1">
              POPULAR
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Single Event
            </h3>
            <div className="text-2xl font-bold text-primary tabular-nums mb-4">
              Rp 199k - 399k
            </div>
            <p className="text-sm text-foreground/80 mb-6 min-h-[40px]">
              Pay-per-event access for organizations with occasional procurement
              needs.
            </p>
            <Button
              className="w-full bg-primary rounded-none"
              variant="default"
            >
              Buy Event Credit
            </Button>
          </div>
          <div className="border border-border p-8 bg-white shadow-sm">
            <h3 className="text-xl font-bold text-primary mb-2">Team</h3>
            <div className="text-2xl font-bold text-primary tabular-nums mb-4">
              ~Rp 999k{" "}
              <span className="text-sm font-normal text-foreground/60">
                /month
              </span>
            </div>
            <p className="text-sm text-foreground/80 mb-6 min-h-[40px]">
              Unlimited sourcing events for regular procurement volume and
              dedicated teams.
            </p>
            <Button className="w-full rounded-none" variant="outline">
              Subscribe
            </Button>
          </div>
        </div>
        <div className="mt-8 border border-success/30 bg-success/5 text-success p-4 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">
            Suppliers always bid for free. No listing fees, no bidding fees.
          </span>
        </div>
      </div>
    </section>
  );
}

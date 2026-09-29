import { ShieldCheck, Clock, Lock } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 bg-slate-50 border-b border-border px-6"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 border border-border bg-white shadow-sm">
          <Lock className="w-8 h-8 text-primary mb-6" />
          <h3 className="text-xl font-bold text-primary mb-3">
            Fair & Secure Bidding
          </h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            Bids are completely immutable. Every bid creates a new append-only
            record, ensuring a 100% accurate history of negotiations that cannot
            be altered.
          </p>
        </div>
        <div className="p-8 border border-border bg-white shadow-sm">
          <Clock className="w-8 h-8 text-primary mb-6" />
          <h3 className="text-xl font-bold text-primary mb-3">
            Anti-Sniping Protection
          </h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            Our soft-close technology automatically extends the auction timer if
            a valid bid is placed in the final minutes, ensuring fair
            competition.
          </p>
        </div>
        <div className="p-8 border border-border bg-white shadow-sm">
          <ShieldCheck className="w-8 h-8 text-primary mb-6" />
          <h3 className="text-xl font-bold text-primary mb-3">
            Complete Auditability
          </h3>
          <p className="text-foreground/80 text-sm leading-relaxed">
            Export comprehensive event results, including potential savings,
            complete bid histories, and your specific award justifications to
            XLSX.
          </p>
        </div>
      </div>
    </section>
  );
}

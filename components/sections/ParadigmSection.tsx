import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ParadigmSection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-border px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          Stop chasing suppliers over WhatsApp.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border bg-white shadow-sm">
          <div className="p-8 border-b md:border-b-0 md:border-r border-border">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="text-red-600">The Old Way</span>
            </h3>
            <ul className="space-y-4">
              {[
                "Manually comparing quotation spreadsheets.",
                "No standardized bid process or audit trail.",
                "Difficulty tracking negotiation rounds.",
                "Email chains and informal WhatsApp promises.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-foreground"
                  text-sm
                >
                  <XCircle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8">
            <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
              <span className="text-success">BidFlow</span>
            </h3>
            <ul className="space-y-4">
              {[
                "Centralized, immutable bid history.",
                "Server-validated bidding rules.",
                "One-click export for defensible audit trails.",
                "Zero supplier friction or platform fees.",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-foreground"
                  text-sm
                >
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

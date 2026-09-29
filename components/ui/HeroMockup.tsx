import React from "react";
import { FileSpreadsheet, Clock, CheckCircle2 } from "lucide-react";

export default function HeroMockup() {
  return (
    <div className="border border-border bg-slate-50 shadow-2xl relative rounded-xl overflow-hidden">
      {/* MacBook Style Top Bar */}
      <div className="w-full h-10 bg-slate-200/60 border-b border-border flex items-center px-4 space-x-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10"></div>
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10"></div>
        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10"></div>
      </div>

      {/* Content Area */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Incoming Email Mockup */}
        <div className="border border-border bg-white p-5 rounded-lg shadow-sm">
          <div className="text-xs text-foreground/50 mb-3">Incoming Email</div>
          <div className="font-semibold text-base text-primary mb-2">
            Re: Q3 Laptops Quotation
          </div>
          <div className="text-sm text-foreground/80 space-y-3">
            <p>Hi team, attached is our pricing.</p>
            <div className="flex items-center gap-2 border border-border p-2.5 bg-slate-50 text-primary rounded-md">
              <FileSpreadsheet className="w-4 h-4" /> quote_final_v2.xlsx
            </div>
          </div>
        </div>

        {/* BidFlow Dashboard Mockup */}
        <div className="border border-border bg-white p-5 rounded-lg shadow-sm flex flex-col">
          {/* FIXED: Using Flexbox instead of Absolute positioning to prevent overflow */}
          <div className="flex justify-between items-start gap-4 mb-6">
            <div className="text-sm font-medium text-foreground/60 leading-tight">
              Active Event: IT Equipment
            </div>
            <div className="flex items-center gap-1.5 text-warning text-xs font-bold border border-warning/30 bg-warning/10 px-2 py-1 rounded shrink-0">
              <Clock className="w-3.5 h-3.5" /> 04:12 Remaining
            </div>
          </div>

          <div className="space-y-3 mt-auto">
            <div className="flex justify-between items-center text-sm border-b border-border pb-2.5">
              <span className="font-medium text-foreground/70">Supplier A</span>
              <span className="tabular-nums font-mono text-foreground/70">
                Rp 45,000,000
              </span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-border pb-2.5 bg-success/10 px-2 -mx-2 rounded-sm">
              <span className="font-medium text-success flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Supplier B
              </span>
              <span className="tabular-nums font-mono text-success font-bold">
                Rp 42,500,000
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-0.5">
              <span className="font-medium text-foreground/70">Supplier C</span>
              <span className="tabular-nums font-mono text-foreground/70">
                Rp 48,000,000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

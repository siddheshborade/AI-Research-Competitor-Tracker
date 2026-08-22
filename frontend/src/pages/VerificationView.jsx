import React from "react";
import { VerificationQueue } from "../components/verification/VerificationQueue";
import { EvidenceDrawer } from "../components/evidence/EvidenceDrawer";
import { ShieldCheck } from "lucide-react";

export function VerificationView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-amber-400" />
          Trust Layer & Human Verification Gate
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review contested findings, inspect multi-source corroboration evidence, and audit verified intelligence into the permanent knowledge base.
        </p>
      </div>

      <VerificationQueue />
      <EvidenceDrawer />
    </div>
  );
}

export default VerificationView;

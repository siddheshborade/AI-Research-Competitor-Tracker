import React from "react";
import { ContradictionHub } from "../components/modules/ContradictionHub";
import { EvidenceDrawer } from "../components/evidence/EvidenceDrawer";
import { AlertOctagon } from "lucide-react";

export function ContradictionView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <AlertOctagon className="w-6 h-6 text-orange-400" />
          Contradiction Detection & Claim Discrepancies
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated multi-source cross-examination detecting vendor over-claims, benchmark divergences, and patent dispute anomalies.
        </p>
      </div>

      <ContradictionHub />
      <EvidenceDrawer />
    </div>
  );
}

export default ContradictionView;

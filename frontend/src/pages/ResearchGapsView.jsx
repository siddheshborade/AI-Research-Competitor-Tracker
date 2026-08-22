import React from "react";
import { ResearchGaps } from "../components/modules/ResearchGaps";
import { OpportunityThreatMatrix } from "../components/modules/OpportunityThreatMatrix";
import { EvidenceDrawer } from "../components/evidence/EvidenceDrawer";
import { Compass } from "lucide-react";

export function ResearchGapsView() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-cyan-400" />
          Research Gaps & Opportunity-Threat Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Detect technical white-spaces and evaluate concrete strategic playbooks for offensive market capture and defensive IP protection.
        </p>
      </div>

      <ResearchGaps />
      <OpportunityThreatMatrix />
      <EvidenceDrawer />
    </div>
  );
}

export default ResearchGapsView;

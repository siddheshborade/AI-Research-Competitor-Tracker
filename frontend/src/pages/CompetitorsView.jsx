import React from "react";
import { CompetitorMatrix } from "../components/competitors/CompetitorMatrix";
import { EvidenceDrawer } from "../components/evidence/EvidenceDrawer";
import { Building2 } from "lucide-react";

export function CompetitorsView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Building2 className="w-6 h-6 text-intel-purple-light" />
          Competitor Surveillance & Strategic Timelines
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Chronological analysis of patents filed, research publications released, and competitor product announcements.
        </p>
      </div>

      <CompetitorMatrix />
      <EvidenceDrawer />
    </div>
  );
}

export default CompetitorsView;

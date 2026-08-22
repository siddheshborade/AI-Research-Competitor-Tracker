import React from "react";
import { EvidenceGraph } from "../components/evidence/EvidenceGraph";
import { EvidenceDrawer } from "../components/evidence/EvidenceDrawer";
import { Network, Sparkles } from "lucide-react";

export function EvidenceGraphView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Network className="w-6 h-6 text-cyan-400" />
          Interactive Multi-Entity Evidence Graph
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore multi-dimensional relationships connecting research preprints, patent filings, competitor hardware roadmaps, and emerging intelligence alerts.
        </p>
      </div>

      <EvidenceGraph />
      <EvidenceDrawer />
    </div>
  );
}

export default EvidenceGraphView;

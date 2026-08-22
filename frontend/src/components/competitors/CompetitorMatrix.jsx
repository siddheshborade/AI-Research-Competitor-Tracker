import React from "react";
import { CompetitorCard } from "./CompetitorCard";
import { useResearch } from "../../context/ResearchContext";
import { Building2, Layers, Award, FileText } from "lucide-react";

export function CompetitorMatrix() {
  const { competitors } = useResearch();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-obsidian-850 border border-obsidian-700 text-intel-purple-light">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            Competitor Intelligence & Strategy Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">
            Continuous surveillance of target organizations, patent filing velocity, research publication output, and strategic product disclosures.
          </p>
        </div>
      </div>

      {/* Competitors List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {competitors.map((comp) => (
          <CompetitorCard key={comp.id} competitor={comp} />
        ))}
      </div>
    </div>
  );
}

export default CompetitorMatrix;

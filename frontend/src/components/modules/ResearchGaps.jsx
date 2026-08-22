import React from "react";
import { Sparkles, Compass, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function ResearchGaps() {
  const { researchGaps, setActiveView, showToast } = useResearch();

  const handleAddToResearch = (gapTitle) => {
    showToast(`Added "${gapTitle}" as an autonomous research priority.`, "purple");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 bg-cyan-950/20 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
          <Compass className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            Research Gap & Technical White-Space Discovery
          </h3>
          <p className="text-xs text-cyan-200/80 mt-1 leading-relaxed max-w-3xl">
            Identifies unexplored intersections between technologies with low patent and research saturation, uncovering high-commercial-value opportunities before competitors establish defensive moats.
          </p>
        </div>
      </div>

      {/* Gaps List */}
      <div className="grid grid-cols-1 gap-6">
        {researchGaps.map((gap) => {
          return (
            <div
              key={gap.id}
              className="glass-panel rounded-2xl p-6 border border-obsidian-750 hover:border-obsidian-600 transition-all space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                    WHITE SPACE • POTENTIAL: {gap.commercialPotential}
                  </span>
                  <h4 className="text-base font-bold text-slate-100">
                    {gap.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold bg-obsidian-950 px-3 py-1 rounded-lg border border-obsidian-800">
                  Opportunity Index: {gap.gapScore}/100
                </span>
              </div>

              {/* Multi-Dimensional Activity Density Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-800">
                  <span className="text-[10px] text-slate-500 block uppercase">
                    Academic Research Density:
                  </span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">
                    {gap.researchDensity}
                  </span>
                </div>
                <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-800">
                  <span className="text-[10px] text-slate-500 block uppercase">
                    Patent Registry Saturation:
                  </span>
                  <span className="text-amber-300 font-semibold mt-0.5 block">
                    {gap.patentDensity}
                  </span>
                </div>
                <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-800">
                  <span className="text-[10px] text-slate-500 block uppercase">
                    Competitor Activity:
                  </span>
                  <span className="text-purple-300 font-semibold mt-0.5 block">
                    {gap.competitorActivity}
                  </span>
                </div>
              </div>

              {/* Opportunity Description & Playbook */}
              <div className="bg-obsidian-950 p-4 rounded-xl border border-obsidian-800 text-xs space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block mb-1">
                    White Space Analysis:
                  </span>
                  <p className="text-slate-200 leading-relaxed font-sans">
                    {gap.opportunityDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-obsidian-850">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block mb-1">
                    Actionable First-Mover Playbook:
                  </span>
                  <p className="text-emerald-200/90 leading-relaxed font-sans font-medium">
                    {gap.suggestedAction}
                  </p>
                </div>
              </div>

              {/* Time Window & Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-obsidian-800 flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Window of Opportunity: {gap.timeWindow}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAddToResearch(gap.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-intel-purple/20 hover:bg-intel-purple/30 text-purple-200 text-xs font-medium border border-intel-purple/40 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Track as Priority Objective</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResearchGaps;

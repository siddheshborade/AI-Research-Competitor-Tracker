import React from "react";
import { ShieldAlert, ShieldCheck, AlertOctagon, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function OpportunityThreatMatrix() {
  const { intelligenceItems, setSelectedEvidenceItem } = useResearch();

  const threats = intelligenceItems.filter(
    (i) => i.category === "THREAT" || i.priority === "CRITICAL"
  );
  const opportunities = intelligenceItems.filter(
    (i) =>
      i.category === "OPPORTUNITY" ||
      i.category === "RESEARCH GAP" ||
      i.category === "TREND"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <h3 className="text-base font-bold text-slate-100">
          Opportunity vs. Threat Strategic Action Matrix
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Deep risk and upside modeling beyond simple red/green labels. Focuses on strategic defense postures and offensive market capture plays.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* THREATS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-red-500/30">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-red-300">
              Defensive Threat Mitigations ({threats.length})
            </h4>
          </div>

          <div className="space-y-4">
            {threats.map((item) => (
              <div
                key={item.id}
                className="glass-card-threat rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-red-950 text-red-300 border border-red-500/40">
                    CRITICAL DEFENSIVE VULNERABILITY
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {item.competitor}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-slate-100">{item.title}</h5>

                <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-800 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-red-400 font-mono block">
                      Strategic Impact:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {item.why}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-obsidian-850">
                    <span className="text-[10px] uppercase font-bold text-amber-400 font-mono block">
                      Defensive Playbook Action:
                    </span>
                    <p className="text-amber-200/90 leading-relaxed font-sans font-medium">
                      {item.soWhat}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Evidence: {item.sourcesCount} Independent Sources
                  </span>
                  <button
                    onClick={() => setSelectedEvidenceItem(item)}
                    className="text-intel-purple-light hover:text-purple-300 font-medium flex items-center gap-1"
                  >
                    <span>Inspect Proof</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OPPORTUNITIES COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/30">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Offensive Market Capture Opportunities ({opportunities.length})
            </h4>
          </div>

          <div className="space-y-4">
            {opportunities.map((item) => (
              <div
                key={item.id}
                className="glass-card-verified rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    OFFENSIVE WHITE SPACE PLAY
                  </span>
                  <span className="text-xs font-mono text-emerald-400">
                    Confidence: High
                  </span>
                </div>

                <h5 className="text-sm font-bold text-slate-100">{item.title}</h5>

                <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-800 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">
                      Upside Vector:
                    </span>
                    <p className="text-slate-300 leading-relaxed font-sans">
                      {item.why}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-obsidian-850">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono block">
                      Offensive Execution Step:
                    </span>
                    <p className="text-cyan-200/90 leading-relaxed font-sans font-medium">
                      {item.soWhat}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Evidence: {item.sourcesCount} Independent Sources
                  </span>
                  <button
                    onClick={() => setSelectedEvidenceItem(item)}
                    className="text-intel-purple-light hover:text-purple-300 font-medium flex items-center gap-1"
                  >
                    <span>Inspect Proof</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpportunityThreatMatrix;

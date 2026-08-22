import React from "react";
import { TrendingUp, Radio, Activity, Sparkles, FileText, Award, Layers, ArrowUpRight } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function EmergingSignals() {
  const { emergingSignals, setActiveView } = useResearch();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-intel-purple/30 bg-purple-950/20 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-purple-950 border border-intel-purple/40 text-intel-purple-light shadow-intel-purple">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            Weak-Signal Radar & Early Emerging Trend Detection
          </h3>
          <p className="text-xs text-purple-200/80 mt-1 leading-relaxed max-w-3xl">
            Detects subtle, low-frequency patterns repeated across independent academic preprints, early patent filings, and niche developer releases <strong>before</strong> they become mainstream headlines.
          </p>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {emergingSignals.map((signal) => {
          return (
            <div
              key={signal.id}
              className="glass-card-purple rounded-2xl p-6 transition-all space-y-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                    SIGNAL: {signal.signalStrength}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {signal.velocity}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-100 leading-snug">
                  {signal.title}
                </h4>
              </div>

              {/* Observed Across Breakdown */}
              <div className="bg-obsidian-950/90 rounded-xl p-3.5 border border-obsidian-750 space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block">
                  Observed Independent Convergence:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="bg-obsidian-900 p-2 rounded-lg border border-obsidian-800">
                    <span className="text-cyan-400 font-bold block text-sm">
                      {signal.observations.researchPapers}
                    </span>
                    <span className="text-[10px] text-slate-400">Papers</span>
                  </div>
                  <div className="bg-obsidian-900 p-2 rounded-lg border border-obsidian-800">
                    <span className="text-amber-400 font-bold block text-sm">
                      {signal.observations.patents}
                    </span>
                    <span className="text-[10px] text-slate-400">Patents</span>
                  </div>
                  <div className="bg-obsidian-900 p-2 rounded-lg border border-obsidian-800">
                    <span className="text-purple-400 font-bold block text-sm">
                      {signal.observations.codeRepositories}
                    </span>
                    <span className="text-[10px] text-slate-400">Code Repos</span>
                  </div>
                  <div className="bg-obsidian-900 p-2 rounded-lg border border-obsidian-800">
                    <span className="text-emerald-400 font-bold block text-sm">
                      {signal.observations.industryArticles}
                    </span>
                    <span className="text-[10px] text-slate-400">Articles</span>
                  </div>
                </div>
              </div>

              {/* Why it Matters & Playbook */}
              <div className="space-y-3 text-xs">
                <div className="bg-obsidian-950 p-3.5 rounded-xl border border-obsidian-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-400 font-mono block">
                    Strategic Significance:
                  </span>
                  <p className="text-slate-200 leading-relaxed font-sans">
                    {signal.whyItMatters}
                  </p>
                </div>

                <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">
                    Recommended Strategic Playbook:
                  </span>
                  <p className="text-emerald-200/90 leading-relaxed font-sans font-medium">
                    {signal.strategicPlaybook}
                  </p>
                </div>
              </div>

              {/* Cluster Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-obsidian-800">
                {signal.clusterTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-900 text-slate-400 border border-obsidian-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EmergingSignals;

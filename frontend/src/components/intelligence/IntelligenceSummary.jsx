import React from "react";
import { AlertOctagon, TrendingUp, Sparkles, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function IntelligenceSummary({ onSelectFilter }) {
  const { intelligenceItems, contradictions, emergingSignals, researchGaps } = useResearch();

  const criticalThreats = intelligenceItems.filter(
    (i) => i.priority === "CRITICAL" || i.category === "THREAT"
  ).length;

  const verifiedCount = intelligenceItems.filter(
    (i) => i.verificationState === "VERIFIED"
  ).length;

  const needsReviewCount = intelligenceItems.filter(
    (i) => i.verificationState === "NEEDS_REVIEW"
  ).length + contradictions.filter((c) => c.verificationState === "NEEDS_REVIEW").length;

  const metrics = [
    {
      label: "Critical Threats",
      count: criticalThreats,
      icon: AlertOctagon,
      color: "text-red-400",
      bg: "bg-red-950/40 border-red-500/30",
      action: () => onSelectFilter && onSelectFilter({ category: "THREAT" }),
    },
    {
      label: "Emerging Signals",
      count: emergingSignals.length,
      icon: TrendingUp,
      color: "text-intel-purple-light",
      bg: "bg-purple-950/40 border-purple-500/30",
      action: () => onSelectFilter && onSelectFilter({ category: "TREND" }),
    },
    {
      label: "Research Gaps",
      count: researchGaps.length,
      icon: Sparkles,
      color: "text-cyan-400",
      bg: "bg-cyan-950/40 border-cyan-500/30",
      action: () => onSelectFilter && onSelectFilter({ category: "RESEARCH GAP" }),
    },
    {
      label: "Verification Required",
      count: needsReviewCount,
      icon: ShieldAlert,
      color: "text-amber-400",
      bg: "bg-amber-950/40 border-amber-500/30",
      action: () => onSelectFilter && onSelectFilter({ verification: "NEEDS_REVIEW" }),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <button
            key={idx}
            type="button"
            onClick={m.action}
            className={`p-4 rounded-2xl border ${m.bg} flex items-center justify-between text-left transition-all hover:scale-[1.02] shadow-sm`}
          >
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-1">
                {m.label}
              </span>
              <span className={`text-2xl font-bold font-mono ${m.color}`}>
                {m.count}
              </span>
            </div>
            <div className={`p-3 rounded-xl bg-obsidian-950/70 border border-obsidian-800 ${m.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default IntelligenceSummary;

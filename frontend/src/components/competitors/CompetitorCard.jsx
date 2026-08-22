import React, { useState } from "react";
import { Building2, Award, FileText, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { CompetitorTimeline } from "./CompetitorTimeline";

export function CompetitorCard({ competitor }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getThreatBadge = (level) => {
    switch (level?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-950/80 text-red-400 border-red-500/40";
      case "HIGH":
        return "bg-amber-950/80 text-amber-300 border-amber-500/40";
      default:
        return "bg-purple-950/80 text-purple-300 border-purple-500/30";
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 hover:border-obsidian-600 transition-all space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-obsidian-850 border border-obsidian-700 text-intel-purple-light">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">{competitor.name}</h3>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${getThreatBadge(
                  competitor.threatLevel
                )}`}
              >
                {competitor.threatLevel} THREAT
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{competitor.tagline}</p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-obsidian-800 transition-colors"
          title={isExpanded ? "Collapse Timeline" : "Expand Timeline"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Activity Counters & Focus Areas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-center">
        <div className="bg-obsidian-950 p-2.5 rounded-xl border border-obsidian-800">
          <span className="text-amber-400 font-bold block text-sm">
            {competitor.patentsCount}
          </span>
          <span className="text-[10px] text-slate-400">Active Patents</span>
        </div>
        <div className="bg-obsidian-950 p-2.5 rounded-xl border border-obsidian-800">
          <span className="text-cyan-400 font-bold block text-sm">
            {competitor.papersCount}
          </span>
          <span className="text-[10px] text-slate-400">Research Papers</span>
        </div>
        <div className="bg-obsidian-950 p-2.5 rounded-xl border border-obsidian-800">
          <span className="text-purple-400 font-bold block text-sm">
            {competitor.recentActivityCount}
          </span>
          <span className="text-[10px] text-slate-400">Total Signals</span>
        </div>
      </div>

      {/* Focus Area Tags */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-mono text-slate-500 mr-1">Focus:</span>
        {competitor.focusAreas.map((area, idx) => (
          <span
            key={idx}
            className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-obsidian-950 text-slate-300 border border-obsidian-800"
          >
            {area}
          </span>
        ))}
      </div>

      {/* Expanded Timeline */}
      {isExpanded && <CompetitorTimeline competitor={competitor} />}
    </div>
  );
}

export default CompetitorCard;

import React from "react";
import { WhatWhySoWhat } from "./WhatWhySoWhat";
import { ContradictionCard } from "../modules/ContradictionCard";
import { Sparkles, Network, ArrowRight } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function ResearchResult({ brief }) {
  const { setActiveView } = useResearch();

  if (!brief) return null;

  return (
    <div className="space-y-6">
      {/* Contradiction Alert (if detected) */}
      {brief.contradiction && brief.contradiction.detected && (
        <ContradictionCard contradiction={brief.contradiction} />
      )}

      {/* Main What -> Why -> So What Card */}
      <WhatWhySoWhat brief={brief} />

      {/* Actions / Jump to Graph */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-obsidian-900 border border-obsidian-750 text-xs">
        <span className="text-slate-400 font-mono">
          Evidence graph hydrated with {brief.sourcesCount || 5} sources & entity relations.
        </span>
        <button
          onClick={() => setActiveView("graph")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-intel-purple/20 hover:bg-intel-purple/30 text-purple-200 font-medium border border-intel-purple/40 transition-colors"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Inspect Evidence Graph</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}

export default ResearchResult;

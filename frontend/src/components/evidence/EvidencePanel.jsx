import React from "react";
import { EvidenceCard } from "./EvidenceCard";
import { Layers, FileCheck } from "lucide-react";

export function EvidencePanel({ evidenceItems = [] }) {
  if (!evidenceItems || evidenceItems.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 text-center text-slate-400 space-y-2">
        <FileCheck className="w-6 h-6 text-slate-500 mx-auto" />
        <h4 className="text-xs font-mono uppercase font-bold text-slate-300">
          No Evidence Collected Yet
        </h4>
        <p className="text-xs text-slate-500">
          Sources and citations will appear here after autonomous research execution.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Collected Evidence & Sources
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {evidenceItems.length} Independent Items
        </span>
      </div>

      <div className="space-y-3">
        {evidenceItems.map((item) => (
          <EvidenceCard key={item.id} evidence={item} />
        ))}
      </div>
    </div>
  );
}

export default EvidencePanel;

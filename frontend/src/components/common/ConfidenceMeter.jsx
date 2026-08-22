import React from "react";
import { ShieldCheck, Layers, FileText, BookmarkCheck } from "lucide-react";

export function ConfidenceMeter({ confidence, score = 0.9, evidenceCount = 3, sourcesCount = 2, sourceTypes = [] }) {
  const percentage = Math.round((score || 0.85) * 100);
  
  let barColor = "bg-emerald-500";
  let textColor = "text-emerald-400";
  let label = "High Confidence";

  if (percentage < 75 && percentage >= 50) {
    barColor = "bg-amber-500";
    textColor = "text-amber-400";
    label = "Moderate Confidence";
  } else if (percentage < 50) {
    barColor = "bg-red-500";
    textColor = "text-red-400";
    label = "Low Confidence";
  }

  return (
    <div className="bg-obsidian-900/90 border border-obsidian-700/80 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${textColor}`} />
          <span className="text-xs font-medium text-slate-300">Confidence & Evidence Provenance</span>
        </div>
        <span className={`text-xs font-mono font-semibold ${textColor}`}>
          {label} ({percentage}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Provenance Metrics */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-obsidian-800/60 font-mono">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-intel-purple-light" />
          <span>{evidenceCount} Evidence Points</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>{sourcesCount} Independent Sources</span>
        </div>
      </div>
    </div>
  );
}
export default ConfidenceMeter;

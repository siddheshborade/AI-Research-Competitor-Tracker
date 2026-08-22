import React from "react";
import { ExternalLink, BookOpen, Globe, Award, Calendar, CheckCircle2 } from "lucide-react";

export function EvidenceCard({ evidence }) {
  const isPaper = evidence.sourceType.toLowerCase().includes("paper") || evidence.sourceType.toLowerCase().includes("patent");

  const getRelevanceBadge = (rel) => {
    switch (rel?.toLowerCase()) {
      case "critical":
        return "bg-red-950/80 text-red-300 border-red-500/40";
      case "high":
        return "bg-amber-950/80 text-amber-300 border-amber-500/40";
      default:
        return "bg-purple-950/80 text-purple-300 border-purple-500/30";
    }
  };

  return (
    <div className="bg-obsidian-950 border border-obsidian-750 hover:border-obsidian-600 rounded-xl p-4 transition-all space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-obsidian-850 border border-obsidian-700 text-intel-purple-light mt-0.5">
            {isPaper ? <BookOpen className="w-4 h-4 text-purple-400" /> : <Globe className="w-4 h-4 text-cyan-400" />}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
              {evidence.sourceType} • {evidence.publisher}
            </span>
            <h4 className="text-xs font-semibold text-slate-100 line-clamp-2">
              {evidence.title}
            </h4>
          </div>
        </div>

        <span
          className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${getRelevanceBadge(
            evidence.relevance
          )}`}
        >
          {evidence.relevance}
        </span>
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-300 font-sans leading-relaxed bg-obsidian-900/80 p-2.5 rounded-lg border border-obsidian-800">
        {evidence.summary}
      </p>

      {/* Footer: Date, Verification, and Link */}
      <div className="flex items-center justify-between pt-1 border-t border-obsidian-850 text-[11px] font-mono text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{evidence.verificationStatus || "Verified"}</span>
        </div>

        <div className="flex items-center gap-3">
          {evidence.publishedDate && (
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {evidence.publishedDate}
            </span>
          )}
          {evidence.url && (
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-intel-purple-light hover:underline font-semibold"
            >
              <span>Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default EvidenceCard;

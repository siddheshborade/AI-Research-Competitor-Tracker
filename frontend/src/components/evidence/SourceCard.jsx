import React from "react";
import { ExternalLink, Bookmark, Calendar, Building, Sparkles, FileText, Award } from "lucide-react";

export function SourceCard({ source }) {
  const getSourceIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "patent":
      case "patent grant":
      case "patent filing":
        return <Award className="w-4 h-4 text-amber-400" />;
      case "research paper":
      case "journal article":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-intel-purple-light" />;
    }
  };

  return (
    <div className="bg-obsidian-950 border border-obsidian-750 hover:border-obsidian-600 rounded-xl p-4 transition-all space-y-3 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-obsidian-850 border border-obsidian-700">
            {getSourceIcon(source.type)}
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block">
              {source.type} • {source.publisher}
            </span>
            <h4 className="text-xs font-semibold text-slate-100 line-clamp-1">
              {source.title}
            </h4>
          </div>
        </div>
        {source.date && (
          <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" />
            {source.date}
          </span>
        )}
      </div>

      {/* Supporting Claim Snippet */}
      {source.snippet && (
        <div className="bg-obsidian-900/90 rounded-lg p-3 border border-obsidian-800 text-xs text-slate-300 leading-relaxed font-mono">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            " Verified Extraction / Supporting Claim "
          </span>
          <p className="font-sans text-slate-200">"{source.snippet}"</p>
        </div>
      )}

      {/* Rationale & External Link */}
      <div className="flex items-center justify-between pt-1 text-xs border-t border-obsidian-850/80">
        <div className="text-[11px] text-slate-400 font-sans line-clamp-1">
          <span className="text-intel-purple-light font-mono">Rationale:</span>{" "}
          {source.selectionRationale || "Selected for multi-source cross-corroboration."}
        </div>
        {source.url && (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-intel-purple-light hover:text-purple-300 hover:underline shrink-0 ml-2"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default SourceCard;

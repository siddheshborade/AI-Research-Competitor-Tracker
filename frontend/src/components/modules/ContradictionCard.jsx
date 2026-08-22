import React from "react";
import { AlertOctagon, ExternalLink, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";

export function ContradictionCard({ contradiction }) {
  if (!contradiction || !contradiction.detected) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-amber-500/50 bg-amber-950/20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-400">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
              Contradiction Detected & Re-Searched
            </span>
            <h4 className="text-xs font-bold text-slate-100">
              {contradiction.title}
            </h4>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse">
          ⚠ Verification Triggered
        </span>
      </div>

      {/* Disputed Claim */}
      <div className="bg-obsidian-950/90 rounded-xl p-3 border border-obsidian-800 text-xs">
        <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block mb-1">
          Disputed Claim:
        </span>
        <p className="text-slate-200 font-sans leading-relaxed">
          "{contradiction.claim}"
        </p>
      </div>

      {/* Side-by-side sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Source A */}
        <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[10px] uppercase text-amber-400">
              Source A (Supports Claim)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {contradiction.sourceA.type}
            </span>
          </div>
          <h5 className="font-semibold text-slate-200 text-xs">
            {contradiction.sourceA.name}
          </h5>
          <p className="text-[11px] text-slate-300 italic">
            "{contradiction.sourceA.snippet}"
          </p>
          {contradiction.sourceA.url && (
            <a
              href={contradiction.sourceA.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-intel-purple-light hover:underline"
            >
              <span>View Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Source B */}
        <div className="bg-obsidian-950 p-3 rounded-xl border border-obsidian-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[10px] uppercase text-cyan-400">
              Source B (Conflicts / Disproves)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {contradiction.sourceB.type}
            </span>
          </div>
          <h5 className="font-semibold text-slate-200 text-xs">
            {contradiction.sourceB.name}
          </h5>
          <p className="text-[11px] text-slate-300 italic">
            "{contradiction.sourceB.snippet}"
          </p>
          {contradiction.sourceB.url && (
            <a
              href={contradiction.sourceB.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-intel-purple-light hover:underline"
            >
              <span>View Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Agent Action & Final Status */}
      <div className="bg-purple-950/30 border border-intel-purple/30 rounded-xl p-3 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-intel-purple-light font-mono font-bold text-[10px] uppercase">
          <RefreshCw className="w-3.5 h-3.5" />
          Agent Verification Action:
        </div>
        <p className="text-slate-200 font-sans leading-relaxed">
          {contradiction.agentAction}
        </p>

        <div className="pt-1.5 border-t border-purple-900/40 flex items-center gap-1.5 text-emerald-300 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Final Resolution: {contradiction.finalStatus}</span>
        </div>
      </div>
    </div>
  );
}

export default ContradictionCard;
